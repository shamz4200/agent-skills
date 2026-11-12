# Night Dossier ("ND style")

A second Shamz style, next to What If Dusk: **true-story investigations told at night**. Dark rooms lit by one warm
lamp, simple "bean" characters, a camera that never stops drifting, handwritten text cards typed on with the voice,
and a dossier of files, maps, stamps and counters. Shamz is the investigator who walks you through the file.

"ND style" and "Night Dossier" mean the same thing.

| Folder | What's in it |
|---|---|
| `STUDY.md` | The reference study: measured pace, art style, camera, animation, story shape |
| `engine/dossier.tsx` | The rig and the look: `Bean`, `Cam` + `Layer` (parallax camera, focus views), `Night` (lamp-light), `Finish` (vignette + grain), `Bokeh`, `Rain`, `TypeCard`, `NameTag`, `LocTag`, `Stamp`, `Paper`, `Hand`, counters |
| `engine/kit2.tsx` | The cast (`LOOKS`, Shamz included) and data-driven inserts: `Doc`, `News`, `Chart`, `BigNum`, `Cal`, `MapShot`, `Term`, `Chat`, `Flow`, `ChapterCard`, `Photo`, `Bubble` |
| `engine/sets.tsx` | Flexible scene sets dressed with a cast list: `ShamzDesk`, `Office`, `Street`, `Table`, `Stage`, plus `Dax`, `Sheet`, `Gadgets`, `Target`, `EndCard` |
| `engine/cold.tsx` | Hand-built shots (the Wirecard cold open): how to write a one-off shot |
| `example/` | A finished 60 s test, ready to render: script, shots, timeline, voice and mix scripts |
| `tools/` | For full episodes: `voice.py`, `retime.py` (exact per-sentence word timing + chapter-card gaps), `mix.py` (music cues that come and go, ducking, effects), and a full-episode shot list as an example |

## The style in one page

- **Look.** Night palette (navy, charcoal, bottle green), each scene lit by one warm practical light; a vignette and
  paper grain on every frame; bright warm flashbacks for the past. Green = money, red = danger, gold = accents.
- **Characters.** Beans: big round head, dot eyes, pill body, stick legs, arms only when needed, one identifying
  prop each (glasses, a hair shape, a hat). Close-ups crop at the chest.
- **Shamz is in every episode.** In a true story he is the guide (the investigator at his desk and corkboard, on
  screen every 30 to 60 s) and never replaces the real people. In a "what if you" story he is the main character.
- **Camera.** Never still: slow push-ins, pull-backs, sideways drifts with parallax; whip pans; top-down desk inserts.
- **Dossier kit.** Black cards with one handwritten line typed on in sync (about every 30 to 40 s), name tags with a
  dotted connector, location tags, files and photos on green felt, stamps, maps with pins and routes, counters,
  calendars, newspapers, terminals, CCTV frames.
- **Pace.** 19 to 20 cuts a minute (26+ in the first minute), a visual beat about every 1.4 s, narration about
  155 to 160 words a minute in short sentences.
- **Story.** Present tense. Cold open on the most striking scene, ending "This is the story of how ...". Then 4 to 6
  named chapters, each with a chapter card. Every number is shown as it is spoken; every claim is attributed.
  Ending decided up front: **complete** (bookend, a question for the comments, subscribe) or **cliffhanger**.
- **Music comes and goes.** Music under the cold open, chapter cards, tense stretches and the ending; quiet room
  tone in between; always ducked under the voice.
- **True stories only from published, checkable sources.** Put `[SRC]` lines in the script. Real people are simple
  beans doing only what the record says. Allegations are worded as allegations.

## Make an episode

Work in a new folder (copy `example/` as the start) with `node_modules` linked to the skill studio's
(`ln -s <skill>/studio/node_modules node_modules` after `npm install` in `<skill>/studio`).

1. **Script** (`script.md`): `## chapter` headings, one or two sentences per line, numbers spelled out, `[SRC]` lines.
2. **Voice**: `python3 voice.py` (Chatterbox; set `CHATTERBOX_VOICE_SAMPLE` to your own sample, which is never
   committed), then for a full episode `python3 retime.py` (exact timings, chapter gaps).
3. **Shots**: one line per shot in `studio_src/timeline.ts`: script line, cue word, kind, params, marks.
   Reuse the sets and inserts; write a one-off shot only when nothing fits.
4. **Storyboard**: `npx remotion render studio_src/index.ts DossierBoard out/board --sequence --public-dir public`,
   tile it into contact sheets, and fix what you see before animating. Checklist: faces visible, feet on floors,
   people to scale, nothing cut off at a frame edge, text inside the frame and readable, no scene too dark to read.
5. **Sound**: `python3 mix.py`. **Render**: `npx remotion render studio_src/index.ts Dossier out/silent.mp4
   --public-dir public`, then mux with `-af loudnorm=I=-14:TP=-1.5`.
6. **QC** a 1 fps contact sheet of the finished video before anyone else sees it.

Traps that cost time: the render browser may not reach Google Fonts (the fonts ship in `example/public/fonts`,
loaded with `@remotion/fonts`); keep `.cache/` and `node_modules` out of git (the webpack cache is over 100 MB);
whisper can mis-time a stretch with spoken numbers, which is why `retime.py` times each sentence on its own.

## Master prompt (paste this to another agent)

```
You are making an animated video in the Night Dossier style ("ND style"), a style from the Shamz agent-skills repo.

Get the tools:
- Clone https://github.com/shamz4200/agent-skills and open skills/shamz-what-if/night-dossier/.
- Read README.md (the style in one page and the pipeline) and STUDY.md (the measured reference) before anything else.
- The engine is in engine/ (dossier.tsx, kit2.tsx, sets.tsx, cold.tsx). A finished 60-second example is in example/.
  Full-episode tools are in tools/. The Remotion project and Python scripts it relies on are in ../studio and
  ../scripts (run npm install in ../studio; pip install chatterbox-tts faster-whisper soundfile numpy).

What the style is:
- True-story investigation, present tense, calm narrator, short sentences, about 155-160 words a minute.
- Night scenes lit by one warm lamp, a vignette and paper grain on every frame; bright warm flashbacks.
- "Bean" characters: big round head, dot eyes, pill body, stick legs, one identifying prop each.
- The camera always moves: slow push-ins, pull-backs, drifts with parallax, whip pans, top-down desk inserts.
- Dossier devices: black cards with a handwritten line typed on with the voice, name tags, location tags, files and
  photos on green felt, stamps, maps with pins and routes, counters, calendars, newspapers, terminals, CCTV frames.
- Pace: 19-20 cuts a minute (26+ in the first minute); something new on screen about every 1.4 seconds.
- Structure: cold open on the most striking scene ending "This is the story of how ..."; then 4-6 named chapters,
  each with a chapter card; every number shown as it is spoken; every claim attributed.
- Shamz (brown skin, orange locs, purple hoodie: LOOKS.shamz) is in every episode. In a true story he is the guide
  at his investigator's desk, on screen every 30-60 seconds, and never replaces the real people. In a "what if you"
  story he is the main character.
- Music comes and goes: on for the cold open, chapter cards, tense stretches and the ending; room tone in between;
  ducked under the voice.

Rules:
- Before writing the script, decide and tell me the ending: "complete" (bookend scene, a question for the comments,
  a call to subscribe) or "cliffhanger" (needs a Part 2).
- Only true, published, checkable facts. Put [SRC] lines in the script. Word allegations as allegations. Real
  people do only what the record says.
- Never copy the reference video's story, script, characters or scenes: only the look, pace, camera and structure.
- Never commit voice samples or third-party media. Never print API keys.
- Render a storyboard of every shot and fix it before the long render. Check a 1 fps contact sheet of the finished
  video before sending it: faces visible, feet on floors, people to scale, nothing cut off at a frame edge, text
  inside the frame and readable, no scene too dark.
- Start with a 60-second test of the cold open and show it to me before building the full episode.

My topic: <one line, e.g. "How one man made 1.9 billion euros disappear">
Length: <e.g. 60-second test / about 12 minutes>
```
