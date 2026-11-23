---
name: weekly-monetization-tracker
description: Track YouTube monetization progress weekly from a fresh Studio read, chart it, and log the history.
---

# $shamz Weekly Monetization Tracker

A $shamz weekly tracker for monetization progress across your channels. It takes a fresh read-only Studio read, charts progress against the thresholds, delivers a dated update stating its data vintage, and appends the numbers to a history log.

## When to use it

Use it once a week, on the same day each week. Deliver the chart and the numbers in the same run. A run is not finished until the history log is appended.

## Step 1: fresh read-only Studio read

- Sign in with your Google account, open the creator studio, and change nothing, upload nothing, and modify no settings. Read-only, always.
- For EACH channel you track, record: current subscriber count, qualified watch hours toward 4,000 (note the Earn tab's "as of" date), Shorts views toward 10M in 90 days, and fan-funding numbers (500 subscribers and 3,000 hours) if shown.
- From analytics for the last 28 days, record: subscriber change, views, watch hours, and click-through rate if shown at channel level.
- Return format per channel: subscribers, subscriber change over 28 days, qualified hours (365-day, Earn tab), hours over 28 days, views over 28 days, click-through rate over 28 days, Shorts views over 90 days, and the Earn-tab data date.
- A missing panel is reported as not shown, never guessed. A dash for a 28-day change is not a measured zero; chart it as zero only with a note that the studio showed a dash.
- Never invent numbers. Every figure comes from a live Studio read or from a dated, labelled fallback.
- If two-step verification blocks an unattended run, stop. Do not retry blindly and do not work around it. Report plainly that the next run needs $shamz to approve the sign-in on his phone.

## Step 2: build the chart

- Use your chart script for this tracker. Replace the data arrays with the fresh numbers. Update the title date line and the subtitle with the Earn-tab vintage and the analytics window.
- Keep the 3-panel layout: subscribers against 1,000; qualified hours against 4,000; Shorts views against 10M.
- Run it and save the chart to your workspace with a dated filename.
- Verify the chart file exists and the numbers printed on it match the Studio read. If they do not match, fix the script; do not deliver.

## Step 3: deliver

- Attach the chart.
- Short update: per-channel numbers with 28-day deltas, which channel is closest, the subscriber gap, and one concrete growth lever for the week, tied to that week's numbers.
- State the data vintage explicitly: the Earn-tab date plus the analytics window.
- Keep the update tight: chart, numbers, closest channel, gap, one lever, data vintage. No filler.
- Projections are linear extrapolations of the last 28 days: a floor estimate, not a ceiling. Say so.
- Never recommend buying subscribers or watch hours. It violates platform terms and risks the channels.
- Thresholds to chart against: 1,000 subscribers plus 4,000 qualified watch hours in 365 days, or 1,000 subscribers plus 10M valid Shorts views in 90 days, for the main partner programme; 500 subscribers plus 3,000 qualified hours for fan funding. Re-verify thresholds on official documentation before planning against a reported future change; a reported change that has not been read on an official page stays caveated, never presented as verified fact.

## Step 4: log it

- Append the numbers to your history log in the same run: date, source, and per-channel figures. Never edit a past entry; append corrections as new entries.
- Log the run to your goal tracker when it completes.
- A run that missed the history append has not finished. The state file and the checkpoint order below are the guard against that repeat.

## Fallback path

1. Say so plainly in the delivery: the live read failed and why.
2. Use the most recent VERIFIED scan from the history log.
3. Label the chart and the message as fallback, with the fallback data's date.
4. Never present fallback data as fresh. Never invent numbers to fill gaps.

## Restart-proof method for this tracker

- Keep a state file in your workspace, never in a temporary folder. It holds the last completed output (chart file and hash, numbers, log status), the next step, and the exact resume command. Update it at the end of every run, before ending the turn.
- Read the studio in segments, one channel at a time. Write each channel to a dated scan file as soon as it lands. On resume, skip verified channels and read only the missing ones.
- Write as you go: chart, scan file, history append, daily log, goal entry. Each is written when it lands, never held until the end.
- After a restart, read the state file first, check the scan file and the tail of the history log, resume the next incomplete step, then report status. Never re-read a channel already scanned, never report status before resuming.
