# Segment Audio Hygiene

A $shamz skill in the Shamz agent-skills collection. It assembles multi-chunk narration without DC bursts, drift, or gaps, for any video segment built from separate narration files.

## What it does

1. Re-encodes every narration chunk to one common sample rate, channel layout, and sample format.
2. Rejects any chunk showing samples pinned at the negative full scale limit.
3. Cuts narration at word ends measured from the timed transcript.
4. Joins cuts with no added silence and no overlap, padded or trimmed to exact beat boundaries.
5. Verifies the assembled segment's duration, bursts, clicks, drift, and voice presence before delivery.

## What you need

- The narration chunk files and their timed transcript.
- The expected beat total for the assembled segment.
- The original chunk files, kept until the assembled segment passes.

## How a run works

Re-encode all chunks to one common format and reject any chunk with the pinned-sample pattern. Cut at word ends from the timed transcript, join with no gaps or overlap, and pad or trim each chunk to its exact beat boundary, restoring intentional holds in the timeline after the join. Measure the assembled duration against the expected beat total, scan the start, middle, and end for bursts, clicks, and drift, and confirm voice presence with a transcript sample. Rebuild from the chunk stage when a check fails.

## Rules it follows

- Never cut at a fixed duration grid; cut at word ends.
- Never patch the assembled file when a chunk is bad; regenerate or re-encode the chunk from its source.
- Never present a segment that failed an audio check as a pass.
- Split long beats at sentence boundaries to keep each cut clean.

## What's in the folder

| File | What it is |
| --- | --- |
| SKILL.md | The skill: frontmatter plus the full rule list. |
| README.md | This overview: what the skill does and how a run works. |
