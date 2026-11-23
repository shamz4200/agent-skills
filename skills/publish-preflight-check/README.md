# Shamz Publish Preflight Check

Verify every publishing destination and its sign-in route before building any packaging, mirror, or
carousel set. A set is only ever built for a destination that has already verified.

![Pointing fist](hero.jpg)

## What it does

1. **Lists every destination** with its ordered account handle and its route: browser session, API token,
   or CLI account id.
2. **Reads the signed-in handle on the live account surface**, or compares the token or account id, before
   building the set.
3. **Checks the standing reauth rule** and uses a fresh web-flow link for any YouTube reauth.
4. **Stops building for a mismatched destination at once** and parks the work as ready but blocked.
5. **Resumes only after a fresh live read shows the ordered handle**, rechecked just before publishing.

## How a run works

List the destinations and their routes and record the ordered handle for each in the run note. Verify each
sign-in on the live surface before building anything. Build only for destinations that verify. Park any
mismatched destination as ready but blocked, report the ordered and actual handles, and resume only after a
fresh live read shows the ordered handle, with one more check just before the publish step.

## What you need

- The ordered account handle for every destination.
- The route for each destination: browser session, API token, or CLI account id.
- The standing reauth rule for YouTube.

## Install

From the folder you want to work in, give your agent the prompt in
[SETUP_PROMPT.md](../../SETUP_PROMPT.md), or run the installer yourself:

```bash
git clone --depth 1 https://github.com/shamz4200/agent-skills /tmp/agent-skills
bash /tmp/agent-skills/install.sh .
```

Then start your agent from that folder and ask it to use the publish preflight check skill.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The check the agent follows |
| `README.md` | This how-to guide |
| `LICENSE` | The MIT licence, which must stay with these files |
| `hero.jpg` | The hero image for this guide |

## Rules it follows

- Each destination is checked separately: one signed-in session can be right for one channel and wrong for
  another.
- Never build packaging for a destination whose handle does not match.
- Never reuse a spent OAuth link; a rejected flow means a fresh web-flow link.
- Work built for a blocked destination stays ready but blocked, never packaged or live.
- A CLI destination that posts by account id skips the browser sign-in check.

## Licences

- MIT: see `LICENSE` in this folder, which must stay with these files.
