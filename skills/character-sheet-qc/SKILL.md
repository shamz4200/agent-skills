# Character Sheet Quality Control

## Lock the sheet before generation

- Retrieve the actual locked character sheet file for each character before any generation or quality check begins.

- Treat the locked sheet as the single source of truth for that character, and treat a sheet the user has locked as presented as canonical even when it differs from an earlier generic rule.

- Record the sheet path for each character in the build record before stills are generated, so later checks compare against a file and not against a remembered description.

- Never substitute a generated image for the sheet, and never use a wrong generation as a later reference.

## Inspect every still individually

- Inspect every still one by one, zoomed on face and body form and outfit, before any still is passed.

- Compare eyes, hair, skin tone, and key accessories against the sheet, and reject a still when any signature attribute differs.

## Eye check — SHARINGAN, EXACTLY LIKE $SHAMZ'S PHOTO (locked 2026-11-23 ~22:35 GMT, $shamz: "Yes that's perfect")

- The eyes must be EXACTLY like $shamz's own reference photo (sent 22:33 GMT): BIG, ROUND, WIDE OPEN. Full circle red iris. Three small black COMMA tomoe (curved teardrops, NOT dots, NOT circles) arranged around the centre. Small black pupil in the centre. Small white highlight dot near the top of the red iris. White sclera surrounding the red iris on all sides.
- PASS = all six elements present with comma tomoe. FAIL if ANY of these: thin red slits that read as closed eyes; plain flat red with no tomoe and no eye shape; round DOT tomoe (ladybug/target look); half-oval iris with no white, no pupil, no highlight.
- REFERENCE: ~/workspace/user/files/FEF2999F-EB6C-4DBF-A429-91CD5CDEC1F7-photo-8659D74D-F723-4DC0-B629-1917F5A7ABA9.jpg, eye band crop at ~/workspace/shamz-tv/verify-v3/fix4/shamz-eyes-reference.jpg. This SUPERSEDES the sheet-neutral-eye standard — the sheet's neutral eye is narrow half-lidded with a half-oval iris; $shamz's photo is the law for the eyes. The sheet remains the law for everything else (face, hair, skin, tattoos, outfit). The old "wide-open round discs" FAIL criterion is VOID.
- Prompt wording (use this verbatim in every generation prompt): "eyes exactly like the reference photo, Sharingan style: big round wide-open eyes, full circle red irises, three small black comma-shaped tomoe inside each red iris, small black pupil in the centre, small white highlight dot near the top of the iris, white sclera surrounding the red iris on all sides".
- NEVER use "plain solid flat red" or "no tomoe" or "no dots" in the prompt — that wording produces the thin-slit slop that failed. NEVER use the sheet's neutral eye crop as an edit reference — it produced full-circle irises with big round DOT tomoe, which $shamz rejected (2026-11-23 ~22:14 GMT). NEVER use #29 as the eye reference — #29 has solid red eyes with no tomoe, and edits copied from it only made the red 2px taller (2026-11-23 ~22:26 GMT).
- PROVEN FIX METHOD (verified on #30 still-01, approved by $shamz): media.generate_image EDIT, canvas = current still, reference = the eye band crop from $shamz's photo at ~/workspace/shamz-tv/verify-v3/fix4/shamz-eyes-reference.jpg, instruction: "Replace only the eyes in the first image with the exact eyes from the second image. Copy them precisely: the eyes are big, round, and wide open. The white sclera surrounds the red iris on all sides. The red iris is a full circle. Inside the red iris are three small black comma shapes, curved like tiny teardrops, arranged around the centre. They are commas, not circles, not dots. There is a small black pupil in the centre of the red iris. There is a small white highlight dot near the top of the red iris. Change only the eyes. Keep everything else in the first image exactly the same."
- Verify on a ZOOMED FACE CROP, not at full-image scale, and compare side by side against $shamz's photo eyes at the same scale. Red alone is NOT a pass. SHOW ONE STILL TO $SHAMZ BEFORE APPLYING THE FIX ANYWHERE ELSE.
- Sideways glances produce white sclera — add "eyes looking straight ahead at the viewer" / "facing the camera directly" to the prompt for front-facing shots.
- Stubborn poses (arms-raised, hand-on-chin, pointing) couple with thin slits. After repeated failures, change route: edit-with-reference using $shamz's photo eye band (above) or change the pose. Do not keep regenerating the same prompt.

## Body proportion check (added 2026-11-23 after $shamz flagged #27)

- Body proportion matches the sheet: normal adult male, about 7 to 7.5 heads tall, head roughly 1/7.5 of total height, shoulders about 2 head-widths wide, legs about half the total height. NOT chibi, NOT big-head-short-body, NOT stocky/squat.
- FAIL if: head ~1/5 of height or larger, body short and stocky, legs short — the character reads as a chibi.
- Prompt wording (add to every generation prompt): "normal adult male body proportions, about 7.5 heads tall, head is one seventh of total height, long legs about half the total height, NOT chibi, NOT big head, NOT short stocky body". The generator drifts to chibi/big-head proportions unless the prompt pins the adult proportion.
- A still fails if EITHER the eyes fail OR the body proportion fails.

- Compare body form and proportions against the sheet as a separate check, and reject a still when limbs, hands, or overall shape drift even when the face looks correct.

- Compare outfit colours, trim, patches, trousers, shoes, and accessories against the sheet, and reject a still when the outfit changes.

- Check every verb and prop against the outfit, and reject an impossible action such as rolling up sleeves on a sleeveless vest.

## Verify the still dimensions before you pass it

- Verify the delivery aspect ratio of every still with PIL before you pass it.

- For a 16:9 delivery, require width divided by height of 1.7778 within 0.01.

- For a 9:16 delivery, require width divided by height of 0.5625 within 0.01.

- Reject a still whose ratio falls outside tolerance and regenerate it at the correct ratio.

- Generate at the exact delivery ratio in the first place: a 16:9 generation centre-cropped to a 1.565 target (720x460) clips the hands at the edges (seen on #30 still-01 v1, 2026-11-23 — the shrug hands were cut). Ask for the target ratio in the prompt (e.g. "aspect ratio about 1.56 to 1") and keep hands fully inside the frame with space around them.

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

## Available connectors

- Use `muse.connector_search` to find other connectors and `muse.skill_search` to find related skills.

- If nothing here fits, look on the web for a maintained API or MCP server and set it up with [Custom Connectors and MCPs](/opt/muse/skills/custom-connector-setup/SKILL.md), or build a custom connector.

## Alternatives for better results

- Build a per episode outfit and arm lock before stills begin, so one episode keeps one consistent outfit and arm system even when later episodes change them.

- Show a complete shot list with a shot by shot presence audit before stills begin, so framing and character presence problems are fixed at list stage rather than after generation.
