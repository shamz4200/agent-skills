#!/usr/bin/env python3
"""RMS onset envelope for beat mapping.

Reads an audio or video file, decodes to mono 8kHz, and prints the energy
onsets (times in seconds where the short-window RMS peaks). Use it to find
the beat grid before cutting: every cut and every type change lands on an
onset.

Usage: onset-envelope.py <file> [--win 0.1] [--thresh 0.12]
Prints: onset count, first 30 onset times, first 30 gaps between onsets.
"""
import subprocess, struct, math, argparse

def envelope(path, win=0.1, sr=8000):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(sr),
         "-f", "s16le", "-"], capture_output=True).stdout
    n = len(raw) // 2
    vals = struct.unpack(f"<{n}h", raw[:n * 2])
    per = int(sr * win)
    rms = []
    for i in range(0, len(vals) - per, per):
        chunk = vals[i:i + per]
        rms.append(math.sqrt(sum(x * x for x in chunk) / len(chunk)) / 32768)
    return rms

def onsets(rms, thresh, win):
    peaks = []
    for i in range(1, len(rms) - 1):
        if rms[i] > thresh and rms[i] >= rms[i - 1] and rms[i] >= rms[i + 1]:
            peaks.append(i * win)
    out = []
    for p in peaks:
        if not out or p - out[-1] > 0.25:
            out.append(round(p, 2))
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("--win", type=float, default=0.1)
    ap.add_argument("--thresh", type=float, default=0.12)
    args = ap.parse_args()
    rms = envelope(args.file, args.win)
    pk = onsets(rms, args.thresh, args.win)
    gaps = [round(b - a, 2) for a, b in zip(pk, pk[1:])]
    print(f"onsets: {len(pk)}")
    print(f"first 30: {pk[:30]}")
    print(f"gaps: {gaps[:30]}")

if __name__ == "__main__":
    main()
