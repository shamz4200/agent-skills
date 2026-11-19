# The Glow style

A third Shamz style: **research explainers in the second person, told at night with glowing white figures**.
Detailed painted night rooms (deep navy, moonlight, warm lamp glows), soft white figures that bloom, studies shown as
crowds of little people, huge glowing numbers with the citation under them, and captions that appear one short
phrase at a time with the key words in yellow or red. Shamz is the "you" of the story.

**Painted, detailed backgrounds are the standard** (the owner, Nov 2026: "these higher detailed backgrounds are better,
this needs to be the standard"). The first version, with line-art rooms drawn in code, is kept as `GlowLineArt`.

| Folder | What's in it |
|---|---|
| `STUDY.md` | The reference study: measured pace, art style, captions, camera, story shape |
| `engine/glow.tsx` | The rig and the look: `Fig` (glowing jointed figure: poses, `walk` cycle, `blend` between poses, blinking, idle breathing, hair shapes, colour tints, shirts with prints, a phone with a light beam), `Head` (a head alone, e.g. on a pillow), Shamz's beanie, locs and eyes, `Cam`, `Dust`, `Finish`, `Captions`, `Tag`, `BigStat`, `Cite`, `Bubble`, and `Plate` + `DetailCtx` (the painted backgrounds) |
| `engine/sets.tsx` | The sets, each with a painted plate behind it (or line art when `DetailCtx` is false): `Bedroom` (a sleeper and a thought bubble with a replay inside), `Hall` (school hallway, a trip with flying books, a crowd that stares or ignores), `Lab` (an experiment room), `Crowd` (a study's sample with a group lit up and a big number), `Spot` (one spotlight, one that follows, everyone's own), `Bars` (guess vs reality), `Close` (a reaction close-up with the room blurred behind), `Time` (a big clock time), `End` (question + subscribe); furniture people touch (`Bed`, `Nightstand`, `Clock`, `Chair`, `Door`) is drawn in code on top |
| `engine/vault.tsx` | Scenes from the first full episode ("What If You Were Locked Inside a Bank Vault Overnight?"): `VaultIn` (vault door from inside shutting/opening, bang, pace with panic breath, sit, doze, wake, the emergency ventilator, CCTV look), `DoorOut` (lobby: fire crew, phone, drill, staff, morning), `Street`, `TimeLock`, `Workshop`, `Avenue`, `WallCut`, `BoxDims`, `Gauge` (CO2 meter), `PhoneUI`, `Cave`, `Dates` |
| `engine/awake.tsx` | Scenes from "What If You Stayed Awake for 11 Days?": `Room` (any plate and cast, hallucination warp, faces in the dark), `Pinball`, `Bars2`, `Micro` (microsleep), `Neurons`, `Wash` (the brain cleaning itself in sleep), `Count`, `RatStat`, `Day` (day cards), `LongSleep`; figure options `quiff`, `glasses`, `tired`, pose `cheer` |
| `engine/blackout.tsx` | The first Story Formula episode's kit ("What If the Whole World Lost Power for 24 Hours?"): `Place` (power on/off/cut/restore), `Skyline` (windows going dark or lighting up), `Alert` (viral clip + FALSE stamp, emergency alert), `Control` (grid control room), `Fridge`, `Kit`, and **`Rule`, the Shamz's Rule card**; the figure's `insight` prop makes Shamz's cloud patch glow (the channel motif) and `torch` gives a torch beam |
| `tools/backgrounds.py` | Generates the painted plates with FLUX.1 [schnell] on Cloudflare Workers AI in the fixed Glow palette (no people, no text) |
| `cast/` | Shamz in the Glow style (`shamz-glow-sheet.png`, `shamz-glow-head.png`) and the code that draws them (`Sheet.tsx`) |
| `example/` | The finished 60 s test "Nobody Saw It" (the spotlight effect): script, `plates.json` and the plates in `public/bg/`, shot list, Root, voice, retime, mix and render scripts |

## The style in one page

- **Backgrounds (standard).** One painted plate per location, generated with `tools/backgrounds.py` from a short
  scenery prompt in `plates.json`: deep navy and indigo night, moonlight through windows, small warm lamp glows, soft
  bloom and dust, rich clutter, straight-on at eye level, empty floor, no people, no text. Ask for a **very wide shot
  from far back** so furniture comes out human-sized next to the figures. The plate is dimmed a little so the figures
  pop, and blurred behind close-ups for depth. Check every plate: regenerate any with lettering, faces, creatures, modern objects in a
  period scene, or wrong scale. `Plate` holds each frame until its picture is decoded, so no frame renders without it, and it is keyed by name so a shot that switches plates never shows the previous one.
- **Figures.** Soft white glowing people: big round head, dark oval eyes with a glint, short brows, a simple mouth,
  a pill torso and thick round-ended tube limbs, shaded grey-blue on the far side. Identity from one hair shape (cap,
  bun, ponytail) or a colour tint for a group (yellow = the group that matters).
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
both OFL) are in `example/public/fonts/`; the render browser may not reach Google Fonts.

1. **Script** (`script.md`): one `## ` heading, then one or two short sentences per line; `[SRC]` lines.
2. **Backgrounds**: write `plates.json` (`{"bedroom": "<scenery only>", ...}`), then
   `CLOUDFLARE_ACCOUNT_ID=<id> python3 <skill>/glow-style/tools/backgrounds.py` (the API token is a network secret
   for api.cloudflare.com, or `CLOUDFLARE_API_TOKEN` outside a Claude cloud session; never put it in code). Look at
   every plate and regenerate the bad ones (`--force name`). If a plate's floor sits lower or higher than the figures,
   set its line in `PLATE` in `glow.tsx`.
3. **Voice**: `python3 voice.py` (Chatterbox; `CHATTERBOX_VOICE_SAMPLE` = your own sample, never committed),
   then `python3 retime.py` (exact per-sentence word timing).
4. **Shots**: one line per shot in `studio_src/timeline.ts`: `[script line, cue word, set, params, marks]`.
5. **Storyboard**: `npx remotion render studio_src/index.ts GlowBoard out/board --sequence --public-dir public`;
   tile and fix before animating (feet on floors, people to scale with the room, nothing cut off, text off faces: in zoomed close-ups keep the face in the upper half so the captions never cover it).
6. **Sound**: `python3 mix.py` (a soft warm music bed ducked under the voice, effects on the action).
7. **Render**: `bash render.sh <frames> 700` (composition `Glow`), then mux with
   `-af "volume=<gain>dB,alimiter=limit=0.8:level=disabled"` to about -14 LUFS.
8. **QC** a 1 fps contact sheet before anyone sees it.

## Master prompt (paste this to another agent)

```
You are making an animated video in the Glow style from the Shamz agent-skills repo.

Get the tools:
- Clone https://github.com/shamz4200/agent-skills and open skills/shamz-what-if/glow-style/.
- Read README.md (the style in one page and the pipeline) and STUDY.md (the measured reference) first.
- The engine is engine/glow.tsx and engine/sets.tsx; painted backgrounds come from tools/backgrounds.py. A finished
  60-second example is in example/. The Remotion project and Python voice scripts are in ../studio and ../scripts
  (npm install in ../studio; pip install chatterbox-tts faster-whisper soundfile numpy pillow).
- Backgrounds need a Cloudflare Workers AI account: CLOUDFLARE_ACCOUNT_ID, and the API token as a secret
  (never in code or in chat).

What the style is:
- A research explainer in the second person ("you"), calm and quick: about 175 words a minute, short sentences.
- Painted, detailed night backgrounds are the standard: one plate per location, deep navy and moonlight with warm
  lamp glows, no people, no text, wide enough that furniture is human-sized next to the figures; dimmed a little,
  blurred behind close-ups. Beds, chairs, doors and clocks that people touch are drawn in code on top.
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
- Follow the Shamz Story Formula (../references/story-formula.md): a promise in the first 15 seconds, personal "you"
  moments, re-hooks every 60-90 seconds, a payoff that answers the title, a takeaway, an ending that feels positive,
  a numbered "Shamz's Rule" card, and the sign-off "Stay curious. I'll see you in the next one."
- Before writing the script, decide and tell me the ending: "complete" (question + subscribe) or "cliffhanger".
- Only real, published studies; cite them on screen and in [SRC] lines; round honestly.
- Never copy the reference video's story, script, characters or scenes: only the look, pace, camera and structure.
- Never commit voice samples or third-party media. Never print API keys.
- Check every background before using it (no lettering, faces or creatures; furniture to scale).
- Storyboard every shot and fix it before the long render. Check a 1 fps contact sheet of the finished video
  before sending it: feet on floors, people to scale, nothing cut off at a frame edge, text inside the frame and off
  faces, captions readable.
- Start with a 60-second test and show it to me before building a full episode.

My topic: <one line, e.g. "Why you remember embarrassing moments at 2 a.m.">
Length: <e.g. 60-second test / about 8 minutes>
```
