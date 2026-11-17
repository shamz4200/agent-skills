# Style reference 7: "Why Strict Parents Still Didn't Know" (TubePull upload)

Studied 17 Nov 2026 from the owner's upload (8:33, 854x480). The video is third-party media and stays out of git; only
these notes are kept. We adopt the **look, figure design approach, captions, camera language, story shape and pace**,
never its story, script, characters (Leo, the two dads), studies-as-plot or scenes. Style name: **Glow style** (the owner's name;
first called "Glow style"). Painted detailed backgrounds are the standard.

## Pace (measured with tools/analyze_shots.py and tools/transcribe.py)

- 166 shots in 8.5 min: **19.4 cuts/min**, median shot **2.5 s** (36% under 2 s, 38% 2 to 4 s, 1% over 10 s).
- The opening is much faster: **44 cuts/min in the first 15 s** (median 1.2 s), 38 in the first 30 s, **30 in the
  first minute**. After that it settles at about 18 cuts/min; the last 10% slows to about 12 (5 s shots) for the
  emotional ending.
- **Visual beats** (a cut or something new appearing): 28 a minute overall, one every **1.8 s** median; 44/min in the
  first 15 s. Nothing ever holds more than 10 s.
- Transitions: 146 hard cuts, 13 dissolves (time jumps and push-throughs), 4 fades to black, 2 punch cuts.
- Motion: only 15% of shots are static. 39% have a camera move (slow push-ins, pull-backs, drifts), 15% layered
  parallax, 60% have character animation.
- Narration: 1,490 words, **about 175 words a minute** (faster than Night Dossier), median sentence **7 words**,
  only 7 pauses over 1 s. Second person throughout ("you" about 70 times); 13 questions.

## Art style

- **Glowing white figures.** Every person is a soft white figure: a big round head, two dark oval eyes with a white
  glint, short brows, a simple line mouth; a pill torso and thick rounded limbs (tube arms and legs with round ends,
  no hands, no clothes beyond the odd pair of jeans or a cap). They are shaded slightly grey-blue on the far side and
  **bloom** (a soft white glow). Identity comes from one hair shape (a backwards cap, a bun, a ponytail) and colour
  tints: a group can glow warm yellow, pink-red or blue to show a category.
- **Night rooms in line art.** Sets are deep navy rooms drawn as dark shapes with thin light-blue outlines: a window
  with a big moon and stars, a wall lamp throwing a warm pool, a door, a shelf, a plant, a bed, a nightstand with a
  glowing digital clock, a desk chair. A soft grid/paper texture on the walls. Two moods: **cold blue** and **warm
  amber** (the warm room is the "good" house); a split frame puts one beside the other with a diagonal light seam.
- **Atmosphere everywhere:** floating dust/star specks, bloom on lamps, moons and screens, a strong vignette.
- **Data shots:** huge glowing numbers in a monospace font (yellow) with a spaced-out citation line under them
  ("AUTHOR ET AL. (YEAR) · JOURNAL"); crowds of tiny figures standing in rows on a horizon to show a study's sample,
  coloured by group (e.g. told everything / lied); a dot field of hundreds of tiny heads; bar charts with filling
  bars; dark side panels with a checklist that ticks in; a house cut open in two halves (blue room vs warm room).
- **UI overlays:** phone screens (messages, a map with a dot, a location toggle), pill tags in the corner
  ("LATER TONIGHT", "TEN YEARS AGO", "DAD 1"), a big glowing clock time ("11:45").

## Captions

Bottom-centre, **1 to 3 words at a time**, bold rounded sans (Inter Extra Bold), white with a dark shadow. The
phrase appears whole, with the words not yet spoken dimmed; they light up as they are said. **Key words are
coloured**: yellow for numbers, names and the point, red for danger/negative words. A huge red or yellow glowing word
sometimes takes over the frame ("NOT", "CAN'T", "WORSE", "UNASKED").

## Camera

Slow push-ins and drifts on almost every shot; pull-backs to reveal a crowd or a second house; split-screen wipes;
zoom-through into a phone or window; quick time-jump dissolves with a clock.

## Story shape

1. **Hook in the first 15 s**: "you" in a relatable situation, a contrast (you vs a neighbour), then "scientists tested
   this on 1,000+ families, and the result is not what you'd think".
2. **Tonight, minute by minute**: one evening told with clock times, cutting between two parallel lives.
3. **The study, shown as people**: each finding is a crowd shot with a number and an on-screen citation.
4. **The twist** (what really worked) and a time jump ("2 years later").
5. **Slow, warm ending**: the lesson in a few short lines, longer shots, then a question.

Every claim is backed by a named study shown on screen. Narration is calm, fast, conversational, short sentences.

## How we build it (Glow style engine)

Remotion + SVG, like Night Dossier, in `glow/<episode>/studio_src/glow.tsx`: `Fig` (glowing jointed figure with
poses, walk cycle, blinking, idle breathing, hair shapes, tints, shirts, phone), `Cam`, `Dust`, `Finish`,
`Captions` (phrase-at-a-time with dim upcoming words and keyword colours), `Tag`, `BigStat`, `Cite`, `Bubble`;
sets in `sets.tsx` (rooms, bedroom, hallway and stairs, classroom, crowds, spotlight stage, data panels, end card).
Shamz is a glowing figure too, with his permanent marks: the black ribbed beanie with the gold patch and black
cloud, golden locs and red eyes with three dots round the pupil.
