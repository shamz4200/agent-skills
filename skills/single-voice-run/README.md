# Shamz Single Voice Run

Run one voice synthesis job at a time in small checkpointed chunks, so a second run cannot kill the first
with out of memory. One voice slot, one job, chunks verified on disk as they land.

![Thinking in a blue hoodie](hero.jpg)

## What it does

1. **Claims one voice slot with a lockfile** before synthesis starts.
2. **Waits for a running synthesis to finish** instead of starting a second one alongside it.
3. **Synthesizes narration in chunks of about 50 seconds**, verifying each chunk on disk.
4. **Resumes from the last verified chunk** after a restart or a kill.
5. **Checks free memory before starting** and retries only the failed chunk after memory recovers.

## How a run works

Check the full process list for a running voice synthesis, then claim the slot with a lockfile holding your
process id and record the run in the episode state file. Synthesize one chunk at a time, writing each
finished chunk to disk and verifying its duration before the next. If synthesis is killed for out of memory,
stop, check what else is using the voice model, and retry only the failed chunk once memory has recovered.
Remove the lockfile only after the chunk file is verified on disk.

## What you need

- The episode workdir for the lockfile, chunk files, and state file.
- The narration text split into chunks of about 50 seconds.
- A memory reading before the run starts.

## Install

From the folder you want to work in, give your agent the prompt in
[SETUP_PROMPT.md](../../SETUP_PROMPT.md), or run the installer yourself:

```bash
git clone --depth 1 https://github.com/shamz4200/agent-skills /tmp/agent-skills
bash /tmp/agent-skills/install.sh .
```

Then start your agent from that folder and ask it to use the single voice run skill.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The run the agent follows |
| `README.md` | This how-to guide |
| `LICENSE` | The MIT licence, which must stay with these files |
| `hero.jpg` | The hero image for this guide |

## Rules it follows

- Never start a second voice synthesis while the first is still running.
- Never synthesize narration as one monolithic run.
- Never restart the whole block from zero after a kill; resume from the last verified chunk.
- Do not start when free memory is under 1GB.
- A lockfile counts as stale only after a second process check confirms its process id is no longer alive.

## Licences

- MIT: see `LICENSE` in this folder, which must stay with these files.
