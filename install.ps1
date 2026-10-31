# Install the skills from shamz4200/agent-skills into a project folder (Windows PowerShell).
#
#   powershell -ExecutionPolicy Bypass -File install.ps1 [project-folder]     # default: the current folder
#
# Same steps as install.sh: copy skills to .claude/skills, start commands to .opencode/commands and .claude/commands, a skills block in
# AGENTS.md, an empty .env kept out of git, and a check for Node, Python and FFmpeg. Safe to re-run.
param([string]$Project = ".")
$ErrorActionPreference = "Stop"

$RepoUrl = "https://github.com/shamz4200/agent-skills"
$Project = (Resolve-Path $Project).Path
if (Test-Path (Join-Path $PSScriptRoot "skills")) {
    $Src = $PSScriptRoot
} else {
    $Src = Join-Path ([System.IO.Path]::GetTempPath()) ("agent-skills-" + [guid]::NewGuid())
    git clone --depth 1 $RepoUrl $Src | Out-Null
}

Write-Host "Installing skills into $Project"
$skillsDir = Join-Path $Project ".claude\skills"
$cmdDir = Join-Path $Project ".opencode\commands"
$claudeCmdDir = Join-Path $Project ".claude\commands"
New-Item -ItemType Directory -Force -Path $skillsDir, $cmdDir, $claudeCmdDir | Out-Null
$lines = @()
foreach ($skill in Get-ChildItem (Join-Path $Src "skills") -Directory) {
    $dest = Join-Path $skillsDir $skill.Name
    if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
    Copy-Item -Recurse $skill.FullName $dest
    $cmds = Join-Path $skill.FullName "opencode\commands"
    if (Test-Path $cmds) { Copy-Item (Join-Path $cmds "*.md") $cmdDir -Force }
    $ccmds = Join-Path $skill.FullName "claude\commands"
    if (Test-Path $ccmds) { Copy-Item (Join-Path $ccmds "*.md") $claudeCmdDir -Force }
    $desc = (Select-String -Path (Join-Path $dest "SKILL.md") -Pattern "^description: (.*)" | Select-Object -First 1).Matches.Groups[1].Value
    $desc = ($desc -split '\. ')[0].TrimEnd('.') + "."                  # first sentence
    $lines += "- ``.claude/skills/$($skill.Name)/SKILL.md``: $desc"
    Write-Host "  + $($skill.Name)"
}

# AGENTS.md: one block between markers, replaced on every run
$begin = "<!-- agent-skills:begin -->"
$end = "<!-- agent-skills:end -->"
$block = @(
    $begin,
    "## Installed skills",
    "",
    "Skills from $RepoUrl live in ``.claude/skills/``. Before a task that matches one, read its ``SKILL.md`` and follow it",
    "step by step.",
    "",
    "Start commands: when I type ``/what-if <idea>`` or ``/shamz <idea>``, make a Shamz What If episode of that idea with",
    "``.claude/skills/shamz-what-if/SKILL.md``, from the first step to the finished episode. Claude Code and OpenCode also",
    "have these as slash commands (``.claude/commands/``, ``.opencode/commands/``).",
    ""
) + $lines + @($end) -join "`n"
$agents = Join-Path $Project "AGENTS.md"
$text = if (Test-Path $agents) { Get-Content $agents -Raw -Encoding UTF8 } else { "" }
if ($null -eq $text) { $text = "" }
$pattern = [regex]::Escape($begin) + "(?s).*?" + [regex]::Escape($end)
if ($text -match $pattern) {
    $text = [regex]::Replace($text, $pattern, { param($m) $block })
} else {
    $text = ($text.TrimEnd() + "`n`n" + $block + "`n").TrimStart()
}
[System.IO.File]::WriteAllText($agents, $text, (New-Object System.Text.UTF8Encoding $false))

# keys: names only, never values (UTF-8 without BOM, so every tool reads it)
$envFile = Join-Path $Project ".env"
if (-not (Test-Path $envFile)) {
    $envText = "ELEVENLABS_API_KEY=`n`n# Free route instead of ElevenLabs (see the skill's README): remove the # from these lines`n# VOICE_ENGINE=chatterbox`n# SFX_ENGINE=library`n# CHATTERBOX_VOICE_SAMPLE=../voice/my_voice.wav`n"
    [System.IO.File]::WriteAllText($envFile, $envText, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "  created .env (add your ElevenLabs key after the = sign)"
}
$gi = Join-Path $Project ".gitignore"
foreach ($pat in @(".env", "voice/")) {                                  # keys and voice samples never go in git
    if (-not (Test-Path $gi) -or -not (Select-String -Path $gi -Pattern ("^" + [regex]::Escape($pat) + "$") -Quiet)) { Add-Content -Path $gi -Value $pat }
}
New-Item -ItemType Directory -Force -Path (Join-Path $Project "voice") | Out-Null

# tools the skills need
$missing = @()
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { $missing += "Node.js 18+" }
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) { $missing += "ffmpeg" }
if (-not (Get-Command ffprobe -ErrorAction SilentlyContinue)) { $missing += "ffprobe (comes with ffmpeg)" }
$py = Get-Command python -ErrorAction SilentlyContinue
if ($py) {
    python -c "import numpy, PIL" 2>$null
    if ($LASTEXITCODE -ne 0) { $missing += "Python packages: pip install numpy pillow" }
} else { $missing += "Python 3.9+" }
if ($missing.Count -eq 0) { Write-Host "All tools found." } else {
    Write-Host ("Missing: " + ($missing -join ", "))
    Write-Host "  winget install OpenJS.NodeJS.LTS; winget install Python.Python.3.12; winget install Gyan.FFmpeg"
    Write-Host "  then, in a new terminal: pip install numpy pillow"
}
if (-not (Select-String -Path $envFile -Pattern "^ELEVENLABS_API_KEY=.+" -Quiet)) { Write-Host "Next: put your ElevenLabs key in $envFile" }
Write-Host "Done. Start your agent from $Project."
