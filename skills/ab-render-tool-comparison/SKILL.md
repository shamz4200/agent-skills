---
name: ab-render-tool-comparison
description: Compare two render or production tools fairly: same cut twice, hashes, times, frame inspection, human eye overrules speed.
---

# Shamz A/B Render-Tool Comparison

A $shamz skill, part of the Shamz agent-skills collection at github.com/shamz4200/agent-skills. When two tools could do the same job, compare them on the same work and let the human eye overrule measured speed.

Use it before committing a pipeline to a new render or production tool.

## Pick the two tools

- Name the two tools and what each would replace. Any two tools: a code renderer against an editor, one engine against another, a new tool against the current one.
- Fix the test cut first: one timed cut, identical content, identical length, identical source material for both.

## Build the same cut twice

- Build the cut in tool A, then build the exact same cut in tool B. Same content, same timing, same length.
- Record the content hash of each output, so you know the two cuts really match.
- Record render time and authoring time separately. A fast render with slow authoring is not a fast tool.

## Inspect both

- Frame-inspect both outputs. Look at the same timestamps in each.
- Judge picture quality, motion, and artefacts by eye. The human eye verdict overrules measured speed: a faster tool that looks worse loses.
- Note what each tool could not do, not just what it did.

## Record the verdict

- Write the comparison up: hashes, both times, frame-inspection notes, and the verdict with the reason.
- Keep the report with the project so the decision is not re-litigated from memory.

## Rules it follows

- Same cut, same content, same timing. A comparison built on different cuts proves nothing.
- Render time and authoring time are separate numbers. Never merge them.
- The eye overrules the stopwatch.
