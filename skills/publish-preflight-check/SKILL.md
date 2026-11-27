# Publish Preflight Check

## Identify every destination and its route

- List each destination, its ordered account handle, and its route before building anything.

- Name the route as a browser session, an API token, or a CLI account id for each destination.

- Record the ordered handle for each destination in the run note so later checks compare against the same string.

- Treat each destination separately because one signed in session can be right for one channel and wrong for another.

## Verify the sign in and the OAuth flow before building

- Open the live account surface for a browser destination and read the signed in handle shown there before building the set.

- Compare the token or account id for an API or CLI destination against the ordered handle before building the set.

- Skip the browser sign in check for a CLI destination that posts by account id, because that route does not use the browser session.

- Run this check at the start of the day for recurring packaging runs, not only when a publish step fails.

- Check the standing reauth rule before you generate any YouTube OAuth link.

- Use the web flow for every YouTube reauth and never use the installed app flow.

- Confirm the link you send is a fresh web flow link and has not already been used or spent.

- Record the flow you used and the result with the token record so the next worker does not repeat a rejected flow.

- Stop at once when Google rejects a code for a missing client secret and switch to a fresh web flow link instead of retrying the same flow.

- Stop building for a mismatched destination at once and report the ordered handle, the handle actually signed in, and the destination that is blocked.

- Keep any work already built ready and unposted, and label it ready but blocked, never packaged or live.

- Do not build more sets for the blocked destination while the mismatch stands, because extra sets only grow the unpackaged backlog.

- Resume only after a fresh live read shows the ordered handle, and recheck the handle again just before the publish step.

## Scan every packaging text for placeholders

- Collect the exact description file, pinned comment text, community post text, carousel caption, and title variants for the episode before any upload begins.

- Use the exact files that will publish, not a draft or a summary, so the scan sees what the audience will see.

- Record the file path for each text in the run note before you scan it.

- Search every collected text for an opening square bracket and read each bracketed token in full.

- Treat any bracketed token in all capitals as a placeholder, including link tokens such as [PRIMARY FUNNEL LINK] and [COMMUNITY LINK].

- Treat [TODO], [INSERT], [LINK], and any other bracketed instruction as a placeholder even when it looks short or harmless.

- Record the scan result as zero hits or list every hit with its file and line, and never report a scan as clean from memory or from a glance.

- Replace each hit with the real link or real text from its source, or delete the line when no real value exists for it.

- Run the same bracket search again after every fix and confirm zero hits before the upload or post step starts.

- Hold any packaging item that still has a hit, and never publish a description, comment, post, or caption that still carries a placeholder.

- Read the live description and pinned comment after upload and fix at once any placeholder the pre publish scan missed.

## Answer the remake copyright questions

- Name the creator and channel that made the source footage before you judge anything else.

- Record the source title, link, total length, and the exact span used in the remake.

- Compare the used span with the total length and record the share as a plain fraction of the source.

- Check whether the source came from the user own stream, because own footage is a different case from another creator footage.

- Stop the YouTube path at once when you cannot identify the source creator, because an unidentified source cannot pass the check.

- Answer whose footage it is from the source record you just made.

- Answer how much of the original is used, using the recorded span and total length.

- Answer whether the remake substitutes for the original, by asking whether a viewer could watch the remake instead of the source and get the same video.

- Answer whether the change is genuine transformation or only a new voice over the same video.

- Judge transformation on what the viewer sees, not on the voice alone, because a new voice over full screen source footage does not change the video.

- Treat revoicing, a new end card, and new handles as packaging, not transformation, when the footage stays full screen and as it was.

- Record a pass or fail for each question in the build record, with one line of evidence beside each answer.

## Hold, reroute, and record the verdict

- Hold any remake from YouTube when it fails any of the four questions.

- Send a failing remake to Instagram and TikTok only when the user has said so for that remake, because a fail for YouTube is not a pass for every surface.

- Transform a held remake before it returns to YouTube, by rebuilding the picture with new visuals or a new edit that changes what the viewer sees.

- Ask the user for a hold, transform, or explicit override call when a remake fails, and do not post the failing remake to YouTube while you wait.

- Keep the strike risk in view, because three strikes in 90 days can terminate a channel and one strike is already on Shamz TV.

- Write the four answers, the verdict for each question, and the destinations allowed into the remake build record before upload.

- Name the exact file the verdict covers, so a later re-edit gets a fresh check and not a reused pass.

- Re-run the check when the source span, the edit, or the destination changes, because any of those changes can change an answer.

## Available connectors

- [vidIQ](/opt/hatch/connectors/vidiq_mcp/CONNECTOR.md) for researching the source channel and video before you answer the copyright questions.

- Use `muse.connector_search` to find other connectors and `muse.skill_search` to find related skills.

- If nothing here fits, look on the web for a maintained API or MCP server and set it up with [Custom Connectors and MCPs](/opt/muse/skills/custom-connector-setup/SKILL.md), or build a custom connector.

## Alternatives for better results

- Use an API or CLI route where one is available for a destination whose browser session is shared, because that route avoids the single browser session limit.

- Ask the user to sign in once for the blocked channel and then run all blocked sets for that channel together, instead of rebuilding one set at a time.

- Keep one source file for the real links used by a channel and copy each link from that file, so a template never ships with its placeholder still in place.

- Build the remake from the user own stream footage when you can, because own footage removes the source question at the start.

- Ask the user early for a hold, transform, or override call on a borderline remake, instead of building the full package first and then discovering it cannot post to YouTube.
