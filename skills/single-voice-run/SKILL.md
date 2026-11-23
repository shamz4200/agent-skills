---
name: single-voice-run
description: Run one voice synthesis job at a time in small checkpointed chunks so a second run cannot kill the first with out of memory.
---
# Single Voice Run

## Claim one voice slot before you start

- Check the full process list for a running voice synthesis before you start a new one.
- Create a lockfile in the episode workdir holding your process id before synthesis starts, and remove it only after the chunk file is verified on disk.
- Wait for the running synthesis to finish instead of starting a second one alongside it.
- Record the running process id, the chunk range, and the output path in the episode state file in your workspace before synthesis starts.
- Treat a lockfile as stale only after you confirm its recorded process id is no longer alive with a second process check.
- Never start a second voice synthesis to save time while the first is still running.

## Synthesize in small checkpointed chunks

- Synthesize narration in chunks of about 50 seconds, never as one monolithic run.
- Write each finished chunk to disk and verify its duration before you start the next chunk.
- Resume from the last verified chunk after a restart or a kill, and never restart the whole block from zero.
- Keep the chunk files and the state file under your workspace, never under /tmp.

## Check memory and restart safely

- Check free memory before you start, and do not start when free memory is under 1GB.
- If synthesis is killed for out of memory, stop and check what else is using the voice model before you retry.
- Retry only the failed chunk after the other synthesis has finished and memory has recovered.
- Record the kill, the chunk, and the memory reading in the state file so the next worker does not repeat the same start.

## Alternatives for better results

- Use the managed text to speech route for a short voice note instead of the local voice model when the local model is busy.
