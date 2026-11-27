# Live File Deletion Verification

## Take the order exactly as given

- Record the user exact deletion order in the run note before you list any file.

- Treat only the categories the user named as protected, and never add a protection category of your own.

- When the user names core categories, copy them word for word into the run note and use that list as the only protection list.

- When the scope is unclear, stop and ask the user to name what stays before you delete anything, and never fill the gap with a rule you invented.

- When the user corrects a protection you added, remove it at once and recheck every file you held or deleted under it before you report again.

## Verify each file against its upload receipt

- Build the deletion list from the files on disk, with path, size, and sha256 for each file.

- Find the upload receipt for each file before you call it live, using the live URL and the upload record that matches the file hash.

- Treat a project note that says Final as a note only, never as proof that the file is live.

- Treat a file marked do not post as not live, and never delete it inside a live batch.

- Hold any file with no receipt and no live URL, and report it as unverified instead of deleting it.

## Classify every file before you delete it

- Mark each file as receipt verified live, note only, never uploaded, do not post, or keep locked, and record the evidence beside each mark.

- Read the keep lock list at ~/workspace/goals/shamz-abundance-engine/hidden_files/storage-keep-locks.txt before you delete anything, and never delete a locked path.

- Keep character sheets, scripts, rules, voices, narration, and trading material, and keep any file the user named as core.

- Delete a file only when its mark and its evidence agree with the user order for that file.

- Reverify the whole batch after any correction to the order, because a file held as live at one moment can be wrong at the next.

## Report what you deleted with its evidence

- Report the count of files deleted, the total size freed, and one line per file with its path, size, hash, live URL, and receipt type.

- Count only receipt verified files as live deleted, and list note only files separately with their own count.

- Never claim that every file was checked by hash unless every file in the batch was checked by hash.

- When a claim you made was wrong, say so in one plain sentence, name the files affected, and correct the record before you continue.

- Never present a deletion as verified from a glance, a summary, or a memory of the list.

## Available connectors

- Use `muse.connector_search` to find other connectors and `muse.skill_search` to find related skills.

- If nothing here fits, look on the web for a maintained API or MCP server and set it up with [Custom Connectors and MCPs](/opt/muse/skills/custom-connector-setup/SKILL.md), or build a custom connector.

## Alternatives for better results

- Check the live platform state for a file before you call it live, instead of trusting a note.

- Keep the deletion list in a file under ~/workspace so a later worker can recheck it after a restart.

- Free space in small verified steps and retest with a small write after each step when disk pressure is the reason for the deletion.
