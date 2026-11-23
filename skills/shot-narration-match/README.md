# Shot Narration Match

A $shamz skill in the Shamz agent-skills collection. It gates a narrated video block on per-shot narration match, group shots, and one locked location before any stills are made.

## What it does

1. Matches every shot to its own narrator text: the named character, doing the described action.
2. Locks one primary location for the block and keeps interior shots there.
3. Requires group shots where the story tells a scene as a group.
4. Gives every shot its own distinct verb and fails the list when any verb repeats.
5. Publishes a match scan in the shot list header and fails the list on any mismatch.

## What you need

- The narrator text for every shot in the block.
- The shot list with a location lock, verb column, and group shot count.
- The locked character sheet for each character who appears.

## How a run works

Read the narrator text shot by shot and name who each line mentions before choosing who appears. Name one primary location in the shot list header, count group shots and distinct verbs, and publish the match scan. Rewrite and rescan a failing list to zero, then present the passed list with its scan for a verdict before any stills, narration, or segment work starts. Check each still and the assembled segment against the same list.

## Rules it follows

- Never show a different character in place of the named one.
- Run a mute test on every shot: fail any shot whose story is unclear with the sound off.
- Never let a block drift across unrelated rooms while the narration stays in one room.
- Never reuse a generic pose or listening verb across many shots.
- Never claim a gate passed without the scan or file that proves it.

## What's in the folder

| File | What it is |
| --- | --- |
| SKILL.md | The skill: frontmatter plus the full rule list. |
| README.md | This overview: what the skill does and how a run works. |
