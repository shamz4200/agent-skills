# Shamz A/B Render-Tool Comparison

A $shamz skill, part of the Shamz agent-skills collection. Compare two render or production tools on the same cut, with hashes, times, and a frame inspection, and let the human eye decide.

## What it does

1. Fixes one timed test cut and builds it in both tools.
2. Records content hashes, render time, and authoring time separately.
3. Frame-inspects both outputs at the same timestamps.
4. Records a verdict where picture quality overrules speed.

## What you need

- Two tools to compare, both able to build the same cut.
- Identical source material for both builds.
- A way to hash outputs and inspect frames.

## How a run works

1. Fix the test cut: same content, same timing, same length.
2. Build it in tool A, then in tool B. Record hashes and both times.
3. Frame-inspect both at the same timestamps.
4. Write up the verdict with the reason.

## Rules it follows

- Same cut, same content, same timing.
- Render time and authoring time stay separate.
- The eye overrules the stopwatch.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The method the agent follows |
| `README.md` | This how-to guide |

The MIT licence file ships with the skill at publish time.
