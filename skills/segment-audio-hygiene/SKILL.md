# Segment Audio Hygiene

## Re-encode to one common format

- Re-encode every narration chunk to the same sample rate, channel layout, and sample format before any concat step.

- Check each re-encoded chunk for samples pinned at the negative full scale limit before you use it.

- Reject any chunk that shows that pinned sample pattern and regenerate or re-encode it from its source instead of patching the assembled file.

- Keep the original chunk files until the assembled segment passes its audio checks.

## Cut at word ends with no gaps

- Cut narration at word ends measured from the timed transcript, never at a fixed duration grid.

- Join cuts with no added silence between words and no overlap at the join.

- Pad or trim each chunk to its exact beat boundary so the assembled timeline matches the narration timeline.

- Restore any intentional holds in the segment timeline after the audio join, rather than letting a gap hide inside the audio.

## Verify the assembled segment before delivery

- Measure the assembled narration duration against the expected beat total and reject a mismatch larger than a small tolerance.

- Scan the assembled file for bursts, clicks, and drift at the start, middle, and end before you present it.

- Confirm voice presence in the assembled mix with a transcript sample, so a silent or bed only mix cannot pass on duration alone.

- Rebuild from the chunk stage when a check fails, and do not present a segment that failed an audio check as a pass.

## Available connectors

- Use `muse.connector_search` to find other connectors and `muse.skill_search` to find related skills.

- If nothing here fits, look on the web for a maintained API or MCP server and set it up with [Custom Connectors and MCPs](/opt/muse/skills/custom-connector-setup/SKILL.md), or build a custom connector.

## Alternatives for better results

- Split long beats at sentence boundaries to keep each cut clean and each word end measurable.

- Lay one continuous narration track under concatenated video rather than slicing narration per clip and joining the slices.
