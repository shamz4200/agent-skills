# The $shamz Study-a-Video

Turn one sent video or post into a structured study: verified stats, outlier verdict, and a transferable
lesson. What was verified stays separate from what the creator merely claims.

![Shamz with a headset, thinking](hero.jpg)

## What it does

1. **Searches memory first.** Checks for the video ID or title and any related prior studies before answering.
2. **Fetches the basics.** Public embed data for title and channel, plus the thumbnail, read in plain words:
   text, hero, colours, layout, implied hook.
3. **Delegates read-only browser research.** A self-contained brief asking only for what was observed: stats,
   description, chapters, claims in order, top comments, outlier check, hook analysis, sponsors and funnels,
   uncertainties.
4. **Writes the study, verdict first.** Outlier verdict, what it actually teaches, verified-vs-creator-claim
   split, comments, title vs thumbnail, transferable lesson, limitations.
5. **Logs the study.** Video ID, URL, observed stats, outlier verdict, and transfer verdict in the creator's
   notes.
6. **Covers posts too.** The short-form post variant adds an author baseline check, bookmark-to-like ratio,
   and a kill-list check.
7. **Mines comments honestly.** The comment-goldmine method excludes the creator's own accounts, states
   confidence by sample size, and keeps quoted comments verbatim.

## What you need

- A video link or post sent by the creator
- Memory access for prior studies of the same video, channel, or claim
- A read-only browser research route (no likes, subscribes, or comments)
- The creator's kill-list, for the short-form post variant's claim check

## How a run works

1. Acknowledge the study, then search memory for the video and related prior studies.
2. Fetch the embed data and thumbnail, and record the thumbnail read.
3. Send the read-only browser brief and wait for the report.
4. Write the study in the creator's voice: verdict first, outlier verdict, teachings, verified-vs-claim
   split, comments, title vs thumbnail, transfer, limitations.
5. Log the study with its stats and verdicts. No rule is folded without explicit approval.

## Install

From the folder you want to work in, give your agent the prompt in
[SETUP_PROMPT.md](../../SETUP_PROMPT.md), or run the installer yourself:

```bash
git clone --depth 1 https://github.com/shamz4200/agent-skills /tmp/agent-skills
bash /tmp/agent-skills/install.sh .
```

Then start your agent from that folder and send it the video or post to study.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The pipeline the agent follows |
| `README.md` | This how-to guide |
| `LICENSE` | MIT licence, which must stay with these files |
| `hero.jpg` | The hero image for this guide |

## Rules it follows

- The browser task never likes, subscribes, comments, or interacts.
- Never transcribe the full narration. Summarise it.
- Never upgrade a creator-reported claim to confirmed without a primary or corroborating source.
- Uncertainties are stated plainly, never smoothed over.
- Competitor comments are a proxy for niche demand, never proof the creator's own viewers want the same
  thing.
- Quoted comments stay verbatim: slang, spelling, and capitals included.

## Licences

- MIT: see `LICENSE` in this folder, which must stay with these files.
