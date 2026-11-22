import {C, Ep} from '../engine';
import words from '../../../bank-vaults/words.json';
export const ep: Ep = {
  id: 'bank-vaults', words: words as any, chip: 's3_smirk.png',
  hl: {stop: C.red, small: C.mag, seriously: C.mag, five: C.gold, thousand: C.gold, hundred: C.gold, vault: C.cyan, eight: C.cyan, locked: C.red,
    optional: C.teal, twist: C.mag, drill: C.red, blow: C.red, pick: C.red, van: C.cyan, cash: C.gold, follow: C.cyan, trophy: C.gold, first: C.cyan},
  shots: [
    {at: 0, plate: 's1_stop', from: [1.3, 0, 6], to: [1.1, 0, 2]},
    {at: 7, plate: 's1_stop', from: [1.6, -4, 14], to: [1.66, -4, 15]},
    {at: 8, plate: 's2_grin', from: [1.1, 0, 2], to: [1.2, 0, 5]},
    {at: 21, plate: 'grad:#3a2a06,#07070c', from: [1, 0, 0], to: [1.05, 0, 0]},
    {at: 31, plate: 'b_vault', from: [1.1, 0, -2], to: [1.2, 0, 2], dim: 0.45},
    {at: 43, plate: 'map', from: [1, 0, 0], to: [1.06, 0, -2]},
    {at: 61, plate: 'b_vault', from: [1.6, 8, 8], to: [1.7, 9, 9], dim: 0.6, blur: 10},
    {at: 73, plate: 'b_van', from: [1.2, 3, 2], to: [1.06, 0, 0], dim: 0.45},
    {at: 88, plate: 's3_smirk', from: [1.0, 0, 0], to: [1.12, 0, 4]},
    {at: 97, plate: 's3_smirk', from: [1.22, -3, 3], to: [1.08, 0, 0]},
  ],
  capY: [1480, 1480, 1420, 1420, 1500, 1560, 1300, 1420, 1320, 1250],
  overlays: [
    {type: 'tag', from: 2, to: 7, text: 'SMALL BANKS = SMALL MONEY', color: C.mag, ink: C.ink},
    {type: 'versus', from: 8, to: 21, top: 1000, title: 'WHAT ONE ROBBERY PAYS', left: {label: 'SMALL BANK', value: '$5K-45K', color: C.mag, at: 9, size: 76}, right: {label: 'BIG VAULT', value: '$205K', color: C.gold, at: 19}},
    {type: 'count', from: 21, to: 31, top: 760, label: 'UP TO', value: 205000, comma: true, prefix: '$', startAt: 21, endAt: 27, sub: '{gold:in one run}', subAt: 28, size: 190},
    {type: 'big', from: 33, to: 43, text: '8', x: 290, y: 470, w: 500, size: 560, fill: 'b_vault.png', stroke: C.gold, label: 'BIG VAULTS'},
    {type: 'tag', from: 38, to: 43, text: 'LOCKED UNTIL CHAPTER 4', color: C.red},
    {type: 'badge', from: 43, to: 61, top: 230, title: 'OPTIONAL MISSION · CHAPTER 4', big: "THAT'S WHERE THE MONEY IS", bigSize: 62, color: C.teal, stamp: 'UNLOCK', stampAt: 51},
    {type: 'pin', from: 54, to: 61, x: 660, y: 1180, title: 'CAFE', sub: 'OCEAN BEACH · START HERE'},
    {type: 'list', from: 61, to: 73, top: 330, title: 'THE VAULT DOOR', color: C.red, stamp: 'NOPE', rows: [
      {at: 66, name: 'Drill it', icon: '🛠', stampAt: 67}, {at: 68, name: 'Blow it', icon: '💥', stampAt: 69}, {at: 71, name: 'Pick it', icon: '🔓', stampAt: 72}]},
    {type: 'badge', from: 73, to: 88, top: 330, title: 'THE ONLY WAY IN', big: 'FOLLOW THE VAN', color: C.gold, stamp: 'CASH DROP', stampAt: 82},
    {type: 'flow', from: 79, to: 88, top: 740, title: 'VAULT OPENS ONLY DURING A DELIVERY', left: 'ARMORED\nVAN', right: 'VAULT\nOPEN', rightColor: C.gold, blockAt: 1e6, blockText: ''},
    {type: 'badge', from: 88, to: 97, top: 1020, title: 'ROB 5 VAULTS', big: '🏆 MAXIMUM WITHDRAWAL', bigSize: 58, color: C.gold, stamp: 'TROPHY', stampAt: 95},
    {type: 'cta', from: 97, question: 'Which bank are you hitting first?', qAt: 98, followAt: 106},
  ],
};
