# Final Master Audio QC

The last gate before a master ships. It upmixes mono narration to stereo before the mux, measures both
channels separately, and scans the exact final file for silent gaps.

A $shamz skill, part of the Shamz agent-skills collection. Overall loudness passing never excuses a silent
channel or a silent gap.

![Shamz, locked in](hero.jpg)

## What it does

1. **Duplicates mono narration to both channels explicitly** when building the final mix, never relying on a
   default mapping to place it.
2. **Measures left and right mean volume separately on the exact final file**, and requires both channels to
   carry voice.
3. **Runs a silence detector on the exact final file** and lists every gap with start time and duration.
4. **Flags any gap longer than about 2 seconds** that is not an intentional silent end card, and compares each
   narration chunk duration with its slot, stretching or regenerating a chunk that is much shorter than its slot.
5. **Blocks approval and upload when either check fails**, and binds the QC report to the final file hash.

## What you need

- The exact final file to check, never an earlier master
- The narration chunk durations and their slots
- A silence detector and per-channel volume measurement

## Install

From the folder you want to work in, give your agent the prompt in
[SETUP_PROMPT.md](../../SETUP_PROMPT.md), or run the installer yourself:

```bash
git clone --depth 1 https://github.com/shamz4200/agent-skills /tmp/agent-skills
bash /tmp/agent-skills/install.sh .
```

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The skill: front matter plus the full rule list |
| `README.md` | This how-to guide |
| `LICENSE` | MIT licence, which must stay with these files |
| `hero.jpg` | The hero image for this skill |

## Rules it follows

- Never rely on a default mapping to place mono narration.
- Overall loudness passing never excuses a silent channel or a silent gap.
- Never reuse a QC report from an earlier master; a new render voids the earlier report.
- Fix the mix at its source before rebuilding.
- Listen to the final file in headphones as a second check after the measurements pass.

## Licences

- MIT: see `LICENSE` in this folder, which must stay with these files.
