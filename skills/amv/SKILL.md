---
name: amv
description: Build an AMV style edit (anime music video) in the style of the viral TikTok AMV editors, from a song and a footage set, using beat-cut grids, kinetic typography, matched-pose morphs and single-look colour grades. Use when $shamz asks for an AMV edit or names a song for one.
---

# AMV

AMV is a $shamz tool, part of the Shamz agent-skills collection at github.com/shamz4200/agent-skills, built for the Shamz TV workflow.

Build an AMV style edit: a song cut to footage with the techniques of the viral TikTok AMV editors. The full study behind this skill is at `~/workspace/shamz-tv/amv-study/TECHNIQUES.md`, from 9 key videos $shamz picked on 2026-11-28. Read it before your first build. The vision is to become the coldest editor online, videos that go viral and rival professional editors.

Use AMV when $shamz names a song for an AMV short or asks for an AMV style edit. Do not start a build until he has named both the song and the footage. The footage call is his: GTA 6 gameplay from his own streams, or anime he names. Never pick the footage yourself.

## Copyright gate

- An AMV built from anime footage uses someone else's footage. Run the four-question copyright check from `~/workspace/custom-skills/remake_copyright_check/SKILL.md` before posting any anime AMV to YouTube.
- If the check fails, the AMV does not go to YouTube without $shamz's explicit word for that video. It can go to Instagram and TikTok only when he says so.
- An AMV built from his own GTA 6 stream footage is not a remake and the gate does not apply. The gate is about whose footage it is, not about the edit style.
- Never mark an upload as AI made or altered content.

## Map the beat first

- Take the song file from $shamz. Read duration and BPM with ffprobe and the onset script before choosing any shot.
- Run `~/workspace/custom-skills/amv/scripts/onset-envelope.py <song>` to get the onset times and gaps. Every cut and every type change lands on an onset. A cut between onsets reads as a mistake.
- Find the drops first: the biggest energy jumps in the track. Those are the section boundaries. The loudest section gets the fastest cuts and the biggest type.
- Reference numbers from the study: the fast lyric edits cut on a 0.3 to 0.6 second grid (eighth notes near 140 BPM). MAGIC is slower, 63 BPM, 0.952 seconds per beat, drops at 93 seconds and 233.5 seconds, loudest section 235 to 258 seconds. Do not force the reference pace onto a slower song. One cut per beat or per half beat is the MAGIC grid.
- Build a cut plan before touching footage: section, onset times, shot, type card. No section before $shamz passes the plan when he asked to see it first.

## Cut on the grid

- Average shot length in the study is 1.1 to 1.5 seconds in fast sections. The morph edit (V9) is the exception at 2.7 seconds, because the match needs time to register.
- Match on motion or on colour, never on plot. A sword swing cuts to a sword swing. A red-lit fight cuts to a red-lit fight. Two shots from different series with the same movement read as one sequence.
- No dead space. A shot held across two onsets with no motion in it gets cut or gets a push-in.
- One unique shot per beat. Never reuse a still or a clip across shots to save time. Never repeat a shot inside one edit.
- Slow push-ins only, one direction, one speed. Never out-and-back. Never push in on a shot that is already moving fast; the push is for stillness.
- Open with a slow burn, then the storm. One shot, one mood, ending on the first loud onset. The longest intro in the study is 11 seconds and it only works because the shot has motion in it. A still intro longer than 3 seconds is dead space.

## Kinetic typography

- One word or short phrase per card, never a full sentence. Type size is 40 to 70 percent of frame height. The card lives for one lyric line only, then it is gone.
- The type changes exactly on the lyric onset. Colour is the emotion: heavy condensed sans for anger, thin serif for tenderness, red for the hard lines, white for the plain ones. The font changes with the mood.
- Small caption lines sit at the bottom and never fight the big type. If a caption is unreadable at phone size, make it big or cut it.
- Dialogue type is smaller and slower than lyric type, because the viewer has to hear the line in their head. Hold the punchline card longer than feels right. One joke per beat, then cut.
- Japanese kanji cards work as hook cards when the song or the footage is Japanese. One kanji per card, giant, same grid as the English type.

## Matched-pose morph

- The key technique of the set. Two characters in the same framing dissolve into each other: same head position, same eyeline, same pose. The grade flips inside the dissolve (warm to cold), so the two characters feel like one person changing.
- Match the pose first, the face second, the framing third. Both shots must share head position and eyeline or the morph smears. Never morph two shots that only share a colour. The match is pose, not palette.
- Hold each side 2 to 3 seconds with a slow push-in. The slowness is what lets the viewer register the match.
- Verify the morph by eye on the built frames before showing it to $shamz. A smeared morph is a fail, not a style.

## Colour grade

- Pick one look per section, lock it, and cut on the change. Warm versus cold is the strongest split in the study.
- Single-look references: heavy red wash with crushed blacks (Death Note, V7), fiery orange for action and red for verses (V8), warm orange on one character and cold blue on the other (V9).
- The grade can move with the beat and the lyric, red for one verse and orange fire for the fight, but the shift happens on a cut, never mid-shot. A grade that drifts inside a shot reads as an accident.
- Never grade two consecutive shots the same way if they are meant to contrast.

## Flashes, overlays and props

- One flash per section, on the loudest onset, 1 to 2 frames. A flash every cut is noise. A 3 frame flash hides content and reads as a mistake.
- One overlay per video, applied globally, and it must serve the theme. Snow for winter, embers for fire, rain for grief. Keep it subtle enough that faces stay readable.
- Composited props must sit on the character, track the head, and match the light. A hat that floats is a fail. Fan-art inserts work only when the art style matches the source.
- Logo cards are punchlines, one per video at most.
- Picture-in-picture inset: one per video, one beat only, and the inset must be a different moment from the main frame.
- Letterbox is a commitment, not a garnish. Either the whole video is letterboxed or none of it is. Never ship an odd-width frame.

## Creator mark and end card

- Persistent small watermark, bottom centre or bottom corner, one place, never moving. For Shamz work the mark is $shamz.
- Credit card as the last content frame, 1 to 2 seconds. Then the Shamz end card. Never a TikTok search card on Shamz work.
- The platform end card is not content and is never counted in the runtime.

## Render and export

- Ship 1024x576 h264 for landscape AMVs, or the platform native size for portrait. Never an odd width.
- Audio is the song only, loudnorm minus 14 LUFS, true peak at or under minus 1. No game audio under an AMV unless $shamz orders it.
- Loudness normalisation is a separate audio-only pre-pass written to a premix WAV. Never run loudnorm inside a combined audio and video filtergraph.
- One heavy encode at a time. Verify the built file by eye at 1fps before presenting it: every cut on an onset, every type card readable, every morph clean, no repeated shots.

## Present for approval

- Show $shamz the full exact file in chat before it posts anywhere. Approval binds to that file's hash. Silence never counts as approval.
- Name the file distinctly per version. Never overwrite an approved file.
- On approval, post with the batch pattern: YouTube API first, then Instagram, then TikTok, then Studio packaging (pinned comment, Community post, Test and Compare on long-form). Record every link in the batch results file.

## What this skill does not do

- It does not pick the song or the footage. Both are $shamz's call.
- It does not cover the ShamzClipz funny-caption Shorts format. That is the `shamzclipz` skill.
- It does not cover beat-sync aura farm edits from GTA 6 gameplay. That workflow lives in the beat-sync build notes, not here.
- It does not animate stills or generate footage. AMV cuts real footage.

## Available connectors

- Use `muse.connector_search` to find other connectors and `muse.skill_search` to find related skills.

- If nothing here fits, look on the web for a maintained API or MCP server and set it up with [Custom Connectors and MCPs](/opt/muse/skills/custom-connector-setup/SKILL.md), or build a custom connector.

## Alternatives for better results

- When the song is slow (under 70 BPM), use the morph and the slow push-in instead of the fast-cut grid. The fast grid belongs to fast songs.
- When the footage is gameplay rather than anime, keep the typography and the grade split and drop the morph unless two gameplay shots share a matched pose.
- When $shamz wants the edit to feel colder, strip one element per section (one less overlay, one less flash, one less colour) before adding anything. Subtraction first.

## Verified

- Study completed 2026-11-28 from 9 videos $shamz picked, frame by frame at 1fps plus onset envelopes measured on V2, V3 and V8. Technique counts and shot lengths are measured from the sheets in `~/workspace/shamz-tv/amv-study/frames/`, not guessed.
- MAGIC beat map verified from `~/workspace/shamz-tv/beat-sync/magic-amv-v1/magic-beat-analysis.log`: 277.5s, 63 BPM, drops at 93s and 233.5s, loudest 235 to 258s.
- The onset script was tested on the MAGIC file and returns 517 onsets at the default threshold.
- No AMV has been built with this skill yet. The first build waits on the footage call (GTA 6 gameplay or anime). Treat the first build as untested until $shamz judges it.
