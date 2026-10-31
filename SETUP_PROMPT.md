# Setup prompt

Paste the block below into any coding agent (Claude Code, OpenCode, Codex, Cursor, Aider, Gemini CLI and others),
started from the folder you want to make videos in.

```text
Install my agent skills from https://github.com/shamz4200/agent-skills into this folder.

1. Clone the repo to a temporary folder (git clone --depth 1 https://github.com/shamz4200/agent-skills).
2. Run its installer with this folder as the target:
   - Mac or Linux: bash <clone>/install.sh "$(pwd)"
   - Windows: powershell -ExecutionPolicy Bypass -File <clone>\install.ps1 (Get-Location)
   It copies each skill into .claude/skills/, OpenCode commands into .opencode/commands/, lists the skills in
   AGENTS.md, creates an empty .env and keeps .env out of git.
3. Install anything the installer reports as missing (Node.js 18+, Python 3.9+ with numpy and pillow, ffmpeg with
   ffprobe), using this computer's package manager. Ask me before installing system-wide.
4. Ask me for my ElevenLabs API key and write it into .env as ELEVENLABS_API_KEY=<key>. Never print the key, put it
   in a commit, or paste it anywhere else.
5. Read AGENTS.md and each installed skill's SKILL.md, then tell me which skills are installed, what each one does,
   and how to start one (for example: "Make a Shamz What If episode: what if you could pause everyone but you?", or
   /what-if in OpenCode).
```

## Updating later

Run the same prompt again: the installer replaces the skills with the latest version and leaves your `.env` alone.
