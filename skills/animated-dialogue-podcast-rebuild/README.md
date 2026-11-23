# The $shamz Animated Dialogue Podcast Rebuild

A $shamz skill in the Shamz agent-skills collection. Rebuild an animated dialogue podcast episode end to end — script first, still-then-clip per line, segmented assembly, full QC, and exact-file approval — generalised from one show to any dialogue podcast.

## What it does

1. **Checks the locks before building.** Outfit, thumbnail, and voice decisions re-read; the pause confirmed lifted for this show specifically.
2. **Writes the script and locks packaging first.** Speaker-tagged dialogue, cold open first, title and thumbnail concepts locked before narration or render spend.
3. **Narrates with a spectral scan before mixing.** Fixed tones are found and notched on the raw narration, hiss treated only by the method the creator chose, loudness gated and recorded.
4. **Builds one still-then-clip per dialogue line.** Still verified frame-level first, then animated — genuine animation throughout, no still plus pan.
5. **Assembles in segments.** Chunked, checkpointed, verified pieces skipped on rerun; at most two heavy encodes at once.
6. **Runs a full QC gate table on the exact file.** Stream parity, loudness, audio gap scan, loop gate, motion, morph, photoreal, speaker-sync, hair and outfit sweeps, title cards, SFX-motion.
7. **Gets SHA-bound exact-file approval.** Compressed review copy for watching; only the approved file's hash ever publishes.
8. **Uploads at full quality and packages in full.** Title, description, chapters, playlist, thumbnail, Community post, pinned comment — verified live.

## What you need

- The show format: speaker-tagged dialogue structure, hosts, locked voices, outfits, and character sheets
- The target channel and handle to verify at upload, plus the series playlist
- The locked loudness gate for the show
- The canonical logo asset for the start and end cards
- A narration loop scanner and a spectral analysis tool for the pre-mix scan
- An episode record file in your workspace for hashes and the QC report

## How a run works

1. Confirm the locks and the lift of the pause, then write the script and lock packaging.
2. Synthesise the narration, spectral-scan it, notch any real hum found, mix, and gate the loudness.
3. Plan one clip per dialogue line, generate each still, verify it, then animate it.
4. Assemble in segments and run the full QC gate table on the exact file.
5. Send the review copy with the file's hash and wait for explicit approval of that file.
6. Upload at full quality, package in full, and verify every item on the live surface.

## Rules it follows

- Silence is never approval. Only the exact SHA-bound approved file publishes.
- Still first, then clip — never animate straight from a character reference.
- One clip per dialogue line; a second fresh angle for any line past roughly ten seconds.
- No burned-in captions; captions travel as a sidecar file only.
- The notch recipe is an example from one recorded build, not a universal constant — measure the hum in your own build first.
- The creator's ears override automated QC on audio.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The pipeline the agent follows |
| `README.md` | This how-to guide |
