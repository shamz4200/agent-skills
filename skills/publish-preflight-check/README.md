# Publish Preflight Check

A $shamz skill in the Shamz agent-skills collection. It verifies every publishing destination and its sign-in route before any packaging, mirror, or carousel set is built.

## What it does

1. Lists every destination with its ordered account handle and its route: browser session, API token, or CLI account id.
2. Reads the signed-in handle on the live account surface, or compares the token or account id, before building the set.
3. Checks the standing reauth rule and uses a fresh web-flow link for any YouTube reauth.
4. Stops building for a mismatched destination at once and parks the work as ready but blocked.
5. Resumes only after a fresh live read shows the ordered handle, rechecked just before publishing.

## What you need

- The ordered account handle for every destination.
- The route for each destination: browser session, API token, or CLI account id.
- The standing reauth rule for YouTube.

## How a run works

List the destinations and their routes and record the ordered handle for each in the run note. Verify each sign-in on the live surface before building anything. Build only for destinations that verify. Park any mismatched destination as ready but blocked, report the ordered and actual handles, and resume only after a fresh live read shows the ordered handle, with one more check just before the publish step.

## Rules it follows

- Each destination is checked separately: one signed-in session can be right for one channel and wrong for another.
- Never build packaging for a destination whose handle does not match.
- Never reuse a spent OAuth link; a rejected flow means a fresh web-flow link.
- Work built for a blocked destination stays ready but blocked, never packaged or live.
- A CLI destination that posts by account id skips the browser sign-in check.

## What's in the folder

| File | What it is |
| --- | --- |
| SKILL.md | The skill: frontmatter plus the full rule list. |
| README.md | This overview: what the skill does and how a run works. |
