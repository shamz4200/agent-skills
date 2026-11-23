---
name: animated-dialogue-podcast-rebuild
description: Rebuild an animated dialogue podcast episode end to end: script first, still-then-clip per line, segmented assembly, full QC, exact-file approval.
---

# The $shamz Animated Dialogue Podcast Rebuild

Rebuild an animated dialogue podcast episode end to end: script and packaging first, narration with a spectral scan before mixing, one still-then-clip per dialogue line, segmented assembly, a full QC gate table on the exact file, review copy plus SHA-bound approval, and upload with full packaging. Generalised from one show to any dialogue podcast — set the show parameters below before any build.

## Parameters (set these before any build)

- **Show:** the show's format (speaker-tagged dialogue, cold open first, debate topics, rapid-fire round, final take), hosts and their locked voices, outfits, and character sheets.
- **Drop surface:** the channel and handle to verify at upload, the series playlist, and the second surfaces.
- **Loudness spec:** the locked loudness gate for this show (for example −16 ±1 LUFS, true peak at or below −1.0 dBTP).
- **Episode record:** where the run note, hashes, and QC report live in your workspace.

## 0. Before any build

1. Re-read the show's protected workflow and current standing rules. Check for a newer outfit, thumbnail, or voice decision since the last episode. No production on an un-locked outfit system.
2. Confirm the pause is lifted in the creator's own words for this show specifically. A global resume does not count.
3. Confirm the target channel and handle with the creator, and verify it via the platform's channel lookup at upload time.

## 1. Script and packaging first

- Lock title and thumbnail concepts at script stage, before narration or render spend. Thumbnails are made before upload. If no title pairs with any thumbnail sketch, rework the idea, never the packaging.
- Script: speaker-tagged dialogue, cold open first, topics with real debate, signature questions, rapid fire, final take. Every claim a real person, product, or place makes gets a real reference image — never an AI lookalike.

## 2. Narration and audio

1. Synthesise the narration from the dialogue script.
2. **Spectral-scan the raw narration for fixed tones before mixing.** A fixed hum that survives into the mix is caught here or not at all.
3. **Notch recipe (example, not a universal constant):** one recorded build fixed a hum family with a narrow notch at the fundamental and its harmonics — Q=12, −40 dB at the fundamental and at two, three, and four times that frequency, plus a second −40 dB pass at the fundamental — verified across multiple windows. The frequency in that build was 174.5 Hz (harmonics 349, 523.5, 698 Hz). Measure your own build's hum first; only apply a notch at frequencies your scan actually found, and verify the fix across multiple windows.
4. Tackle hiss only by the method the creator chose for that episode. Never apply noise reduction blind to a full episode — test samples first, and check the treatment did not damage the voice.
5. Mix with a split voice chain, a voice-presence gate (a short transcribed sample before the mux and after the mux), and the locked loudness gate. Record the measured loudness.
6. The creator listens at maximum volume before picture approval is treated as audio approval. Their ears override automated QC.

## 3. Picture

1. **Shot plan:** one line and one clip per dialogue line, speaker on screen per line, timings solved from the audio (word timings from transcription, or silence seams plus per-line word counts if transcription stalls).
2. **Scene-still-first:** generate the still, QC it frame-level (hair, outfit, face, body form), then animate it. Generating a character clip directly from a character reference makes the reference portrait literally frame one, so the clip visibly morphs out of it. Genuine animation throughout — no still plus pan.
3. A second fresh-angle shot for any line that runs past a single clip of roughly ten seconds.
4. Logo at start and end from the canonical logo asset.
5. No burned-in captions. Captions travel as a sidecar file only, shifted to match any logo-card offset.

## 4. Assembly and QC

1. Build in segments (mandatory over about ten minutes): chunked, checkpointed, verified pieces skipped on rerun. Never a monolithic long encode. Run at most two heavy encodes at once.
2. **QC gate table on the exact file, hash-bound.** Every gate below runs on the file that will be approved — not on a preview, not on a segment:
   - Stream parity (audio and video streams match the assembly)
   - Loudness against the locked gate, recorded
   - Timestamp-gap scan on the audio (fail on any gap above the locked threshold)
   - Narration loop gate (repetition scan on the raw narration, before assembly)
   - Visual motion sweep (genuine movement throughout, no frozen holds)
   - Morph sweep (no reference-portrait morph at clip starts)
   - Photoreal sweep (no photoreal drift on expressive lines)
   - Speaker-sync windows (the right speaker on screen for each line)
   - Hair-colour sweep, frame-level
   - Outfit sweep, frame-level
   - Title-card checks
   - SFX-motion check (every effect sits on real visible movement)
3. Minor variances are disclosed in the QC report, not hidden.

## 5. Review copy and approval

1. If the exact file is large, ship it with a compressed review copy (low resolution, fast-start) that plays inline in chat.
2. Show the creator the exact file plus its SHA256 hash. Wait for explicit approval of that file. Silence is never approval. A review copy never publishes.

## 6. Upload and packaging (only after approval)

1. Upload via the platform's data API at full quality. Verify the signed-in channel against the handle the creator ordered before uploading.
2. Set title, description, chapters, playlist, thumbnail (PNG or JPG only, format verified), Community post, pinned comment.
3. Verify on the live surface and report the verified outcome with the live URL. Any packaging step that hits a platform scope block is reported as outstanding, not claimed done.
4. Shorts and teasers: one title plus one thumbnail, no comparison test. Long-form: one locked title with three thumbnail variants on different hook axes, one textless variant, winner by watch-time share after at least 1,500 impressions per variant; never hold publication for the test.

## Restart-proof method

Keep a durable state file in your workspace (never in a temporary folder) holding the last completed output, the next step, and the exact command that starts it. Build in segments with verified pieces skipped on rerun: narration in chunks, one still then one clip per dialogue line, assembly in segments, uploads resumable. Write each finished piece to disk as it lands, recording path, size, and hash. After a restart, read the state file first and resume the next step before reporting status. While paused, resuming means confirming the pause still stands and not starting work.

## What this rebuild does not do

- It does not lift a pause, pick a voice, or approve any file. Human approval stays with the creator, and the exact-file publishing rule still governs.
- It does not substitute files, skip gates, or report anything live that has not been verified live.
