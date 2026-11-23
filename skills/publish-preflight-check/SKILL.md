---
name: publish-preflight-check
description: Verify every publishing destination and its sign-in route before building any packaging, mirror, or carousel set.
---
# Publish Preflight Check

## Identify every destination and its route

- List each destination, its ordered account handle, and its route before building anything.
- Name the route as a browser session, an API token, or a CLI account id for each destination.
- Record the ordered handle for each destination in the run note so later checks compare against the same string.
- Treat each destination separately because one signed in session can be right for one channel and wrong for another.

## Verify the sign in before building

- Open the live account surface for a browser destination and read the signed in handle shown there before building the set.
- Compare the token or account id for an API or CLI destination against the ordered handle before building the set.
- Skip the browser sign in check for a CLI destination that posts by account id, because that route does not use the browser session.
- Run this check at the start of the day for recurring packaging runs, not only when a publish step fails.

## Verify the OAuth reauth flow before generating a link

- Check the standing reauth rule before you generate any YouTube OAuth link.
- Use the web flow for every YouTube reauth and never use the installed app flow.
- Confirm the link you send is a fresh web flow link and has not already been used or spent.
- Record the flow you used and the result with the token record so the next worker does not repeat a rejected flow.
- Stop at once when Google rejects a code for a missing client secret and switch to a fresh web flow link instead of retrying the same flow.

## Stop and park on a mismatch

- Stop building for a mismatched destination at once and report the ordered handle, the handle actually signed in, and the destination that is blocked.
- Keep any work already built ready and unposted, and label it ready but blocked, never packaged or live.
- Do not build more sets for the blocked destination while the mismatch stands, because extra sets only grow the unpackaged backlog.
- Resume only after a fresh live read shows the ordered handle, and recheck the handle again just before the publish step.

## Alternatives for better results

- Use an API or CLI route where one is available for a destination whose browser session is shared, because that route avoids the single browser session limit.
- Ask the user to sign in once for the blocked channel and then run all blocked sets for that channel together, instead of rebuilding one set at a time.
