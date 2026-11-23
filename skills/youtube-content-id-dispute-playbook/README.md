# Shamz Content ID Dispute Playbook

A $shamz skill, part of the Shamz agent-skills collection. A Content ID claim on original work gets a dispute filed under Original content, verified live, and tracked to expiry.

## What it does

1. Confirms the channel and that the work is original.
2. Files the dispute under 'Original content' with the exact approved text.
3. Verifies 'Dispute under review' live, with the expiry date.
4. Tracks the 30-day clock and records the publish-or-hold decision.

## What you need

- Access to YouTube Studio on the right channel.
- The exact approved dispute text.
- The claim details: claimant, video ID, and expiry date once filed.

## How a run works

1. Confirm the channel in the Studio switcher.
2. File the dispute under 'Original content' with the approved text.
3. Check the live status reads 'Dispute under review' with an expiry date.
4. Record the claim, the decision, and the expiry date.

## Rules it follows

- Dispute reason is always 'Original content'.
- Verify the review live; a submitted form is not proof.
- Restrictions are suspended while under review.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The playbook the agent follows |
| `README.md` | This how-to guide |

The MIT licence file ships with the skill at publish time.
