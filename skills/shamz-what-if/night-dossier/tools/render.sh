#!/bin/bash
# Render the episode in chunks (resumable): out/parts/pNNN.mp4, then join them into out/silent.mp4.
#   bash render.sh <total frames> [chunk]
cd "$(dirname "$0")"
TOTAL=$1; CH=${2:-1200}; mkdir -p out/parts
BX=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
i=0
for ((a=0; a<TOTAL; a+=CH)); do
  b=$((a+CH-1)); [ $b -ge $TOTAL ] && b=$((TOTAL-1))
  f=$(printf "out/parts/p%03d.mp4" $i); i=$((i+1))
  need=$((b-a+1))
  if [ -f "$f" ]; then
    have=$(ffprobe -v error -count_packets -select_streams v -show_entries stream=nb_read_packets -of csv=p=0 "$f" 2>/dev/null)
    [ "${have:-0}" = "$need" ] && continue
  fi
  rm -f "$f"
  npx remotion render studio_src/index.ts Dossier "$f" --frames=$a-$b --public-dir public --crf 19 --log error --concurrency 4 --browser-executable $BX > out/parts/log_$i.txt 2>&1
  [ -f "$f" ] && echo "ok $f $(date +%H:%M)" || echo "FAIL $f"
done
ls out/parts/p*.mp4 | sed "s|out/parts/|file '|; s|$|'|" > out/parts/list.txt
ffmpeg -v error -y -f concat -safe 0 -i out/parts/list.txt -c copy out/silent.mp4 && echo RENDER_DONE
