#!/bin/bash
# 1 fps QC sheet of a rendered Short: board.sh <mp4> <out.png>
ffmpeg -v error -y -i "$1" -vf "fps=1,scale=270:-1,tile=8x6" -frames:v 1 "$2"
