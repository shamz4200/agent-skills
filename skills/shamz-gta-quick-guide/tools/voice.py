"""Voice the script with Chatterbox. python3 tools/voice.py [sample.mp3]  (no sample = Chatterbox default voice, preview only)
Writes audio/voice.wav and studio/src/words.json."""
import json, sys
import os, pathlib
_here = pathlib.Path(__file__).resolve()
for _d in [os.environ.get('SHAMZ_SCRIPTS', ''), _here.parents[1] / 'scripts', _here.parents[2] / 'scripts',
           pathlib.Path('.claude/skills/shamz-gta-quick-guide/scripts')]:
    if _d and (pathlib.Path(_d) / 'chatterbox_voice.py').exists(): sys.path.insert(0, str(_d)); break
# chatterbox_voice.py ships in this skill's scripts/ (or set SHAMZ_SCRIPTS)
from chatterbox_voice import synth
t = open('script.md').read().split('## Script')[1].split('[SRC]')[0]
text = ' '.join(l.strip() for l in t.split('\n') if l.strip())
sample = sys.argv[1] if len(sys.argv) > 1 else None
words = synth(text, 'audio/voice.wav', sample, 0.5, 0.5, sentence_gap=0.12)
import os; os.makedirs('studio/src', exist_ok=True)
json.dump(words, open('studio/src/words.json', 'w'))
print(len(words), 'words, ends', words[-1])
