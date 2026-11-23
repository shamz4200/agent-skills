---
name: narrated-episode-pipeline
description: Take a narrated episode from script to live and fully packaged, with SHA-bound exact-file approval at the end.
---

# The $shamz Narrated Episode Pipeline

Take a narrated episode from script to live and fully packaged. One pipeline, two lanes: an animated-series lane (one unique clip or still per shot, character-led) and a long-form lane (scene visuals correlated to the narration, with a preview gate before the full build). The stages are the same; the lane parameters differ.

## Parameters (set these before any build)

- **Series bible:** the locked visual bible, character sheets, voice, and outfit rules for this series. Generalise per series — never carry one series' bible, voice, or outfit into another.
- **Voice:** the locked narrator voice and its usage record for this series.
- **Drop surface:** the channel, playlist, drop time, and second surfaces (short-form teaser, community post).
- **Loudness spec:** the channel's locked loudness ceiling (for example −14 LUFS / −1 dBTP).
- **Episode record:** where the run note, hashes, and verification evidence live in your workspace.

## Stage 1 — Script and continuity

1. Write the episode script. Check story continuity against the previous episode's cliffhanger: the episode must answer the open loop it inherits and close with exactly one new open loop.
2. Scan the script for a quotable line — one line that could become a comment meme. If none exists, the script is not done.
3. Run the narration-loop risk check on the script: parallel or repetitive passages are high risk for voice-model degeneration. Generate those passages in shorter voice chunks so a loop stays contained.

## Stage 2 — Packaging first

Lock title and thumbnail concepts at script stage, before narration or render spend. Sketch five thumbnail concepts, select the top three. If no title pairs with any thumbnail sketch, rework the episode idea, never the packaging. The thumbnail method skill governs the thumbnail itself; this pipeline governs the timing.

## Stage 3 — Character lock

Retrieve and visually inspect the actual character sheets before any generation. No generation until a character test matches sheet proportions, measured not eyeballed. Every generated still is zoom-inspected on face, body form, and outfit against the sheet before it is used. A build with off-model shots or repeated scenes is never sent for review.

## Stage 4 — Narration

1. Synthesise the narration in chunks from the locked voice. One sentence per chunk where the voice workflow requires it.
2. **Loop gate (blocking):** run the n-gram repetition scan on the raw narration audio of every episode before assembly. A fail blocks the build — no exceptions, no deadline override. Review flags against the script: a flagged phrase still fails when it is absent from the script (degeneration) or clustered tightly in one passage (same passage re-read consecutively). A scripted phrase spread across distinct passages may be cleared with evidence recorded. Without a script the gate stays fail-closed: any repeat is a fail. Run the same scan on the caption-alignment transcript as a second check.
3. Listen to the assembled narration at increased speed before assembly, and check the voice is present throughout (a voice-presence sample before and after the mix).

## Stage 5 — Picture

- **Animated-series lane:** one unique still per shot, generated fresh for that shot's action and environment. Verify the still, then animate it — never animate straight from a character reference, which makes the reference portrait literally frame one. Genuine animation throughout: no held-still segments with push-ins, no retiming tricks to fake energy. Check eyes and signature attributes at multiple timestamps per clip, not just the first frame.
- **Long-form lane:** one visual per scene, timestamped to what the narration discusses, with slow zoom or pan motion and crossfades between scenes. New visual every few seconds; never talking-head stills on repeat.
- **Both lanes:** every scene gets a genuinely unique still. Never build multiple scenes off one image. Never reuse stills from a trailer, preview, or any older video in a new episode. Sound effects sit only on real visible movement, never on a static frame. Repeated effects get a slight pitch shift each time; never repeat the identical sample twice in a row.

## Stage 6 — Segmented assembly

Build in segments, never as one monolithic encode over about ten minutes. Clips per shot, narration per chunk, assembly in segments, with verified pieces skipped on rerun. Each finished piece is written to disk as it lands, with its path, size, and hash recorded in the episode record. After any interruption, read the episode record first and resume from the next unfinished step — never from zero.

Mix order: atmosphere first, then action, then music, then voice. The music bed never overpowers the voiceover. Loudness normalisation is always a separate audio-only pre-pass; the final mux uses only simple filters.

## Stage 7 — Master QC (on the exact file)

- Duration, loudness against the locked ceiling, no clipping.
- Frame durations in the locked range for the lane (for example 4–6 seconds per shot).
- Duplicate / repeated-scene check.
- Character consistency check, frame by frame on signature attributes.
- Timestamp-gap scan on the audio (fail on any gap above the locked threshold).
- Visual motion sweep, morph sweep, photoreal sweep, speaker-sync windows, title-card checks, SFX-motion check.
- Caption check: small subtitle-style captions at the bottom, never large centred text covering the picture.

Minor variances are disclosed in the QC report, not hidden. A master that passes every automated gate but fails an eye check is still defective — inspect frames yourself.

## Stage 8 — Review copy and SHA-bound approval

1. Make a chat-sized review copy of the master (compressed, fast-start) for the creator to watch. The review copy never publishes.
2. Show the creator the exact master file with its SHA256 hash. Ask the explicit approval question. Only an answer that directly addresses that question counts. Silence is never approval.
3. Only the exact SHA-bound file the creator approved ever publishes. A platform rejection means stop and report — never substitute another file.

## Stage 9 — Upload at full quality

Upload via the platform's data API at full quality, never a compressed browser copy. Verify the signed-in channel against the ordered channel before uploading. Add the episode to the series playlist in episode order, and check series order first: never publish an episode while an earlier-numbered episode on the same series is missing, deleted, or unpublished, unless the creator explicitly orders it.

## Stage 10 — Full drop packaging (starts the moment the upload completes)

- Description: full, keyword-rich, chapters included, written for this episode — never copied. Run the fail-closed placeholder scan first: search the exact description, pinned comment, community post, and title files for bracketed tokens; any bracketed token in all capitals is a placeholder. Replace each with the real link or text, or delete the line. Re-scan after every fix and confirm zero hits before anything publishes.
- Captions: manual captions attached and verified live.
- Thumbnails and titles: three variants plus three titles, test running under one locked title. One variant textless where the image supports it.
- Pinned comment: specific to the video, with a call to action. Posted and visibly pinned.
- Community post: live with the correct watch URL.
- Teaser (where the lane has one): one continuous 45–60 second section from the episode, never a montage, vertical, strong frame zero, separate exact-file approval before posting.

## Stage 11 — Live verification

The episode is not "done" until every item is verified on the live surface: video public on the correct channel, captions live, thumbnails testing, playlist placement, pinned comment, community post. Report the live URL with each verified item. Nothing is reported as live and fully packaged until both upload and packaging are done and verified.

## Monetisation-mistake gates (run before publish)

1. Comment reply logged (at least one genuine reply within 48 hours of publish).
2. Personal-take line present in the script (only the creator could write it).
3. Voice usage recorded (narrator voice and usage count on file).
4. Duration logged; flag if recent uploads cluster within seconds of each other.
5. One-per-day cap respected (a second upload the same day needs the creator's say-so).
6. Title-structure variety against the previous upload; unique description written for this episode; placeholder scan passed.
7. No new niche or channel without a monetisation-policy check.

## Long-form lane variant

- **Preview gate:** before any full build, cut a 60-second preview (or Chapter 1) and get it approved. The full build starts only after the preview passes. If the preview fails, fix the direction there — never after a full render.
- **RSS feed update:** after upload and packaging, update the series RSS feed so the new episode is listed, and verify the feed shows it.
- **No shorts rule (parameter):** a long-form-only series ships no per-episode teasers unless the series parameters explicitly add them.

## Restart-proof method

Keep a durable state file in your workspace (never in a temporary folder) holding the last completed output, the next step, and the exact command that starts it. Update it at every completed piece. Builds are segmented with verified pieces skipped on rerun. After a restart, read the state file first, check what is already on disk, and resume the next step before reporting status.

## What this pipeline does not do

- It does not lift a pause. If the series is paused, read the workflow, do not run it.
- It does not publish without exact-file approval, and it does not substitute files, skip gates, or report anything live that has not been verified live.
