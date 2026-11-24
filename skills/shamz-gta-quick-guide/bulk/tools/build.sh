#!/bin/bash
# Build one batch Short end to end: stage -> render -> cover -> 1 fps board -> music mix.
#   bash gta/tools/build.sh <ep> <music file> <music start s>
set -e; cd "$(dirname "$0")/.."; EP=$1
BX=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
rm -rf studio/public/$EP; bash tools/stage.sh $EP; mkdir -p out
(cd studio && npx remotion render src/index.ts $EP ../out/$EP-silent.mp4 --public-dir public --crf 18 --log error --concurrency 4 --browser-executable $BX \
  && npx remotion still src/index.ts cover-$EP ../out/$EP-cover.png --public-dir public --log error --browser-executable $BX)
bash tools/board.sh out/$EP-silent.mp4 out/$EP-board.png
bash tools/mixep.sh $EP "$2" $3
