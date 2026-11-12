"""Sound for the Night Dossier test: the voice, a dark ambient bed synthesised here (a low drone + a slow pulse), and
a few effects from the studio sound library on the same cue words the shots use. Writes out/mix.wav (-14 LUFS is set
when the video is muxed).

    python3 mix.py
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
FPS = 30
LIB = SKILL / 'studio' / 'library' / 'sfx'
words = json.load(open('studio_src/words.json'))
norm = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())


def find(cue, start):
    w, _, n = cue.partition('#')
    left = int(n or 1)
    for i in range(start, len(words)):
        if norm(words[i]['w']) == norm(w):
            left -= 1
            if left == 0:
                return i
    raise SystemExit(f'cue {cue} not found')


def load(name, gain=1.0):
    f = next(LIB.glob(name + '-*.mp3'))
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(f), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32) * gain


voice, vsr = sf.read('public/voice.wav', dtype='float32')
if voice.ndim > 1:
    voice = voice.mean(axis=1)
if vsr != SR:
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', 'public/voice.wav', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    voice = np.frombuffer(raw, np.float32)
total = words[-1]['e'] + 2.5
n = int(total * SR)
t = np.arange(n) / SR

# ---- the bed: D minor drone, slow swell, a soft low pulse, a little air
bed = np.zeros(n, np.float32)
for fr, a in ((36.71, 0.5), (73.42, 0.38), (110.0, 0.2), (146.83, 0.12), (174.61, 0.08)):
    bed += a * np.sin(2 * np.pi * fr * t + 0.6 * np.sin(2 * np.pi * 0.07 * t + fr))
bed *= 0.55 + 0.45 * np.sin(2 * np.pi * t / 11.0 - 1.2) ** 2
beat = 60 / 54
ph = (t % beat) / beat
bed += 0.5 * np.sin(2 * np.pi * 48 * t) * np.exp(-ph * 9) * (t > 12)
rng = np.random.default_rng(3)
air = np.convolve(rng.standard_normal(n).astype(np.float32), np.ones(64, np.float32) / 64, 'same')
bed += 0.5 * air
bed *= np.clip(t / 2.0, 0, 1) * np.clip((total - t) / 2.5, 0, 1)
bed = bed / np.abs(bed).max() * 0.13

mix = bed.copy()
mix[:len(voice[:n])] += voice[:n] / np.abs(voice).max() * 0.85


def put(sound, sec, gain=1.0):
    i = max(0, int(sec * SR))
    seg = sound[: max(0, n - i)] * gain
    mix[i:i + len(seg)] += seg


S = lambda i: words[i]['s']
cur = -1
def cue(c):
    global cur
    cur = find(c, cur + 1)
    return cur

paper, tick, whoosh, boom, popp, glitch, down = load('paper_land', 0.5), load('counter_tick', 0.22), load('fall_whoosh', 0.3), load('title_boom', 0.5), load('pop', 0.3), load('glitch', 0.3), load('power_down', 0.3)
i = cue('June'); i = cue('man'); put(paper, S(find('cash', i)), 0.6)
i = cue('boards'); i = cue('He'); put(popp, S(find('Jan', i)))
i = cue('Until'); put(whoosh, S(i) - 0.25); put(paper, S(find('yesterday', i)))
i = cue("It's")
for k in range(4): put(popp, S(find('moves', i)) + k * 0.23, 0.6)
i = cue('Not'); i = cue('But')
i = cue('Wirecard'); a, b = S(find('one', i)), S(find('euros', i))
for x in np.arange(a, b, 0.09): put(tick, x)
i = cue('sitting'); put(popp, S(find('two', i))); put(popp, S(find('two', i)) + 0.3)
i = cue('The#2'); put(paper, S(find('never', i)))
i = cue('The'); i = cue('It')
i = cue('By'); put(paper, S(find('warrant', i)))
i = cue('the#2'); put(whoosh, S(i) - 0.25); put(popp, S(find('Belarus', i)) + 0.15)
i = cue('And'); put(down, S(find('gone', i)), 0.8)
i = cue('Years'); i = cue('Russian'); put(paper, S(find('intelligence', i)))
i = cue('This'); a = S(find('invented', i)); b = S(find('euros', i))
for x in np.arange(a, a + 0.85, 0.09): put(tick, x)
put(glitch, b + 0.07)
i = cue('and'); put(boom, S(find('vanished', i)) + 0.2)

mix = np.tanh(mix * 1.1) / 1.1
Path('out').mkdir(exist_ok=True)
sf.write('out/mix.wav', mix, SR)
print('out/mix.wav', round(total, 2), 's')
