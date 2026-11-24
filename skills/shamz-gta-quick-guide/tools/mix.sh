#!/bin/bash
# Mix: Shamz voice + a music bed ducked under it, mastered to -14 LUFS, muxed onto the silent render.
#   bash tools/mix.sh <music.wav> <music start s> <out.mp4>
set -e; cd "$(dirname "$0")/.."
M=$1; S=${2:-0}; OUT=$3
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 out/silent_voice.mp4)
ffmpeg -v error -y -i out/silent_voice.mp4 -i audio/voice.wav -ss $S -i "$M" -filter_complex "
[1:a]aresample=48000,pan=stereo|c0=c0|c1=c0,apad,atrim=0:$D,asplit=2[v][sc];
[2:a]aresample=48000,atrim=0:$D,asetpts=N/SR/TB,volume=0.16,afade=t=in:d=0.4,afade=t=out:st=$(echo "$D-1.6"|bc):d=1.6[m];
[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=350[md];
[v][md]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=9[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k "$OUT"
echo mixed "$OUT"
