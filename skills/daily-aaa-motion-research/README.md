# $shamz Daily Motion Research

Study the best motion websites in the world, once a day, against a locked design vision. Write down only
what is new, split proven techniques from speculation, and end with one testable step.

Research only: it never builds or pushes anything.

![Shamz, energy in motion](hero.jpg)

## What it does

1. **Reads the locked design vision first**, verifying its recorded path before every run.
2. **Reads the existing research notes** so nothing already covered is repeated.
3. **Searches the web for current, sourced techniques** and real motion websites, reading the sources, not
   summaries of summaries.
4. **Files each new technique under one bucket:** pipeline, camera, particles, interface, game feel, or budgets.
5. **Splits every note into PROVEN, with source and date, and SPECULATION, labelled as such.** No technique is
   called proven without a named source behind it.
6. **Ends each note with one concrete, testable next step** that could be tried as a small preview first.

## What you need

- A locked design vision file in your workspace, with its path recorded in your notes
- A dated folder of past daily research notes to check against
- Web search access for current techniques and live motion sites

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
| `SKILL.md` | The pipeline the agent follows |
| `README.md` | This how-to guide |
| `LICENSE` | MIT licence, which must stay with these files |
| `hero.jpg` | The hero image for this skill |

## Rules it follows

- Research only: no build, no rebuild, no push, no change to a locked decision.
- No technique is called proven without a named source behind it.
- Delta-only notes: repeats are linked to, not re-filed.
- A stale vision path is fixed in the record before the run, never worked around silently.

## Licences

- MIT: see `LICENSE` in this folder, which must stay with these files.
