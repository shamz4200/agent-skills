---
name: packaging-placeholder-scan
description: Scan every packaging text for unresolved template placeholders before it goes live.
---
# Packaging Placeholder Scan

## Collect every packaging text

- Collect the exact description file, pinned comment text, community post text, carousel caption, and title variants for the episode before any upload begins.
- Use the exact files that will publish, not a draft or a summary, so the scan sees what the audience will see.
- Record the file path for each text in the run note before you scan it.

## Scan for bracketed placeholders

- Search every collected text for an opening square bracket and read each bracketed token in full.
- Treat any bracketed token in all capitals as a placeholder, including link tokens such as [PRIMARY FUNNEL LINK] and [COMMUNITY LINK].
- Treat [TODO], [INSERT], [LINK], and any other bracketed instruction as a placeholder even when it looks short or harmless.
- Record the scan result as zero hits or list every hit with its file and line, and never report a scan as clean from memory or from a glance.

## Fix and rescan before publishing

- Replace each hit with the real link or real text from its source, or delete the line when no real value exists for it.
- Run the same bracket search again after every fix and confirm zero hits before the upload or post step starts.
- Hold any packaging item that still has a hit, and never publish a description, comment, post, or caption that still carries a placeholder.
- Read the live description and pinned comment after upload and fix at once any placeholder the pre publish scan missed.

## Alternatives for better results

- Keep one source file for the real links used by a channel and copy each link from that file, so a template never ships with its placeholder still in place.
