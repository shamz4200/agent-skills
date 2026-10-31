# agent-skills

Skills for AI coding agents: folders of instructions, scripts and code that teach an agent one job from start to
finish. They work in Claude Code and OpenCode directly, and in any agent that reads `AGENTS.md` (Codex, Cursor,
Aider, Gemini CLI and others).

## Skills

| Skill | What it does | Needs |
|---|---|---|
| [what-if-animation](skills/what-if-animation/) | One topic line in ("What if you could rewind 10 seconds?"), a finished 15-25 s stick-figure "What If" episode out: script, voice, storyboard with a self-check, animation in code (Remotion), sound, mastering to -14 LUFS | Node 18+, Python 3.9+ (numpy, pillow), ffmpeg, an ElevenLabs API key |

## Install

The quickest way: paste the prompt in [SETUP_PROMPT.md](SETUP_PROMPT.md) into your agent, from the folder you want
to work in. It clones this repo, runs the installer, installs what's missing and asks you for your keys.

Or by hand, from your project folder:

```bash
git clone --depth 1 https://github.com/shamz4200/agent-skills /tmp/agent-skills
bash /tmp/agent-skills/install.sh .
```

```powershell
git clone --depth 1 https://github.com/shamz4200/agent-skills $env:TEMP\agent-skills
powershell -ExecutionPolicy Bypass -File $env:TEMP\agent-skills\install.ps1 .
```

The installer puts each skill in `.claude/skills/<name>/`, any OpenCode commands in `.opencode/commands/`, lists the
skills in `AGENTS.md`, creates an empty `.env` and adds `.env` to `.gitignore`. It is safe to re-run; re-running
updates the skills.

## Use

- **Claude Code:** start it in the project folder and ask, e.g. "Make a What If episode: what if you could pause
  everyone but you?"
- **OpenCode:** start it in the project folder and type `/what-if What if you could pause everyone but you?`
- **Other agents:** they find the skills through `AGENTS.md`; ask for the task in plain words.

## Keys

Keys go in the project's `.env` (for example `ELEVENLABS_API_KEY=...`), never in this repo, a prompt or a commit.

## Adding a skill

Add a folder under `skills/` with a `SKILL.md` (front matter `name` and `description`, then the steps), plus any
`references/`, `scripts/` and `opencode/commands/`. The installers pick it up automatically.

## Credits and licences

- `skills/what-if-animation` is by [FreshStack](https://freshstack.ai), copied from
  [kelano86/what-if-animation](https://github.com/kelano86/what-if-animation) under the MIT licence; its `LICENSE`
  stays in its folder and [UPSTREAM.md](skills/what-if-animation/UPSTREAM.md) records the version. Remotion is free
  for individuals and companies of up to three people; ElevenLabs output follows your ElevenLabs plan's terms.
- Everything else in this repo: MIT, see [LICENSE](LICENSE).
