"""Voice one or more Quick Guide scripts with Chatterbox in the owner's voice (0.5 / 0.5).
python3 gta/tools/voice.py <ep dir> [...]  ->  <ep>/audio/voice.wav and <ep>/words.json"""
import json, os, sys
import pathlib; sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3] / 'scripts'))
from chatterbox_voice import synth
SAMPLE = os.environ.get('SHAMZ_VOICE', 'assets/voice/shamz_voice.mp3')  # the owner's sample: never commit or share it
for ep in sys.argv[1:]:
    t = open(f'{ep}/script.md').read().split('## Script')[1].split('[SRC]')[0]
    text = ' '.join(l.strip() for l in t.split('\n') if l.strip())
    os.makedirs(f'{ep}/audio', exist_ok=True)
    words = synth(text, f'{ep}/audio/voice.wav', SAMPLE, 0.5, 0.5, sentence_gap=0.12)
    json.dump([{k: (float(v) if k in 'se' else v) for k, v in w.items()} for w in words], open(f'{ep}/words.json', 'w'))
    print('VOICED', ep, len(words), 'words', round(float(words[-1]['e']), 1), 's', flush=True)
