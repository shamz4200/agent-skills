---
name: weekly-trend-radar
description: Scan multiple niches weekly for trends, grade the evidence, and save the raw responses with the brief.
---

# $shamz Weekly Trend Radar

A $shamz weekly scan across your niches. It finds what is accelerating right now, grades how strong the evidence is, and saves the raw responses so any claim in the brief can be checked later.

## When to use it

Use it once a week, on the same day each week, for every niche you track. Add a one-off niche only for a genuine launch-week event, and say so in the brief; do not let a one-off become a standing niche by accident.

## Set up your niche list

- Keep one short list of niches, each with the search terms you will use for it on each platform.
- Keep the list in your workspace, next to the briefs. Change it only on $shamz's word, and note the change and its date in the next brief.
- A niche is a topic area, not a creator. Do not build the scan around named creators.

## Run the scan

1. For each niche, query short-form video search, long-form video search, and community discussion search for that niche's terms. Cover at least two regions where your audience lives.
2. Also pull each platform's trending feed for the week, so you see what is big outside your niches.
3. Before trusting a trending-endpoint result, check that the endpoint is actually live. If a hashtag, song, or trending endpoint is down or returns nothing, do not treat the empty result as "nothing is trending". Fall back to keyword search on the same platform plus corroboration from the other platforms, and note the fallback in the brief. Re-check the endpoint before the next run; do not assume it is back.
4. For each candidate item, record the text or title, the author or channel, the view or play count, the like count, the date, and the link. Keep only the top items per query, sorted by views.
5. Track the cost of the run: credits spent this run and credits remaining, from the API response. Store your API key securely, never in the skill, never in a brief, and never in a raw file. Log spend and balance in the brief header so a runaway run is visible at once.

## Save the raw responses

- Save the raw API responses for the run in a dated folder under your workspace, one file per query, before you write the brief.
- Save a compact summary of the top items alongside the raw files, so the brief can be rebuilt without re-running the scan.
- Never edit a saved raw file after the run. If a later check corrects a number, note the correction in the next brief, not by rewriting the raw file.

## Grade the evidence and write the brief

- Grade every trend STRONG, MEDIUM, or WATCH:
  - STRONG: the same signal appears across at least two independent platforms, with fresh items in the last few days and large, fast-growing counts.
  - MEDIUM: the signal is clear on one platform with corroboration elsewhere, or strong counts but older items.
  - WATCH: interesting but thin, old, or evergreen rather than new. Do not act on a WATCH item; note it and re-check it next week.
- For each STRONG or MEDIUM trend, write: what it is, the evidence (with counts and dates), why it matters to your channels, and one concrete content angle.
- Add a short "watch, don't act yet" section for WATCH items and seasonal items that are not due yet.
- Add a caveats section: which endpoints were down or substituted, which feeds were mostly noise, and that public counts are directional unless repeated across sources.
- Date the brief, state the spend and balance, and link the raw folder. Do not reuse last week's trends as current facts; re-run the scan for current numbers.

## Monthly creator teardown

Once a month, rotate to one niche and do a deeper teardown of one creator in that niche:

1. Pick a creator who is winning in that niche this month, not a favourite from an earlier month.
2. Pull their recent videos, their best-performing formats, their posting rhythm, and what their audience repeats in comments.
3. Write what is stealable (format, hook, cadence) and what is specific to them and not transferable. Keep it to one page.
4. File it with the briefs, dated, and note the next niche in the rotation.

## Monthly comment goldmine

Once a month, mine comments across your niches for what the audience is asking for:

1. Pull top comments from the week's highest-performing items in each niche.
2. Group them by the question, complaint, or request underneath the wording, not by the exact phrase.
3. Report the strongest groups with example wording and counts, and one content angle per group.
4. File it with the briefs, dated. Do not quote a commenter's handle in the brief unless it is needed to check the source.

## Rules

- Public data only. Never invent a count, a date, or a trend.
- A trend is not real until it is repeated across sources. One platform alone is a lead, not a finding.
- Save raw first, brief second. A brief with no raw folder behind it is unverified.
- Track spend every run. If spend jumps without more niches, stop and find out why before the next run.
- Never present a previous week's brief as this week's picture.
