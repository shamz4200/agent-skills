import {C, Ep} from '../engine';
import words from '../../../heal-fast/words.json';
export const ep: Ep = {
  id: 'heal-fast', words: words as any, chip: 's3_flex.png',
  hl: {wrong: C.red, waiting: C.mag, white: C.cyan, line: C.cyan, fastest: C.teal, zombix: C.teal, square: C.cyan, x: C.cyan, fight: C.red, pink: C.mag, orange: C.gold, extra: C.gold, sleep: C.teal, safehouse: C.teal, gym: C.gold, heal: C.teal},
  shots: [
    {at: 0, plate: 's1_hurt', from: [1.3, 0, 6], to: [1.1, 0, 2]},
    {at: 13, plate: 'grad:#2a0d10,#06060a', from: [1, 0, 0], to: [1.05, 0, 0]},
    {at: 28, plate: 'b_cans', from: [1.2, 0, 0], to: [1.06, 0, 2], dim: 0.45},
    {at: 48, plate: 's2_drink', from: [1.1, 0, 2], to: [1.2, 0, 4]},
    {at: 52, plate: 'b_food', from: [1.2, 3, 0], to: [1.05, 0, 0], dim: 0.4},
    {at: 73, plate: 'b_bed', from: [1.25, -3, 3], to: [1.08, 0, 0], dim: 0.45},
    {at: 82, plate: 's3_flex', from: [1.15, 0, 4], to: [1.03, 0, 0]},
    {at: 91, plate: 's3_flex', from: [1.0, 0, 0], to: [1.1, 3, 2]},
  ],
  capY: [1480, 1420, 1420, 1400, 1420, 1420, 1400, 1250],
  overlays: [
    {type: 'tag', from: 2, to: 13, text: 'WAITING WON’T FILL IT', color: C.red},
    {type: 'badge', from: 13, to: 28, top: 640, bigSize: 110, title: 'HEALTH REFILLS ON ITS OWN UP TO', big: 'THE WHITE LINE', color: C.cyan, stamp: 'ONLY', stampAt: 24, bar: {from: 14, to: 24, segs: 10, min: 'EMPTY', cap: 'WHITE LINE', capAt: 24}},
    {type: 'badge', from: 28, to: 33, top: 300, title: 'FASTEST HEAL', big: 'ZOMBIX', bigSize: 120, color: C.teal, stamp: 'MID-FIGHT', stampAt: 32},
    {type: 'button', from: 33, to: 41, x: 90, y: 1000, glyph: 'L1', action: '+ SQUARE · PS', color: C.cyan, hold: true},
    {type: 'button', from: 41, to: 48, x: 90, y: 1000, glyph: 'LB', action: '+ X · XBOX', color: C.teal, hold: true},
    {type: 'versus', from: 52, to: 73, top: 300, title: 'FOOD HEARTS', vs: '·', left: {label: 'PINK HEART', value: 'FULL', color: C.mag, at: 56, sub: 'heals to max'}, right: {label: 'ORANGE HEART', value: '+EXTRA', color: C.gold, at: 64, sub: 'above your max'}},
    {type: 'badge', from: 73, to: 82, top: 300, title: 'BETWEEN JOBS', big: 'SLEEP IT OFF', color: C.teal, stamp: 'SAFEHOUSE', stampAt: 76},
    {type: 'badge', from: 82, to: 91, top: 1030, title: 'MORE MAX HEALTH FOR GOOD', big: 'HIT THE GYM', color: C.gold, stamp: '💪', stampAt: 89},
    {type: 'cta', from: 91, question: 'How do you heal?', qAt: 92, followAt: 98},
  ],
};
