# Shamz Narrated Block Pipeline

A $shamz skill, part of the Shamz agent-skills collection. Build a narrated animated episode one block at a time, with approval at every stage, so nothing bad reaches the next stage.

## What it does

1. Locks the character sheets and world look before anything is generated.
2. Approves the script, then passes the shot list through the gates (movie test, shot length, camera variety, no repeats).
3. QCs every still individually against its locked sheet.
4. Records voice in small checkpointed chunks.
5. Adds scene-matched sound, assembles the block, and QCs it shot by shot.

## What you need

- Locked character sheets (one per character) and a locked world look.
- An approved script.
- A voice pipeline that records in checkpointed chunks.
- A still generator and an assembly tool.

## How a run works

1. Lock sheets and world look, record the paths.
2. Approve the script.
3. Write the shot list, run it through the gates, get it approved.
4. Generate and QC one unique still per shot.
5. Record the voice in chunks, add sound, assemble.
6. QC the block against the shot list, then deliver it for approval.

## Rules it follows

- One block at a time, approval at every stage gate.
- One unique still per shot, never reused.
- No shot over 8 seconds, no repeated verb, pose, or still.
- Character-exact in every frame, or the still is regenerated.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The pipeline the agent follows |
| `README.md` | This how-to guide |

The MIT licence file ships with the skill at publish time.
