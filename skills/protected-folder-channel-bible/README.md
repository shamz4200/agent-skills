# $shamz Protected-Folder Channel Bible

A $shamz skill in the Shamz agent-skills collection. It holds a whole channel in one protected folder, so the channel can be rebuilt at the same quality from that folder alone if everything else is wiped.

## What it does

1. Sets up one protected folder per channel with a fixed template of files.
2. Records every standing rule with its date and source, plus the series and character bibles, voice, pacing, workflow, episode status, and packaging checklist.
3. Keeps a state file in the folder with the last completed output, the next step, and the exact starter command.
4. Runs a weekly review that checks live work against the folder, fixes drift in the same run, and logs what changed and what was learned.
5. Guards the folder as the single source of truth: a fresh session reading only that folder must be able to run the lane exactly as before.

## What you need

- A folder in your workspace for the channel, kept out of any temporary location.
- The channel's locked bibles, character sheets, voice details, and workflow, filed as written records, not remembered descriptions.
- A weekly review slot to check the folder's freshness and the week's work against it.

## How a run works

1. Create the folder from the template and fill each file from the channel's locked sources.
2. Work from the folder every day; update it the same day a rule changes, a bible updates, or an episode ships.
3. Each week, review the folder for freshness, check the week's builds against it, write a dated review note, and update the state file.
4. After any restart, read the state file first and resume the next step before reporting status.

## Rules it follows

- The folder is never deleted, never moved, and never stored in a temporary folder.
- Rules change only on $shamz's explicit word, and are updated the same day.
- Approval is exact-file and hash-bound; silence is never approval.
- Packaging is complete only when every item is verified live.
- No shortcuts: a method change means stop and tell, never a silent fallback.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The pipeline the agent follows |
| `README.md` | This how-to guide |
