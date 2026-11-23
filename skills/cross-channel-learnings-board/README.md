# $shamz Cross-Channel Learnings Board

A $shamz skill in the Shamz agent-skills collection. It harvests lessons from every chat, verifies each one against its source, files them dated on a shared board, and folds the durable ones into the rules. Method only: the board entries themselves are private house rules and never ship as-is.

## What it does

1. Harvests learnings from every chat, the same day they land, with attribution to who learned it and which channel.
2. Verifies each learning against its source before filing it, and never invents one.
3. Files each verified learning as one dated board entry, appended in order, never edited in place.
4. Folds learnings that earn standing-rule status into the rules file the same night.
5. Runs a weekly review in pieces, in order, writing each piece to disk as it lands, and delivers a short summary last.

## What you need

- A protected folder with a learnings board, a rules file, a weekly-review log, and a state file.
- Access to the chats and files each learning came from, so it can be verified.
- A weekly review slot, on the same day each week.

## How a run works

1. Collect the week's learnings, verify each against its source, and append dated entries to the board the same day.
2. Fold any learning that earns standing status into the rules file, with date and source.
3. At the weekly review, build in order: board, rules, log, state file, then the chat summary last.
4. After any restart, read the state file first and resume from the first missing piece.

## Rules it follows

- Attribute every transfer; never present another chat's learning as your own idea.
- Verify before filing; an unverified learning is not filed as a lesson.
- Real board entries stay private; only generic example entries are ever shown.
- Rules change only on $shamz's explicit word; a review proposes, it never applies.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The pipeline the agent follows |
| `README.md` | This how-to guide |
