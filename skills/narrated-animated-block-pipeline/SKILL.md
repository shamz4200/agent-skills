---
name: narrated-animated-block-pipeline
description: Build a narrated animated block one stage at a time: locked sheets, gated shot list, QC'd stills, checkpointed voice, assembly, QC, delivery.
---

# Shamz Narrated Block Pipeline

A $shamz skill, part of the Shamz agent-skills collection at github.com/shamz4200/agent-skills. Build one narrated animated block at a time, with approval at every stage gate, so no bad shot, still, or line ever reaches the next stage.

Use it when you are building a narrated animated episode in blocks: one block is one self-contained stretch of story with its own shots, stills, voice, and sound.

## How it works

- Work one block at a time. Finish a block, get it approved, then start the next. Never build two blocks in parallel.
- Every stage ends in an approval gate. A stage that fails its gate is fixed in that stage, never patched after assembly.
- Character sheets and the world look are locked before any generation begins. The locked sheet is the single source of truth; a generated image is never a substitute for it.

## Stage 1: lock the sheets

- Lock one character sheet per character: face, eyes, hair, outfit, proportions, signature accessories.
- Lock the world look: palette, line weight, background style, lighting.
- Record the sheet paths in the build record before any still is generated.

## Stage 2: approve the script

- The script is approved before the shot list is written.
- Narration is story only: it moves the story, it does not describe what the picture already shows.

## Stage 3: pass the shot list through the gates

- Write the shot list first: one shot per line, with the exact narration line, who is in frame, and the verb.
- Movie test: environment, object, and other-character shots carry at least half of each block. The world tells the story, not just the hero.
- No shot runs over 8 seconds.
- Camera angles vary: no two neighbouring shots use the same move or direction.
- No repetition: no repeated verb, pose, or still across shots in the block.
- One verb per shot per character: the character in frame does one clear action.
- The shot list is approved before any still is made. If the grammar is wrong, redo it at shot-list stage, never patch after generation.

## Stage 4: QC every still against its sheet

- Generate one unique still per shot. No repeats, no reversed reuse, no cycle logic.
- Inspect every still individually, zoomed in, against its locked character sheet: face, eyes, hair, outfit, proportions.
- A still that drifts from the sheet is regenerated. Drift is never carried forward as accepted.

## Stage 5: voice in checkpointed chunks

- Record narration in small checkpointed chunks, one voice job at a time.
- Verify each chunk on disk before the next starts.
- Voice is built after final voice timings are known, so shots are cut to the voice, not the other way round.

## Stage 6: sound

- Scene-matched environmental ambience under every scene, ducked below the voice.
- Sound sits on visible movement only. No effect is spotted to a static frame.

## Stage 7: assemble

- Assemble the block from its own stills, voice, and sound only.
- Keep breathing room in. Do not aggressively tighten pauses.

## Stage 8: QC the block

- Check the block against the shot list, shot by shot: narration matches picture, no repeated stills, no shot over 8 seconds, character exact in every frame.
- Check pacing: a 3 to 5 second shot average, checked at shot-list stage and again on the assembled block.
- The block is delivered only when every gate passes.

## Rules it follows

- Never reuse a still, for any episode, ever. One unique still per shot.
- Never send a block for review with off-model shots or repeated scenes.
- Never claim a block is done until it has been inspected against the true reference.
- Character, world, and camera specifics are parameters: swap in your own sheets, bible, and palette. The stage order and the gates stay the same.

## Provenance

- Proven on a 100-shot block with 25 voice chunks, every gate passed.
