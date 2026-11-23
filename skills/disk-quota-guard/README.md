# Disk Quota Guard

A $shamz skill in the Shamz agent-skills collection. It detects a disk quota failure directly and recovers a stalled build without trusting free-space readings.

## What it does

1. Treats the exact error text Disk quota exceeded or EDQUOT as a quota failure.
2. Proves the wall with a small test write instead of trusting a free-space reading.
3. Stops the stalled build at once and keeps the last verified checkpoint and state file intact.
4. Frees space safely in small verified steps, retesting after each step.
5. Resumes only from the checkpoint once writes succeed again.

## What you need

- The build state file, kept up to date with usage, readings, and test results.
- The keep lock list, naming paths that must never be deleted.
- A way to run a small test write in your workspace.

## How a run works

When a build fails on a write, run a small test write in your workspace and record the result with the usage and free-space reading. If the test write fails, stop the build, tell the user the quota is reached and what must be freed, then free only regenerable intermediates in small verified steps, retesting after each step. Resume from the last verified checkpoint once the test write passes; if no safe space can be freed, leave the files in place and report the exact shortfall.

## Rules it follows

- A free-space reading is never proof that writes will succeed.
- Never restart the same write in a loop while the quota wall stands.
- Never delete a locked path, even under disk pressure.
- Keep character sheets, scripts, rules, voices, narration, and trading material.
- Check the quota with a small test write before a long build starts.

## What's in the folder

| File | What it is |
| --- | --- |
| SKILL.md | The skill: frontmatter plus the full rule list. |
| README.md | This overview: what the skill does and how a run works. |
