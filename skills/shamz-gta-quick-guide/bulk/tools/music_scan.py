"""Scan music beds: tempo, strong (loud, steady) sections and sung-vocal sections (faster-whisper).
python3 gta/tools/music_scan.py [file ...]   (default: every file in assets/music/ not yet named in docs/GTA_MUSIC.md)
Prints a rotation row per track. Vocals under narration clash: avoid sung sections or use the backing version."""
import sys, pathlib, warnings
warnings.filterwarnings('ignore')
import librosa, numpy as np
from faster_whisper import WhisperModel
root = pathlib.Path(__file__).resolve().parents[2]
doc = (root / 'docs/GTA_MUSIC.md').read_text()
files = [pathlib.Path(f) for f in sys.argv[1:]] or sorted(p for p in (root / 'assets/music').iterdir() if p.name not in doc)
wm = WhisperModel('base.en', device='cpu', compute_type='int8')
def spans(blocks):
    out, a = [], None
    for b in blocks + [None]:
        if a is not None and (b is None or b != prev + 8): out.append(f'{a}-{prev + 8}'); a = None
        if b is not None and a is None: a = b
        prev = b if b is not None else prev
    return out
for f in files:
    y, sr = librosa.load(f, sr=16000, mono=True)
    t = float(np.atleast_1d(librosa.beat.beat_track(y=y, sr=sr)[0])[0])
    db = 20 * np.log10(librosa.feature.rms(y=y, hop_length=sr)[0] + 1e-6)
    blk = [db[i * 8:i * 8 + 8].mean() for i in range(len(db) // 8)]
    segs = [s for s in wm.transcribe(y.astype(np.float32), language='en', vad_filter=True)[0] if s.no_speech_prob < 0.5]
    sung = sorted({int(s.start // 8 * 8) for s in segs})
    strong = [i * 8 for i, v in enumerate(blk) if v > np.median(blk) - 1 and i * 8 not in sung]
    n = sum(len(s.text.split()) for s in segs)
    d = len(y) / sr
    print(f"| `{f.name}` | ~{t:.0f} BPM | {int(d // 60)}:{int(d % 60):02d} | {', '.join(spans(strong)) or '-'} | "
          f"{'vocals ' + ', '.join(spans(sung)) if sung else 'no vocals heard'} ({n} words) |")
