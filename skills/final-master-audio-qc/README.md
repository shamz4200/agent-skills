# Final Master Audio QC

A $shamz skill in the Shamz agent-skills collection. It upmixes mono narration to stereo before the mux, measures both channels separately, and scans the exact final file for silent gaps.

## What it does

1. Duplicates mono narration to both channels explicitly when building the final mix.
2. Measures left and right mean volume separately on the exact final file.
3. Runs a silence detector on the exact final file and lists every gap with start time and duration.
4. Flags any gap longer than about 2 seconds that is not an intentional silent end card.
5. Blocks approval and upload when either check fails, and binds the QC report to the final file hash.

## What you need

- The exact final file to check, never an earlier master.
- The narration chunk durations and their slots.
- A silence detector and per-channel volume measurement.

## How a run works

Build the final mix with mono narration explicitly duplicated to both channels. Measure left and right mean volume separately on the exact final file and require both channels to carry voice. Run a silence detector on the same file, list every gap, and compare each narration chunk duration with its slot, stretching or regenerating a chunk that is much shorter than its slot. Record per-channel means and the longest unintended gap beside the loudness reading, and run both checks again after any re-render.

## Rules it follows

- Never rely on a default mapping to place mono narration.
- Overall loudness passing never excuses a silent channel or a silent gap.
- Never reuse a QC report from an earlier master; a new render voids the earlier report.
- Fix the mix at its source before rebuilding.
- Listen to the final file in headphones as a second check after the measurements pass.

## What's in the folder

| File | What it is |
| --- | --- |
| SKILL.md | The skill: frontmatter plus the full rule list. |
| README.md | This overview: what the skill does and how a run works. |
