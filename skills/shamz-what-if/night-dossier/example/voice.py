import os
from pathlib import Path as _P
SKILL = _P(os.environ.get('SHAMZ_SKILL_DIR') or _P(__file__).resolve().parents[2])   # the shamz-what-if skill folder
VOICE_SAMPLE = os.environ.get('CHATTERBOX_VOICE_SAMPLE')              # your own voice sample (never commit it); None = default voice
import json, re, sys
sys.path.insert(0, str(SKILL / 'scripts'))
from chatterbox_voice import synth
lines = [l.strip() for l in open('script.md').read().split('\n\n')[2].split('\n') if l.strip()]
text = ' '.join(lines)
words = synth(text, 'public/voice.wav', VOICE_SAMPLE, 0.5, 0.5)
json.dump(words, open('studio_src/words.json', 'w'))
print(len(words), words[-1])
