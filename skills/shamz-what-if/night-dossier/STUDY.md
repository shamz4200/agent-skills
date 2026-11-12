# Style reference 6: "How a Chinese Spy Got Inside Nvidia" (TubePull upload)

Studied 12 Nov 2026 from the owner's upload (19:48, 512x288). The video is third-party media and stays out of git; only
these notes are kept. We adopt the **look, animation approach, camera language, storytelling shape and pace**, never
its story, script, characters or scenes. Style name: **Night Dossier**.

## Pace (measured with tools/analyze_shots.py and tools/transcribe.py)

- 390 shots in 19.8 min: **19.7 cuts/min**, median shot **2.5 s** (10% under 0.8 s, 10% over 5.8 s, 2% over 10 s).
- Cold open is faster: 26 to 28 cuts/min for the first 60 s, median 2.0 s. The rest holds 18.5 to 22 cuts/min.
- **Visual beats** (a cut or something new appearing on screen): 715, one every **1.4 s** (36 per min), never a gap
  over 10 s and under 1% over 6 s. Something new appears roughly twice per shot.
- Transitions: 342 hard cuts, **35 fades through black** (the text cards), 9 push-through dissolves, 3 punch cuts.
- Motion mix: only 10% of shots are fully static; 63% have a camera move or parallax; 43% have character animation.
- Narration: 3,149 words, **159 words/min**, short sentences (median 6 words), 12 pauses over 1 s. One calm narrator;
  characters speak a few short quoted lines ("To our customers!").

## Art style

- **Night palette.** Most scenes are dark: deep navy, charcoal and bottle green rooms lit by one warm practical light
  (candle, desk lamp, pendant, monitor glow, torch beam). Bright scenes are flashbacks (childhood, diner, daytime
  offices) in warm cream, orange and teal. Accent colours carry meaning: **money/chip green**, **danger red**, gold.
- **Lighting is the look.** Heavy vignette on every frame, soft glow/bloom around lamps and screens, light pools on
  floors and desks, bokeh dots behind close-ups, rain streaks, dust. Characters pick up the warm light on one side.
- **Characters ("beans").** A big round head (flat skin tone, dark outline), dot eyes, a simple line mouth, simple
  hair cap; a small bean/pill-shaped body in one flat colour; thin black stick legs with small feet; arms are thin
  lines that only appear when needed. Identity comes from one or two props: glasses, a hair shape, a jacket colour, a
  hard hat, a chef hat. Close-ups crop at the chest and the head fills a third of the frame.
- **Sets.** Flat 2D illustrations with dark outlines and soft paper texture, drawn straight-on (stage view) with a
  few in one-point perspective for depth (corridors, server halls, warehouses, libraries). Each set is simple but
  carries 5 to 10 readable props.
- **Graphic devices (the "dossier" kit).**
  - **Black text cards**: a line of narration typed on, handwritten white script on black, word by word in sync
    with the voice; used about every 30 to 40 s for the key sentence of a beat. Chapter titles use the same card.
  - Name tags that slide in under a character with a dotted connector line; location tags ("SINGAPORE") in a corner.
  - Desk-top inserts shot from above on green felt: files, photos with paper clips, clipboards with tick boxes,
    ledgers being written, stamps ("APPROVED"), rubber erasing a name.
  - Maps (parchment land, pale blue sea) with pins, routes drawn on, shipping labels and a country lighting red.
  - Counters that tick up, price tags, calendars with circled dates, newspaper front pages, a stock chart, a "LIVE"
    news frame, CCTV/camera viewfinder frames with REC and a timestamp, green-screen surveillance terminals.
  - Visual metaphors: a set of scales, a padlocked chip, a chef becoming a thousand chefs, a pyramid of boxes, cars
    queueing at a border gate for an export ban.
  - Split screens (two places at once) with a torn or straight divide.

## Camera

- **Always moving, gently**: slow push-ins on faces and documents, slow pull-backs to reveal, sideways drifts with
  2 to 4 parallax layers. Static frames are rare (10%).
- **Signature moves**: whip pan between two people at a table (motion blur); pull back through a window to the whole
  building and street; push **through** a screen, door or window into the next scene (iris/match cut); top-down
  insert of a desk or table; tilt down from a sign to the scene; map push-in from region to city; rack from bokeh.
- Framing ladder inside a scene: wide two-shot, close-up A, close-up B, insert of the object, back to wide.

## Animation

- Limited but constant: blinks, mouth flaps on quoted lines, head tilts, an arm reaching, a toast, walking as a
  two-pose bob, objects sliding or dropping in, text writing on, lights flickering, numbers counting.
- Energy comes from camera motion, reveals and cutting, never from complex character animation.

## Storytelling

- **True-story investigation** in the present tense, third person, about real, documented events: business, power,
  money, espionage. Calm, plain words, dry wit; no hype.
- Structure: **cold open on the most striking scene** (35 s) ending on "This is the story of how ..."; title; then
  **4 to 6 named chapters** ("The Man With the Key", "The Pipeline", "The Memo"), each opening with a chapter card.
  Chapter 1 is the hero's origin (humble start, rise). Then the other side's plan, the scheme step by step, the
  money, who knew, the reveal and the fallout.
- Numbers are always shown (counter, tag, ledger) at the moment they're spoken. Every claim is attributed ("an
  American memo later wrote...", a newspaper front page, a company statement card).
- **Bookend ending**: return to the opening scene, changed (the empty chair), a closing question, and a last quoted
  line. For us: add the question for the comments and the subscribe call (the ending rule).

## How we would make it (plan)

- Engine: Remotion + SVG (the studio already drives POV Doodle and What If Dusk), a new `engine/dossier.tsx`:
  bean character rig (head, bean body, stick legs, on-demand arms, prop slots), lighting pass (vignette, glow, light
  pools, bokeh, rain), camera rig (push, pull, drift with parallax layers, whip pan, push-through transition), and
  the dossier kit as reusable components (type-on card, name tag, desk insert, map, counter, newspaper, CCTV frame).
- Sets code-drawn in SVG (dark outlines + paper texture overlay), 2 to 4 parallax layers each.
- Voice: Shamz (Chatterbox), about 155 to 160 wpm; type-on cards timed from the script's word timings.
- Targets: 19 to 20 cuts/min (26+ in the first minute), a visual beat every 1.4 s, a text card every 30 to 40 s,
  under 10% static shots, 4 to 6 chapters, 10 to 20 min.
- True stories only from published, checkable sources, with [SRC] lines in the script; real people shown as simple
  beans doing only what the record says; allegations worded as allegations.
