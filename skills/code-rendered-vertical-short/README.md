# The $shamz Code-Rendered Vertical Short

A $shamz skill in the Shamz agent-skills collection. Build a vertical story short in code — script, coded character, word-timed narration, render, frame QA — and hand the creator the exact file for a verdict. Nothing is published by this skill.

> Status: needs a proving run. One test short was built end to end (69.51 seconds, 1440×2560, SHA-verified, delivered for verdict, never published). The 3D world step in that test stalled and was cut, so it is unproven — the test shipped on a 2D canvas route instead. The next run proves or fixes it.

## What it does

1. **Picks one surprising true story.** A physical cause and effect that can be shown, with a simple everyday analogy that explains it.
2. **Writes the script to a beat formula.** Hook, setting, escalation, snap, deadpan double line, explanation, consequence, callback twist — and gets it approved before anything is built.
3. **Scaffolds from the bridge template.** The look lives in the template's values; the story lives in the shot plan.
4. **Adapts the character in code.** Signature attributes carried into the code-drawn style and verified before timing.
5. **Narrates one sentence per chunk.** Word timings hand-fixed, loop-checked, and recorded with a hash before retiming.
6. **Plans shots from the word timings.** Boundaries derived from sentence starts, so beats land on their narration.
7. **Renders vertical at final resolution.** Picture and mix muxed afterwards, duration checked against the mix.
8. **Runs frame QA on the final file.** Black, white, frozen, and pop frames checked, loudness measured, frames inspected by eye.
9. **Delivers the exact file for verdict.** Hash, duration, and resolution reported. Nothing publishes.

## What you need

- An approved script (55–70 seconds, English only, one steady narrator tone)
- The locked character parameters (skin tone, hair, eye colour, outfit, signature attributes)
- The locked narrator voice, its reference audio, and its synthesis settings
- The bridge template to scaffold from
- A coded renderer and a video encoder (for example Remotion and ffmpeg), plus a speech-to-text tool for word timings
- Disk room for render bundles — the renderer copies project assets into a temporary folder on every render

## How a run works

1. Approve the script, then scaffold the project from the bridge template.
2. Adapt the character in code and verify the signature attributes.
3. Synthesise the narration sentence by sentence, fix the word timings by hand, and loop-check the transcript.
4. Write the shot plan from the word timings and render.
5. Mix the sound, mux picture and mix, and run frame QA plus a visual inspection.
6. Fix anything QA finds, re-run QA, and deliver the exact file with its hash for the creator's verdict.

## Rules it follows

- No captions or labels in the video. English only. One steady narrator tone.
- The script is approved before scaffolding, narration, or rendering.
- Every hold creeps — a flat hold reads as a freeze in QA.
- The 3D world step is unproven: if it stalls, fall back to the proven 2D canvas route and report the change plainly.
- A flagged frame is investigated by eye, never assumed to be a glitch or assumed to be fine.
- Nothing is published by this skill. The final file waits for the creator's verdict.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The pipeline the agent follows |
| `README.md` | This how-to guide |
