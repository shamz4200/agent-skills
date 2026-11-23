---
name: protected-folder-channel-bible
description: Hold a whole channel in one protected folder so it can be rebuilt at the same quality from that folder alone.
---

# $shamz Protected-Folder Channel Bible

A $shamz method for holding a whole channel in one protected folder. Standard: if every other file for that channel got cleared, this folder alone must be enough to produce work at the exact same quality as before. Never delete the folder. Never store anything from it in a temporary folder.

## The folder template

Create one protected folder per channel in your workspace, with these files:

- `README.md` — what the folder is, what it holds, the channel identity, the current status, and the current blocker. Updated whenever a rule changes, a bible updates, or a new episode ships.
- `CORE-RULES.md` — every standing rule for the channel, each with its date and source. If a rule conflicts with a newer order from $shamz, the newer order wins and this file is updated the same day.
- `SERIES-BIBLE.md` — the channel's art direction, pacing, and visual standard, and which episode is the current bible episode.
- `CHARACTER-SHEETS.md` — every character, their sheet, voice, and locked attributes. The sheet file itself is the source of truth; never quality-check against a remembered description.
- `VOICE.md` — narration voice details, voice routing, and audio rules.
- `PACING.md` — pacing, timing, and sync rules.
- `WORKFLOW.md` — the daily build, publish, packaging, and carousel workflow, step by step.
- `EPISODE-STATUS.md` — where every episode stands: masters, hashes, status, and live links.
- `DOS-AND-DONTS.md` — a quick-reference do and do-not list.
- `PACKAGING-CHECKLIST.md` — the standard packaging items, all verified live before anything is reported as fully packaged.
- `bibles/` — verbatim copies of the series bible, character bible, location bible, prop library, episode list, the style-bible notes, and the style-bible reference frames.
- `character-sheets/` — the canonical character sheet images.
- `WEEKLY-REVIEWS/` — one dated note per weekly review.
- `STATE.md` — the state file for the lane (see below).

Add a channel-specific file only when that channel genuinely needs one, for example a list of monetisation mistakes trimmed to that channel. Do not copy another channel's file into this folder without trimming it to this channel.

## STATE.md

- `STATE.md` lives in the protected folder, never in a temporary folder.
- It always holds: the last completed output, the next step, and the exact script or command that starts it. Updated at every completed piece.
- After a restart, read `STATE.md` first, check the episode directory and the protected folder on disk, resume the next step, then report. Status-only reporting while ordered work is unstarted is a failure.
- While a lane is paused, resume means read `STATE.md`, confirm the pause and the blocker, and do not start work. No builder runs while the pause holds.

## What goes in the files

- Core rules carry dates and sources. A rule without a date and a source cannot be trusted, and cannot be updated safely.
- Character consistency is a golden rule: characters must look identical to their character sheets, always, no exceptions. A build with off-model shots or repeated scenes must never be sent for review. Quality checks include an explicit duplicate and repeated-scene check.
- Approval is exact-file and hash-bound: only the exact file $shamz approved ever publishes. Silence is never approval. A reaction counts as approval only when it directly answers an explicit approval question.
- When $shamz approves something, the lane owns it until it is live and verified. A handoff message is not completion. Verify the result directly and report the verified outcome, not "it is underway".
- Uploads go through the platform's data API at full quality unless the channel's workflow says otherwise. Verify the destination channel and the token or account before every upload. Never use another channel's token.
- Packaging is complete only when every item is verified live: description and chapters, captions, thumbnails in a comparison test, playlist placement, pinned comment, and community post. Verify every item live before reporting "fully packaged".
- No-shortcut rules bind every build: a method change means stop and tell $shamz at once, with no fallback without his explicit approval; never spend his credits on a compromised method; bad news is a short message, slop wastes hours; the slot never justifies the shortcut, schedule loses to quality every time.
- Storage rule: keep bible episodes, character voices and sheets and art, settings, configs, workflows, anything currently building, and masters plus upload copies. Delete duplicates and intermediates only after the final is confirmed.
- Sound and music libraries are reusable assets, never deletion candidates, even inside a live episode's folder. A strip removes only that episode's own media; core files (scripts, logs, reports, packaging, captions, quality records, thumbnails) are never deleted by a strip.

## Weekly review

Run a weekly review of the lane, on the same day each week:

1. Read the week's work, the protected folder, and the chat for the week.
2. Check the folder for freshness: is the state file still accurate? Is anything stale or missing? Is the current blocker still the real blocker? Fix it in the same run.
3. Check live work against the folder: did the week's builds follow the bible, the character sheets, the pacing rules, and the packaging checklist? Note any drift, and update the folder for it.
4. Write one dated note in `WEEKLY-REVIEWS/`: what happened, what was learned, what changed in the protected folder, and anything that should carry into next week.
5. Update `STATE.md` with the new last completed output and the new next step.
6. Deliver a short summary. Quiet only if the week was genuinely empty, and even then, record the note.
7. The review itself does not authorise a build, a push, a resume, a tool install, or a payment. Those still need $shamz's explicit order.
8. If a review finds a protected file missing or a hash mismatch, say so plainly and re-verify from the original source before using it again.

## Rules

- One protected folder per channel, in your workspace, never in a temporary folder, never deleted, never moved.
- A fresh session reading only that folder must be able to run the lane exactly as before. If it cannot, the folder is incomplete.
- Rules change only on $shamz's explicit word, and are updated the same day.
- The folder is the single source of truth for the channel. When the folder and a memory disagree, check the original source before acting.
