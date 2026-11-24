import {C, Ep} from '../engine';
import words from '../../../hunting-money/words.json';
export const ep: Ep = {
  id: 'hunting-money', words: words as any, chip: 's3_smile.png',
  hl: {thousands: C.gold, right: C.teal, chapter: C.cyan, bret: C.teal, good: C.teal, pristine: C.gold, most: C.gold, gun: C.cyan, shrewsbury: C.cyan, big: C.mag, wortham: C.cyan, small: C.mag, wreck: C.red, bigger: C.gold, thousand: C.gold, hunted: C.cyan},
  shots: [
    {at: 0, plate: 's1_rifle', from: [1.3, 0, 6], to: [1.1, 0, 2]},
    {at: 17, plate: 'b_lodge', from: [1.2, 0, 0], to: [1.06, 0, 2], dim: 0.4},
    {at: 28, plate: 'b_deer', from: [1.1, 0, -2], to: [1.22, 0, 2], dim: 0.35},
    {at: 42, plate: 's2_scope', from: [1.1, 0, 2], to: [1.2, 2, 4]},
    {at: 60, plate: 'b_deer', from: [1.6, -6, 6], to: [1.7, -7, 7], dim: 0.55, blur: 8},
    {at: 73, plate: 'b_gator', from: [1.2, 3, 0], to: [1.05, 0, 0], dim: 0.4},
    {at: 87, plate: 's3_smile', from: [1.15, 0, 4], to: [1.03, 0, 0]},
  ],
  capY: [1480, 1420, 1420, 1400, 1420, 1420, 1250],
  overlays: [
    {type: 'tag', from: 2, to: 17, text: 'HUNT IT RIGHT', color: C.gold, ink: C.ink},
    {type: 'badge', from: 17, to: 28, top: 300, title: 'CHAPTER 2 · YOUR BUYER', big: 'BRET', bigSize: 120, color: C.teal, stamp: 'BUYS HUNTS', stampAt: 24},
    {type: 'list', from: 28, to: 42, top: 300, title: 'BRET ONLY TAKES', color: C.teal, stamp: 'YES', stampColor: C.teal, rows: [
      {at: 34, name: 'Good', icon: '✓', stampAt: 34}, {at: 36, name: 'Pristine', sub: 'pays the most', icon: '★', stamp: 'BEST', stampAt: 39}]},
    {type: 'versus', from: 47, to: 73, top: 300, title: 'THE RIGHT GUN', vs: '·', left: {label: 'BIG GAME', value: 'SM-69', color: C.mag, at: 48, size: 78, sub: 'deer · boar · bear · gator'}, right: {label: 'SMALL GAME', value: 'W-22', color: C.cyan, at: 61, size: 78, sub: "won't wreck it"}},
    {type: 'count', from: 77, to: 87, top: 900, label: 'PER ANIMAL · UP TO', value: 3000, fromV: 500, comma: true, prefix: '$', startAt: 79, endAt: 86, size: 150},
    {type: 'cta', from: 87, question: "What's the biggest thing you've hunted?", qAt: 88, followAt: 96},
  ],
};
