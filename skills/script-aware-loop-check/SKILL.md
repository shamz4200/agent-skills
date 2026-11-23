---
name: script-aware-loop-check
description: Catch repeated phrases in a narration transcript without flagging scripted repetition or numbers spoken in different forms.
---
# Script Aware Loop Check

## Normalize number forms before comparing

- Convert every digit token in a flagged transcript window to its spoken word form before you compare the phrase with the script.
- Compare the converted phrase against the script in that one normalized form, with script number words left as written.
- Treat a phrase as absent from the script only after the normalized comparison still finds no match.

## Distinguish a list from a loop

- Check whether each repeat of a flagged phrase carries a different payload, such as a different hour or price, and follows the script in order.
- Clear a flag only when the normalized phrase is in the script and each repeat matches a distinct script item in order.
- Fail a flag when the normalized phrase is absent from the script.
- Fail a flag when the normalized repeats form a tight cluster under 60 seconds with the same payload, even when the phrase is scripted, unless clip level evidence proves each repeat is a distinct scripted passage.

## Proceed on a proven false positive

- Prove a false positive with clip level evidence before you clear a clustered flag.
- Check each repeat against its own script passage and its own timestamp, and confirm the repeats are distinct passages rather than one passage re-read.
- Record the normalized phrase, the script match for each repeat, and the repeat timestamps with the cleared flag.
- Proceed with the build once the evidence proves the flag is a false positive, and do not ask the user to rule on a verified non error.
- Keep the flag as a fail when the evidence does not prove a false positive, and never clear a flag on a tool verdict alone.

## Report the normalized evidence

- Record the normalized phrase, its script match, and the repeat timestamps alongside the original suspect report.
- Keep the original suspect report with the episode record, and never discard it when a flag is cleared.
- Run the remaining final master checks unchanged, and never use a cleared list flag to skip another check.

## Alternatives for better results

- Run the loop check on the narration audio before assembly, so a true loop is caught before it reaches a final master.
- Keep a timed transcript with word timestamps for every episode, so a flagged phrase can be aligned to its script passage by time as well as by wording.
