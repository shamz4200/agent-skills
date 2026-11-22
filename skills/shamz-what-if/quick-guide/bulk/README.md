# Bulk mode: several Quick Guide Shorts a day

The data-driven engine used for the owner's batches (videos #2-#6). One shared Remotion studio; each Short is a
spec (`src/eps/<slug>.ts`: shots + overlays keyed to **word indices** of its voice take) plus its own folder
`<slug>/` (`script.md`, `plates.json`, `plates/`, `audio/voice.wav`, `words.json`, `upload.md`).

**Rules (owner, Nov 2026):** brand-new images for every video (never reuse a plate from another video); Shamz in a
brand-new outfit every video (log it); next music bed in the rotation; max-SEO upload pack with #shamz always and no
sources in descriptions; 1 fps QC board checked by eye before sending.

## Pipeline per batch
1. Research N topics; write `<slug>/script.md` for each (90-115 words, `[SRC]` lines).
2. `python3 tools/voice.py <slug> ...` (Chatterbox, the owner's sample, about 1 min per sentence on CPU: start first).
3. Write `<slug>/plates.json` (`outfit`, 3 `shamz` poses that act the lines, 2-3 `scenes`; see `example-plates.json`)
   and run `python3 tools/plates.py <slug> ...` (FLUX.2 [klein] 9B on Cloudflare Workers AI, 3 at a time; needs the
   **Workers Paid** plan for more than ~12 images a day). `python3 tools/sheet.py <slug> out.png` and check every plate:
   on-model Shamz, no logos/lettering, good hands. Delete and regenerate bad ones; reword prompts the filter flags.
4. Write `src/eps/<slug>.ts` (see `eps/bank-vaults.ts`) and register it in `Root.tsx` with a cover.
   Overlays in `engine.tsx`: `alert`, `big` (numeral with a plate inside), `tag`, `list` (rows + stamps), `value`
   (strike), `versus`, `count` (counter, `comma`), `badge` (stamp + segmented bar), `flow`, `check`, `pin`, `zone`,
   `stars` (`center`/`scale` for a big hero row), `icons` (what-they-know with swaps), `button` (controller prompt),
   `cta`. Shot plates: a plate name, `map`, or `grad:#a,#b`.
5. `bash tools/build.sh <slug> <music file> <start s>`: stage, render, cover, 1 fps board, two-pass mix at -14 LUFS.
6. Read each board: no empty beats over ~2 s, nothing over faces, nothing in the bottom ~300 px / right ~120 px
   except the CTA pills, counters already moving when their line starts. Fix the spec and rebuild.
