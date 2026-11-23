---
name: live-verified-media-strip
description: Free disk space safely: verify a video is live from four sources first, then strip only masters and segments.
---

# $shamz Live-Verified Media Strip

A $shamz method for freeing disk space safely. Verify a video is live from four sources first, then strip only its masters and segments, keeping scripts, logs, captions, and thumbnails. This is the verify-then-strip cleanup method; it is not the quota-failure detector, which is a separate skill.

## Governing principle

If the episodes are live, or the date has already passed, the episode media can go. That means: a live episode is stripped, its documents kept, and a held episode past its date can go whole. "Get rid of" a live episode still means the strip, not wiping its documents whole, unless $shamz explicitly confirms the wipe after being told what the strip keeps.

## No deletion without an order

- Never delete on your own initiative, even when a folder is obviously bloated. Flag it, name the size and what it contains, and wait for $shamz's word.
- His explicit "delete" is the only authorisation, and it covers exactly what he named. No deletion happens on a general or standing instruction. Every delete needs his explicit word for that item, after the verify-live check and the what's-left overview.
- An order given after the verification gap has been explained to him counts as an override of the verify rule. An order given without that explanation does not override it.

## Step 1: fresh whole-machine scan

1. Measure saved memory, workspace total, and the top directories, one directory at a time, appending each result to a durable file in your workspace as it lands. A rerun skips directories already in the file. Never hold a whole scan in memory until the end.
2. For any channel named, drill one level into its biggest subdirectories for their top files.
3. Report headline numbers first (disk free, saved memory), then folders grouped: biggest, then fastest-growing, then the rest. Never one long list of every folder.
4. End with the biggest free-up candidates by size, flagged only, never deleted on the scan. A scan is a decision view only; every deletion still needs his word per item.
5. When $shamz says to clear or delete an episode, or to show a folder, the reply automatically includes the fresh full folder overview (total plus breakdown, what was deleted and what is left) in that same message, without him asking. A folder question gets a fresh measurement in the same turn, not a number remembered from an earlier scan.
6. Never reuse a stale scan for a decision view. A fresh scan runs when he asks for one.

## Step 2: live-status verification, four sources, in order

Check in this order, and stop at the first solid record. If no record exists, the episode is treated as NOT live. Report that plainly and do not delete.

1. Episode folder: a publish record file, a published video id file, an upload log showing a completed upload with a video id, or a drop log with a live-page verification section.
2. Upload-state directory: the upload-state logs for that channel, showing a completed upload with a video id.
3. Memory: search memory for the episode name plus "live" or "published" and for its video id. A memory note naming the id plus its public or unlisted status counts as a record.
4. Platform API: if the token has read scope, check the video's status directly. A token that returns a permission error on a read proves nothing about the video, only about the token.

Never delete on the user's assertion that it is live, and never on an assistant's earlier claim. Verify from a record first. If the record and the assertion disagree, the record wins and the discrepancy gets reported plainly.

## A HELD label is not a liveness record

- A HELD label is a gate verdict, not a liveness record. Before treating a held build as not-live, check the gate's own evidence word by word.
- Precedent: a label said held, the episode was actually live. A label alone never settles liveness. The same failure class has appeared when a gate's tokenisation collapsed scripted lists, spoken once each with distinct closes, into false flags. Each master hash was verified against the record before any deletion.
- Held or not-published episodes are never stripped. If a build log says HELD, NOT PUBLISHED, or NOTHING UPLOADED, the folder stays whole until its live status is established or it becomes stale under the stale-episode rule below.

## Step 3: strip a live episode

1. Verify live per step 2. Record the video id.
2. Measure the deletion set first: master video files, shot directories, premix audio, bed-check audio, quarantine shots, cache directories, extracted frame directories, all still images except thumbnails, and all narration and audio recordings.
3. Delete exactly that set. Keep everything else.
4. Measure after, then reply with the full what's-left overview and log it.

Delete: master videos (including variant, defect, static, and review copies), shot directories, premix audio, bed-check audio, quarantine shots, cache directories, extracted frames, all still images except thumbnails, and all narration and audio recordings. Never sound libraries.

Keep: all scripts and workflows, build and drop logs, reports, packaging text (titles, description, pinned comment, community post, chapters), captions, quality records and hash files, thumbnails, charts, timed transcripts, and beat text files. Series bibles and character sheets live outside episode folders and are never touched by a strip.

## Step 4: stale date-bound episodes

- A daily episode tied to that day's subject matter goes stale once its date passes; it can never go up late. A held daily episode past its date gets its entire folder deleted, not just its media.
- Confirm from the build log that it is HELD or NOT PUBLISHED and that its date has passed, then delete the whole folder, reply with the full what's-left overview, and log it.

## Step 5: frames-only cleanup

- Extracted frames live in frame directories inside a work folder. Verify the delivered videos exist (top-level video files plus an upload results file or manifest showing posted ids) and that the source illustrations and scripts remain, then delete only the frame directories.

## Exceptions

- A master is kept when the platform copy went up as a compressed fallback and the local master is the only full-quality copy. Do not delete it without a new explicit order.
- Sound libraries are NEVER deleted. A sound or music library is a reusable asset, not episode media, even when it sits inside a live episode's folder. Never offer to delete one.
- Core files are NEVER deleted by a strip. Scripts, logs, reports, packaging text, captions, quality records, and thumbnails stay, always.
- Frames are intermediates, not core. Extracted frames are rebuildable from the source material and are never key content.

## After every delete

- Reply with the full what's-left overview, unprompted, naming exactly what was deleted, what was kept, and the size freed. Deletion is permanent, so there is no ambiguity about what can and cannot come back. Anything live on the platform is recoverable from the platform; anything else is not.
- Log every cleanup in a dated note, recording what was ordered, what was verified live (with video ids), what was deleted, what was kept, sizes before and after, and any exception or correction.
- Strips run one folder at a time: verify live, strip, verify the folder has no media remaining, then update the state file with that folder's result BEFORE starting the next folder. A restart mid-strip resumes at the next unverified folder; already-stripped folders are never re-processed.

## Restart-proof method

- Keep a state file in your workspace, never in a temporary folder. It records the last completed output, the next step, and the exact command that resumes it. After any restart, read the state file FIRST and resume the next step before reporting status.
- Scans run in segments, one top-level directory at a time, each result appended to a durable file as it lands.
- Nothing this lane needs to keep ever lives in a temporary folder.
