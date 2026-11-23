---
name: manual-deploy-workflow
description: Deploy a web app with auto-deploy off: check, upload, deploy by hand, verify live, roll back by re-upload.
---

# $shamz Manual Deploy Workflow

A $shamz deploy workflow for a web app with auto-deploy off. Every change goes through the same steps, in order: check, upload, deploy by hand, verify live, and roll back by re-upload when needed.

## Before you start

- Work in the deploy tree in your workspace. Edit the source there, not a mirror or a projected copy. Mirrors do not change saved definitions.
- There is no local version-control repository in the deploy tree. Do not try to commit there.
- Auto-deploy is disabled. Nothing goes live on upload alone; a manual deploy step is always required.

## Step 1: edit the local file

- Make the change in the deploy tree, in the file that owns the behaviour.
- Keep the change small and descriptive. One change, one purpose, so a revert is one step.

## Step 2: syntax-check before upload

- Run a syntax check on the changed file before uploading it. For a Python file, parse it and confirm it parses cleanly.
- Never upload a file that fails this check. Fix it locally first.

## Step 3: upload via the web interface

- Upload through your code host's web interface, to <your GitHub repo>, branch `main`.
- The upload path mirrors the deploy tree: a file at `app/main.py` in the deploy tree is uploaded to `app/` on the host.
- Commit directly to `main` with a descriptive message, for example a fix message naming what the change tolerates or corrects.
- Record the commit identifier the upload returns. Keep it in the deploy report.

## Step 4: manual deploy

- Open your hosting service dashboard, go to <your hosting service>, and run a manual deploy of the latest commit.
- Wait for the deploy to report success and for a successful request in the logs.
- A typical build takes around a minute. A slow first load on a free tier is normal, not a bug; allow for the cold start before judging the deploy.

## Step 5: verify live

- Load <your app URL> and expect a successful response.
- Re-test the exact behaviour the change was meant to fix, on the live site, before calling it done. A commit identifier is not proof; live behaviour is.
- For destructive actions behind confirmation dialogs, $shamz must click manually. Do not automate a destructive confirmation.
- Record the verification: the live URL, the behaviour tested, and the result.

## Rollback

- There is no automatic rollback. To revert, re-upload the previous version of the file with a `revert:` commit message, then run a manual deploy again.
- Keep the previous commit identifier in the deploy report, so a revert is one step, not archaeology.

## Rules

- Auto-deploy stays off. Every change needs the manual deploy step.
- Never upload a file that fails the syntax check.
- Never call a deploy done on a commit identifier alone. Live behaviour is the proof.
- Edit the source, never the mirror.
- A revert is a re-upload plus a manual deploy, with the previous identifier already recorded.
