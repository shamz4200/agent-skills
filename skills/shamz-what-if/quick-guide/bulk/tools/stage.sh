#!/bin/bash
# Stage an episode for the shared studio: its own plates (never reused between videos) and the voice into studio/public/<ep>/
cd "$(dirname "$0")/.."
for ep in "$@"; do
  mkdir -p studio/public/$ep
  cp $ep/plates/*.png studio/public/$ep/ 2>/dev/null
  cp $ep/audio/voice.wav studio/public/$ep/voice.wav
done
