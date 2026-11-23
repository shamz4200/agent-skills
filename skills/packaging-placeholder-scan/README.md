# Shamz Packaging Placeholder Scan

Scan every packaging text for unresolved template placeholders before it goes live. A description,
comment, post, or caption never ships with a bracketed token still in it.

![Golden eye](hero.jpg)

## What it does

1. **Collects the exact texts that will publish:** the description, pinned comment, community post, carousel
   caption, and title variants.
2. **Searches every text for an opening square bracket** and reads each bracketed token in full.
3. **Treats any all-capitals bracketed token, and any bracketed instruction, as a placeholder.**
4. **Records zero hits, or lists every hit** with its file and line.
5. **Fixes every hit, rescans to zero, and holds any item that still has a hit.**

## How a run works

Collect the exact texts that will publish and record each file path in the run note. Search every text for
bracketed tokens and record the result as zero hits, or list every hit with file and line. Replace each hit
with the real link or real text, or delete the line when no real value exists, then run the same bracket
search again and confirm zero hits before the upload or post step starts. Read the live description and
pinned comment after upload and fix at once any placeholder the pre-publish scan missed.

## What you need

- The exact packaging files that will publish, not drafts or summaries.
- The real links and real text that replace each placeholder.
- The file path of each text, recorded in the run note before scanning.

## Install

From the folder you want to work in, give your agent the prompt in
[SETUP_PROMPT.md](../../SETUP_PROMPT.md), or run the installer yourself:

```bash
git clone --depth 1 https://github.com/shamz4200/agent-skills /tmp/agent-skills
bash /tmp/agent-skills/install.sh .
```

Then start your agent from that folder and ask it to use the packaging placeholder scan skill.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The scan the agent follows |
| `README.md` | This how-to guide |
| `LICENSE` | The MIT licence, which must stay with these files |
| `hero.jpg` | The hero image for this guide |

## Rules it follows

- Never report a scan as clean from memory or from a glance.
- Never publish a description, comment, post, or caption that still carries a placeholder.
- Keep one source file for the real links used by a channel and copy each link from that file.

## Licences

- MIT: see `LICENSE` in this folder, which must stay with these files.
