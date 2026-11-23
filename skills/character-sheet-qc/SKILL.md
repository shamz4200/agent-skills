---
name: character-sheet-qc
description: Check every generated still and thumbnail against its locked character sheet before it is passed, narrated, or assembled.
---
# Character Sheet QC

## Lock the sheet before generation

- Retrieve the actual locked character sheet file for each character before any generation or quality check begins.
- Treat the locked sheet as the single source of truth for that character, and treat a sheet the user has locked as presented as canonical even when it differs from an earlier generic rule.
- Record the sheet path for each character in the build record before stills are generated, so later checks compare against a file and not against a remembered description.
- Never substitute a generated image for the sheet, and never use a wrong generation as a later reference.

## Inspect every still individually

- Inspect every still one by one, zoomed on face and body form and outfit, before any still is passed.
- Compare eyes, hair, skin tone, and key accessories against the sheet, and reject a still when any signature attribute differs.
- Compare body form and proportions against the sheet as a separate check, and reject a still when limbs, hands, or overall shape drift even when the face looks correct.
- Compare outfit colours, trim, patches, trousers, shoes, and accessories against the sheet, and reject a still when the outfit changes.
- Check every verb and prop against the outfit, and reject an impossible action such as rolling up sleeves on a sleeveless vest.

## Multi-timestamp clip eye check

- When QC-ing generated video clips, inspect frames at t=0/2/4/6/8/9 seconds, never t=0 only.
- This catches mid-clip morphs (eyes turning into spirals) a first-frame check misses.
- Proven on a Sage Mode episode: the check caught a scene-71 morph, v1 was rejected and v2 rebuilt from the clean still.

## Verify the still dimensions before you pass it

- Verify the delivery aspect ratio of every still with PIL before you pass it.
- For a 16:9 delivery, require width divided by height of 1.7778 within 0.01.
- For a 9:16 delivery, require width divided by height of 0.5625 within 0.01.
- Reject a still whose ratio falls outside tolerance and regenerate it at the correct ratio.
- Never crop a wrong ratio still to fit, and never send a wrong ratio still to animation.
- Record a user granted exception as an exception and not as a quality control pass, and keep the exception with the still record.

## Reject failures and recheck them

- Reject a failing still at the still stage, before animation or assembly, and generate a fresh still from the approved sheet instead of editing the failed file repeatedly.
- Mark every failed generation as noncanonical, and keep it out of later reference sets.
- Recheck each fixed still with the same individual zoomed inspection before it is accepted, and never carry a failed still forward as accepted as presented.
- Stop the block when any still fails its check, and do not narrate or assemble a block that contains a failed still.

## Report what you actually inspected

- State plainly which stills were personally zoom inspected and which were only worker reported, and never claim a full check when only a sample was checked.
- Never treat a contact sheet as a replacement for individual inspection, and list headline flags carried forward instead of hiding them in a pass.
- Deliver a still, block, or segment as a pass only after every still in it has passed its individual check.

## Alternatives for better results

- Build a per episode outfit and arm lock before stills begin, so one episode keeps one consistent outfit and arm system even when later episodes change them.
- Show a complete shot list with a shot by shot presence audit before stills begin, so framing and character presence problems are fixed at list stage rather than after generation.
