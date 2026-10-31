"""The free voice route: Chatterbox (open source, runs on your own computer) cloned from your own voice sample, with
word timings from faster-whisper. voice.py uses it when the engine is "chatterbox"; it writes the same files as the
ElevenLabs route, so every later step works unchanged.

Setup (once): pip install chatterbox-tts faster-whisper   (downloads about 3 GB of models on the first run)
Voice sample: 10 to 30 s of clean speech in one voice, as a WAV or MP3. Never commit it: keep it in the project folder,
which the installer's .gitignore covers, or anywhere outside the repo.
"""
import difflib, os, re, subprocess

import numpy as np

_tts = None


def _model():
    global _tts
    if _tts is None:
        import torch
        from chatterbox.tts import ChatterboxTTS
        torch.set_num_threads(max(1, os.cpu_count() or 1))
        dev = 'cuda' if torch.cuda.is_available() else ('mps' if torch.backends.mps.is_available() else 'cpu')
        _tts = ChatterboxTTS.from_pretrained(device=dev)
    return _tts


def _norm(w):
    return re.sub(r"[^\w]", '', w.lower().replace('’', "'"))


def synth(text, out_wav, sample=None, exaggeration=0.5, cfg_weight=0.5, sentence_gap=0.3):
    """Speak `text` into out_wav (one take per sentence, joined with a short pause) and return its word timings as
    [{'w', 's', 'e', 'p'}], the format voice.py expects (p = the punctuation after the word)."""
    import torchaudio as ta

    model = _model()
    sentences = [s for s in re.split(r'(?<=[.!?…])\s+', text.strip()) if s]
    gap = np.zeros(int(sentence_gap * model.sr), dtype=np.float32)
    parts = []
    for s in sentences:
        wav = model.generate(s, audio_prompt_path=sample, exaggeration=exaggeration, cfg_weight=cfg_weight)
        parts += [wav.squeeze(0).cpu().numpy().astype(np.float32), gap]
    audio = np.concatenate(parts[:-1]) if parts else np.zeros(1, dtype=np.float32)
    import torch
    ta.save(str(out_wav), torch.from_numpy(audio).unsqueeze(0), model.sr)
    return timings(out_wav, text)


def timings(wav_path, text):
    """Word timings for a take of `text`: transcribe what was actually spoken, then line it up with the script's own
    words (the script keeps its spelling and punctuation; whisper only supplies the times)."""
    from faster_whisper import WhisperModel

    # decoded with ffmpeg and handed over as samples (faster-whisper's own decoder breaks with some PyAV versions)
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(wav_path), '-f', 's16le', '-ac', '1', '-ar', '16000', '-'],
                         capture_output=True, check=True).stdout
    audio16 = np.frombuffer(raw, np.int16).astype(np.float32) / 32768.0
    total = len(audio16) / 16000
    wm = WhisperModel(os.environ.get('WHISPER_MODEL', 'base.en'), device='cpu', compute_type='int8')
    segs, _ = wm.transcribe(audio16, language='en', word_timestamps=True, vad_filter=False)
    heard = [(w.word.strip(), w.start, w.end) for seg in segs for w in (seg.words or [])]
    script = [(m.group(1), m.group(2)) for m in re.finditer(r"([\w'’]+)([^\w\s'’]*)", text)]
    a, b = [_norm(w) for w, _ in script], [_norm(w) for w, _, _ in heard]
    times = [None] * len(script)
    for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
        for k in range(blk.size):
            times[blk.a + k] = (heard[blk.b + k][1], heard[blk.b + k][2])
    # words whisper missed or heard differently: spread them evenly between their matched neighbours
    i = 0
    while i < len(times):
        if times[i] is not None:
            i += 1
            continue
        j = i
        while j < len(times) and times[j] is None:
            j += 1
        t0 = times[i - 1][1] if i > 0 else 0.0
        t1 = times[j][0] if j < len(times) else total
        step = max(0.05, (t1 - t0) / (j - i))
        for k in range(i, j):
            times[k] = (t0 + (k - i) * step, t0 + (k - i + 1) * step)
        i = j
    return [{'w': w, 's': round(s, 3), 'e': round(e, 3), 'p': p} for (w, p), (s, e) in zip(script, times)]
