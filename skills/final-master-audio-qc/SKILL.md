---
name: final-master-audio-qc
description: Upmix mono narration to stereo before the mux, measure both channels separately, and scan the exact final file for silent gaps.
---
# Final Master Audio QC

## Upmix mono narration to stereo before the mux

- Duplicate mono narration to both channels explicitly when you build the final mix, never rely on a default mapping to place it.
- Measure left and right mean volume separately on the exact final file and require both channels to carry voice.
- Reject a file where one channel is near silence while the other carries voice, even when integrated loudness passes.

## Scan the exact final file for silent gaps

- Run a silence detector on the exact final file and list every silent gap with its start time and duration.
- Flag any gap longer than about 2 seconds that is not an intentional silent end card.
- Compare each narration chunk duration with its slot and stretch or regenerate a chunk that is much shorter than its slot, never leave the shortfall as silence.
- Run both checks again after any re-render, because a new render voids the earlier report.

## Treat overall loudness as insufficient alone

- Record per-channel means and the longest unintended gap beside the loudness reading in the QC report.
- Block approval and upload when either check fails, and fix the mix at its source before you rebuild.
- Bind the QC report to the final file hash, never reuse a report from an earlier master.

## Alternatives for better results

- Check narration stems before assembly so a short chunk is caught before the final mix is built.
- Listen to the final file in headphones as a second check after the measurements pass.
