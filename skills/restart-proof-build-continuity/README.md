# $shamz Restart-Proof Build Continuity

A $shamz skill in the Shamz agent-skills collection. It keeps every long build restart-proof: a state file, chunked builds, a protected folder, and a 10-minute idle watchdog. This extracts the canonical method already held as standing rules; it is not a new invention.

## What it does

1. Gives every long job a state file in your workspace, holding the last completed output with size and hash, the next step, and the exact resume command.
2. Builds in chunks of 10 to 30 minutes, writing each finished piece to disk as it lands and skipping verified pieces on rerun.
3. Holds each lane in one protected folder that can rebuild the lane at the same quality from that folder alone.
4. Watches long renders every 10 minutes, and restarts a stalled job from its checkpoint in the same check that finds it.
5. Keeps one owner on a render from start through assembly, quality checks, and delivery of the exact file.

## What you need

- A workspace that survives restarts, and a state file per long job inside it.
- Builds split into checkpointed chunks, with each piece written to disk as it lands.
- A protected folder per lane, with its rules, workflow, state, and reviews.
- A watchdog that checks the driver and the log every 10 minutes and can restart the job.

## How a run works

1. Before starting, read the state file and verify on disk what actually landed.
2. Run the next chunk, write it to disk, update the state file, then start the next chunk.
3. If the machine restarts, read the state file first, skip verified pieces, and resume from the next missing piece.
4. If the watchdog finds the driver dead and the log unchanged for 10 minutes, it restarts the job from checkpoint in that same check.

## Rules it follows

- State file first after every restart, before any status report.
- Chunked builds only for anything over 10 minutes; verified pieces are never redone.
- Nothing needed is ever kept in a temporary folder.
- A stall is restarted in the same check that finds it, never just reported.
- A completed step starts the next step; a failed step starts a fixed retry.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The pipeline the agent follows |
| `README.md` | This how-to guide |
