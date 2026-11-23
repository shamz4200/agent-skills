# $shamz Meme-Coin Intel Scan

A $shamz skill in the Shamz agent-skills collection. It scans meme culture first, then the token, then the trench, and reports a verdict-first answer to nine fixed questions. Education and intelligence only: it never recommends buying.

## What it does

1. Scouts culture first for newly accelerating memes, sounds, moments, and slang, prioritising acceleration over absolute size.
2. Checks tokens only for the strongest cultural candidates, using the contract address as the primary identifier.
3. Screens each qualifying token in the trench: wallet quality, holder distribution, developer history, bundling, liquidity, momentum, social validation, and manipulation.
4. Writes a verdict-first report with one signal block per qualifying signal, watch items, dedup notes, and answers to nine fixed questions.
5. Applies the no-signal rule honestly: if nothing genuinely early is developing, it says so.
6. Marks anything older than 7 days STALE, and restarts after dormancy with a fresh baseline scan.
7. Reviews weekly, counting reports first, naming any zero-scan gap, and escalating a long dormancy instead of backfilling it.

## What you need

- Public culture sources: trend and editorial feeds, news, social search, and short-form trend coverage.
- Public token-screening sources for the primary chain you track, plus launchpad and trending-token feeds.
- A folder in your workspace for dated scan reports and raw payloads, and a folder for weekly reviews.

## How a run works

1. Culture scout since the last scan, with recency validated per entry.
2. Token check for the strongest candidates, then a trench screen on the qualifiers.
3. Dedup against prior reports and any wider culture scan, then apply the no-signal rule.
4. Write the full report, file it dated, then deliver the verdict with names and tickers only.

## Rules it follows

- Culture first, tokens second; a token without a cultural leg is not a signal.
- Never fabricate an address, a price, a holder count, or a launch time. Unverifiable is UNVERIFIED, stated plainly.
- Never recommend buying; never present speculation as certainty.
- Contract addresses stay in reports only, never in chat summaries.
- A signal not rechecked within 7 days is STALE, and a zero-scan week is reported as zero-scan.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The pipeline the agent follows |
| `README.md` | This how-to guide |
