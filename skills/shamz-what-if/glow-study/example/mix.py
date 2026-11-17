"""Glow Study test sound. Based on the Night Dossier mix: the voice, music that comes and goes (composed here in code), quiet room tone in between,
and effects from the studio sound library placed on the shots.

    python3 mix.py            (after retime.py)   -> out/mix.wav

Music (owner: "background music from time to time"): three cues, all in D minor so they join cleanly.
  theme    the cold open and the ending: slow plucked arpeggio over a pad, a soft pulse
  mystery  the spy passages: sparse bell notes over a low drone
  tension  the collapse and the raid: a faster low ostinato with a ticking hat
plus a short sting on every chapter card. Music is ducked under the voice, and between cues there is only room tone.
"""
import json
import re
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf

SR = 44100
import os
SKILL = Path(os.environ.get('SHAMZ_SKILL_DIR') or Path(__file__).resolve().parents[2])
LIB = SKILL / 'studio/library/sfx'
words = json.load(open('studio_src/words.json'))
lines = json.load(open('studio_src/lines.json'))
norm = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())
END = words[-1]['e'] + 8.0
N = int(END * SR)
t = np.arange(N) / SR


def dec(path, gain=1.0):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32) * gain


def lib(name, gain=1.0):
    return dec(next(LIB.glob(name + '-*.mp3')), gain)


# ------------------------------------------------------------------ synth
NOTE = {n: 440 * 2 ** ((i - 57) / 12) for i, n in enumerate(f'{p}{o}' for o in range(0, 8) for p in ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])}


def pluck(freq, dur, bright=0.5):
    n = int(dur * SR)
    x = np.arange(n) / SR
    env = np.exp(-x * (3.2 / dur)) * np.clip(x / 0.006, 0, 1)
    return (np.sin(2 * np.pi * freq * x) + bright * 0.5 * np.sin(4 * np.pi * freq * x) * np.exp(-x * 9) + bright * 0.2 * np.sin(6 * np.pi * freq * x) * np.exp(-x * 14)) * env


def pad(freqs, dur):
    n = int(dur * SR)
    x = np.arange(n) / SR
    env = np.clip(x / 1.2, 0, 1) * np.clip((dur - x) / 1.4, 0, 1)
    y = sum(np.sin(2 * np.pi * f * x + 0.5 * np.sin(2 * np.pi * 0.21 * x + f)) + 0.4 * np.sin(2 * np.pi * f * 1.003 * x) for f in freqs)
    return y / len(freqs) * env


def kick(amp=1.0):
    x = np.arange(int(0.32 * SR)) / SR
    return amp * np.sin(2 * np.pi * (46 + 60 * np.exp(-x * 30)) * x) * np.exp(-x * 11)


def hat(amp=1.0):
    x = np.arange(int(0.05 * SR)) / SR
    rng = np.random.default_rng(1)
    return amp * rng.standard_normal(len(x)) * np.exp(-x * 90)


def add(buf, snd, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf) or i < 0:
        return
    seg = snd[: len(buf) - i]
    buf[i:i + len(seg)] += seg * gain



# Glow Study music: a soft, warm bed under the whole video (the reference keeps light music under most of it), in
# F major / D minor, slow; it drops out for the turn ("But here's the thing") and comes back brighter.
PROG = [['F3', 'A3', 'C4', 'E4'], ['D3', 'F3', 'A3', 'C4'], ['A#2', 'D3', 'F3', 'A3'], ['C3', 'E3', 'G3', 'A#3']]


def bed(dur, bright=0.6, pulse=True):
    buf = np.zeros(int((dur + 3) * SR), np.float32)
    beat = 60 / 78
    bar = beat * 4
    for b in range(int(dur / bar) + 1):
        ch = PROG[b % 4]
        add(buf, pad([NOTE[n] for n in ch], bar + 1.2), b * bar, 0.13)
        add(buf, pluck(NOTE[ch[0]] / 2, bar, 0.2), b * bar, 0.22)
        for k, idx in enumerate([0, 2, 3, 1, 2, 3, 1, 2]):
            if k % 2 and not pulse:
                continue
            add(buf, pluck(NOTE[ch[idx]] * 2, 1.4, bright), b * bar + k * beat / 2, 0.09 if k % 2 else 0.12)
        if pulse:
            add(buf, kick(0.3), b * bar, 0.4)
            add(buf, kick(0.18), b * bar + beat * 2, 0.4)
    buf = buf[: int(dur * SR)]
    x = np.arange(len(buf)) / SR
    return buf * np.clip(x / 1.0, 0, 1) * np.clip((dur - x) / 2.0, 0, 1)


L0 = lambda i: words[lines[i]['i']]['s']
L1 = lambda i: words[lines[i]['i'] + lines[i]['n'] - 1]['e']
music = np.zeros(N, np.float32)
turn = L0(7)
add(music, bed(turn - 0.2, 0.5, pulse=False), 0.0, 1.0)       # quiet, sparse under the hook
add(music, bed(END - L1(7) + 0.2, 0.75, pulse=True), L1(7) - 0.2, 1.0)   # fuller from the research on

voice, vsr = sf.read('audio/voice_ep.wav' if Path('audio/voice_ep.wav').exists() else 'audio/voice.wav', dtype='float32')
if voice.ndim > 1:
    voice = voice.mean(1)
if vsr != SR:
    voice = np.interp(np.arange(int(len(voice) * SR / vsr)) * vsr / SR, np.arange(len(voice)), voice).astype(np.float32)
v = np.zeros(N, np.float32)
v[: min(N, len(voice))] = voice[:N]
# duck: envelope of the voice, smoothed
env = np.abs(v)
k = int(0.25 * SR)
env = np.convolve(env, np.ones(k) / k, mode='same')
env = np.clip(env / (env.max() * 0.35 + 1e-9), 0, 1)
music *= 0.30 - 0.18 * env

fx = np.zeros(N, np.float32)
W0 = lambda word, line, nth=1: next(w['s'] for j, w in enumerate(words[lines[line]['i']:lines[line]['i'] + lines[line]['n']]) if norm(w['w']) == word and (nth := nth - 1) == 0)
add(fx, lib('step', 0.5), L0(0) + 0.1); add(fx, lib('step', 0.5), L0(0) + 0.45)
add(fx, lib('tumble', 0.8), W0('trip', 0) + 0.15)
add(fx, lib('paper_land', 0.7), L0(1) + 0.05)
add(fx, lib('class_murmur', 0.35), L0(2) - 0.1)
add(fx, lib('gasp', 0.4), L0(2) + 0.3)
add(fx, lib('pop', 0.5), W0('think', 3))
add(fx, lib('counter_tick', 0.4), L0(4))
add(fx, lib('rewind', 0.45), W0('replay', 4))
add(fx, lib('rewind', 0.45), L0(5)); add(fx, lib('rewind', 0.5), L0(6))
add(fx, lib('drone_hit', 0.5), L0(7) - 0.1)
add(fx, lib('pop', 0.5), L0(8) + 0.3)
add(fx, lib('step', 0.4), L0(9) + 0.2); add(fx, lib('step', 0.4), L0(9) + 0.6)
add(fx, lib('select_draw', 0.4), L0(11))
add(fx, lib('ding', 0.45), W0('four', 13))
add(fx, lib('title_boom', 0.45), W0('spotlight', 14) - 0.1)
add(fx, lib('sparkle', 0.35), W0('spotlight', 14))
add(fx, lib('shades', 0.3), L0(16))
add(fx, lib('tumble', 0.5), L0(18) + 0.1)
add(fx, lib('counter_tick', 0.35), L0(19))
add(fx, lib('rewind', 0.4), L0(20))
add(fx, lib('sparkle', 0.35), W0('forgot', 22))
add(fx, lib('ding', 0.5), L0(23) + 0.6)

out = v + music + fx * 0.8
out = out / max(1e-9, np.abs(out).max()) * 0.95
sf.write('out/mix.wav', out[: int((words[-1]['e'] + 4.5) * SR)], SR)
print('mix', round(len(out) / SR, 1), 's')
