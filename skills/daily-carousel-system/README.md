# The $shamz Daily Carousel System

A $shamz skill in the Shamz agent-skills collection. Build three carousel sets a day — market, wisdom, or story — with a duplicate guard and live verification, then mirror them to a second surface.

## What it does

1. **Builds three sets a day from fresh inputs.** Fresh market data, fresh wisdom content, or a fresh story — never yesterday's leftovers.
2. **Runs the duplicate guard.** Every line is checked against the used-content log before building; anything used inside the window is rejected and replaced.
3. **QCs each set before posting.** Locked size, decode-clean slides, exact copy, signature attributes correct, watermark or footer present.
4. **Posts the three sets staggered through the day.** One set at a time, in order, with the active channel verified before anything posts.
5. **Verifies every set live.** Stepping through the live post slide by slide, caption checked exact, no duplicate or partial post left live.
6. **Mirrors to a second surface.** Market sets mirror as Community posts in a 5+2 slide split — six posts a day.
7. **Logs the day.** Posted sets, live URLs, verification results, and content all go into the used-content log the same day.

## What you need

- The lane parameters: primary surface, mirror surface, brand kit, and (for the market lane) a fresh price feed
- The used-content log for the duplicate guard
- The locked character sheet (story lane) or character art (market lane)
- The day's fresh market scan (market lane) or the rotating theme schedule (wisdom lane)
- A verified sign-in on the posting channel — never post to an unverified channel

## How a run works

1. Pull the day's fresh inputs and check every line against the used-content log.
2. Build the three sets in the lane's slide structure and QC each one.
3. Post the sets staggered through the day, verifying the active channel first.
4. Step through each live post slide by slide, check the caption, and run the lane's purity check.
5. Mirror the sets to the second surface and verify the mirrors live.
6. Log the day: sets, URLs, verification results, and content. Built-but-unposted sets do not count as used.

## Rules it follows

- Three sets a day, staggered — never all at once.
- No repeats inside the log window. Rejected drafts are recorded so they are not re-proposed.
- A hook without the central character fails QC and the set is held (story lane).
- All text is rendered over art, never baked into generations (story lane).
- Carousels post without music.
- If sign-in fails, never guess or retry a password — report the block and retry only after sign-in is restored.
- A set that fails live verification is held and reported, not re-posted blindly.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The pipeline the agent follows |
| `README.md` | This how-to guide |
