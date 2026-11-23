# Shamz Full-Packaging Mirror Checklist

The checklist that runs the moment a video goes live: full packaging, mirror to Instagram and TikTok, every
item verified live. Packaging is part of the upload task, not a follow-up.

A $shamz skill, part of the Shamz agent-skills collection.

![Shamz at the desk](hero.jpg)

## What it does

1. **Playlists the video** in episode order, **posts and pins the comment**, and **posts exactly one
   Community post** — never two.
2. **Verifies captions, thumbnails, and titles on the live surface**, and starts Test & Compare where the
   platform supports it.
3. **Mirrors the video to Instagram and TikTok** with the same caption.
4. **Re-checks everything live after publishing**, before reporting it done. Only then does it report
   "live and fully packaged".

## What you need

- The live video URL and its title, description, and thumbnail files
- The caption text for the mirrors
- Signed-in access to each destination, verified before you post

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
| `SKILL.md` | The checklist the agent follows |
| `README.md` | This how-to guide |
| `LICENSE` | MIT licence, which must stay with these files |
| `hero.jpg` | The hero image for this skill |

## Rules it follows

- Never report "live" and treat packaging as implied.
- One Community post per video, never two.
- Check the live surface before retrying anything that reported an error.
- Packaging begins the moment the upload completes. No other work interleaves between upload and packaging.
- The same caption goes to every mirror surface.
- The pre-publish half of this job — verifying every destination and its sign-in route before building
  anything — is the publish-preflight-check skill. This skill is the execution and verification checklist
  that follows it.

## Licences

- MIT: see `LICENSE` in this folder, which must stay with these files.
