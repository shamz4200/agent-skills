// Shots in order. `cue` is the spoken word a shot starts on (searched forward from the previous shot's cue; `word#2`
// = its second occurrence from there). `marks` are words inside the shot that trigger something (local frames).
import React from 'react';
import wordsJson from './words.json';
import { Word } from './dossier';
import * as S from './shots';

export const FPS = 30;
export const WORDS = wordsJson as Word[];
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');
const find = (cue: string, from: number) => {
  const [w, n] = cue.split('#');
  let left = Number(n ?? 1);
  for (let i = from; i < WORDS.length; i++) if (norm(WORDS[i].w) === norm(w) && --left === 0) return i;
  throw new Error(`cue "${cue}" not found after word ${from}`);
};

type Def = { cue: string; C: React.FC<S.ShotP>; marks?: Record<string, string>; card?: boolean; whip?: boolean };
const DEFS: Def[] = [
  { cue: 'June', C: S.S1Airfield, marks: { tag: 'small' } },
  { cue: 'man', C: S.S2Cash, marks: { cash: 'cash' } },
  { cue: 'boards', C: S.S3Board },
  { cue: 'He', C: S.S4Name, marks: { name: 'Jan' } },
  { cue: 'Until', C: S.S5Office, marks: { stamp: 'yesterday' }, whip: true },
  { cue: "It's", C: S.S6Wirecard, marks: { moves: 'moves' } },
  { cue: 'Not', C: S.S7Scales, marks: { tip: 'worth' } },
  { cue: 'But', C: S.Card, card: true },
  { cue: 'Wirecard', C: S.S9Ledger, marks: { one: 'one', euros: 'euros' } },
  { cue: 'sitting', C: S.S10Map, marks: { two: 'two', phil: 'Philippines' } },
  { cue: 'The#2', C: S.S11Bank, marks: { never: 'never' } },
  { cue: 'The', C: S.S12Vault },
  { cue: 'It', C: S.Card, card: true },
  { cue: 'By', C: S.S14Warrant, marks: { warrant: 'warrant' } },
  { cue: 'the#2', C: S.S15Flight, marks: { landed: 'Belarus' }, whip: true },
  { cue: 'And', C: S.S16Gone, marks: { gone: 'gone' } },
  { cue: 'Years', C: S.S17Court },
  { cue: 'Russian', C: S.S18File, marks: { russian: 'intelligence' } },
  { cue: 'This', C: S.S19Invented, marks: { invented: 'invented', euros: 'euros' } },
  { cue: 'and', C: S.S20Vanish, marks: { vanished: 'vanished' } },
];

const LEAD = 4; // frames a shot starts ahead of its cue word
export type Shot = { start: number; d: number; C: React.FC<S.ShotP>; m: Record<string, number>; words: Word[]; card?: boolean; whip?: boolean };
export const SHOTS: Shot[] = (() => {
  let cur = -1;
  const idx = DEFS.map((d) => (cur = find(d.cue, cur + 1)));
  const starts = idx.map((i, k) => (k === 0 ? 0 : Math.max(0, Math.round(WORDS[i].s * FPS) - LEAD)));
  const total = Math.round(WORDS[WORDS.length - 1].e * FPS) + 75;
  return DEFS.map((d, k) => {
    const end = k + 1 < DEFS.length ? starts[k + 1] : total;
    const m: Record<string, number> = {};
    Object.entries(d.marks ?? {}).forEach(([name, w]) => { m[name] = Math.round(WORDS[find(w, idx[k])].s * FPS) - starts[k]; });
    return { start: starts[k], d: end - starts[k], C: d.C, m, words: WORDS.slice(idx[k], k + 1 < DEFS.length ? idx[k + 1] : WORDS.length), card: d.card, whip: d.whip };
  });
})();
export const TOTAL = SHOTS[SHOTS.length - 1].start + SHOTS[SHOTS.length - 1].d;
