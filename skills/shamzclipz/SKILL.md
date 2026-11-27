---
name: shamzclipz
description: Find viral and funny moments in a long livestream VOD and cut them into Shorts in the Shamz funny-caption format, using the ShamzClipz audio-first moment finder. Use when $shamz sends a VOD link from his own Twitch or Kick stream, or a local MP4 of his own gameplay, and wants Shorts cut from it.
---

# ShamzClipz

ShamzClipz is a $shamz tool, part of the Shamz agent-skills collection at github.com/shamz4200/agent-skills, built for the Shamz TV workflow.

Find viral and funny moments in a long livestream VOD and cut them into Shorts in our funny caption format.

Use ShamzClipz when $shamz sends a VOD link from his own Twitch or Kick stream, or a local MP4 of his own gameplay, and wants Shorts cut from it. Use it for a finished VOD and for a stream that is live right now.

## Set up the finder

- Run everything from the ShamzClipz finder engine at `~/workspace/shamz-tv/shamzclipz-engine` and use its venv Python at `~/workspace/shamz-tv/shamzclipz-engine/.venv/bin/python`.

- Check the install before a run with `~/workspace/shamz-tv/shamzclipz-engine/.venv/bin/python -c "import highlights, excite, smart, curation, ytdl, captions"` run from `~/workspace/shamz-tv/shamzclipz-engine`.

- Treat Ollama as not installed. The local LLM judge is deliberately absent, so `smart._model()` returns None and the engine falls back to activity and transcript scores. Judge the shortlist yourself instead.

- Treat the large Whisper model as not downloaded. Transcription uses faster-whisper `base` and the `base.en` model already cached in `~/.cache/huggingface`. Never download `large-v3` for this skill.

- Never touch the voice venv at `~/workspace/shamz-survives/voice-clone/venv`, the Hugging Face cache, any character sheet, or the Chatterbox model staging directory.

## Get the VOD

- Accept only $shamz's own streams, Twitch `@shamz888` or Kick `@shamz420`. Never clip another creator's footage.

- Take the VOD link from $shamz the same night or the next morning, because Twitch VODs expire.

- Download audio only for a VOD longer than 10 minutes. Use the venv yt-dlp wrapper `ytdl.YDL` with format `ba[ext=m4a]/ba/worst`, which is the same audio-first call the engine uses for long sources.

- Download the whole video only for a short source or when deep mode needs the picture for optical flow. Never download a multi-hour video whole just to scan it.

- Read the duration with ffprobe before scoring, for example `ffprobe -v error -show_entries format=duration -of csv=p=0 <file>`.

- Keep the downloaded source under the run folder in `~/workspace/shamz-tv/gta6-clips/` and record the source URL and download time in the run note.

## Transcribe the VOD

- Prefer the source captions when the source is a YouTube link. Use `captions_yt.from_info(info)` to get word timed words, then `captions_yt.window(words, a, b)` for the words inside a candidate window.

- Transcribe Twitch and Kick VODs and local files with faster-whisper from the ShamzClipz finder venv. Call `captions.transcribe(source, start, end, data, report, language, model)` with model `base` for scouting and `small` only in deep mode.

- Never run Whisper while a Chatterbox voice job is running. Wait for a voice free window first.

- Transcribe the full audio track once and reuse the word list for every candidate, instead of transcribing each candidate separately.

## Score the moments

- Score activity with `highlights.rank(source, duration, count, length, report, motion_on, extra)`. It returns clips with start, end, title, score, reason, and features.

- Read the activity signals as loudness jumps against a rolling 2 minute baseline, raised voice energy in the 2 to 4 kHz band, optical flow motion at 160 by 90, and cut density. The blend is 0.35 motion, 0.30 loud, 0.20 shout, and 0.15 cuts, with an audio only fallback of 0.55 loud and 0.45 shout.

- Run fast mode with motion off, so scoring uses audio and transcript only. Turn motion on only in deep mode, when the audio and transcript signals are thin.

- Score what is said with `excite.seconds_signal(words, duration)`, which turns the hype lexicon into a per second signal from 0 to 1. Pass that signal as `extra` into `highlights.rank` so shouted lines attract candidates.

- Custom $shamz words in the lexicon (added 2026-11-25, `excite.py` `_LEX`): "oh wow", repeated "no" ("no no no no"), repeated "yes" ("yes yes yes") and "a wah di" score 3; "jheezee", "aura farm" / "aura farming", "bludclart" / "bloodclart", "lol" and "peak" score 2. A single "no" or "yes" stays weak (0.7); only the repeated forms score. Add any future words to `_LEX` the same way and re-run the 33 unit tests (`tests.test_captions`, `tests.test_live`, `tests.test_reedit`).

- Score a single candidate with `excite.window_score(words, duration)`, which returns 0 to 1 for how exclamation dense the clip is.

- Run the full pipeline with `smart.find(src, duration, count, length, report, language, data, min_len, motion, words, deep, weights, select, profile, brief, includes, excludes)`. It ranks, reads each candidate transcript, snaps the edges, and returns the clips and the engine name.

- Snap every candidate with `smart.snap(c, words, min_len, max_len)` so the clip starts where speech starts and ends on a sentence end inside the length limits.

- Use deep mode only when the audio and transcript signals are thin. Deep mode downloads the whole video and adds optical flow, so budget the disk and the time.

## Rank and curate

- Deduplicate with `curation.select(clips, count, profile)`. It rejects clips that overlap a chosen clip by more than 0.35 and penalises repeated kinds and near identical transcripts.

- Pick the profile to match the moment. Use `balanced` for a mixed batch, `action` for chases, crashes, and explosions, and `dialogue` for talking, jokes, and opinions.

- Add dialogue led candidates with `curation.transcript_candidates(words, duration, length, count, focus)`. It finds story beats, reversals, and punchlines the activity score misses.

- Drop filler with `curation.filler(text)` and filter with `curation.passes_filters(text, includes, excludes)` before you judge a candidate.

- Judge the shortlist yourself, because no local LLM is installed. Score each candidate for a clear setup, real stakes, and an actual payoff. Penalise repetition, filler, sponsor reads, generic shouting, and incomplete thoughts, which is the same judging rule in `smart.PROMPT`.

- Gameplay and cutscene moments from $shamz's own stream ARE clips, even when his mic is muted and there is no facecam ($shamz 2026-11-26, correcting a zero-clip call on EP 5). Never reject a moment just because Shamz is not speaking or visible in it. A funny, dramatic or wild game moment from his own stream counts on its own. His mic will sometimes be muted and the cam sometimes off; that does not make the VOD unclippable.

- Aura farm edits (standing, $shamz 2026-11-27): when clipping a VOD, ALSO look for action moments that can be timed to his music — gunplay, fights, crazy driving, or any hard action. These are NOT funny-caption Shorts. They are beat-sync edits in the reference formula at `~/workspace/shamz-tv/beat-sync/reference-short-study.md`: a slice around ONE drop of one of his songs, one POV caption for the build-up only, removed at the drop, hard cuts only, action landing on the drop, end mid-action. Length: NO CAP ($shamz 2026-11-27) — do not limit ourselves; if the music and the action need more time, take it. Hunt them with per-second audio peaks plus frame verification, not the transcript — gunfire and punches do not talk. First examples: EP 6 swamp shootout (VOD 295-330, 440-475), EP 6 rifle vs truck (6158-6178), EP 5 D-Man brawl (5500-5559). Never use arcade games in them — gameplay shooting only ($shamz 2026-11-27). GAME AUDIO (standing, $shamz 2026-11-27 ~04:14 GMT): do NOT mute the gameplay audio by default — fight sounds, punches, gunshots ADD to the edit. The build-up may be low/muted, but unmute before the action starts. Default for a new edit: game audio full (1.0) under the music, loudnorm -14 LUFS on the mix. IMPACTS MUST LAND ($shamz 2026-11-27 ~04:21 GMT): the test is whether you can HEAR the fists land and the gunshots land over the music — if the impacts are buried, the game audio is still too low. Present the finished edit for approval; never post without his pick. STEALTH FIGHTS (standing, $shamz 2026-11-27): hunts must ALSO find quiet stealth fights, not just the loudest gunfire. The EP 6 junkyard fight at ~2h09m (VOD 7740) was missed because the hunt ranked by loudest sustained audio + dialogue; stealth fights are long near-silent stretches with spaced single shots and almost no talking, so neither signal flags them. Scan for isolated transient peaks (single gunshots) in quiet stretches too, and sample frames in those windows for Jason armed and in cover with bodies down. Loudest-first alone is not a complete hunt. FAST PACE (standing, $shamz 2026-11-27): aura farm edits must keep people engaged — fast-paced action, no dead space. Every cut must have movement, a shot, a hit or a body dropping; any stretch with nothing happening gets cut, even if it shortens the edit.

- Build the timestamp log first, with in time, out time, and a one line description per moment. Cut only after the log is done.

- Check every candidate against earlier batches and drop duplicates. The same moment with the same payoff is a duplicate even as a different cut.

## Cut the chosen moments

- Cut one moment per clip with ffmpeg, 15 to 60 seconds long. Start 2 to 3 seconds before the payoff and end right after the reaction lands.

- Name each file `YYYY-MM-DD - [short viral title] - [source] - [timestamp].mp4`.

- Verify each cut by playing it back and checking the duration with ffprobe before you render captions.

## Render in our caption format

- Render every Short at 720 by 1280 with the gameplay letterboxed in the middle. Write funny lines at the top and the bottom in the black bars, one top line and one bottom line per beat. Never put captions over the gameplay.

- Keep the facecam visible in a stacked vertical layout with gameplay on top and the facecam below. The facecam sits bottom right on the stream.

- Put hook text on screen in the first 2 seconds that states the payoff.

- Never use the engine's built-in caption styles or layouts. Its karaoke styles burn word by word captions over the picture, which is the opposite of our format.

- Follow the render spec in `~/workspace/shamz-tv/gta6-clips/CLIP-PROMPT-OWN-STREAMS.md` for clip types, titles, and folders.

## Present for approval

- Present the exact finished file to $shamz with its SHA256, duration, and title. Nothing uploads without his approval of that exact file.

- Treat posting as a separate step. Post to YouTube with the YouTube Data API, to Instagram with instagram-cli, and to TikTok in the browser. This skill never posts.

## Clip a live stream

- Start from a Twitch channel link or a YouTube Live link and parse it with `live_session.parse_target(text)`, which returns the platform, the channel or video id, and the URL.

- Treat a chat spike as 10 second buckets with at least 6 non-empty buckets of history, then a bucket with at least 8 messages, above the mean plus 2.5 standard deviations, and at least 2.5 times the mean. That rule is `live_session.is_spike(count, history)`.

- Cut around each spike with `live_session.LiveSession(target, data, render, before=24, after=14)`. The clip starts 24 seconds before the spike, because chat reacts after the moment, and runs 14 seconds past it.

- Read chat anonymously. Twitch chat connects read only over IRC and YouTube chat uses pytchat.

- Run one live session at a time and keep the computer awake and online while it records. Unattended sessions stop after a time cap and delete the recording when the last clip is cut.

## Keep the disk clean

- Delete the downloaded VOD and the source audio after the clips are cut and approved. Keep only the final Shorts and the timestamp log.

- Check free disk before a long VOD download with `df -h ~`. A multi-hour 1080p VOD is several gigabytes, so never start one with less than 10 GB free.

- Never delete the voice venv, the Hugging Face cache, character sheets, or the Chatterbox model staging directory when you clean up.

## What this skill does not do

- Post to any platform by itself.

- Use the engine's built-in caption styles, layouts, or its web app export.

- See the screen. The judge reads transcript only, so a purely visual funny moment with no verbal reaction can be missed. Scan sampled frames at candidate times when the audio is quiet, and flag any visual only moment you cannot verify from the transcript.

## Available connectors

- Use `muse.connector_search` to find other connectors and `muse.skill_search` to find related skills.

- If nothing here fits, look on the web for a maintained API or MCP server and set it up with [Custom Connectors and MCPs](/opt/muse/skills/custom-connector-setup/SKILL.md), or build a custom connector.

## Alternatives for better results

- Ask $shamz for timestamps or stream markers he remembers before you scan, because his memory of the big moments beats any signal.

- Use the `dialogue` profile when the funny is in what was said and the `action` profile when the funny is in what happened on screen.

- Prefer a YouTube source when one exists, because its captions are free and fast. Budget Whisper time for every Twitch or Kick VOD.

- Sample frames at candidate times to catch visual only moments the transcript cannot see.

## Verified

- Install verified 2026-11-23. Imports pass for highlights, excite, smart, curation, ytdl, captions, captions_yt, llm, facecam_detect, and live_session. Unit tests pass, 33 tests in tests.test_captions, tests.test_live, and tests.test_reedit.

- The full VOD to Short run is untested. The engine is verified, but no real VOD has been run end to end through this skill yet, so run the first one as a test and record what breaks.
