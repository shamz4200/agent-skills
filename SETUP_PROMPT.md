# Setup prompt

Paste the block below into any coding agent (Claude Code, OpenCode, Codex, Cursor, Aider, Gemini CLI and others),
started from the folder you want to make videos in. The same block sets up a new agent and updates one that is
already set up.

```text
Install my agent skills from https://github.com/shamz4200/agent-skills into this folder.

1. Clone the repo to a temporary folder (git clone --depth 1 https://github.com/shamz4200/agent-skills).
2. Run its installer with this folder as the target:
   - Mac or Linux: bash <clone>/install.sh "$(pwd)"
   - Windows: powershell -ExecutionPolicy Bypass -File <clone>\install.ps1 (Get-Location)
   It copies each skill into .claude/skills/, the start commands into .claude/commands/ and .opencode/commands/,
   lists the skills in AGENTS.md, creates an empty .env and keeps .env out of git. If the skills are already
   installed, this updates them and leaves .env alone.
3. Install anything the installer reports as missing (Node.js 18+, Python 3.9+ with numpy and pillow, ffmpeg with
   ffprobe), using this computer's package manager. Ask me before installing system-wide.
4. Ask me which voice and sound route I want, unless .env already shows one:
   - ElevenLabs (default): if .env has no key yet, tell me to put my ElevenLabs API key after ELEVENLABS_API_KEY=
     in .env myself (or in this environment's secrets). Never ask me to paste the key into this chat, never print
     it, never put it in a commit.
   - Chatterbox (free, my own voice cloned on this computer): run pip install chatterbox-tts faster-whisper, ask me
     to save 10 to 30 seconds of clean speech as voice/my_voice.wav in this folder, then in .env remove the # from
     VOICE_ENGINE=chatterbox, SFX_ENGINE=library and CHATTERBOX_VOICE_SAMPLE=../voice/my_voice.wav. The voice sample
     never goes in git or to any online service.
5. Read AGENTS.md and each installed skill's SKILL.md, then tell me which skills are installed, which voice route
   is set up, and confirm the start commands below work in this agent.

Start commands (make a Shamz What If episode from one idea):
  /what-if What if you could see one minute ahead?
  /shamz What if you could pause everyone but you?

- In Claude Code and OpenCode these are slash commands: I type one with my idea, press Enter and leave it running.
- In other agents (Codex, Cursor, Aider, Gemini CLI), treat a message starting with /what-if or /shamz as a request to
  make that episode with .claude/skills/shamz-what-if/SKILL.md, from the first step to the finished episode
  (AGENTS.md says the same).
- The episode lands in what-if-studio/out/<episode>/. The first run also sets up the animation studio, which adds a
  few minutes.

Tips for making episodes:
- Start a fresh session for each cartoon.
- When I give notes in plain words ("the ball in shot 3 covers his face"), fix that shot and re-render it.
- Remind me to open the source of the episode's one real fact before I post.
```

## Make your first cartoon

After setup, start your agent from the same folder and type:

```
/what-if What if you could see one minute ahead?
```

or `/shamz` and your idea. Leave it running; the episode lands in `what-if-studio/out/<episode>/`.

## Voice routes

- **ElevenLabs (default):** studio voices and generated sound effects; about 150 to 250 credits an episode.
- **Chatterbox (free):** your own voice, cloned on your computer from a 10 to 30 second sample, with the sound from
  the skill's 40-clip library. No account, no key, no credits; slower without a GPU. Details in
  [the skill's README](skills/shamz-what-if/README.md#the-free-chatterbox-route).

## Updating later

Paste the same block again: the installer replaces the skills and commands with the latest version and leaves your
`.env` alone.
