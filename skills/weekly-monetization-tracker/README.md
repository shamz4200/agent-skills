# $shamz Weekly Monetization Tracker

Track monetization progress weekly from a fresh read-only Studio read, chart it against the thresholds, and
log the history so progress is visible week to week.

![Shamz in a tux with a cigar, holding a phone](hero.jpg)

## What it does

1. **Takes a fresh read-only Studio read across your channels:** subscribers, qualified hours against 4,000,
   Shorts views against 10M, and 28-day deltas.
2. **Builds a 3-panel progress chart** and verifies the numbers on it match the Studio read before delivery.
3. **Delivers a dated update with the chart,** per-channel numbers, the closest channel, the subscriber gap,
   one growth lever, and the data vintage stated explicitly.
4. **Appends the numbers to a dated history log in the same run,** and logs the run to your goal tracker.
5. **Falls back to the most recent verified scan, clearly labelled with its date,** when the live read fails,
   and never presents fallback data as fresh.

## What you need

- Read access to the creator studio for each channel you track, under your Google account
- A chart script kept in your workspace, with the 3-panel layout
- A history log file in your workspace, appended to, never edited in place

## How a run works

1. Read each channel in the studio, one channel at a time, writing each channel's numbers to a dated scan file
   as it lands.
2. Build the chart from the fresh numbers and verify it matches the read.
3. Deliver the chart and the short update with the data vintage stated.
4. Append to the history log, update the state file, and log the run.

## Install

From the folder you want to work in, give your agent the prompt in
[SETUP_PROMPT.md](../../SETUP_PROMPT.md), or run the installer yourself:

```bash
git clone --depth 1 https://github.com/shamz4200/agent-skills /tmp/agent-skills
bash /tmp/agent-skills/install.sh .
```

Then start your agent from that folder and run the tracker on the same day each week.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The pipeline the agent follows |
| `README.md` | This how-to guide |
| `LICENSE` | MIT licence, which must stay with these files |
| `hero.jpg` | The hero image for this guide |

## Rules it follows

- Never invent numbers; every figure comes from a live read or a dated, labelled fallback.
- Read-only in the studio: change nothing, upload nothing, modify no settings.
- A missing panel is not shown, never zero; a dash is not a measured zero.
- A two-step verification block is reported plainly, never worked around.
- Projections are linear floor estimates, labelled as such, and buying subscribers or watch hours is never
  recommended.

## Licences

- MIT: see `LICENSE` in this folder, which must stay with these files.
