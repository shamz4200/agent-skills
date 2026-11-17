# Glow Study ("GS style")

A third Shamz style: **research explainers in the second person, told at night with glowing white figures**. Deep
navy rooms drawn in thin light-blue lines, a moon in the window, one warm lamp, floating dust; soft white figures that
bloom; studies shown as crowds of little people; huge glowing numbers with the citation under them; and captions that
appear one short phrase at a time with the key words in yellow or red. Shamz is the "you" of the story.

"GS style" and "Glow Study" mean the same thing. Status: **in testing** (60 s test made; the owner may ask for more
detailed backgrounds next).

| Folder | What's in it |
|---|---|
| `STUDY.md` | The reference study: measured pace, art style, captions, camera, story shape |
| `engine/glow.tsx` | The rig and the look: `Fig` (glowing jointed figure: poses, `walk` cycle, `blend` between poses, blinking, idle breathing, hair shapes, colour tints, shirts with prints, a phone with a light beam), `Head` (a head alone, e.g. on a pillow), Shamz's beanie, locs and eyes, `Cam` (push/drift between two views), `Dust`, `Finish` (vignette), `Captions`, `Tag`, `BigStat`, `Cite`, `Bubble` |
| `engine/sets.tsx` | Line-art sets and data shots: room pieces (`Wall`, `Window`, `Lamp`, `Door`, `Shelf`, `Plant`, `Bed`, `Nightstand`, `Clock`, `Chair`), `Bedroom` (a sleeper and a thought bubble with a replay inside), `Hall` (school hallway, lockers, stairs, a trip with flying books, a crowd that stares or ignores), `Lab` (an experiment room), `Crowd` (a study's sample with a group lit up and a big number), `Spot` (one spotlight, one that follows, everyone's own), `Bars` (guess vs reality), `Close`, `Time` (a big clock time), `End` (question + subscribe) |
| `cast/` | Shamz in Glow Study (`shamz-glow-sheet.png`, `shamz-glow-head.png`) and the code that draws them (`Sheet.tsx`) |
| `example/` | The finished 60 s test "Nobody Saw It" (the spotlight effect): script, shot list, Root, voice, retime, mix and render scripts |

## The style in one page

- **Look.** Deep navy rooms in line art: dark shapes with thin light-blue outlines, a faint grid on the walls, a moon
  window, a warm wall lamp, a glowing digital clock; floating dust; bloom on lights and figures; a vignette. A warm
  amber room for the "good" side of a comparison.
- **Figures.** Soft white glowing people: big round head, dark oval eyes with a glint, short brows, a simple mouth,
  a pill torso and thick round-ended tube limbs, shaded grey-blue on the far side. Identity from one hair shape (cap,
  bun, ponytail) or a colour tint for a group (yellow = the group that matters, red = the bad outcome).
- **Shamz (permanent marks).** The same glowing body as everyone, plus the black ribbed beanie with the gold patch
  and black cloud, golden locs, and red eyes with three dots round the pupil (`<Fig shamz />`). Never change these.
- **Data.** Huge glowing monospace numbers (yellow) with a spaced citation line ("AUTHOR ET AL. (YEAR) · JOURNAL");
  crowds of figures for a study's sample, lit by group; bars that fill; a pill tag in the corner ("TONIGHT").
- **Captions.** 1 to 3 words at a time, bottom centre, Inter Extra Bold; upcoming words dimmed and lighting up as
  spoken; key words yellow (numbers, the point) or red (danger, the negative).
- **Camera.** Always moving: slow push-ins, pull-backs to reveal a crowd, drifts; close-ups for reactions.
- **Pace.** About **30 cuts a minute in the first minute** (44 in the first 15 s), then about 18; median shot 2.5 s;
  something new on screen every 1.8 s. Narration about 175 words a minute, median sentence 7 words.
- **Story.** Second person. A relatable moment, a contrast, "scientists tested this", one night told by the clock,
  each finding shown as people with the study on screen, a twist, then a slow, warm ending and a question. Ending
  decided up front: **complete** (question + subscribe) or **cliffhanger**.
- **Only real, published studies**, cited on screen and in `[SRC]` lines. Round honestly ("about one in four").

## Make a video

Work in a new folder (copy `example/`), link `node_modules` to the skill studio's and copy its `package.json`
(`ln -s <skill>/studio/node_modules node_modules; cp <skill>/studio/package.json .`). Fonts (Inter, JetBrains Mono,
both OFL) go in `public/fonts/` (from npm: `@fontsource/inter`, `@fontsource/jetbrains-mono`); the render browser
may not reach Google Fonts.

1. **Script** (`script.md`): one `## ` heading, then one or two short sentences per line; `[SRC]` lines.
2. **Voice**: `python3 voice.py` (Chatterbox; `CHATTERBOX_VOICE_SAMPLE` = your own sample, never committed),
   then `python3 retime.py` (exact per-sentence word timing).
3. **Shots**: one line per shot in `studio_src/timeline.ts`: `[script line, cue word, set, params, marks]`.
4. **Storyboard**: `npx remotion render studio_src/index.ts GlowBoard out/board --sequence --public-dir public`;
   tile and fix before animating (feet on floors, nothing cut off, text off faces and inside the frame).
5. **Sound**: `python3 mix.py` (a soft warm music bed ducked under the voice, effects on the action).
6. **Render**: `bash render.sh <frames> 700`, then mux with `-af "volume=<gain>dB,alimiter=limit=0.8:level=disabled"`
   to about -14 LUFS.
7. **QC** a 1 fps contact sheet before anyone sees it.

## Master prompt (paste this to another agent)

```
You are making an animated video in the Glow Study style ("GS style") from the Shamz agent-skills repo.

Get the tools:
- Clone https://github.com/shamz4200/agent-skills and open skills/shamz-what-if/glow-study/.
- Read README.md (the style in one page and the pipeline) and STUDY.md (the measured reference) first.
- The engine is engine/glow.tsx and engine/sets.tsx. A finished 60-second example is in example/. The Remotion
  project and Python voice scripts are in ../studio and ../scripts (npm install in ../studio;
  pip install chatterbox-tts faster-whisper soundfile numpy).

What the style is:
- A research explainer in the second person ("you"), calm and quick: about 175 words a minute, short sentences.
- Deep navy night rooms in line art (thin light-blue outlines, moon window, warm lamp, glowing clock), floating
  dust, bloom, vignette; a warm amber room for the "good" side of a comparison.
- Glowing white figures: round head, dark oval eyes with a glint, pill torso, thick round tube limbs; identity
  from a hair shape or a colour tint for a group.
- Shamz (<Fig shamz />: black ribbed beanie with the gold patch and black cloud, golden locs, red eyes with three
  dots round the pupil; never change these) is the "you" of the story.
- Studies shown as people: crowds of figures with a group lit up, a huge glowing number, the citation underneath.
- Captions 1-3 words at a time at the bottom, upcoming words dimmed, key words yellow or red.
- Pace: about 30 cuts a minute in the first minute (faster in the first 15 seconds), then about 18; something
  new on screen about every 2 seconds; the camera always moving.
- Shape: a relatable moment, a contrast, "scientists tested this", one night told by the clock, each finding
  shown as people, a twist, a slow warm ending and a question for the comments.

Rules:
- Before writing the script, decide and tell me the ending: "complete" (question + subscribe) or "cliffhanger".
- Only real, published studies; cite them on screen and in [SRC] lines; round honestly.
- Never copy the reference video's story, script, characters or scenes: only the look, pace, camera and structure.
- Never commit voice samples or third-party media. Never print API keys.
- Storyboard every shot and fix it before the long render. Check a 1 fps contact sheet of the finished video
  before sending it: feet on floors, people to scale, nothing cut off at a frame edge, text inside the frame and off
  faces, captions readable.
- Start with a 60-second test and show it to me before building a full episode.

My topic: <one line, e.g. "Why you remember embarrassing moments at 2 a.m.">
Length: <e.g. 60-second test / about 8 minutes>
```
