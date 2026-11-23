# GTA daily series: music beds (owner's tracks, alternate in order)

The owner supplies the tracks (Nov 2026). Files live in `assets/music/` (git-ignored: never commit or upload them
anywhere except inside the finished videos). **Alternate**: each new video takes the next track in the rotation below,
wrapping round; when the owner adds tracks, append them to the rotation. Log every use.

Mix (`gta/chapter1-money/tools/mix.sh <track> <start s> <out.mp4>`): start the track at its strongest section, music
gain 0.16, sidechain-ducked under the voice (threshold 0.03, ratio 6), 0.4 s fade in, 1.6 s fade out, master to about
-14 LUFS. Bed sits about 10 dB under the voice.

## Rotation (use in this order, wrapping round; 25 beds)
"Use from" = loud, steady, vocal-free stretches in seconds (`gta/tools/music_scan.py`). Pick a start inside one that
covers the whole Short (about 45 s); for longer videos, loop or chain stretches. Listen to the chosen start before mixing.

| # | Track | Tempo | Length | Use from (s) | Vocals |
|---|---|---|---|---|---|
| 1 | `shamz_sea_signs_part_2.wav` | ~152 BPM | 2:48 | 8-30, 47-80, 112-135 | none heard |
| 2 | `shamz_symbols_part_2.wav` | ~123 BPM | 2:56 | 24-60, 88-104, 144-168 | none heard |
| 3 | `sage_mode_backing.mp3` | ~99 BPM | 3:38 | 8-40, 120-144, 176-200 | instrumental |
| 4 | `2020_vision_apocalypsis_combined.mp3` | ~125 BPM | 3:24 | 32-120, 152-190 | none heard |
| 5 | `do_you_wanna_roll_combined.mp3` | ~72 BPM | 3:12 | 40-72, 80-136, 152-176 | none heard |
| 6 | `six_degrees_combined.mp3` | ~134 BPM | 3:37 | 48-80, 88-120, 184-216 | none heard |
| 7 | `dream_combined.mp3` | ~99 BPM | 3:11 | 40-128, 136-152, 160-176 | none heard |
| 8 | `keep_part_2_combined.mp3` | ~125 BPM | 2:49 | 64-104, 112-128, 136-160 | none heard |
| 9 | `lord_2nd_backing.mp3` | ~89 BPM | 2:31 | 40-56, 80-152 | instrumental |
| 10 | `manifest_and_create_backing.mp3` | ~134 BPM | 3:47 | 56-88, 120-136, 144-160, 176-224 | instrumental |
| 11 | `you_wahh_all_in_a_way_combined.mp3` | ~125 BPM | 3:53 | 40-150, 160-230 | none heard |
| 12 | `pretty_brown_eyes_backing.mp3` | ~99 BPM | 3:22 | 80-96, 136-184 | instrumental |
| 13 | `meme_millionaire_combined.mp3` | ~125 BPM | 3:12 | 32-104, 152-184 | a word at 0-8 only |
| 14 | `reach_backing.mp3` | ~99 BPM | 4:08 | 64-136, 144-168, 208-248 | instrumental |
| 15 | `shadow_clone_backing.mp3` | ~134 BPM | 4:07 | 88-112, 120-168, 208-232 | instrumental |
| 16 | `paint_your_canvas_combined.mp3` | ~85 BPM | 2:31 | 48-88, 112-152 | none heard |
| 17 | `shamz_family_part_2_combined.mp3` | ~125 BPM | 2:51 | 40-64, 72-128, 136-168 | none heard |
| 18 | `phoenix_combined.mp3` | ~72 BPM | 2:44 | 32-120, 144-160 | none heard |
| 19 | `reckless_combined.mp3` | ~125 BPM | 2:26 | 48-72, 80-120, 128-144 | none heard |
| 20 | `wizard_combined.mp3` | ~85 BPM | 2:38 | 64-104, 112-152 | none heard |
| 21 | `sixth_sense_combined.mp3` | ~99 BPM | 3:49 | 136-224 | vocals 40-64, 88-96, 128-136 |
| 22 | `polar_opposites_combined.mp3` | ~78 BPM | 3:20 | 56-104, 120-160 | vocals 48-56, 168-176 |
| 23 | `diamond_hands_combined.mp3` | ~75 BPM | 2:49 | 120-152 | vocals 0-24, 64-96, 104-120 |
| 24 | `magic_combined.mp3` | ~125 BPM | 4:37 | 64-128, 232-272 | vocals 0-24, 128-152, 192-232 |
| 25 | `glory_combined.mp3` | ~170 BPM | 2:36 | 48-80 only | vocals 0-48, 80-160 |

Spares, not in the rotation (same song as a bed above): `sage_mode_combined.mp3` (sung vocals 64-136 s),
`pretty_brown_eyes_combined.mp3`, `shadow_clone_combined.mp3`. When the owner adds tracks: copy them into
`assets/music/` with a short snake_case name, run the scanner, append rows to the rotation.

## Usage log
| Date | Video | Track | Start |
|---|---|---|---|
| 2026-11-22 | #1 GTA 6 is about to DELETE your money | Sea Signs pt 2 | 47 s |

| 2026-11-22 (batch) | #2 Stop robbing small banks | Symbols pt 2 | 24 s |
| 2026-11-22 (batch) | #3 You're losing the cops wrong | Sage Mode (backing) | 8 s |
| 2026-11-22 (batch) | #4 GTA 6 beat Avengers: Endgame | 2020 Vision | 40 s |
| 2026-11-22 (batch) | #5 4 tricks GTA 6 never tells you | Do You Wanna Roll | 80 s |
| 2026-11-22 (batch) | #6 Don't start Tourist Trap yet | Six Degrees | 88 s |

| 2026-11-22 (batch 2) | #7 Stop using enemy guns | Dream | 40 s |
| 2026-11-22 (batch 2) | #8 Stop googling safe codes | Keep pt 2 | 64 s |
| 2026-11-22 (batch 2) | #9 Nov 25 patch? Not confirmed | Lord 2nd (backing) | 80 s |
| 2026-11-22 (batch 2) | #10 Your trunk beats the cops | Manifest and Create (backing) | 176 s |
| 2026-11-22 (batch 2) | #11 Money with no crime | You Wahh | 40 s |

| 2026-11-23 (batch 2) | #12 Your wallet has a limit | Pretty Brown Eyes (backing) | 136 s |

| 2026-11-23 (batch 3) | #13 Moses pays for stolen cars | Meme Millionaire | 32 s |
| 2026-11-23 (batch 3) | #14 Change these settings first | Reach (backing) | 64 s |
| 2026-11-23 (batch 3) | #15 3 secrets in GTA 6 | Shadow Clone (backing) | 120 s |
| 2026-11-23 (batch 3) | #16 Jewelry stores pay up to $25,000 | Paint Your Canvas | 112 s |

| 2026-11-23 (11:11 batch) | #17 You're healing wrong | Shamz Family pt 2 | 72 s |
| 2026-11-23 (11:11 batch) | #18 Hunting pays thousands | Phoenix | 32 s |

Next video uses: **#19 Reckless**.
