# Character Sheet QC

A $shamz skill in the Shamz agent-skills collection. It checks every generated still and thumbnail against its locked character sheet before it is passed, narrated, or assembled.

## What it does

1. Locks the character sheet as the single source of truth before generation begins.
2. Inspects every still individually, zoomed on face, body form, and outfit.
3. Checks generated video clips at multiple timestamps, not just the first frame.
4. Verifies each still's delivery aspect ratio before passing it.
5. Rejects failures at the still stage and rechecks every fix the same way.

## What you need

- The locked character sheet file for each character in the build.
- The generated stills and clips to inspect.
- The delivery aspect ratio for the episode.

## How a run works

Retrieve the locked sheet for each character and record its path in the build record. Inspect every still one by one against the sheet, then check clips frame by frame at several timestamps, then verify aspect ratios. Reject any failing still before animation or assembly, generate a fresh still from the approved sheet, and recheck it the same way. Only a block whose every still has passed its individual check is delivered as a pass.

## Rules it follows

- The locked sheet is the single source of truth; never substitute a generated image for the sheet.
- Never crop a wrong-ratio still to fit, and never send a wrong-ratio still to animation.
- A user-granted exception is recorded as an exception, not as a pass.
- Never claim a full check when only a sample was checked.
- A contact sheet never replaces individual inspection.

## What's in the folder

| File | What it is |
| --- | --- |
| SKILL.md | The skill: frontmatter plus the full rule list. |
| README.md | This overview: what the skill does and how a run works. |
