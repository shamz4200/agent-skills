# $shamz Cross-Channel Learnings Board

Lessons land in every chat, every day. This skill harvests them, verifies each one against its source, files
them dated on a shared board, and folds the durable ones into the rules.

Method only: the board entries themselves are private house rules and never ship as-is. Only generic example
entries are ever shown.

![Shamz holding the whole picture](hero.jpg)

## What it does

1. **Harvests learnings from every chat**, the same day they land, with attribution to who learned it and
   which channel.
2. **Verifies each learning against its source** before filing it, and never invents one.
3. **Files each verified learning as one dated board entry**, appended in order, never edited in place.
4. **Folds learnings that earn standing-rule status into the rules file** the same night.
5. **Runs a weekly review in pieces, in order**, writing each piece to disk as it lands, and delivers a short
   summary last.

## What you need

- A protected folder with a learnings board, a rules file, a weekly-review log, and a state file
- Access to the chats and files each learning came from, so it can be verified
- A weekly review slot, on the same day each week

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

- Attribute every transfer; never present another chat's learning as your own idea.
- Verify before filing; an unverified learning is not filed as a lesson.
- Real board entries stay private; only generic example entries are ever shown.
- Rules change only on $shamz's explicit word; a review proposes, it never applies.

## Licences

- MIT: see `LICENSE` in this folder, which must stay with these files.
