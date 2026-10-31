#!/usr/bin/env bash
# Install the skills from shamz4200/agent-skills into a project folder (Mac / Linux).
#
#   bash install.sh [project-folder]          # default: the current folder
#
# What it does, every step safe to re-run:
#   1. copies each skill to <project>/.claude/skills/<name>   (Claude Code and OpenCode load skills from here)
#   2. copies each skill's start commands to <project>/.opencode/commands/ (OpenCode) and .claude/commands/ (Claude Code)
#   3. adds a short block to <project>/AGENTS.md naming the skills (Codex, Cursor, Aider and others read AGENTS.md)
#   4. creates <project>/.env with empty key lines if it has none, and keeps .env out of git
#   5. checks for Node, Python, FFmpeg and the Python packages, and says what is missing
set -euo pipefail

REPO_URL="https://github.com/shamz4200/agent-skills"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT="$(cd "${1:-.}" && pwd)"

# run from a clone of this repo, or fetch one
if [ -d "$HERE/skills" ]; then
  SRC="$HERE"
else
  SRC="$(mktemp -d)"
  git clone --depth 1 "$REPO_URL" "$SRC" >/dev/null
fi

echo "Installing skills into $PROJECT"
mkdir -p "$PROJECT/.claude/skills" "$PROJECT/.claude/commands" "$PROJECT/.opencode/commands"
names=()
for skill in "$SRC"/skills/*/; do
  name="$(basename "$skill")"
  names+=("$name")
  rm -rf "$PROJECT/.claude/skills/$name"
  cp -R "$skill" "$PROJECT/.claude/skills/$name"
  if [ -d "$skill/opencode/commands" ]; then
    cp "$skill"/opencode/commands/*.md "$PROJECT/.opencode/commands/"
  fi
  if [ -d "$skill/claude/commands" ]; then
    cp "$skill"/claude/commands/*.md "$PROJECT/.claude/commands/"
  fi
  echo "  + $name"
done

# AGENTS.md: one block between markers, replaced on every run
begin="<!-- agent-skills:begin -->"
end="<!-- agent-skills:end -->"
block="$begin
## Installed skills

Skills from $REPO_URL live in \`.claude/skills/\`. Before a task that matches one, read its \`SKILL.md\` and follow it
step by step.

Start commands: when I type \`/what-if <idea>\` or \`/shamz <idea>\`, make a Shamz What If episode of that idea with
\`.claude/skills/shamz-what-if/SKILL.md\`, from the first step to the finished episode. Claude Code and OpenCode also
have these as slash commands (\`.claude/commands/\`, \`.opencode/commands/\`).
"
for name in "${names[@]}"; do
  desc="$(sed -n 's/^description: //p' "$PROJECT/.claude/skills/$name/SKILL.md" | head -1 | sed 's/\. .*/./')"   # first sentence
  block+="
- \`.claude/skills/$name/SKILL.md\`: $desc"
done
block+="
$end"
touch "$PROJECT/AGENTS.md"
python3 - "$PROJECT/AGENTS.md" "$begin" "$end" "$block" <<'PY'
import re, sys
path, begin, end, block = sys.argv[1:5]
text = open(path, encoding="utf-8").read()
pat = re.compile(re.escape(begin) + ".*?" + re.escape(end), re.S)
text = pat.sub(lambda _m: block, text) if pat.search(text) else (text.rstrip() + "\n\n" + block + "\n").lstrip()
open(path, "w", encoding="utf-8").write(text)
PY

# keys: names only, never values
if [ ! -f "$PROJECT/.env" ]; then
  cat > "$PROJECT/.env" <<'ENV'
ELEVENLABS_API_KEY=

# Free route instead of ElevenLabs (see the skill's README): remove the # from these lines
# VOICE_ENGINE=chatterbox
# SFX_ENGINE=library
# CHATTERBOX_VOICE_SAMPLE=../voice/my_voice.wav
ENV
  echo "  created .env (add your ElevenLabs key after the = sign)"
fi
for pat in .env voice/; do                                         # keys and voice samples never go in git
  if [ ! -f "$PROJECT/.gitignore" ] || ! grep -qxF "$pat" "$PROJECT/.gitignore"; then
    printf '%s\n' "$pat" >> "$PROJECT/.gitignore"
  fi
done
mkdir -p "$PROJECT/voice"

# tools the skills need
missing=()
command -v node >/dev/null || missing+=("Node.js 18+")
command -v ffmpeg >/dev/null || missing+=("ffmpeg")
command -v ffprobe >/dev/null || missing+=("ffprobe (comes with ffmpeg)")
if command -v python3 >/dev/null; then
  python3 -c "import numpy, PIL" 2>/dev/null || missing+=("Python packages: pip install numpy pillow")
else
  missing+=("Python 3.9+")
fi
if [ ${#missing[@]} -eq 0 ]; then
  echo "All tools found."
else
  echo "Missing: ${missing[*]}"
  echo "  Mac:   brew install node python ffmpeg && pip3 install numpy pillow"
  echo "  Linux: sudo apt install nodejs npm python3-pip ffmpeg && pip3 install numpy pillow"
fi
grep -q '^ELEVENLABS_API_KEY=.\+' "$PROJECT/.env" || echo "Next: put your ElevenLabs key in $PROJECT/.env"
echo "Done. Start your agent from $PROJECT."
