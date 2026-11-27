# Disk Quota Guard

## Detect the quota failure directly

- Treat the exact error text Disk quota exceeded or EDQUOT as a quota failure, and do not treat a df free space reading as proof that writes will succeed.

- Test with a small write when a build fails on a write, and record whether the test write succeeds or fails before you retry the build.

- Write the test file under ~/workspace, never under /tmp, and delete the test file after the check so the check itself does not add pressure.

- Record the usage at failure, the df reading, and the test write result in the build state file, so the next worker sees the wall instead of rederiving it.

## Stop the stalled work before you retry it

- Stop the stalled build at once when the test write fails, and do not restart the same write in a loop while the quota wall stands.

- Tell the user plainly that the home quota is reached, name the usage and the df reading, and name what must be freed before work can resume.

- Keep the last verified checkpoint and the state file intact, and resume only from that checkpoint after writes succeed again.

## Free space safely and resume

- Read the keep lock list before deleting anything, and never delete a locked path even when disk pressure is high.

- Delete only regenerable intermediates, duplicate finals, and old review copies, and keep character sheets, scripts, rules, voices, narration, and trading material.

- Free space in small verified steps, retest with a small write after each step, and start the build again only after the test write passes.

- If no safe space can be freed, leave the files in place, report the exact shortfall, and wait for the user to choose what goes.

## Available connectors

- Use `muse.connector_search` to find other connectors and `muse.skill_search` to find related skills.

- If nothing here fits, look on the web for a maintained API or MCP server and set it up with [Custom Connectors and MCPs](/opt/muse/skills/custom-connector-setup/SKILL.md), or build a custom connector.

## Alternatives for better results

- Check the quota with a small test write before starting a long build, so a build never discovers the wall hours into an encode.

- Clean regenerable intermediates before a long build when usage is already near the known wall, instead of waiting for a write to fail mid build.
