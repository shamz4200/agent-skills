---
name: restart-proof-build-continuity
description: Keep every long build restart-proof: state file, chunked builds, protected folder, and a 10-minute idle watchdog.
---

# $shamz Restart-Proof Build Continuity

A $shamz method for keeping long builds alive through restarts. This extracts the canonical method already held as standing rules; it is not a new invention. The machine restarts without warning, several times a day, killing running processes and wiping temporary folders. No restart ever loses progress.

## Rule 1: a state file for every long job

- Every long job keeps a state file under your workspace, never in a temporary folder. A temporary folder is wiped on restart; the workspace is not.
- The state file always holds, updated after every step:
  - Last completed output, with path, size, and hash where applicable.
  - Next step.
  - The exact script or command that starts that step.
- Update the state file at the end of every run, before ending the turn. A run that cannot update its state file has not finished.
- After any restart, read the state file FIRST, verify on disk what actually landed (counts, files, timestamps, hashes where recorded), and resume the next step before reporting status. Never trust a log line alone. Never report status before resuming.

## Rule 2: chunked builds, verified pieces skipped on rerun

- Any build longer than 10 minutes is built in segments. No exceptions, no "one pass this time".
- Segment size is 10 to 30 minutes each. Small enough that losing one to a restart is annoying, not catastrophic.
- Each finished piece is written to disk as it lands, never held until the end. A rerun skips verified pieces and resumes at the next missing piece, never from zero.
- Narration is chunked per sentence or per short passage, each file written as it lands. Stills and renders are written as they land, with a log per run. Assembly only runs after all its inputs are checkpointed on disk.
- Uploads, downloads, and any transfer over about 10 minutes must be resumable and checkpointed too, with the resume state persisted in your workspace. Never launch a long transfer without resume support.
- Before starting a duplicate, check the process list for a live generation or render and check the state file and output timestamps. Never spawn a duplicate job while one is alive.
- If a long process dies, restart it immediately from its checkpoint. Do not await a decision. A dead build restarts itself, always, without being asked. If the failure is unrecoverable (source file missing, disk full), report the specific blocker and exactly what is needed to unblock it.
- Never go idle on ordered work. A completed step starts the next step. A failed step starts a fixed retry. Status-only checking is not work.

## Rule 3: a protected folder per lane

- Each lane keeps one protected folder in your workspace, never in a temporary folder, holding everything needed to rebuild that lane at the same quality from that folder alone if everything else is wiped.
- The folder holds: a README, core rules, app or channel state, a roadmap, a workflow, a dos-and-don'ts list, and weekly reviews. Short file-based lanes chunk their work by file, not by time, with each file written and verified before the next starts.
- Nothing the lane needs to keep ever lives in a temporary folder. All state, notes, and drafts live under your workspace.
- After a restart, the protected folder is the recovery source: read its state file, check what is on disk, resume the next step. A fresh session reading only that folder must be able to run the lane exactly as before.

## Rule 4: a 10-minute idle watchdog for long builds

- While a long render or build runs, a watchdog checks at least every 10 minutes.
- Idle means the current job's driver is dead AND its newest output or log has not changed for 10 minutes. Prep on the next item does not count as work. The threshold is 10 minutes, never longer.
- On a stall, the check restarts the job from its checkpoint in that same check, detached, verifies the process and the log are moving, and reports the restart.
- A monitoring check that only observes an unfinished task is defective. If the check finds no builder running and a next step exists, the check launches that next step in that same run. Reporting "still idle" a second time without starting work is itself the failure.
- A watcher must watch itself: it logs a heartbeat at least every 10 minutes, and a second check verifies the watcher process itself is alive, not just the render. A watcher runs until the delivered final file exists and is verified, never on a fixed timeout shorter than the job.
- The done file is a trigger, not an exit. A watcher exits only when the delivered final file exists and is verified. If the render is done but no final file exists, that is a missing-assembly alarm: restart assembly from checkpoint in that same run and keep watching until the final exists.
- One owner carries a render from start through assembly, quality checks, and delivery of the exact file, or hands it to a named successor before ending. A coordinator never completes while render, assembly, or quality checks are still outstanding.

## Rules

- State file first, after every restart, before any status report.
- Chunked builds only, for anything over 10 minutes. Verified pieces are skipped, never redone.
- Nothing needed is kept in a temporary folder. Ever.
- A stall is restarted in the same check that finds it. Never report a stall and wait.
- A completed step is a trigger to start the next step, never a stopping point.
