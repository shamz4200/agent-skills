# The $shamz Daily Carousel System

Build three carousel sets a day — market, wisdom, or story — with a duplicate guard and live verification,
then mirror them to a second surface. One shared skeleton, three variants.

A $shamz skill, part of the Shamz agent-skills collection.

![Shamz, golden hour](hero.jpg)

## What it does

1. **Builds three sets a day from fresh inputs.** Fresh market data, fresh wisdom content, or a fresh story —
   never yesterday's leftovers.
2. **Runs the duplicate guard.** Every line is checked against the used-content log before building; anything
   used inside the window is rejected and replaced.
3. **QCs each set before posting.** Locked size, decode-clean slides, exact copy, signature attributes correct,
   watermark or footer present.
4. **Posts the three sets staggered through the day.** One set at a time, in order, with the active channel
   verified before anything posts.
5. **Verifies every set live.** Stepping through the live post slide by slide, caption checked exact, no
   duplicate or partial post left live.
6. **Mirrors to a second surface.** Market sets mirror as Community posts in a 5+2 slide split — six posts a day.
7. **Logs the day.** Posted sets, live URLs, verification results, and content all go into the used-content log
   the same day.

## The three lanes

- **Market:** three sets a day from fresh market data, seven slides each at 1080x1350. Every number comes from
  closed bars, never forming bars. Hook, setup chart, the break, the count, the lesson, what to watch, closer.
- **Wisdom:** three sets a day, five slides each at 1080x1350, rotating themes (Quote, Koan, Poem, plus
  Gratitude and Mindfulness where the lane uses them). No content repeats within 30 days.
- **Story:** three sets a day, seven slides at 1080x1350: hook, four story beats, wisdom line, closer. The
  central character is the central figure of every hook slide, no exceptions, and all text is rendered over
  the art, never baked into generations.

## What you need

- The lane parameters: primary surface, mirror surface, brand kit, and (for the market lane) a fresh price feed
- The used-content log for the duplicate guard
- The locked character sheet (story lane) or character art (market lane)
- The day's fresh market scan (market lane) or the rotating theme schedule (wisdom lane)
- A verified sign-in on the posting channel — never post to an unverified channel

## Install

From the folder you want to work in, give your agent the prompt in
[SETUP_PROMPT.md](../../SETUP_PROMPT.md), or run the installer yourself:

```bash
git clone --depth 1 https://github.com/shamz4200/agent-skills /tmp/agent-skills
bash /tmp/agent-skills/install.sh .
```

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The pipeline the agent follows |
| `README.md` | This how-to guide |
| `LICENSE` | MIT licence, which must stay with these files |
| `hero.jpg` | The hero image for this skill |

## Rules it follows

- Three sets a day, staggered — never all at once.
- No repeats inside the log window. Rejected drafts are recorded so they are not re-proposed.
- A hook without the central character fails QC and the set is held (story lane).
- All text is rendered over art, never baked into generations (story lane).
- Carousels post without music.
- If sign-in fails, never guess or retry a password — report the block and retry only after sign-in is restored.
- A set that fails live verification is held and reported, not re-posted blindly.

## Licences

- MIT: see `LICENSE` in this folder, which must stay with these files.
