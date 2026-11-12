"""Sound for the episode: the voice, music that comes and goes (composed here in code), quiet room tone in between,
and effects from the studio sound library placed on the shots.

    python3 mix.py            (after retime.py)   -> out/mix.wav

Music (owner: "background music from time to time"): three cues, all in D minor so they join cleanly.
  theme    the cold open and the ending: slow plucked arpeggio over a pad, a soft pulse
  mystery  the spy passages: sparse bell notes over a low drone
  tension  the collapse and the raid: a faster low ostinato with a ticking hat
plus a short sting on every chapter card. Music is ducked under the voice, and between cues there is only room tone.
"""
import os
from pathlib import Path as _P
SKILL = _P(os.environ.get('SHAMZ_SKILL_DIR') or _P(__file__).resolve().parents[2])   # the shamz-what-if skill folder
VOICE_SAMPLE = os.environ.get('CHATTERBOX_VOICE_SAMPLE')              # your own voice sample (never commit it); None = default voice
import json
import re
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf

SR = 44100
LIB = SKILL / 'studio' / 'library' / 'sfx'
words = json.load(open('studio_src/words.json'))
lines = json.load(open('studio_src/lines.json'))
chapters = json.load(open('studio_src/chapters.json'))
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


PROG = [['D3', 'F3', 'A3', 'D4'], ['A#2', 'D3', 'F3', 'A#3'], ['G2', 'A#2', 'D3', 'G3'], ['A2', 'C#3', 'E3', 'A3']]


def cue(kind, dur):
    """One music cue of `dur` seconds, starting and ending softly."""
    buf = np.zeros(int((dur + 3) * SR), np.float32)
    if kind == 'theme':
        beat = 60 / 84
        bar = beat * 4
        for b in range(int(dur / bar) + 1):
            ch = PROG[b % 4]
            add(buf, pad([NOTE[n] for n in ch], bar + 1.0), b * bar, 0.16)
            add(buf, pluck(NOTE[ch[0]] / 2, bar, 0.2), b * bar, 0.3)
            for k, idx in enumerate([0, 2, 1, 3, 2, 1, 3, 2]):
                add(buf, pluck(NOTE[ch[idx]] * 2, 1.1, 0.7), b * bar + k * beat / 2, 0.11 if k % 2 else 0.15)
            for k in range(4):
                add(buf, kick(0.5 if k == 0 else 0.28), b * bar + k * beat, 0.5)
    elif kind == 'mystery':
        beat = 60 / 66
        bar = beat * 4
        mel = ['D5', 'A4', 'F5', 'E5', 'D5', 'A#4', 'A4', 'C#5']
        for b in range(int(dur / bar) + 1):
            ch = PROG[(b // 2) % 4]
            add(buf, pad([NOTE[ch[0]] / 2, NOTE[ch[2]] / 2, NOTE[ch[1]]], bar + 1.2), b * bar, 0.2)
            add(buf, pluck(NOTE[mel[b % 8]], 2.6, 1.0), b * bar, 0.14)
            add(buf, pluck(NOTE[mel[(b + 3) % 8]], 2.0, 1.0), b * bar + beat * 2.5, 0.08)
    else:  # tension
        beat = 60 / 112
        bar = beat * 4
        ost = [0, 0, 3, 0, 5, 0, 3, 7]
        for b in range(int(dur / bar) + 1):
            ch = PROG[(b // 2) % 4]
            root = NOTE[ch[0]] / 2
            add(buf, pad([NOTE[ch[0]], NOTE[ch[2]]], bar + 0.8), b * bar, 0.12)
            for k, st in enumerate(ost):
                add(buf, pluck(root * 2 ** (st / 12), 0.34, 0.9), b * bar + k * beat / 2, 0.2)
                add(buf, hat(0.5 if k % 2 else 0.25), b * bar + k * beat / 2, 0.08)
            add(buf, kick(0.7), b * bar, 0.5)
            add(buf, kick(0.4), b * bar + beat * 2.5, 0.5)
    buf = buf[: int(dur * SR)]
    x = np.arange(len(buf)) / SR
    return buf * np.clip(x / 1.5, 0, 1) * np.clip((dur - x) / 2.5, 0, 1)


def sting():
    buf = np.zeros(int(4.0 * SR), np.float32)
    add(buf, pad([NOTE['D2'], NOTE['A2'], NOTE['D3']], 3.6), 0, 0.5)
    add(buf, pluck(NOTE['D4'], 2.4, 1.0), 0.5, 0.3)
    add(buf, pluck(NOTE['A4'], 2.6, 1.0), 1.0, 0.26)
    add(buf, pluck(NOTE['F5'], 2.6, 1.0), 1.5, 0.2)
    add(buf, kick(1.0), 0.45, 0.6)
    return buf


# ------------------------------------------------------------------ where the music plays (by script line)
L0 = lambda i: words[lines[i]['i']]['s']
L1 = lambda i: words[lines[i]['i'] + lines[i]['n'] - 1]['e']
CUES = [
    ('theme', 0, 9, 3.0),        # the cold open, to the title
    ('theme', 20, 25, 0.6),      # the rise: investors, the DAX
    ('mystery', 37, 45, 0.5),    # spies, the consulate, Novichok
    ('tension', 56, 58, 0.4),    # the evidence leaves, the story runs, the raid
    ('mystery', 64, 67, 0.4),    # detectives, the locked room, the sailor
    ('tension', 82, 88, 0.8),    # the banks reply, June 2020, the collapse
    ('mystery', 93, 98, 0.4),    # the escape route, Moscow
    ('tension', 100, 106, 0.5),  # the raid, the spy ring
    ('theme', 111, 118, 7.5),    # the ending and the end card
]
music = np.zeros(N, np.float32)
for kind, a, b, tail in CUES:
    s0, s1 = L0(a) - 0.3, L1(b) + tail
    add(music, cue(kind, s1 - s0), max(0, s0), 1.0)
st = sting()
for c in chapters:
    add(music, st, c['s'] + 0.1, 0.9)

# room tone under everything: a very low drone and a little air
rng = np.random.default_rng(3)
air = np.convolve(rng.standard_normal(N).astype(np.float32), np.ones(64, np.float32) / 64, 'same')
tone = 0.5 * np.sin(2 * np.pi * 36.71 * t) + 0.3 * np.sin(2 * np.pi * 55 * t + np.sin(2 * np.pi * 0.05 * t)) + 0.6 * air
tone *= 0.035 / np.abs(tone).max()

# ------------------------------------------------------------------ voice, ducking, effects
voice = dec('audio/voice_ep.wav')
voice = voice / np.abs(voice).max() * 0.86
v = np.zeros(N, np.float32)
v[: min(N, len(voice))] = voice[:N]
env = np.zeros(N, np.float32)
for w in words:
    env[int(max(0, w['s'] - 0.12) * SR): int((w['e'] + 0.25) * SR)] = 1.0
k = int(0.35 * SR)
env = np.convolve(env, np.ones(k, np.float32) / k, 'same')
music = music / (np.abs(music).max() + 1e-9)
music_gain = 0.24 - 0.165 * env                    # full between sentences, tucked well under the voice

mix = v + music * music_gain + tone
sp = env > 0.9
rms = lambda x: float(np.sqrt(np.mean(x ** 2)))
mu = (music * music_gain)[sp]
print('under the voice: music is', round(20 * np.log10(rms(mu[np.abs(mu) > 1e-5]) / rms(v[sp])), 1), 'dB below the voice')

# effects by shot kind, read from the shot list
src = open('studio_src/timeline.ts').read()
body = src[src.index('const SHOTLIST'): src.index('// ------------------------------------------------------------------ resolve cues')]
ent = [(m.start(), int(m.group(1)), m.group(2), m.group(3)) for m in re.finditer(r"\[(\d+), (null|'[^']*'|\"[^\"]*\"), '(\w+)'", body)]


def find_in(cue_word, line, start=None):
    wd, _, n = cue_word.partition('#')
    left = int(n or 1)
    L = lines[line]
    for i in range(start if start is not None else L['i'], L['i'] + L['n']):
        if norm(words[i]['w']) == norm(wd):
            left -= 1
            if left == 0:
                return i
    return None


paper, tick, whoosh, boom, popp, glitch, down = lib('paper_land', 0.45), lib('counter_tick', 0.18), lib('fall_whoosh', 0.26), lib('title_boom', 0.5), lib('pop', 0.26), lib('glitch', 0.26), lib('power_down', 0.28)
starts = []
for k2, (pos, line, at, kind) in enumerate(ent):
    at = None if at == 'null' else at.strip('\'"')
    wi = find_in(at, line) if at else lines[line]['i']
    starts.append((words[wi]['s'], wi, line, kind, body[pos: ent[k2 + 1][0] if k2 + 1 < len(ent) else len(body)]))
for k2, (s0, wi, line, kind, text) in enumerate(starts):
    s1 = starts[k2 + 1][0] if k2 + 1 < len(starts) else END
    stamps = re.findall(r"stamp: '([^']+)'", text)
    if kind in ('doc', 'news', 'cal'):
        add(mix, paper, s0 + 0.05, 0.7)
    if kind in ('bignum', 'S9', 'S19'):
        for x in np.arange(s0 + 0.2, min(s1, s0 + 1.3), 0.09):
            add(mix, tick, x)
    if kind in ('map', 'S10'):
        add(mix, popp, s0 + 0.35)
    if kind in ('chart',):
        add(mix, whoosh, s0 + 0.1, 0.5)
    if kind in ('S5', 'S15'):
        add(mix, whoosh, s0 - 0.25)
    if kind in ('term', 'chat'):
        for x in np.arange(s0 + 0.3, min(s1, s0 + 2.2), 0.13):
            add(mix, tick, x, 0.7)
    if kind == 'dax':
        add(mix, popp, s0 + 0.5)
    if stamps:
        j = find_in(stamps[-1], line, wi)
        add(mix, paper, (words[j]['s'] if j is not None else s0 + (s1 - s0) * 0.5) + 0.02, 1.0)
    if kind in ('S16',):
        add(mix, down, s0 + (s1 - s0) * 0.6, 0.8)
    if kind == 'S20':
        add(mix, boom, s0 + (s1 - s0) * 0.45)
    if kind == 'end':
        add(mix, boom, s0 + 0.4, 0.7)

mix = np.tanh(mix * 1.1) / 1.1
Path('out').mkdir(exist_ok=True)
sf.write('out/mix.wav', mix, SR)
on = sum((L1(b) + tail) - (L0(a) - 0.3) for _, a, b, tail in CUES) + 4 * len(chapters)
print('out/mix.wav', round(END, 1), 's; music on about', round(100 * on / END), '% of the time;', len(starts), 'shots with effects')
