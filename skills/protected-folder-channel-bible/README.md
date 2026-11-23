# Shamz Protected-Folder Channel Bible

Hold a whole channel in one protected folder, so the channel can be rebuilt at the same quality from that
folder alone if everything else is wiped. The folder is the single source of truth for the lane.

![Shamz in white robes on the hills](hero.jpg)

## What it does

1. **Sets up one protected folder per channel** with a fixed template of files.
2. **Records every standing rule with its date and source**, plus the series and character bibles, voice,
   pacing, workflow, episode status, and packaging checklist.
3. **Keeps a state file in the folder** with the last completed output, the next step, and the exact starter
   command.
4. **Runs a weekly review** that checks live work against the folder, fixes drift in the same run, and logs
   what changed and what was learned.
5. **Guards the folder as the single source of truth:** a fresh session reading only that folder must be
   able to run the lane exactly as before.

## The folder template

- `README.md` — what the folder is, what it holds, the channel identity, the current status, and the
  current blocker.
- `CORE-RULES.md` — every standing rule for the channel, each with its date and source.
- `SERIES-BIBLE.md` — the channel's art direction, pacing, and visual standard, and which episode is the
  current bible episode.
- `CHARACTER-SHEETS.md` — every character, their sheet, voice, and locked attributes.
- `VOICE.md` — narration voice details, voice routing, and audio rules.
- `PACING.md` — pacing, timing, and sync rules.
- `WORKFLOW.md` — the daily build, publish, packaging, and carousel workflow, step by step.
- `EPISODE-STATUS.md` — where every episode stands: masters, hashes, status, and live links.
- `DOS-AND-DONTS.md` — a quick-reference do and do-not list.
- `PACKAGING-CHECKLIST.md` — the standard packaging items, all verified live before anything is reported
  as fully packaged.
- `bibles/` — verbatim copies of the series bible, character bible, location bible, prop library, episode
  list, style-bible notes, and style-bible reference frames.
- `character-sheets/` — the canonical character sheet images.
- `WEEKLY-REVIEWS/` — one dated note per weekly review.
- `STATE.md` — the state file for the lane.

Add a channel-specific file only when that channel genuinely needs one. Do not copy another channel's file
into this folder without trimming it to this channel.

## How a run works

1. Create the folder from the template and fill each file from the channel's locked sources.
2. Work from the folder every day; update it the same day a rule changes, a bible updates, or an episode
   ships.
3. Each week, review the folder for freshness, check the week's builds against it, write a dated review
   note, and update the state file.
4. After any restart, read the state file first and resume the next step before reporting status.

## What you need

- A folder in your workspace for the channel, kept out of any temporary location.
- The channel's locked bibles, character sheets, voice details, and workflow, filed as written records,
  not remembered descriptions.
- A weekly review slot to check the folder's freshness and the week's work against it.

## Install

From the folder you want to work in, give your agent the prompt in
[SETUP_PROMPT.md](../../SETUP_PROMPT.md), or run the installer yourself:

```bash
git clone --depth 1 https://github.com/shamz4200/agent-skills /tmp/agent-skills
bash /tmp/agent-skills/install.sh .
```

Then start your agent from that folder and ask it to use the protected-folder channel bible skill.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The method the agent follows |
| `README.md` | This how-to guide |
| `LICENSE` | The MIT licence, which must stay with these files |
| `hero.jpg` | The hero image for this guide |

## Rules it follows

- The folder is never deleted, never moved, and never stored in a temporary folder.
- Rules change only on $shamz's explicit word, and are updated the same day.
- Approval is exact-file and hash-bound; silence is never approval.
- Packaging is complete only when every item is verified live.
- No shortcuts: a method change means stop and tell, never a silent fallback.
- Character consistency is a golden rule: characters must look identical to their character sheets, always,
  no exceptions.

## Licences

- MIT: see `LICENSE` in this folder, which must stay with these files.
