---
name: code-rendered-vertical-short
description: Build a vertical story short in code: script, coded character, timed narration, render, frame QA, exact file for verdict.
---

# The $shamz Code-Rendered Vertical Short

Build a vertical story short in code: the characters are drawn by code, the world is built by code, the narration is timed word by word, and the render is checked frame by frame. The finished file goes to the creator for a verdict. Nothing is published by this skill.

## Status: needs a proving run

One test short was built end to end with this method (69.51 seconds, 1440×2560, SHA-verified, delivered for verdict, never published). The method below is what that test proved. The 3D world step in it is **unproven**: the full 3D bridge world never completed a single frame in the GPU-less sandbox (three timeouts, the longest over five minutes, main thread blocked), and the test shipped on a 2D canvas route instead. Do not present the 3D world step as proven. The next run of this skill is a proving run: record what breaks, and update this skill with what actually worked.

## Parameters (set these before any build)

- **Character:** the locked character for this short, as code parameters — skin tone, hair style and colour, eye colour and shape, outfit colours, signature attributes. The code-drawn style adapts the character; it does not preserve the proportions of a reference illustration. Say that plainly when it matters.
- **Voice:** the locked narrator voice for this short, its reference audio, and its synthesis settings.
- **World:** the coded world for this short (exteriors, interiors, or both — whichever the template actually provides; do not claim a location the template cannot render).
- **Format:** vertical 9:16, target length 55–70 seconds, English only, one steady narrator tone, no captions or labels in the video.

## Pipeline

### 1. Topic and facts

Pick one surprising true story with a physical cause and effect that can be shown, plus a simple everyday analogy that explains it. Write the facts with their source at the top of the script file. Jokes must be researched real facts.

### 2. Script (approved before anything else)

Target roughly 3.7 words per second, 55–70 seconds. Beat formula from the proven test:

- **Hook:** the absurd fact in one line.
- **Setting:** year, place, pride.
- **Action:** escalation over three or four beats, each a little bigger.
- **Snap:** the moment it breaks.
- **Deadpan double line:** "Luckily … / Unluckily …".
- **Explanation:** one idea through an everyday analogy (for example a kid on a swing).
- **Consequence:** the rule it created.
- **Callback twist:** the ending.

Never describe on screen what the viewer already sees. Get the script approved before scaffolding, narration, or rendering. "Just do it" applies only once the script is approved.

### 3. Scaffold from the bridge template

Copy the bridge template into a new project folder and register a new composition next to the template's own. The look lives in the template's values; the story lives in the shot plan, the world layout, and the cast roles. Do not rebuild the look from scratch.

### 4. Character adapted in code

Adapt the locked character into the code-drawn style: bean-head cartoon cards with ink outlines, drawn on a design canvas, camera-facing billboards with blinks and walk cycles. Carry the signature attributes across (hair, eyes, outfit, skin tone). Verify the adaptation against the character parameters before the shot plan is timed to it — if an expression hides a signature attribute (for example lidded eyes hiding the eye colour), change the expression, not the attribute.

### 5. Narration with word timings

1. Synthesise the narration one sentence per chunk, with the locked voice settings, and assemble with a short fixed gap between chunks.
2. Produce word timings for the assembled narration with a speech-to-text pass, then hand-fix the timings. Everything is timed to the word timings.
3. **Loop check:** scan the transcript for repeated multi-word sequences. Zero repeated five-word sequences is the pass mark. A loop means regeneration, not assembly.
4. Record the assembled narration's duration, size, and hash in the run note before retiming anything.

### 6. Shot plan

Write the shot plan in code: shot list with start and end frames, light preset per shot (day or golden), crowd mode, crossfades at place or time changes, a white flash after the hook, per-shot camera keys (gliding moves, never a static hold — every hold creeps with a push-in), impact shakes on beats that land, and depth-of-field per beat. Every visual reaction lands a few frames before its word. Shot boundaries are derived from the word timings (sentence starts, slightly early), so story beats land on their narration.

### 7. World (unproven — see status)

The template's world is a painted town with procedural buildings, a sky shader, fog matched to the horizon colour, and a river. Props from an external kit may be absent if the kit files are not in the project; the world code must handle missing props without failing, and the run note must say plainly which props were absent. Do not claim an interior room, a depth-of-field post chain, or any location the template does not render. If the 3D route stalls again, fall back to the 2D canvas route that the test proved, and report the change plainly — it is a renderer change, not the 3D world.

### 8. Sound

Synthesised effects plus an original score, ducked under the voice. Lock the picture's time constants before the sound is made — any later timing change means re-running the sound. Proven mix recipe from the test: music raised, effects lowered, voice unchanged (exact levels are parameters in the project). Output the mix at the locked sample rate and exact length, and measure its loudness rather than estimating it.

### 9. Render

Render at the final vertical resolution with the locked scale factor. The renderer writes a silent audio track: mux the rendered picture with the mix afterwards, mapping picture from one input and audio from the other. A shorter mix truncates the tail of the picture — check the final duration matches the mix exactly and that no narration is cut.

### 10. Frame QA

Run the QA script on the final file: every frame checked for black frames, unplanned white frames, frozen spans, and pop frames, plus a loudness measurement and a frame sheet. Then inspect frames yourself at shot boundaries and mid-shot:

- No black frames, no frozen spans, no teleports. A flagged "pop" must be investigated frame by frame — a regular walk-cycle step is not a glitch, but only a visual inspection proves that.
- Character signature attributes visible in every shot where the expression allows them.
- Cast present only in the shots the plan assigns them to.
- No captions or labels anywhere in any frame.
- Sync is by construction (word-timing-derived boundaries) — verify it by watching, not by assuming it.

Fix anything QA finds, then re-run QA on the fixed file.

### 11. Deliver for verdict

Send the creator the exact finished file with its hash, duration, and resolution. Save after every step, and update the run note with path, size, and hash at each completed piece. The file is for the creator's verdict only. This skill never publishes, never posts, and never claims approval it has not received.

## Gotchas from the proven test

- The renderer copies the project's public assets into a temporary bundle folder on every render and never deletes them. Point the temporary folder at a drive with room, and clear old bundle folders only when nothing is rendering.
- Scratch files inside an output folder break the type check: name them as plain text, not code.
- Pixel-sized post parameters must scale with output resolution: stills and finals render at different scales.
- A flat hold reads as a freeze in QA: every hold needs a creeping push-in.
- Props close to a moving camera become huge cut-off blobs at the frame edge: re-check every prop near a camera's new position after any camera move.
- A foreground prop must be recognisable or gone — a bush cut by the frame edge reads as a coloured ball.
- Signs lit by a side sun go unreadable: give a sign face an unlit material.
- Two ropes to a wide plank reads as a swing; one rope reads as a hanging. Draw what the thing is, not a shorthand for it.

## What this skill does not do

- It does not prove the 3D world step. That step is unproven until a run completes it.
- It does not publish, post, or approve. The final file waits for the creator's verdict.
