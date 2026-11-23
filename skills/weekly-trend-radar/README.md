# $shamz Weekly Trend Radar

A $shamz skill in the Shamz agent-skills collection. It scans your niches every week, grades what is actually accelerating, and leaves the raw evidence behind the brief so nothing has to be taken on trust.

## What it does

1. Scans each niche you track across short-form video, long-form video, and community discussion, in at least two regions.
2. Pulls each platform's trending feed as well, so big outside-niche movement is not missed.
3. Checks whether each trending endpoint is actually live, and falls back to keyword search plus cross-platform corroboration when one is down.
4. Saves the raw API responses for the run in a dated folder before any brief is written.
5. Grades each trend STRONG, MEDIUM, or WATCH, and writes a dated brief with evidence, why it matters, and one content angle per real trend.
6. Tracks the run's credit spend and remaining balance in the brief header.
7. Rotates a monthly creator teardown through your niches, and a monthly comment goldmine for what audiences are asking for.

## What you need

- A short list of niches with search terms per platform, kept in your workspace.
- Access to a social-data API for video and discussion search, with its key stored securely, never in the skill.
- A folder in your workspace for dated briefs and dated raw-response folders.

## How a run works

1. Run the scan for every niche, plus the trending feeds.
2. Save the raw responses in a dated folder, then write the compact summary.
3. Grade the trends, write the brief with counts, dates, spend, and the raw folder link, and file it.
4. Once a month, add the creator teardown for that month's niche and the comment goldmine.

## Rules it follows

- Public data only; never invent a count, a date, or a trend.
- A trend needs corroboration across sources before it is graded STRONG.
- Raw responses are saved before the brief is written, and never edited after.
- Spend is tracked every run; a jump without more niches stops the next run until it is explained.
- A one-off niche is labelled one-off and does not become standing by accident.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The pipeline the agent follows |
| `README.md` | This how-to guide |
