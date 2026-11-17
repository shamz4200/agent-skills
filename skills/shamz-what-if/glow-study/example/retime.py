"""Exact word timings for the episode, and room for the chapter cards.

The voice tool caches one take per sentence, so every sentence's start and end in the full track are known exactly.
Words are timed inside their own sentence only (faster-whisper on that sentence's clip, matched to the script words;
anything unmatched is spread between its neighbours), so a mis-heard number can never shift the rest of the episode.
Then a silent gap is opened before each chapter for its title card.

    python3 retime.py            (after voice.py)
Writes audio/voice_ep.wav, studio_src/words.json (final), studio_src/lines.json, studio_src/chapters.json.
"""
import os
from pathlib import Path as _P
SKILL = _P(os.environ.get('SHAMZ_SKILL_DIR') or _P(__file__).resolve().parents[2])   # the shamz-what-if skill folder
VOICE_SAMPLE = os.environ.get('CHATTERBOX_VOICE_SAMPLE')              # your own voice sample (never commit it); None = default voice
import difflib
import hashlib
import json
import re
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf

SAMPLE = VOICE_SAMPLE
GAP = 0.3            # the voice tool's pause between sentences
CARD = 2.6           # seconds of chapter card before a chapter's first word
TOK = r"([\w'’]+)([^\w\s'’]*)"
norm = lambda w: re.sub(r"[^\w]", '', w.lower().replace('’', "'"))

chap, lines = None, []
for l in open('script.md').read().split('\n'):
    l = l.strip()
    if l.startswith('## '):
        chap = l[3:]
    elif chap and l and not l.startswith('[SRC]'):
        lines.append((chap, l))
text = ' '.join(l for _, l in lines)
sentences = [s for s in re.split(r'(?<=[.!?…])\s+', text.strip()) if s]
tag = hashlib.sha1(f'{SAMPLE}|0.5|0.5'.encode()).hexdigest()[:8]
cache = Path('audio/.chatterbox_cache')
sr = sf.info('audio/voice.wav').samplerate if Path('audio/voice.wav').exists() else 24000

from faster_whisper import WhisperModel  # noqa: E402
wm = WhisperModel('small.en', device='cpu', compute_type='int8')


def res16(wav):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(sr), '-ac', '1', '-i', '-', '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'],
                         input=wav.astype(np.float32).tobytes(), capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32)


def voiced(wav):
    """(start, end) seconds of the spoken part of a clip, by energy."""
    e = np.abs(wav)
    win = int(sr * 0.02)
    env = np.convolve(e, np.ones(win) / win, 'same')
    on = np.where(env > max(0.01, env.max() * 0.04))[0]
    return (on[0] / sr, on[-1] / sr) if len(on) else (0.0, len(wav) / sr)


words, clips, t = [], [], 0.0
for s in sentences:
    wav = np.load(cache / f'{hashlib.sha1(f"{tag}|{s}".encode()).hexdigest()[:16]}.npy')
    dur = len(wav) / sr
    v0, v1 = voiced(wav)
    script = [(m.group(1), m.group(2)) for m in re.finditer(TOK, s)]
    segs, _ = wm.transcribe(res16(wav), language='en', word_timestamps=True, vad_filter=False)
    heard = [(w.word.strip(), w.start, w.end) for seg in segs for w in (seg.words or [])]
    a, b = [norm(w) for w, _ in script], [norm(w) for w, _, _ in heard]
    times = [None] * len(script)
    for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
        for k in range(blk.size):
            times[blk.a + k] = (max(v0, heard[blk.b + k][1]), min(v1 + 0.05, heard[blk.b + k][2]))
    i = 0
    while i < len(times):
        if times[i] is not None:
            i += 1
            continue
        j = i
        while j < len(times) and times[j] is None:
            j += 1
        t0 = times[i - 1][1] if i > 0 else v0
        t1 = times[j][0] if j < len(times) else v1
        # share the gap by word length (longer words take longer to say)
        wts = np.array([max(2, len(script[k][0])) for k in range(i, j)], float)
        cum = np.concatenate([[0], np.cumsum(wts)]) / wts.sum()
        for n, k in enumerate(range(i, j)):
            times[k] = (t0 + (t1 - t0) * cum[n], t0 + (t1 - t0) * cum[n + 1])
        i = j
    # keep them in order and inside the clip
    last = v0
    for k, (s0, e0) in enumerate(times):
        s0 = min(max(s0, last), dur)
        e0 = min(max(e0, s0 + 0.04), dur)
        times[k] = (s0, e0)
        last = s0
    words += [{'w': w, 's': t + s0, 'e': t + e0, 'p': p} for (w, p), (s0, e0) in zip(script, times)]
    clips.append((t, wav))
    t += dur + GAP

# ---- lines and chapters, with the same word split
out_lines, i = [], 0
for c, l in lines:
    n = len(re.findall(TOK, l))
    out_lines.append({'chapter': c, 'text': l, 'i': i, 'n': n})
    i += n
assert i == len(words), (i, len(words))

# ---- open a gap before each chapter (not the cold open): shift everything from that chapter's first sentence on
chapters, shift = [], 0.0
starts = {}
for ln in out_lines:
    starts.setdefault(ln['chapter'], ln['i'])
order = list(starts.items())
cuts = []                                    # (time in the original track, seconds to insert)
for name, wi in order[1:]:
    t0 = max(c for c, _ in clips if c <= words[wi]['s'] + 1e-6)
    pre = 2.2 if not cuts else 0.5          # hold on the last shot before the card (longer after the title)
    cuts.append((t0, pre + CARD, name, pre))
total = t - GAP
audio = np.zeros(int((total + sum(x[1] for x in cuts) + 2) * sr), np.float32)
for ct, wav in clips:
    off = sum(x[1] for x in cuts if x[0] <= ct + 1e-9)
    a0 = int((ct + off) * sr)
    audio[a0:a0 + len(wav)] += wav
for w in words:
    clip_t = max(c for c, _ in clips if c <= w['s'] + 1e-6)
    off = sum(x[1] for x in cuts if x[0] <= clip_t + 1e-9)
    w['s'] = round(w['s'] + off, 3)
    w['e'] = round(w['e'] + off, 3)
done = 0.0
for c, g, name, pre in cuts:
    chapters.append({'title': name, 's': round(c + done + pre - 0.1, 3), 'e': round(c + done + g - 0.25, 3)})
    done += g
end = words[-1]['e']
sf.write('audio/voice_ep.wav', audio[: int((end + 0.5) * sr)], sr)
json.dump(words, open('studio_src/words.json', 'w'))
json.dump(out_lines, open('studio_src/lines.json', 'w'), indent=0)
json.dump(chapters, open('studio_src/chapters.json', 'w'), indent=0)
short = [w for w in words if w['e'] - w['s'] < 0.045]
print(len(words), 'words', round(end, 1), 's', len(chapters), 'chapter cards;', len(short), 'very short words')
