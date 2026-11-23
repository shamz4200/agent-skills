# The $shamz Narrated Episode Pipeline

A $shamz skill in the Shamz agent-skills collection. Take a narrated episode from script to live and fully packaged — packaging locked first, character locked before generation, narration loop-gated before assembly, and only the exact SHA-bound file the creator approved ever publishing.

## What it does

1. **Writes the script with a continuity check.** The episode answers the previous episode's open loop and closes with exactly one new one.
2. **Locks packaging first.** Title and thumbnail concepts lock at script stage, before narration or render spend.
3. **Locks the character sheet.** No generation until a character test matches sheet proportions, measured not eyeballed.
4. **Narrates with a blocking loop gate.** A repetition scan runs on the raw narration audio before assembly; a fail blocks the build.
5. **Builds one unique still per shot.** Verified still first, then animation — never reused stills, never stills from older videos.
6. **Assembles in segments.** Checkpointed, resumable, verified pieces skipped on rerun — never one monolithic encode.
7. **Runs master QC on the exact file.** Loudness, frame durations, duplicate check, character consistency, audio gap scan, motion and morph sweeps.
8. **Gets SHA-bound exact-file approval.** A compressed review copy goes to the creator; only the approved file's hash ever publishes.
9. **Uploads at full quality via the platform API.** Playlist placement in episode order, with the series-order gate checked first.
10. **Packages the drop in full, immediately.** Description with chapters, captions, three thumbnails and titles in testing, pinned comment, Community post — then verifies every item live.
11. **Adds the long-form variant.** A 60-second preview (or Chapter 1) approval gate before any full build, and an RSS feed update after upload.

## What you need

- The series bible: locked visual bible, character sheets, voice, and outfit rules for this series
- The previous episode's script and cliffhanger
- The locked narrator voice and its usage record
- The drop surface: channel, series playlist, drop time, and second surfaces
- The channel's locked loudness ceiling
- An episode record file in your workspace for hashes and verification evidence

## How a run works

1. Write the script, check continuity, and lock title plus thumbnail concepts.
2. Lock the character sheet, then narrate in chunks and run the blocking loop gate.
3. Generate one unique still per shot, verify it, animate it; assemble in segments.
4. Run master QC on the exact file and fix what fails.
5. Send the review copy with the master's hash and wait for explicit approval of that file.
6. Upload at full quality, package the drop in full, and verify every item on the live surface.
7. For a long-form episode, approve the 60-second preview first and update the RSS feed after upload.

## Rules it follows

- Silence is never approval. Only the exact SHA-bound approved file publishes.
- A failed loop gate blocks the build — no exceptions, no deadline override.
- One unique still per shot. Never reuse stills, never build multiple scenes off one image.
- Builds are segmented and restart-proof; verified pieces are skipped on rerun.
- Packaging starts the moment the upload completes. Nothing is "live and fully packaged" until every item is verified live.
- The placeholder scan is fail-closed: no bracketed token ships in any description, comment, post, or caption.
- Series order is checked before every upload; never leapfrog a missing earlier episode without an explicit order.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The pipeline the agent follows |
| `README.md` | This how-to guide |
