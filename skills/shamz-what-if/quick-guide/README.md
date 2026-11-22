# Shamz Quick Guide (GTA 6 daily Shorts)

A fourth Shamz style, approved by the owner on 22 Nov 2026: **vertical 30 to 60 s game guides, tips and viral news**
for @shamz888 (YouTube Shorts, TikTok, Instagram Reels). Fast, punchy, second person. The hook is a mistake the viewer
is making, followed by one surprising number, named specifics, a twist, one action step and a CTA tied to the topic. Dense
motion graphics change every 0.5 to 1 s over painted scenes, and Shamz is the host in a brand-new outfit every video.

| Folder | What's in it |
|---|---|
| `STUDY.md` | The reference study: measured pace (about 150 wpm, hook under 3 s), script shape, the overlay vocabulary |
| `engine/` | The Remotion project (1080x1920, 30 fps). `src/Main.tsx`: shots and every overlay keyed to **word indices** of `words.json`, so a new voice take re-times the whole Short. Overlays: `PhoneAlert` (in-game-style phone message), `BigThree` (a giant numeral with the scene inside it + spaced label), `WipeCard` (data card whose rows light up and get stamped), `ValueCard` (a value with a red strike), `SavingsCard` (stamp + segmented bar with a cap), `OneWay` (a flow diagram with a blocked return), `MapPlate` + `Checklist` (our own stylised map, pin, tooltip, ticking checklist), `CTA` (notification, comment question, follow pill), `Captions` (1 to 3 words, all caps, Anton, key word in a solid colour box), `Chip` (@shamz888). `src/Cover.tsx`: the cover frame |
| `tools/cf.py` | Shamz plates with Cloudflare Workers AI **FLUX.2 [klein] 9B** (`M=flux-2-klein-9b`) using crops of the character sheet as reference images: the most on-model route found (FLUX.2 [dev] drifted to a cartoon or photo look and lighter skin) |
| `tools/gen.py` | The same with Gemini image models (needs paid image quota; the free key returned 429) |
| `tools/look.txt` | The identity paragraph for every Shamz prompt (edit only the OUTFIT sentence each video) |
| `tools/voice.py` | Voices `script.md` with Chatterbox in the owner's voice (0.5 / 0.5, 0.12 s sentence gap), writes `audio/voice.wav` + `studio/src/words.json` |
| `tools/mix.sh` | Voice + the music bed ducked about 10 dB under it (sidechain), fades, mastered to about -14 LUFS, muxed onto the render |
| `tools/music_scan.py` | Scans the owner's music beds: tempo, loud vocal-free stretches, sung sections (faster-whisper) |
| `cast/shamz-gta-sheet.png` | Shamz, the host: keep every permanent mark |
| `example/` | Video #1 "GTA 6 is about to DELETE your money": script with `[SRC]` lines, upload pack, plates, cover, 1 fps QC sheet |

## The style in one page

- **Format.** 9:16, 1080x1920, 30 to 60 s, about 150 wpm, 90 to 110 words. Hook in under 3 s ("Bro. GTA 6 is about to
  delete all your money."), a pattern interrupt ("No, seriously."), one surprising number, specifics with names, a
  twist, one action step, a CTA ("Save this before ..."), a comment question and "follow for a tip every day".
  Decide the ending first: **complete** (the usual) or **cliffhanger** (needs a Part 2).
- **Topic.** Today's most useful, surprising and checkable guide, tip or viral news. Verify every fact against several
  solid sources and never invent in-game numbers, names or locations. Sources go in the script's `[SRC]` lines,
  **never in descriptions**.
- **Host.** Shamz from `cast/shamz-gta-sheet.png`: golden braided locs with gold bead tips, red eyes (white sclera, red
  irises), $shamz / ankh / Om neck tattoos, Medusa and mandala sleeve, Hidden Leaf mark. **A brand-new outfit every
  video**, logged so none repeats. Use waist-up shots: they keep his face large (better identity), and there are no
  feet to float. Check every plate by eye, and regenerate brand logos, wrong hands and drifted faces.
- **Look.** Painted semi-realistic game-art scenes (original Florida-style neon beach towns, rooms, ATMs and so on, never
  copied game art), lightly darkened with a vignette, a slow Ken Burns move per shot and a white flash on each cut. Cards are
  dark glass (rgba 14,16,26,0.92), 34 px radius, Barlow Condensed 700/800. Captions are Anton, all caps, with key words in
  boxes: red #ff2e4d (danger), magenta #ff3fa4 (wrong/bad), cyan #19e3ff (key nouns), teal #14d6a0 (good), gold
  #ffc83d (money/numbers).
- **Layout.** Overlays never cover his face. Cards go above or below the head, and captions sit on the chest or lower middle.
  Keep everything out of the bottom ~300 px and the right ~120 px (platform UI), and nothing important at the frame edges.
- **Footage rule.** Never download or reuse other creators' videos or gameplay. Use only the owner's own captures, our
  graphics and Shamz renders, or official assets where their terms allow. Never recreate a publisher's logos or art.
- **Music.** The owner's own tracks, alternated in order (a rotation log), using a vocal-free stretch, ducked under the
  voice.
- **SEO (every upload).** A keyword-first title under 100 characters, a description whose first two lines repeat the main
  search terms, a YouTube tags list (`shamz`, `shamz888` first), a pinned comment, and captions for YouTube, TikTok and
  Instagram. **`#shamz` is always a hashtag on every platform.** No sources in descriptions. No misleading tags.
- **QC.** Make a 1 fps contact sheet and check it by eye before sending: Shamz on-model, nothing on faces, captions readable and
  inside their boxes, nothing cut off, the CTA clear of the platform UI, loudness about -14 LUFS. Fix, re-render, then send.

## Master prompt (for any agent making one of these)

> You are making today's **Shamz Quick Guide** Short for @shamz888 (YouTube Shorts, TikTok, Instagram Reels).
> 1. Read this README, `STUDY.md` and `example/`. Research today's most useful, surprising and checkable GTA 6 guide,
>    tip or viral news (news sites, Reddit, patch notes, Rockstar Newswire). Verify every fact against several solid
>    sources. Tell the owner the topic and whether it is complete or a cliffhanger.
> 2. Write `script.md` (90 to 110 words, the shape above, `[SRC]` lines), three titles, and pick the strongest promise.
> 3. Pick a brand-new outfit (check the outfit log), edit the OUTFIT sentence in `tools/look.txt`, and generate 4
>    waist-up Shamz plates (different poses and places that act the lines) plus 2 or 3 scene plates with
>    `M=flux-2-klein-9b python3 tools/cf.py <name> "<prompt>" refs/face.png refs/body.png refs/tattoos.png` (crops of
>    the sheet). Check each plate by eye.
> 4. Voice it: `python3 tools/voice.py <owner voice sample>` (the sample is never committed or shared).
> 5. Copy `engine/`, stage your plates and fonts in `public/`, and rewrite `SHOTS` and the overlays in `Main.tsx` for
>    this script (each shot its own framing and move; something changes every 0.5 to 1 s). Render, make the 1 fps QC
>    sheet, fix what you find, and render again.
> 6. Mix with the next track in the music rotation: `bash tools/mix.sh <track> <start s> out/<name>.mp4`.
> 7. Render the cover (`Cover` composition), write the upload pack (SEO rules above, #shamz always, no sources), log
>    the outfit and the track, commit and push (never the voice sample, music or third-party media), and send the owner
>    the MP4, the cover and the captions, plus a list of the gameplay clips he could record to make it better.
