"""Voice for the episode: every spoken line of script.md through Chatterbox (Shamz), with word timings.
Writes public/voice.wav and studio_src/words.json; also studio_src/lines.json (line text, chapter, first word index)."""
import os
from pathlib import Path as _P
SKILL = _P(os.environ.get('SHAMZ_SKILL_DIR') or _P(__file__).resolve().parents[2])   # the shamz-what-if skill folder
VOICE_SAMPLE = os.environ.get('CHATTERBOX_VOICE_SAMPLE')              # your own voice sample (never commit it); None = default voice
import json, re, sys
sys.path.insert(0, str(SKILL / 'scripts'))
from chatterbox_voice import synth
chap, lines = None, []
for l in open('script.md').read().split('\n'):
    l = l.strip()
    if l.startswith('## '): chap = l[3:]
    elif chap and l and not l.startswith('[SRC]'): lines.append((chap, l))
text = ' '.join(l for _, l in lines)
words = synth(text, 'public/voice.wav', VOICE_SAMPLE, 0.5, 0.5)
json.dump(words, open('studio_src/words.json', 'w'))
i, out = 0, []
for c, l in lines:
    n = len(re.findall(r"[\w'’\-]*\w[\w'’\-]*", l))
    out.append({'chapter': c, 'text': l, 'i': i, 'n': n}); i += n
json.dump(out, open('studio_src/lines.json', 'w'), indent=0)
print(len(words), 'words', i, 'counted', words[-1])
