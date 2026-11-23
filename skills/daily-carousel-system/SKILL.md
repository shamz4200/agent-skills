---
name: daily-carousel-system
description: Build three carousel sets a day with a duplicate guard and live verification, then mirror them to a second surface.
---

# The $shamz Daily Carousel System

Build three carousel sets a day with a duplicate guard and live verification, then mirror them to a second surface. One shared skeleton, three variants: market carousels, wisdom carousels, and story carousels. Set the lane parameters below before any build.

## Parameters (set these before any build)

- **Surfaces:** the primary surface (image-first feed) and the mirror surface (community posts on the video channel). Verify the active channel before posting anything.
- **Brand kit:** the locked palette, typefaces, avatar or character art, footer format, and watermark for this lane.
- **Data feed (market lane):** the price feed to pull fresh numbers from — any exchange or market-data source, never a single hard-coded one.
- **Content pool (wisdom lane):** the rotating themes and the used-content log.
- **Story source (story lane):** the series the tales come from and its locked character sheet.

## Shared skeleton (all three variants)

1. **Build the day's three sets** from fresh inputs (fresh data, fresh content, or a fresh story — never yesterday's leftovers).
2. **QC each set before posting:** every slide at the locked size and decode-clean, copy exact with no typos, signature attributes correct, watermark or footer present.
3. **Duplicate guard:** check every line of content against the used-content log before building. Any line used within the locked window (30 days for the wisdom lane) is rejected and replaced; rejected drafts are recorded in the log header so they are not re-proposed.
4. **Post the three sets, staggered through the day** — one set at a time, in order, never all at once.
5. **Live verification per set:** step through the live post slide by slide, check the caption is exact, and confirm no duplicate or partial post is left live. A set that fails verification is held and reported, not re-posted blindly.
6. **Mirror to the second surface** (see the market lane below for the split; wisdom and story lanes mirror as their own second-surface posts where the lane defines them).
7. **Log the day:** every posted set, its live URL, its verification result, and its content go into the used-content log the same day. Built-but-unposted sets are day-stale and do not count as used — fresh content is built instead.

## Variant A — Market carousels

Three sets a day from fresh market data, seven slides each, at 1080×1350.

- **Data first:** pull the fresh market scan for the day and save the raw data with the run. Every number on every slide comes from closed bars, never forming bars. A close is a close; a wick is not a close.
- **Slide structure (seven slides):**
  1. Hook — asset and day label, the headline move in large type, one line of context with the exact close and the day's move.
  2. Setup chart — the asset against its key level, with the chart image and a source line.
  3. The break — rows of the day's key events, each with a label, a figure, and one sentence.
  4. The count — rows of streaks and ranges (consecutive closes below or above a level, highs and lows over the window).
  5. The lesson — the day's takeaway in large type with three numbered points.
  6. What to watch — rows of the next triggers, each a level and the close that would change the story.
  7. Closer — the open question in large type, the two levels that decide it, and the call to comment.
- **Third set:** the weekend or forward-looking playbook set — no macro prints on the weekend, the next prints and decisions dated, same seven-slide structure.
- **Character art:** the character stays full-body in the hook and closer frames, positioned so the face clears the title and text zones. Re-verify at full size from observed face positions before the QC pass.
- **Staggered drops:** the three sets drop through the day, not together.
- **Mirror:** each set is mirrored to the video channel's Community posts in a 5+2 slide split — five slides in the first post, two in the second — six Community posts per day. Verify each mirror post live the same way as the primary post.

## Variant B — Wisdom carousels

Three sets a day, five slides each, at 1080×1350, rotating themes: Quote, Koan, Poem (plus Gratitude and Mindfulness in the rotation where the lane uses them).

- **Template:** category label plus thin rule, avatar circle with a soft glow ring, large serif quote, small accent reflection line, deep gradient background, footer with the creator mark and slide position. No emojis in slide images.
- **Slide structure (five slides):** hook line plus theme line; three middle slides carrying the quote, story, or poem; closer with the follow line.
- **Used-content log:** no content repeats within 30 days. Before building, check every line against the log; rejected drafts are recorded in the day's build header. Built-but-unposted sets do not count as used.
- **Purity check (the exact rules, as recorded in the used-content log):** after posting, each set passes only when all three hold — (1) a uniform category label across all slides in the set, (2) slides 1–5 in order, verified by stepping through the live post, and (3) the caption exact. No post deleted or re-posted. No additional scripted purity rules were found in the build scripts — these three checks are the complete verified rule set.
- **Channel-switch verification:** before posting anything, confirm the active channel is the intended one. If the session opens on the wrong channel, switch first and re-verify. Never post to a channel based on a guess.
- **Posting note:** if sign-in fails at the password step, do not guess or retry the password (lockout risk). Leave the session as it is, report the block, and retry only after sign-in is restored — the creator signing in personally, or a corrected credential — with the active channel re-verified before posting.

## Variant C — Story carousels

Three sets a day, seven slides at 1080×1350: hook, four story beats, wisdom line, closer.

- **Slide structure:** slide 1 is the series tag plus tale title over art. Slides 2–5 carry the tale, one beat per slide. Slide 6 is the wisdom line with a gold accent. Slide 7 is the closer plus the creator watermark.
- **Hook rules:** the central character is the central figure of every hook slide, no exceptions. Every hook shows a fresh pose and composition; never repeat a pose across the day's three sets or reuse a recent hook pose. A hook without the central character fails QC and that set is held for the creator's call — presented, not auto-posted.
- **Text:** render all text over the art or backgrounds, never baked into generations.
- **QC before posting:** all seven slides at the locked size and decode-clean, signature attributes correct, copy exact with no typos and no em dashes, watermark on the closer.
- **No music:** carousels post without music. Only the native mobile app can add music during creation; do not attempt any music step.
- **Closers** point at the latest live episode.

## What this system does not do

- It does not re-post a failed set blindly, guess a password, or post to an unverified channel.
- It does not count built-but-unposted sets as used content.
- It does not invent numbers: every market figure comes from the day's fresh scan of closed bars.
