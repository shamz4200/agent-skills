# Bulk mode: 6 Quick Guide Shorts a day

The production setup for the owner's GTA 6 series (videos #2-#18): one shared Remotion studio, and each Short is a spec
(`src/eps/<slug>.ts`: shots + overlays keyed to **word indices** of its voice take) plus its own folder `<slug>/`
(`script.md`, `plates.json`, `plates/`, `audio/voice.wav`, `words.json`, `upload.md`).

## Owner rules (Nov 2026), all of them, every batch
- **6 Shorts a day**, one batch at 11:11 UK time, sent together.
- **Shamz = the original painted character** (`../cast/shamz-gta-sheet.png`), **a brand-new outfit every video** (log it).
- **Shamz's eyes always exactly like `../cast/shamz_eyes_reference.png`**: bright red iris, black outer ring, thin
  inner ring, black pupil, three curled tomoe, white glint upper-left. `tools/plates.py` paints them on every Shamz
  plate with `tools/eyes.py`; zoom in and check both eyes are centred on each drawn eye. Before/after and a preview
  sheet: `../example/eyes/`.
- **Hands**: zoom in on every hand in every plate and count five fingers (a six-fingered hand once reached a finished
  video). Also check for brand logos (phones, shoes, cars) and garbled lettering. Regenerate failures.
- **Never reuse an image** between videos; code-drawn cards, maps and numbers are fine to share.
- **Music**: the owner's own tracks in rotation (`music-rotation-example.md`), a vocal-free stretch, ducked ~10 dB.
- **Upload pack**: max SEO (keyword-first title under 100 characters, keyword-rich first lines, tags list with `shamz`
  and `shamz888` first, pinned comment, captions for YouTube Shorts, TikTok and Instagram), **#shamz always**, **never any
  sources in descriptions** (sources live in the script's `[SRC]` lines).
- **Matching file names**: deliver `gta6-<slug>.mp4`, `gta6-<slug>.md` (upload pack) and `gta6-<slug>.png` (thumbnail).
- **QC every video by eye** on a 1 fps board before sending; fix first.

## Setup (once)
```
mkdir -p gta/studio/public && cp -r bulk/tools gta/tools && cp -r bulk/src bulk/package.json bulk/tsconfig.json gta/studio/
cp bulk/fonts/*.woff2 gta/studio/public/ && (cd gta/studio && npm install)
pip install chatterbox-tts faster-whisper soundfile numpy librosa mediapipe pillow
apt-get install -y libegl1 libgles2 bc ffmpeg          # MediaPipe needs EGL; mixep.sh uses bc
mkdir -p gta/tools/models && curl -o gta/tools/models/face_landmarker.task \
  https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task
```
Images: Cloudflare Workers AI FLUX.2 [klein] 9B (`CLOUDFLARE_ACCOUNT_ID`; the **Workers Paid** plan, since the free tier
is about 12 images a day). Voice: the owner's sample at `assets/voice/shamz_voice.mp3` or `SHAMZ_VOICE` (never commit it).
`tools/build.sh` points Remotion at a Chromium headless shell: change `BX` to yours.

## Pipeline per batch
1. Research 6 topics (useful, surprising, checkable; none repeated). Write `gta/<slug>/script.md` (90-115 words, hook
   under 3 s, ends with a comment question + follow, `[SRC]` lines from several sources).
2. `python3 gta/tools/voice.py <slugs>`: start first (about a minute per sentence on CPU).
3. `gta/<slug>/plates.json`: `outfit`, three `shamz` poses that act the lines (prefer front-facing so the eyes read),
   three new `scenes` (see `../example/batch/*/plates.json`). `python3 gta/tools/plates.py <slugs>` (paints the eyes).
   `python3 gta/tools/sheet.py gta/<slug> out.png`, then zoom on hands and eyes; regenerate failures.
4. `gta/studio/src/eps/<slug>.ts` (see `src/eps/`), register it + its cover in `Root.tsx`. Overlays in `engine.tsx`:
   `alert`, `big`, `tag`, `list`, `value`, `versus`, `count` (`comma`, `fromV`), `badge` (stamp + bar), `flow`, `check`,
   `pin`, `zone`, `stars` (`center`, `scale`), `icons` (swaps), `button` (`hold`), `cta`. Shot plates: a plate name,
   `map`, or `grad:#a,#b`.
5. `bash gta/tools/build.sh <slug> <music file> <start s>`: stage, render, cover, 1 fps board, two-pass mix at -14 LUFS.
6. Read every board: no empty beats over ~2 s, cards big enough to fill a plain background, nothing over faces,
   nothing in the bottom ~300 px except the CTA pills, counters moving when their line starts, hands and eyes right in
   the first frame and the cover. Fix the spec and rebuild.
7. Write `upload.md` (rules above), copy to `deliverables/gta-NN-<slug>/gta6-<slug>.{mp4,md,png}`, log outfits and
   music, commit, and send the owner all six.
