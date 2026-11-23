# Disk Quota Guard

A build stalls on a write. Free space says there is room. This skill proves the quota wall with a small test
write instead of trusting the reading, then recovers the build without deleting anything that matters.

A $shamz skill, part of the Shamz agent-skills collection.

![Shamz, dark braids and gloves](hero.jpg)

## What it does

1. **Treats the exact error text `Disk quota exceeded` or `EDQUOT` as a quota failure.** A free-space reading
   is never proof that writes will succeed.
2. **Proves the wall with a small test write** in your workspace, and records the result with the usage and
   free-space reading in the build state file.
3. **Stops the stalled build at once** and keeps the last verified checkpoint and state file intact.
4. **Frees space safely in small verified steps**, retesting after each step. Only regenerable intermediates,
   duplicate finals, and old review copies go — never a locked path.
5. **Resumes only from the checkpoint** once writes succeed again.

## What you need

- The build state file, kept up to date with usage, readings, and test results
- The keep lock list, naming paths that must never be deleted
- A way to run a small test write in your workspace

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

- A free-space reading is never proof that writes will succeed.
- Never restart the same write in a loop while the quota wall stands.
- Never delete a locked path, even under disk pressure.
- Keep character sheets, scripts, rules, voices, narration, and trading material.
- Check the quota with a small test write before a long build starts.

## Licences

- MIT: see `LICENSE` in this folder, which must stay with these files.
