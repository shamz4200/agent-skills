#!/bin/bash
# Mix a batch episode: voice + music bed ducked ~10 dB under it, -14 LUFS (two-pass loudnorm), muxed onto out/<ep>-silent.mp4
#   bash gta/tools/mixep.sh <ep> <music file> <music start s>   ->  gta/out/<ep>.mp4
set -e; cd "$(dirname "$0")/.."
EP=$1; M=$2; S=${3:-0}
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 out/$EP-silent.mp4)
FC="[1:a]aresample=48000,pan=stereo|c0=c0|c1=c0,apad,atrim=0:$D,asplit=2[v][sc];
[2:a]aresample=48000,atrim=0:$D,asetpts=N/SR/TB,volume=0.16,afade=t=in:d=0.4,afade=t=out:st=$(echo "$D-1.6"|bc):d=1.6[m];
[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=350[md];[v][md]amix=inputs=2:normalize=0:duration=first"
J=$(ffmpeg -nostats -i out/$EP-silent.mp4 -i $EP/audio/voice.wav -ss $S -i "$M" -filter_complex "$FC,loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i out/$EP-silent.mp4 -i $EP/audio/voice.wav -ss $S -i "$M" -filter_complex "$FC,loudnorm=I=-14:TP=-1.5:LRA=9:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 out/$EP.mp4
echo "mixed out/$EP.mp4 $(ffmpeg -nostats -i out/$EP.mp4 -af ebur128 -f null - 2>&1 | grep -E '^\s+I:' | tail -1)"
