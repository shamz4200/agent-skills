# $shamz Manual Deploy Workflow

A $shamz skill in the Shamz agent-skills collection. It deploys a web app with auto-deploy off: check, upload, deploy by hand, verify live, and roll back by re-upload.

## What it does

1. Edits the change in the deploy tree in your workspace, never in a mirror copy.
2. Syntax-checks the changed file before it is uploaded, and never uploads a file that fails.
3. Uploads through the code host's web interface to your repo's main branch, with a descriptive commit message.
4. Runs a manual deploy on your hosting service and waits for success in the logs.
5. Verifies the exact behaviour on the live site, because a commit identifier is not proof.
6. Rolls back by re-uploading the previous version and deploying again, using the identifier kept in the deploy report.

## What you need

- A deploy tree in your workspace, with no local version-control repository in it.
- Your code host repo, your hosting service, and your app URL, filled in where the placeholders are.
- Access to the hosting dashboard for manual deploys.

## How a run works

1. Edit the file in the deploy tree and syntax-check it.
2. Upload it through the web interface and record the commit identifier.
3. Run a manual deploy, wait for success, then load the live app.
4. Re-test the exact behaviour the change was meant to fix, record the result, and keep the previous identifier for a revert.

## Rules it follows

- Auto-deploy stays off; every change needs the manual deploy step.
- Never upload a file that fails the syntax check.
- Live behaviour is the only proof a deploy worked.
- Destructive actions behind confirmation dialogs are clicked manually by $shamz.
- A revert is a re-upload plus a manual deploy, never an automatic rollback.

## What's in the folder

| Path | What |
|---|---|
| `SKILL.md` | The pipeline the agent follows |
| `README.md` | This how-to guide |
