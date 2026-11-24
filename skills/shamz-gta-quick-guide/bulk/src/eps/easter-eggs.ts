import {C, Ep} from '../engine';
import words from '../../../easter-eggs/words.json';
export const ep: Ep = {
  id: 'easter-eggs', words: words as any, chip: 's3_grin.png',
  hl: {secrets: C.mag, never: C.red, gambit: C.cyan, cool: C.gold, dog: C.gold, rescues: C.teal, cottonmouth: C.cyan, skunk: C.mag, ape: C.mag, bigfoot: C.mag, dare: C.red, bar: C.cyan, chiliad: C.gold, callback: C.gold, hunting: C.cyan},
  shots: [
    {at: 0, plate: 's1_whisper', from: [1.3, 0, 6], to: [1.1, 0, 2]},
    {at: 12, plate: 'b_dog', from: [1.2, 0, 0], to: [1.06, 0, 2], dim: 0.3},
    {at: 41, plate: 'b_skunkape', from: [1.05, 0, 0], to: [1.25, 0, 2], dim: 0.25},
    {at: 55, plate: 's2_spooked', from: [1.1, 0, 2], to: [1.2, 2, 4]},
    {at: 63, plate: 'b_bar', from: [1.2, 3, 0], to: [1.05, 0, 0], dim: 0.4},
    {at: 84, plate: 's3_grin', from: [1.15, 0, 4], to: [1.03, 0, 0]},
  ],
  capY: [1480, 1450, 1450, 1400, 1450, 1250],
  overlays: [
    {type: 'tag', from: 2, to: 12, text: '3 HIDDEN SECRETS', color: C.mag},
    {type: 'tag', from: 12, to: 41, text: 'SECRET 1', color: C.gold, ink: C.ink},
    {type: 'pin', from: 18, to: 24, x: 600, y: 1050, title: 'GAMBIT BAY', sub: 'GET STRANDED AT SEA'},
    {type: 'badge', from: 24, to: 41, top: 300, title: 'RANDOM EVENT', big: 'COOL DOG', bigSize: 100, color: C.gold, stamp: 'RESCUE', stampAt: 33},
    {type: 'tag', from: 41, to: 63, text: 'SECRET 2', color: C.mag},
    {type: 'pin', from: 43, to: 51, x: 520, y: 1050, title: 'COTTONMOUTH LAKE', sub: 'HEAD SOUTH'},
    {type: 'badge', from: 51, to: 55, top: 300, title: "FLORIDA'S BIGFOOT", big: 'SKUNK APE', bigSize: 100, color: C.mag},
    {type: 'tag', from: 63, to: 84, text: 'SECRET 3', color: C.cyan, ink: C.ink},
    {type: 'badge', from: 75, to: 84, top: 300, title: 'THE BAR CUSTOMERS ARE TALKING ABOUT', big: 'MOUNT CHILIAD', bigSize: 86, color: C.gold, stamp: 'GTA 5', stampAt: 82},
    {type: 'cta', from: 84, question: 'Which one are you hunting first?', qAt: 85, followAt: 93},
  ],
};
