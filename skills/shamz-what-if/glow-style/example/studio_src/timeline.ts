// Shot list for the Glow style 60 s test. Each shot: [script line, cue word or null (line start; 'word#2' = 2nd
// occurrence), set kind, params, marks {name: cue word} resolved to frames from the shot start].
import words from './words.json';
import lines from './lines.json';
import { SETS, SP } from './sets';
import React from 'react';

export const FPS = 30;
const LEAD = 4;
type E = [number, string | null, string, any, Record<string, string>?];
const N = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, '');
const SHAMZ = { shamz: true };

const LIST: E[] = [
  [0, null, 'hall', { mode: 'trip', tag: 'MONDAY · SCHOOL', tripAt: 16 }],
  [1, null, 'hall', { mode: 'floor', v: [[860, 780, 1.55], [880, 790, 1.7]] }],
  [2, null, 'hall', { mode: 'crowd', v: [[960, 600, 1.12], [960, 600, 1.0]], ov: { big: '50', sub: 'PEOPLE. AT LEAST.', y: 170 } }],
  [3, null, 'close', { eyes: 'worried', mouth: 'wobble', look: 0.1 }],
  [3, 'think', 'close', { eyes: 'wide', mouth: 'o', big: '?', bigC: '#FF5D5D', v: [[960, 520, 1.15], [960, 520, 1.25]] }],
  [4, null, 'time', { t: '2:00 AM', tag: 'TONIGHT' }],
  [4, 'replay', 'bedroom', { bubble: true, bubbleAt: 2, replays: 1, tag: 'TONIGHT' }],
  [5, null, 'bedroom', { bubble: true, bubbleAt: -20, replays: 2, v: [[1150, 460, 1.35], [1160, 450, 1.42]] }],
  [6, null, 'bedroom', { bubble: true, bubbleAt: -60, replays: 3, eyes: 'wide', v: [[780, 560, 1.55], [760, 560, 1.75]] }],
  [7, null, 'close', { warm: true, eyes: 'open', mouth: 'smile', look: 0.4, v: [[960, 500, 1.1], [960, 500, 1.0]] }],
  [8, null, 'lab', { mode: 'wait', tag: 'CORNELL UNIVERSITY', ov: { big: '2000', sub: 'A TEST', y: 200, x: 1400 } }],
  [9, null, 'lab', { mode: 'enter' }],
  [9, 'embarrassing', 'close', { shamz: false, hair: 'cap', hairC: '#3a2f5a', shirt: '#ff6fa8', print: 'cat', eyes: 'worried', mouth: 'wobble', v: [[960, 760, 1.4], [960, 740, 1.5]] }],
  [10, null, 'lab', { mode: 'ask', v: [[1250, 600, 1.25], [1250, 600, 1.35]] }],
  [11, null, 'crowd', { n: 20, lit: 10, stat: 'HALF', sub: 'WHAT THE STUDENTS GUESSED' }],
  [12, null, 'bars', {}, { go: 'four' }],
  [13, 'four', 'crowd', { n: 20, lit: 5, stat: '1 IN 4', sub: 'WHAT REALLY HAPPENED', cite: 'GILOVICH, MEDVEC & SAVITSKY (2000) · J. PERS. SOC. PSYCHOL.', v: [[960, 600, 1.08], [960, 600, 1.0]] }],
  [14, null, 'spot', { mode: 'one' }],
  [14, 'spotlight', 'spot', { mode: 'one', title: 'THE SPOTLIGHT EFFECT', titleAt: 2, v: [[960, 600, 1.0], [960, 600, 1.1]] }],
  [15, null, 'spot', { mode: 'follow' }],
  [16, null, 'spot', { mode: 'many' }],
  [17, null, 'close', { shamz: false, hair: 'bun', shirt: '#5b8cff', print: 'star', pose: 'shirt', eyes: 'worried', mouth: 'wobble', look: 0, v: [[960, 700, 1.25], [960, 700, 1.32]] }],
  [18, null, 'hall', { mode: 'trip', tripAt: 2, who: { hair: 'pony' }, v: [[1000, 600, 1.2], [1000, 600, 1.25]] }],
  [19, null, 'bedroom', { who: { hair: 'cap' }, eyes: 'wide', clock: '2:00', v: [[700, 560, 1.4], [700, 560, 1.5]] }],
  [20, null, 'bedroom', { bubble: true, bubbleAt: -30, replays: 4, tag: 'TONIGHT', v: [[960, 560, 1.12], [960, 560, 1.0]] }],
  [21, null, 'hall', { mode: 'ignored', v: [[960, 600, 1.0], [960, 600, 1.06]] }],
  [22, null, 'crowd', { n: 20, lit: 5, lit2: 0, phones: true }, { go: 'forgot' }],
  [23, null, 'end', {}],
];

type Wd = { w: string; s: number; e: number };
const W = words as Wd[];
const LN = lines as { text: string; i: number; n: number }[];
const at = (line: number, cue: string | null): number => {
  const l = LN[line];
  if (!cue) return W[l.i].s;
  const [c, k] = cue.split('#'); let hit = 0;
  for (let j = l.i; j < l.i + l.n; j++) if (N(W[j].w) === c && ++hit === (k ? +k : 1)) return W[j].s;
  throw new Error(`cue ${cue} not in line ${line}`);
};
export type Shot = { start: number; d: number; C: React.FC<SP>; p: any; m: Record<string, number>; kind: string };
const starts = LIST.map(([l, c]) => Math.max(0, Math.round(at(l, c) * FPS) - LEAD));
starts[0] = 0;
export const TOTAL = Math.round((W[W.length - 1].e + 4.5) * FPS);
export const SHOTS: Shot[] = LIST.map(([l, c, k, p, mk], i) => {
  const start = starts[i], end = i + 1 < LIST.length ? starts[i + 1] : TOTAL;
  const m: Record<string, number> = {};
  for (const [name, cue] of Object.entries(mk ?? {})) {
    // a mark's cue is searched from this line on
    let t = -1;
    for (let ln = l; ln < LN.length && t < 0; ln++) { try { t = at(ln, cue); } catch { /* next line */ } }
    m[name] = Math.round(t * FPS) - start;
  }
  return { start, d: end - start, C: SETS[k], p, m, kind: k };
});
export const WORDS = W;
