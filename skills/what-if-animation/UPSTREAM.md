# Where this skill comes from

This folder is a copy of the **What If animation** skill by [FreshStack](https://freshstack.ai), published at
https://github.com/kelano86/what-if-animation under the MIT licence (see `LICENSE` in this folder, which must stay
with the files).

- Copied from commit `8092fb5e825e55456d1d47fec0ebf595cb93cc0d` on 2026-10-31.
- Copied unchanged. Changes made in this repo after that date are listed below.

## Changes in this repo

- None yet.

## Updating to a newer upstream version

```bash
git clone --depth 1 https://github.com/kelano86/what-if-animation /tmp/wia
rsync -a --delete --exclude UPSTREAM.md --exclude .git /tmp/wia/ skills/what-if-animation/
```

Then update the commit above and re-apply anything listed under "Changes in this repo".
