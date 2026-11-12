// The episode's shot list. Each entry: [script line, cue word in that line (null = line start; `word#2` = second
// occurrence), kind, params, marks (name -> word in the line, giving a local frame), flag ('card' | 'whip')].
// Line numbers are the spoken lines of script.md, in order (lines.json).
import React from 'react';
import wordsJson from './words.json';
import linesJson from './lines.json';
import chaptersJson from './chapters.json';
import { C, TypeCard, Word } from './dossier';
import * as K from './kit2';
import * as S from './sets';
import * as Cold from './cold';

export const FPS = 30;
export const WORDS = wordsJson as Word[];
const LINES = linesJson as Array<{ chapter: string; text: string; i: number; n: number }>;
export const CHAPTERS = chaptersJson as Array<{ title: string; s: number; e: number }>;

const Card: React.FC<K.SP> = ({ gf, words }) => React.createElement(TypeCard, { words, fps: FPS, gf });
const KINDS: Record<string, React.FC<any>> = {
  card: Card, desk: S.ShamzDesk, office: S.Office, street: S.Street, table: S.Table, stage: S.Stage, dax: S.Dax, sheet: S.Sheet, sites: S.Sites,
  gadgets: S.Gadgets, target: S.Target, end: S.EndCard, jet: S.Jet, paycard: S.PayCard,
  doc: K.Doc, news: K.News, chart: K.Chart, bignum: K.BigNum, cal: K.Cal, map: K.MapShot, term: K.Term, chat: K.Chat, flow: K.Flow,
  S1: Cold.S1Airfield, S2: Cold.S2Cash, S3: Cold.S3Board, S4: Cold.S4Name, S5: Cold.S5Office, S6: Cold.S6Wirecard, S7: Cold.S7Scales, S9: Cold.S9Ledger, S10: Cold.S10Map,
  S11: Cold.S11Bank, S12: Cold.S12Vault, S14: Cold.S14Warrant, S15: Cold.S15Flight, S16: Cold.S16Gone, S17: Cold.S17Court, S18: Cold.S18File, S19: Cold.S19Invented, S20: Cold.S20Vanish,
};

type E = [number, string | null, string, any?, Record<string, string>?, ('card' | 'whip')?];
const DAY = { win: 'day', wall: '#c9b98a' };
const BRAUNKEY = (text: string, extra: any = {}) => ({ kind: 'keynote', screen: 'text', text, cast: [{ k: 'braunS', x: 420, s: 1.9, lit: 1, mouth: 'talk', arms: [null, [110, -220]] }], ...extra });
const FT = { who: 'mccrum', win: 'night', props: ['monitor', 'pink', 'pinkwall', 'phone'], wall: '#3a2f3a', plate: 'FINANCIAL TIMES' };
const WD = { who: 'watchdog', win: 'night', props: ['emblem', 'papers'], plate: 'FINANCIAL WATCHDOG' };
const LAW = { who: 'lawyer', win: 'sg', props: ['monitor', 'papers'], plate2: 'LEGAL · ASIA' };
const AUD_L = [{ k: 'auditor', x: 520 }, { k: 'auditor2', x: 760 }];
const BAR = { kind: 'bar', left: [{ k: 'mars', x: 560, mouth: 'talk', hold: 'glass' }], right: [{ k: 'worker', x: 1240, eyes: 'happy', mouth: 'smile' }, { k: 'worker2', x: 1480, eyes: 'happy', mouth: 'smile' }] };
const LUNCH = { kind: 'lunch', left: [{ k: 'mars', x: 560, mouth: 'smile' }], right: [{ k: 'trader', x: 1280 }, { k: 'trader2', x: 1520 }] };
const SIX = [{ k: 'bul1', x: 310 }, { k: 'bul2', x: 570 }, { k: 'roussev', x: 830 }, { k: 'bul3', x: 1090 }, { k: 'bul4', x: 1350 }, { k: 'bul5', x: 1610 }].map((c) => ({ ...c, s: 1.35, eyes: 'open', mouth: 'line' }));
const SAVERS = { kind: 'spot', cx: 1000, cast: [{ k: 'saver', x: 700 }, { k: 'saver2', x: 1000 }, { k: 'worker2', x: 1300 }].map((c) => ({ ...c, s: 1.5, hold: 'piggy', eyes: 'worried', mouth: 'frown' })) };
const REPORTERS = { kind: 'audit', head: 'THE REPORTERS', board: 'Where did the jet go?', left: [{ k: 'grozev', x: 560 }, { k: 'editor', x: 800 }], right: [{ k: 'worker', x: 1360 }], laptops: true };
const IMM = { title: 'IMMIGRATION · MANILA', lines: ['NAME: MARSALEK, JAN', 'ARRIVED: 23 JUNE 2020', 'DEPARTED: 24 JUNE  >  CHINA'], big: true };
const ASIA3 = [{ c: 'dubai', at: 'Dubai' }, { c: 'singapore', at: 'Singapore' }, { c: 'manila', at: 'Manila', side: 'l' }];

const SHOTLIST: E[] = [
  // ---------------------------------------------------------------- cold open (the approved test)
  [0, null, 'S1', {}, { tag: 'small' }], [0, 'man', 'S2', {}, { cash: 'cash' }], [0, 'boards', 'S3'],
  [1, null, 'S4', {}, { name: 'Jan' }], [1, 'Until', 'S5', {}, { stamp: 'yesterday' }, 'whip'],
  [2, null, 'S6', {}, { moves: 'moves' }], [2, 'Not', 'S7', {}, { tip: 'worth' }],
  [3, null, 'card', {}, {}, 'card'],
  [4, null, 'S9', {}, { one: 'one', euros: 'euros' }], [4, 'sitting', 'S10', {}, { two: 'two', phil: 'Philippines' }],
  [5, null, 'S11', {}, { never: 'never' }],
  [6, null, 'S12'], [6, 'It', 'card', {}, {}, 'card'],
  [7, null, 'S14', {}, { warrant: 'warrant' }], [7, 'the#2', 'S15', {}, { landed: 'Belarus' }, 'whip'], [7, 'And', 'S16', {}, { gone: 'gone' }],
  [8, null, 'S17'], [8, 'Russian', 'S18', {}, { russian: 'intelligence' }],
  [9, null, 'S19', {}, { invented: 'invented', euros: 'euros' }], [9, 'and', 'S20', {}, { vanished: 'vanished' }],

  // ---------------------------------------------------------------- 1. The Company Nobody Understood
  [10, null, 'desk', { mode: 'intro' }], [10, "I've", 'desk', { mode: 'read', v: 'close', file: true }],
  [11, null, 'map', { v: [[340, 270, 2.2], [360, 265, 2.6]], pins: [{ c: 'munich', label: 'Near Munich · 1999' }] }],
  [11, 'A', 'office', { who: 'worker', who2: 'worker2', ...DAY, props: ['crt', 'poster'], loc: 'Aschheim, near Munich · 1999' }],
  [11, 'start', 'office', { who: 'worker', ...DAY, props: ['crt', 'poster'], v: 'close', face: { mouth: 'smile' } }],
  [12, null, 'flow', { title: "WIRECARD'S ONE JOB", nodes: [{ x: 360, y: 600, label: 'YOUR CARD', who: 'saver2' }, { x: 960, y: 600, label: 'WIRECARD', color: '#0e3a22' }, { x: 1560, y: 600, label: 'THE SHOP', who: 'worker' }], edges: [[0, 1], [1, 2]], step: 18 }, { go: 'moves' }],
  [13, null, 'office', { who: 'worker2', ...DAY, props: ['crt'], face: { eyes: 'worried', mouth: 'frown', arms: [[-110, -120], [110, -120]] }, bubble: 'Sell online? No.', loc: 'Most shops · 1999' }],
  [13, 'So', 'sites', {}, { gamble: 'Gambling', adult: 'adult' }],
  [14, null, 'cal', { month: 'THE YEAR', day: '2002' }],
  [14, 'a', 'office', { who: 'braun', ...DAY, props: ['crt', 'poster'], tag: ['Markus Braun', 'Chief executive from 2002'], face: { mouth: 'smile' } }, { tag: 'Markus' }],
  [15, null, 'office', { who: 'braun', ...DAY, props: ['crt', 'poster'], v: 'close' }],
  [15, 'who', 'stage', BRAUNKEY('THE FUTURE')],
  [16, null, 'chart', { mode: 'rise', title: 'WIRECARD · SALES' }], [16, 'Every', 'stage', { kind: 'keynote', text: 'WIRECARD · SALES', cast: [{ k: 'braunS', x: 420, s: 1.9, lit: 1, mouth: 'smile', arms: [null, [120, -230]] }] }],
  [17, null, 'map', { v: [[1380, 600, 1.5], [1440, 640, 1.7]], pins: [{ c: 'mumbai', label: 'Bought', at: 6, side: 'l' }, { c: 'kuala', label: 'Bought', at: 16, side: 'l' }, { c: 'hongkong', label: 'Bought', at: 26 }, { c: 'chennai', label: 'Bought', at: 36 }] }],
  [18, null, 'doc', { title: 'BANKING LICENCE', kicker: 'GERMANY', big: 'Wirecard Bank', stamp: 'GRANTED', stampColor: C.greenD }, { stamp: 'licence' }], [18, 'It#2', 'paycard'],
  [19, null, 'map', { v: [[1150, 640, 1.2], [1250, 660, 1.32]], pins: ASIA3, routes: [{ a: 'munich', b: 'dubai', at: 'Dubai', plane: false, dur: 16 }, { a: 'munich', b: 'singapore', at: 'Singapore', plane: false, dur: 16 }, { a: 'munich', b: 'manila', at: 'Manila', plane: false, dur: 16 }] }, { Dubai: 'Dubai', Singapore: 'Singapore', Manila: 'Manila' }],
  [20, null, 'stage', { kind: 'keynote', text: 'WIRECARD · SHARE PRICE', cast: [{ k: 'braunS', x: 420, s: 1.9, lit: 1, eyes: 'happy', mouth: 'smile', arms: [[-100, -200], [100, -200]] }] }],
  [20, 'Germany', 'street', { kind: 'tower', cast: [{ k: 'saver', x: 420, s: 1.0, eyes: 'happy', mouth: 'smile', arms: [[-60, -230], [60, -230]] }, { k: 'saver2', x: 640, s: 1.0, eyes: 'happy', mouth: 'smile' }, { k: 'worker', x: 1340, s: 1.0, flip: true, eyes: 'happy', mouth: 'smile', arms: [[-60, -230], [60, -230]] }], loc: 'Germany · 2018', rain: false }],
  [20, 'Finally', 'chart', { mode: 'rise', title: 'WIRECARD · SHARE PRICE' }],
  [21, null, 'news', { mast: 'THE MARKET DAILY', head: "GERMANY'S ANSWER|TO PAYPAL", date: '2018' }],
  [22, null, 'bignum', { to: 7, suffix: '%', caption: "BRAUN'S SHARE OF WIRECARD", fast: true }],
  [22, 'On', 'office', { who: 'braun', win: 'night', v: 'close', face: { eyes: 'happy', mouth: 'smile' }, props: ['monitor'], screen: '€ € €' }],
  [23, null, 'bignum', { to: 24000000000, prefix: '€', caption: 'WHAT WIRECARD IS WORTH · 2018' }, { go: 'worth' }],
  [24, null, 'dax', { mode: 'join' }, { go: 'joins' }],
  [25, null, 'dax', { mode: 'kick' }, { go: 'kicks' }], [25, 'A', 'street', { kind: 'bank1870', cast: [{ k: 'saver', x: 420, s: 1.0, eyes: 'worried' }], loc: 'Frankfurt', dark: 0.5 }],
  [26, null, 'card', {}, {}, 'card'],
  [27, null, 'desk', { mode: 'think' }], [27, 'where', 'desk', { mode: 'think', v: 'close' }],
  [28, null, 'bignum', { to: 50, suffix: '%', caption: 'ABOUT HALF OF ALL SALES', sub: 'from just three partner companies', fast: true }],
  [28, 'One', 'map', { v: [[1150, 640, 1.2], [1250, 660, 1.32]], pins: [{ c: 'dubai', label: 'Partner 1', at: 'Dubai' }, { c: 'singapore', label: 'Partner 2', at: 'Singapore' }, { c: 'manila', label: 'Partner 3', at: 'Philippines', side: 'l' }] }, { Dubai: 'Dubai', Singapore: 'Singapore', Philippines: 'Philippines' }],
  [29, null, 'desk', { mode: 'ask' }],
  [29, 'In', 'flow', { title: 'HOW A PARTNER WORKS', nodes: [{ x: 330, y: 600, label: 'SHOPPERS', sub: 'abroad' }, { x: 960, y: 600, label: 'LOCAL PARTNER', sub: 'has the licence', color: '#4a3a12', subC: C.gold }, { x: 1590, y: 600, label: 'WIRECARD', sub: 'gets its share', color: '#0e3a22' }], edges: [[0, 1], [1, 2]], step: 60 }, { go: 'a' }],
  [30, null, 'sheet', { title: 'PARTNER SALES', total: 'ABOUT €1 BILLION' }], [30, 'Only', 'desk', { mode: 'think', v: 'close' }],
  [31, null, 'desk', { mode: 'point', v: [[715, 250, 1.6], [715, 250, 2.4]] }],

  // ---------------------------------------------------------------- 2. The Man With Two Lives
  [32, null, 'office', { who: 'mars', ...DAY, props: ['crt'], tag: ['Jan Marsalek', 'Joins in 2000 · aged 20'], face: { mouth: 'smile' } }, { tag: 'joins' }],
  [32, 'with', 'doc', { title: 'JOB APPLICATION', rows: [['NAME', 'JAN MARSALEK'], ['UNIVERSITY DEGREE', 'NONE']], photo: 'mars', stamp: 'HIRED', stampColor: C.greenD, stampY: 660 }],
  [33, null, 'office', { who: 'mars', win: 'night', plate2: 'J. MARSALEK · COO', props: ['monitor', 'shelf'], tag: ['Chief Operating Officer', 'From 2010 · aged 30'], v: 'pull' }, { tag: 'chief' }],
  [33, 'The#2', 'stage', { kind: 'spot', cx: 960, cast: [{ k: 'braun', x: 800, s: 1.5, hold: 'sign:No. 1' }, { k: 'mars', x: 1120, s: 1.5, mouth: 'smirk', hold: 'sign:No. 2' }] }],
  [34, null, 'table', BAR], [34, 'and', 'map', { routes: [{ a: 'munich', b: 'dubai', at: 2, dur: 14 }, { a: 'dubai', b: 'singapore', at: 14, dur: 14 }, { a: 'singapore', b: 'manila', at: 26, dur: 12 }], v: [[1100, 600, 1.15], [1200, 620, 1.25]] }],
  [35, null, 'jet', { who: 'mars' }],
  [35, 'Five', 'street', { kind: 'tower', sign: 'GRAND HOTEL', signC: C.gold, cast: [{ k: 'mars', walk: [400, 860], s: 1.0, hold: 'suitcase' }], rain: false }],
  [35, 'Meetings', 'office', { props: ['keypad', 'nolamp'], plate: 'PRIVATE', dark: true, wall: '#232a44', v: [[1400, 520, 1.3], [1480, 520, 1.7]] }],
  [36, null, 'map', { v: [[1250, 640, 1.3], [1300, 660, 1.42]], pins: [{ c: 'dubai', at: 4 }, { c: 'singapore', at: 10 }, { c: 'manila', at: 16, side: 'l' }], title: "MARSALEK'S TERRITORY" }],
  [36, 'Their', 'flow', { nodes: [{ x: 330, y: 330, label: 'PARTNER 1' }, { x: 330, y: 600, label: 'PARTNER 2' }, { x: 330, y: 870, label: 'PARTNER 3' }, { x: 1000, y: 640, label: 'MARSALEK', who: 'mars', color: '#3a1418' }, { x: 1600, y: 640, label: 'THE BOOKS', color: '#0e3a22' }], edges: [[0, 3], [1, 3], [2, 3], [3, 4]], step: 5 }],
  [37, null, 'office', { who: 'mars', win: 'night', v: 'close', face: { mouth: 'smirk', eyes: 'happy' }, props: ['monitor'] }], [37, 'Spies', 'card', {}, {}, 'card'],
  [38, null, 'street', { kind: 'villa', cast: [{ k: 'mars', x: 560, s: 0.9, hold: 'phone' }], loc: 'Munich', rain: false }],
  [38, 'right', 'street', { kind: 'villa', v: [[1100, 560, 1.3], [1420, 520, 1.7]], cast: [{ k: 'mars', x: 560, s: 0.9, hold: 'phone' }], rain: false }],
  [39, null, 'table', { ...BAR, v: 'l' }],
  [39, 'friends', 'stage', { kind: 'spot', cx: 960, cast: [{ k: 'spy', x: 700, s: 1.5 }, { k: 'spy', x: 960, s: 1.5, seed: 5 }, { k: 'spy', x: 1220, s: 1.5, seed: 8 }] }],
  [39, 'and', 'map', { v: [[400, 520, 2.0], [420, 540, 2.3]], hi: [{ k: 'libya', label: 'LIBYA', color: C.gold, at: 4 }], pins: [{ c: 'tripoli', label: 'His plans', at: 12 }] }],
  [40, null, 'table', { ...BAR, v: 'r', right: [{ k: 'worker', x: 1240, eyes: 'closed', mouth: 'smirk' }, { k: 'worker2', x: 1480, eyes: 'happy', mouth: 'smile' }] }],
  [41, null, 'map', { v: [[190, 250, 2.6], [200, 250, 3.0]], pins: [{ c: 'london', label: 'London · 2018' }] }],
  [41, 'he', 'table', { ...LUNCH, loc: 'London · 2018' }], [41, 'shows', 'table', { ...LUNCH, docs: true, v: 'doc' }],
  [42, null, 'doc', { title: 'TOP SECRET', kicker: 'CHEMICAL WEAPONS FILE', formula: true, stamp: 'NOVICHOK', red: true, lines: 0, stampY: 300 }, { stamp: 'Novichok' }],
  [42, 'The#2', 'news', { mast: 'THE EVENING POST', head: 'FORMER RUSSIAN SPY|POISONED IN ENGLAND', date: 'MARCH 2018' }],
  [43, null, 'desk', { mode: 'think', v: 'close' }],
  [44, null, 'table', { kind: 'lunch', docs: true, v: 'r', left: [{ k: 'mars', x: 560, mouth: 'smirk' }], right: [{ k: 'trader', x: 1280, eyes: 'closed', look: [0, 1] }, { k: 'trader2', x: 1520, eyes: 'worried', look: [-1, 0.5] }] }],
  [45, null, 'desk', { v: 'board', pins: ['mars', 'spy', 'braun'], note: 'Moscow?' }],
  [45, 'Russian', 'map', { v: [[700, 180, 1.8], [720, 170, 2.0]], hi: [{ k: 'russia', label: 'RUSSIA', at: 2, dx: -700, dy: 80 }], pins: [{ c: 'moscow', label: 'Moscow', at: 10 }] }],
  [46, null, 'table', BAR], [46, 'The#2', 'office', { who: 'mars', win: 'night', props: ['monitor', 'phone'], face: { eyes: 'happy', mouth: 'smile', arms: [[-110, -130], [110, -130]] }, plate2: 'J. MARSALEK · COO' }],
  [47, null, 'office', { who: 'mars', win: 'night', props: ['monitor', 'phone'], v: 'close', face: { eyes: 'open', mouth: 'line' }, dark: true, plate2: 'J. MARSALEK · COO' }],

  // ---------------------------------------------------------------- 3. The Reporter
  [48, null, 'map', { v: [[190, 250, 2.6], [200, 250, 3.0]], pins: [{ c: 'london', label: 'London · 2015' }] }],
  [48, 'A', 'office', { ...FT, tag: ['Dan McCrum', 'Reporter · Financial Times'] }, { tag: 'Dan' }],
  [48, 'gets', 'office', { ...FT, v: 'close', face: { eyes: 'wide', mouth: 'o', arms: [null, [46, -190]] }, bubble: 'Look at Wirecard.' }, { bubble: 'Look' }],
  [49, null, 'office', { ...FT, v: 'screen' }], [49, 'And', 'sheet', { title: 'WIRECARD · THE ACCOUNTS', total: '? ? ?', clear: true }],
  [50, null, 'chart', { mode: 'smooth', title: 'WIRECARD · PROFIT' }], [50, 'Companies', 'street', { kind: 'shack', cast: [], rain: false }],
  [50, 'Offices', 'street', { kind: 'ghost', cast: [{ k: 'mccrum', x: 480, s: 1.0, hold: 'notepad' }] }],
  [51, null, 'news', { mast: 'FINANCIAL TIMES', pink: true, head: 'THE HOUSE|OF WIRECARD', date: '2015' }], [51, 'The#2', 'stage', BRAUNKEY('LIES!')],
  [52, null, 'stage', { kind: 'spot', cx: 960, cast: [{ k: 'trader', x: 700, s: 1.4, hold: 'sign:?' }, { k: 'trader2', x: 960, s: 1.4, hold: 'sign:?' }, { k: 'saver2', x: 1220, s: 1.4, hold: 'sign:?' }] }],
  [52, 'In', 'doc', { title: 'ANONYMOUS REPORT', kicker: '2016', big: 'FRAUD?', note: 'author: unknown', red: true }],
  [53, null, 'chart', { mode: 'dip', title: 'WIRECARD · SHARE PRICE', red: true }],
  [53, "Germany's", 'office', { ...WD, tag: ['BaFin', "Germany's financial watchdog"] }, { tag: 'watchdog' }],
  [53, 'investigates', 'stage', { kind: 'spot', cx: 960, cast: [{ k: 'trader', x: 760, s: 1.4, eyes: 'worried' }, { k: 'trader2', x: 1100, s: 1.4, eyes: 'worried' }], stamp: 'INVESTIGATED' }],
  [54, null, 'map', { v: [[1560, 900, 2.2], [1570, 910, 2.6]], pins: [{ c: 'singapore', label: 'Singapore · 2018', side: 'l' }] }],
  [54, 'a', 'office', { ...LAW, tag: ['The lawyer', "Wirecard's head of legal in Asia"] }, { tag: 'lawyer' }],
  [54, 'finds', 'office', { ...LAW, v: 'close', face: { eyes: 'wide', mouth: 'o' } }],
  [55, null, 'doc', { title: 'CONTRACT', rows: [['CUSTOMER', '?'], ['SIGNED BY', '?']], stamp: 'FAKED?', red: true }, { stamp: 'faking' }],
  [55, 'and', 'flow', { title: 'THE SAME MONEY, ROUND AND ROUND', nodes: [{ x: 960, y: 360, label: 'WIRECARD ASIA', color: '#0e3a22' }, { x: 520, y: 820, label: 'COMPANY A' }, { x: 1400, y: 820, label: 'COMPANY B' }], edges: [[0, 1], [1, 2], [2, 0]], step: 6 }],
  [56, null, 'street', { kind: 'sg', cast: [{ k: 'lawyer', x: 0, walk: [900, 1500], s: 1.0, hold: 'box' }] }],
  [56, 'But', 'street', { kind: 'sg', v: 'close', cx: 1300, cast: [{ k: 'lawyer', x: 1300, s: 1.0, hold: 'usb', mouth: 'smirk' }] }],
  [56, 'And', 'map', { routes: [{ a: 'singapore', b: 'london', at: 2, dur: 30, bend: 0.12 }], pins: [{ c: 'london', label: 'Financial Times', at: 28 }] }],
  [57, null, 'news', { mast: 'FINANCIAL TIMES', pink: true, head: 'WIRECARD: FORGED|CONTRACTS SUSPECTED', date: '30 JANUARY 2019' }],
  [57, "Wirecard's", 'chart', { mode: 'crash', title: 'WIRECARD · SHARE PRICE' }],
  [58, null, 'street', { kind: 'sg', cast: [{ k: 'police', x: 0, walk: [300, 720], s: 1.0 }, { k: 'police2', x: 0, walk: [120, 540], s: 1.0 }, { k: 'police', x: 1320, s: 1.0, hold: 'box', flip: true, seed: 9 }], loc: 'Singapore · February 2019' }],
  [59, null, 'desk', { mode: 'intro', pins: ['mars', 'braun', 'mccrum'] }], [59, 'I', 'desk', { mode: 'read', v: 'close', file: true, pins: ['mars', 'braun', 'mccrum'] }],
  [60, null, 'office', WD], [60, 'But', 'office', { ...WD, v: 'close', face: { eyes: 'closed', mouth: 'line' } }],
  [61, null, 'doc', { title: 'OFFICIAL ORDER', kicker: 'FINANCIAL WATCHDOG · FEBRUARY 2019', big: 'No betting', note: "against Wirecard's shares", stamp: '2 MONTHS' }, { stamp: 'two' }],
  [62, null, 'doc', { title: 'CRIMINAL COMPLAINT', rows: [['AGAINST', 'THE REPORTERS'], ['NEWSPAPER', 'FINANCIAL TIMES']], photo: 'mccrum', stamp: 'FILED', red: true, stampY: 660 }, { stamp: 'Against' }],
  [62, 'Against', 'office', { ...FT, v: 'close', face: { eyes: 'wide', mouth: 'o' } }],
  [63, null, 'news', { mast: 'DIE MORGENZEITUNG', head: 'ATTACK ON A|GERMAN CHAMPION', date: '2019' }],
  [63, "It's", 'map', { v: [[300, 290, 2.2], [320, 290, 2.5]], hi: [{ k: 'germany', color: C.green, at: 2 }], pins: [{ c: 'london', label: 'The reporters', side: 'l', at: 8 }, { c: 'munich', label: 'Wirecard', color: C.green, at: 2 }] }],
  [64, null, 'stage', { kind: 'spot', cx: 960, cast: [{ k: 'auditor', x: 740, s: 1.4, hold: 'case' }, { k: 'auditor2', x: 960, s: 1.4, hold: 'case' }, { k: 'detective', x: 1200, s: 1.4, hold: 'camera' }] }],
  [64, 'private', 'street', { kind: 'plain', lamp: 1240, cast: [{ k: 'mccrum', x: 0, walk: [460, 900], s: 1.0, hold: 'pink' }, { k: 'detective', x: 1480, s: 1.0, flip: true, hold: 'camera' }], cctv: 'LONDON 22:41' }],
  [65, null, 'office', { who: 'mccrum', win: 'none', props: ['keypad', 'crt', 'pink', 'nolamp'], wall: '#2a2f3a', dark: true, loc: 'Financial Times · the locked room' }],
  [65, 'to', 'office', { who: 'mccrum', win: 'none', props: ['keypad', 'crt', 'pink', 'nolamp', 'cable'], wall: '#2a2f3a', v: [[1380, 760, 1.7], [1440, 840, 2.1]] }],
  [66, null, 'office', { ...FT, v: 'close', face: { eyes: 'open', mouth: 'smirk' } }],
  [66, 'They', 'map', { routes: [{ a: 'london', b: 'manila', at: 2, dur: 44, bend: 0.14 }], pins: [{ c: 'manila', label: 'Partner address', at: 40, side: 'l' }] }],
  [67, null, 'street', { kind: 'tropic', cast: [{ k: 'worker2', x: 520, s: 1.0, hold: 'notepad' }], loc: 'The Philippines · 2019' }],
  [67, 'And', 'street', { kind: 'tropic', v: 'close', cx: 940, cast: [{ k: 'worker2', x: 740, s: 1.0, hold: 'notepad' }, { k: 'sailor', x: 1120, s: 1.0, flip: true, shake: true, arms: [[-110, -120], [110, -120]], bubble: 'Wire-what?', bubbleAt: 'never' }] }, { never: 'never' }],
  [68, null, 'sheet', { title: 'WIRECARD · INTERNAL · PARTNER CUSTOMERS', total: 'PUBLISHED · OCT 2019', clear: true, pink: true }],
  [69, null, 'office', { who: 'braun', win: 'night', props: ['phone', 'monitor'], face: { eyes: 'happy', mouth: 'smile' }, v: 'close' }],
  [69, 'That', 'map', { routes: [{ a: 'berlin', b: 'beijing', at: 2, dur: 36, bend: 0.1 }], pins: [{ c: 'beijing', label: 'Beijing · Sept 2019', at: 34, side: 'l' }] }],
  [69, 'Chancellor', 'stage', { kind: 'summit', cast: [{ k: 'merkel', x: 620, s: 1.5, mouth: 'talk', arms: [null, [100, -200]] }], tag: ['Angela Merkel', 'Chancellor of Germany'], tagX: 760, tagY: 420, tagTo: [660, 620] }, { tag: 'Angela' }],
  [70, null, 'chart', { mode: 'dip', title: 'WIRECARD · SHARE PRICE · OCT 2019', red: true }],
  [70, 'To', 'street', { kind: 'tower', tx: 1300, cast: [{ k: 'auditor', x: 0, walk: [260, 760], s: 1.0, hold: 'case' }, { k: 'auditor2', x: 0, walk: [100, 600], s: 1.0, hold: 'case' }, { k: 'auditor', x: 0, walk: [-60, 440], s: 1.0, hold: 'case', seed: 9 }], tag: ['KPMG', 'The special auditors'], tagX: 300, tagY: 420, tagTo: [600, 700] }, { tag: 'KPMG' }],
  [71, null, 'card', {}, {}, 'card'],

  // ---------------------------------------------------------------- 4. The Missing Billions
  [72, null, 'table', { kind: 'audit', left: AUD_L, right: [{ k: 'mars', x: 1360 }], laptops: true }],
  [72, 'Can', 'table', { kind: 'audit', v: 'l', left: [{ k: 'auditor', x: 520, mouth: 'talk' }, { k: 'auditor2', x: 760 }], right: [{ k: 'mars', x: 1360 }], laptops: true, board: 'Can we see the money?' }],
  [73, null, 'table', { kind: 'audit', v: 'r', left: AUD_L, right: [{ k: 'mars', x: 1360, mouth: 'talk', arms: [[-110, -120], [110, -120]] }], laptops: true }],
  [73, 'one', 'bignum', { to: 1900000000, prefix: '€', caption: 'IN SPECIAL ACCOUNTS' }],
  [73, 'looked', 'stage', { kind: 'spot', cx: 900, cast: [{ k: 'trader2', x: 900, s: 1.6, hold: 'case' }], tag: ['The trustee', 'Looks after the money'], tagX: 1060, tagY: 520, tagTo: [960, 640] }],
  [74, null, 'map', { v: [[1560, 760, 1.8], [1600, 720, 1.9]], pins: [{ c: 'singapore', label: 'First: Singapore', at: 2, side: 'l' }, { c: 'manila', label: 'Then: 2 banks', at: 'Then', side: 'l' }], routes: [{ a: 'singapore', b: 'manila', at: 'Then', dur: 20, plane: false, color: C.green }] }, { Then: 'Then' }],
  [75, null, 'desk', { mode: 'shock', pins: ['mars', 'braun', 'mccrum'] }],
  [75, 'For', 'office', { who: 'auditor', win: 'night', props: ['stack', 'phone', 'clock'], plate: 'THE AUDITORS', face: { eyes: 'closed', mouth: 'line' } }],
  [75, 'asked', 'office', { who: 'auditor', win: 'night', props: ['stack', 'phone', 'clock'], plate: 'THE AUDITORS', v: [[1110, 730, 2.0], [1110, 730, 2.5]] }],
  [76, null, 'doc', { title: 'ACCOUNT CONFIRMATION', big: '€1.9 billion', note: '(a copy of a copy)' }],
  [76, 'And', 'office', { props: ['monitor', 'nolamp'], screen: 'BALANCE: €1.9 BN', v: 'screen', dark: true }],
  [77, null, 'table', { kind: 'audit', fast: true, board: 'Month 6...', left: [{ k: 'auditor', x: 520, eyes: 'worried' }, { k: 'auditor2', x: 760, eyes: 'worried' }], right: [{ k: 'mars', x: 1360, arms: [[-110, -120], [110, -120]], mouth: 'smirk' }], laptops: true }],
  [77, 'A', 'doc', { title: 'REQUEST No. 14', rows: [['WE NEED', 'A BANK STATEMENT'], ['OR JUST', 'A PHONE CALL']], stamp: 'NO REPLY', stampY: 660 }, { stamp: 'Anything' }],
  [78, null, 'cal', { month: 'APRIL 2020', day: '28' }],
  [78, 'It', 'doc', { title: 'SPECIAL AUDIT REPORT', kicker: 'KPMG · 28 APRIL 2020', rows: [['DOES THE €1.9 BILLION', 'EXIST?']], stamp: 'CANNOT CONFIRM', red: true }, { stamp: 'cannot' }],
  [79, null, 'stage', BRAUNKEY("DON'T WORRY")],
  [80, null, 'office', { who: 'auditor2', win: 'night', props: ['stack', 'shelf'], plate: 'EY · THE REGULAR AUDITOR', tag: ['EY', 'Signed the accounts since 2009'] }, { tag: 'EY' }],
  [80, 'Now', 'office', { who: 'auditor2', win: 'night', props: ['stack', 'shelf'], v: 'close', face: { eyes: 'worried', mouth: 'frown' } }],
  [81, null, 'map', { routes: [{ a: 'munich', b: 'manila', at: 2, dur: 34, plane: false, bend: 0.12 }], pins: [{ c: 'manila', label: 'Dear bank...', at: 30, side: 'l' }] }],
  [82, null, 'S11', {}, { never: 'not' }],
  [82, 'These#2', 'doc', { title: 'THE BANKS REPLY', rows: [['YOUR ACCOUNT NUMBERS', 'NOT OURS'], ['YOUR DOCUMENTS', 'FAKE']], stamp: 'FAKE', red: true, stampY: 660 }, { stamp: 'fake' }],
  [83, null, 'cal', { month: 'JUNE 2020', day: '18', from: '17' }],
  [83, 'Wirecard', 'news', { mast: 'BREAKING NEWS', head: 'WIRECARD: €1.9 BILLION|CANNOT BE FOUND', date: '18 JUNE 2020' }],
  [83, 'The#2', 'chart', { mode: 'crash', title: 'WIRECARD · 18 JUNE 2020', tag: '-60%' }],
  [84, null, 'office', { who: 'braun', win: 'night', props: ['rec', 'nolamp'], face: { mouth: 'talk' }, bubble: 'We may be the victim.', loc: 'Wirecard HQ · that evening' }, { bubble: 'may' }],
  [85, null, 'cal', { month: 'JUNE 2020', day: '19', from: '18' }],
  [85, 'Markus', 'street', { kind: 'tower', cast: [{ k: 'braun', x: 0, walk: [1000, 1500], s: 1.0, hold: 'box' }], stamp: 'RESIGNED', stampX: 560 }, { stamp: 'resigns' }],
  [85, 'And', 'office', { win: 'night', props: ['nolamp'], cast: [{ k: 'mars', x: 760, s: 1.5, hold: 'suitcase', mouth: 'talk', bubble: "I'll find it in Manila.", bubbleAt: 'Manila' }, { k: 'worker', x: 1350, s: 1.5, flip: true }, { k: 'worker2', x: 1580, s: 1.5, flip: true }] }, { Manila: 'Manila' }],
  [86, null, 'cal', { month: 'JUNE 2020', day: '22', from: '19' }],
  [86, 'Wirecard', 'doc', { title: 'PRESS RELEASE', kicker: 'WIRECARD · 22 JUNE 2020', big: '€1.9 billion', note: '"probably does not exist"', stamp: 'NEVER EXISTED', red: true }, { stamp: 'never' }],
  [86, 'That', 'office', { who: 'police', win: 'none', props: ['emblem', 'papers'], plate: 'POLICE · MUNICH', who2: 'braun', face2: { eyes: 'closed' }, wall: '#2a3147' }],
  [87, null, 'cal', { month: 'JUNE 2020', day: '25', from: '22' }],
  [87, 'Wirecard', 'street', { kind: 'tower', on: 'off', cast: [], stamp: 'INSOLVENT' }, { off: 'bust', stamp: 'bust' }],
  [87, "It's", 'dax', { mode: 'collapse' }, { go: 'first' }],
  [88, null, 'bignum', { from: 20000000000, to: 0, prefix: '€', caption: 'OF VALUE · WIPED OUT', color: C.red }], [88, 'A', 'stage', SAVERS],
  [89, null, 'card', {}, {}, 'card'],

  // ---------------------------------------------------------------- 5. The Vanishing
  [90, null, 'desk', { mode: 'ask', pins: ['mars', 'braun', 'mccrum'], note: 'Where is he?' }],
  [91, null, 'term', IMM], [91, 'then', 'map', { routes: [{ a: 'manila', b: 'beijing', at: 2, dur: 26, color: '#58e07a', bend: 0.1 }], pins: [{ c: 'manila', label: '23 June?', side: 'l' }], v: [[1600, 500, 1.6], [1600, 480, 1.7]] }],
  [92, null, 'term', { ...IMM, stamp: 'FAKE' }, { stamp: 'fake' }], [92, 'He', 'desk', { mode: 'shock', v: 'close', pins: ['mars', 'braun', 'mccrum'] }],
  [93, null, 'S1', {}, { tag: 'airfield' }], [93, 'That', 'S15', {}, { landed: 'Belarus' }],
  [94, null, 'street', { kind: 'plain', lamp: 700, cast: [{ k: 'spy', x: 900, s: 1.2, hold: 'phone' }], loc: 'Vienna', dark: 0.66 }],
  [94, 'former', 'doc', { title: 'PROSECUTORS · VIENNA', rows: [['HELPED ARRANGE THE FLIGHT', 'A FORMER OFFICER'], ['OF', 'AUSTRIAN INTELLIGENCE']], stamp: 'ARRESTED 2021', stampY: 660 }],
  [95, null, 'table', REPORTERS],
  [95, 'One', 'table', { ...REPORTERS, v: 'l', tag: ['Christo Grozev', 'Journalist · Bellingcat'], tagX: 720, tagY: 660, tagTo: [600, 560] }, { tag: 'Christo' }],
  [95, 'Remember', 'desk', { v: [[975, 250, 1.8], [975, 250, 2.4]], pins: ['mars', 'grozev', 'braun'], note: 'Grozev!' }],
  [96, null, 'map', { v: [[600, 230, 1.5], [640, 210, 1.7]], routes: [{ a: 'minsk', b: 'moscow', at: 4, dur: 30, plane: false, color: C.red }], pins: [{ c: 'minsk', label: 'Minsk', side: 'l', at: 0 }, { c: 'moscow', label: 'Moscow', at: 30 }], hi: [{ k: 'belarus', color: '#7a1f22', at: 0 }, { k: 'russia', label: 'RUSSIA', at: 26, dx: -640, dy: 40 }] }],
  [96, 'Marsalek', 'street', { kind: 'moscow', cast: [{ k: 'spy', x: 660, s: 1.0 }, { k: 'mars', x: 830, s: 1.0 }, { k: 'spy', x: 1000, s: 1.0, seed: 6, flip: true }], loc: 'Moscow', rain: false }],
  [97, null, 'street', { kind: 'station', cast: [{ k: 'saver', x: 0, walk: [200, 560], s: 1.0 }, { k: 'worker', x: 0, walk: [1720, 1380], s: 1.0, flip: true }], rain: false, loc: 'Germany' }],
  [97, 'Police', 'street', { kind: 'station', v: [[960, 520, 1.4], [960, 500, 1.8]], cast: [], rain: false }],
  [98, null, 'desk', { mode: 'read', file: true, pins: ['mars', 'braun', 'mccrum', 'grozev'] }],
  [98, 'A', 'street', { kind: 'moscow', v: 'close', cx: 830, cast: [{ k: 'mars', x: 830, s: 1.0, mouth: 'smirk' }], rain: false }],
  [99, null, 'card', {}, {}, 'card'],
  [100, null, 'map', { v: [[200, 240, 2.6], [210, 235, 3.0]], pins: [{ c: 'yarmouth', label: 'England · 2023' }] }],
  [100, 'British', 'street', { kind: 'sea', cast: [{ k: 'police', x: 0, walk: [1560, 1160], s: 1.0, flip: true }, { k: 'police2', x: 0, walk: [1700, 1300], s: 1.0, flip: true }], loc: 'Great Yarmouth, England · February 2023', rain: true }],
  [101, null, 'gadgets', {}, { cams: 'spy', pass: 'dozens' }],
  [101, 'and', 'stage', { kind: 'lineup', cast: SIX, tag: ['The leader', 'Runs a team of six'], tagX: 960, tagY: 300, tagTo: [870, 560] }, { tag: 'leader' }],
  [102, null, 'chat', { name: 'The boss', msgs: [{ t: 'Is the team ready?' }, { t: 'Ready. Watching him now.', me: true }, { t: 'Good. Send photos.' }, { t: 'Sent.', me: true }, { t: 'New target tomorrow.' }, { t: 'Understood.', me: true }, { t: 'Do not lose him.' }] }],
  [103, null, 'doc', { title: 'THE BOSS', photo: 'mars', rows: [['NAME', 'JAN MARSALEK'], ['LAST SEEN', 'MOSCOW']], stamp: 'IDENTIFIED', red: true, stampY: 660 }, { stamp: 'Jan' }],
  [104, null, 'S17'],
  [104, 'Following', 'map', { v: [[400, 300, 1.8], [420, 300, 2.0]], pins: [{ c: 'london', label: 'Followed', at: 2, side: 'l' }, { c: 'vienna', label: 'Followed', at: 10 }, { c: 'berlin', label: 'Followed', at: 18 }] }],
  [104, 'Planning', 'doc', { title: 'THE PLAN', big: 'Kidnap', note: 'from the prosecution evidence', red: true, stamp: 'EVIDENCE' }],
  [105, null, 'target', { who: 'grozev', name: 'Christo Grozev', sub: 'The journalist who found him' }, { lock: 'Christo' }],
  [105, 'The', 'table', { ...REPORTERS, v: 'l', left: [{ k: 'grozev', x: 560, eyes: 'wide' }, { k: 'editor', x: 800 }] }],
  [106, null, 'stage', { kind: 'prison', cast: SIX, stamp: 'PRISON', loc: 'London · May 2025' }, { stamp: 'prison' }],
  [107, null, 'stage', { kind: 'court', q: true, cast: [{ k: 'barrister', x: 380, y: 1010, s: 1.7, mouth: 'talk' }], v: [[1300, 620, 1.3], [1560, 640, 1.9]] }],
  [107, 'He', 'street', { kind: 'station', v: [[960, 520, 1.5], [960, 500, 1.8]], cast: [], rain: false }],

  // ---------------------------------------------------------------- 6. The Empty Seat
  [108, null, 'stage', { kind: 'dock', cast: [{ k: 'braun', x: 1600, y: 720, s: 1.4, legs: false, flip: true }], loc: 'Munich · December 2022' }],
  [108, 'He', 'stage', { kind: 'dock', v: [[1500, 560, 1.6], [1560, 540, 1.85]], cast: [{ k: 'braun', x: 1600, y: 720, s: 1.4, legs: false, mouth: 'talk', flip: true, bubble: 'I was fooled too.', bubbleAt: 'fooled' }] }, { fooled: 'fooled' }],
  [109, null, 'street', { kind: 'plain', lamp: 900, cast: [{ k: 'watchdog', x: 0, walk: [760, 1400], s: 1.2, hold: 'box' }], loc: 'Germany · January 2021', stamp: 'REMOVED', stampX: 700 }, { stamp: 'loses' }],
  [110, null, 'doc', { title: 'PENALTY', kicker: 'AUDIT REGULATOR · 2023', rows: [['EY', 'FINED'], ['BIG NEW AUDIT CLIENTS', 'BANNED · 2 YEARS']], stamp: 'SANCTIONED', red: true, stampY: 660 }, { stamp: 'banned' }],
  [111, null, 'S12'], [111, 'Because', 'bignum', { from: 1900000000, to: 0, prefix: '€', caption: 'NOTHING TO FIND', color: C.red }],
  [112, null, 'street', { kind: 'tower', on: 'off', cast: [{ k: 'worker', x: 0, walk: [1000, 1500], s: 1.0, hold: 'box' }, { k: 'worker2', x: 0, walk: [820, 1300], s: 1.0, hold: 'box' }, { k: 'saver2', x: 0, walk: [900, 420], s: 1.0, hold: 'box', flip: true }] }, { off: 'lose' }],
  [112, 'Thousands#2', 'stage', SAVERS],
  [113, null, 'S1', {}, { tag: 'airfield' }], [113, 'The#2', 'S2', {}, { cash: 'cash' }], [113, 'The#3', 'S3'],
  [114, null, 'S9', {}, { one: 'looking', euros: 'money' }],
  [114, 'The#2', 'table', { kind: 'audit', v: 'l', left: AUD_L, right: [{ k: 'mars', x: 1360 }], laptops: true }],
  [114, 'The#3', 'office', { ...FT, v: 'close' }],
  [114, 'The#4', 'street', { kind: 'sg', v: 'close', cx: 600, cast: [{ k: 'police', x: 480, s: 1.0 }, { k: 'police2', x: 720, s: 1.0 }] }],
  [115, null, 'S16', {}, { gone: 'leaving' }],
  [116, null, 'desk', { mode: 'ask', pins: ['mars', 'braun', 'mccrum', 'grozev'], note: 'One question' }],
  [117, null, 'office', { ...FT, face: { mouth: 'talk' }, bubble: 'The numbers are fake.' }],
  [117, 'and', 'office', { ...WD, face: { eyes: 'worried', mouth: 'frown', arms: [null, [130, -200]] }, stamp: 'COMPLAINT' }, { stamp: 'went' }],
  [117, 'Why', 'desk', { mode: 'ask', v: 'close', pins: ['mars', 'braun', 'mccrum', 'grozev'] }],
  [118, null, 'end'],
];

// ------------------------------------------------------------------ resolve cues to frames
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');
const findIn = (cue: string, line: number, from?: number) => {
  const [w, n] = cue.split('#');
  let left = Number(n ?? 1);
  const L = LINES[line];
  for (let i = from ?? L.i; i < L.i + L.n; i++) if (norm(WORDS[i].w) === norm(w) && --left === 0) return i;
  throw new Error(`cue "${cue}" not found in line ${line}: ${L.text}`);
};

const LEAD = 4;
export type Shot = { start: number; d: number; C: React.FC<any>; p: any; m: Record<string, number>; words: Word[]; card?: boolean; whip?: boolean; chapter?: { title: string; n: number }; kind: string; line: number };
export const SHOTS: Shot[] = (() => {
  const idx = SHOTLIST.map(([line, at]) => (at ? findIn(at, line) : LINES[line].i));
  for (let k = 1; k < idx.length; k++) if (idx[k] <= idx[k - 1]) throw new Error(`shot ${k} (line ${SHOTLIST[k][0]}) does not come after the one before it`);
  const starts = idx.map((i, k) => (k === 0 ? 0 : Math.max(0, Math.round(WORDS[i].s * FPS) - LEAD)));
  const total = Math.round(WORDS[WORDS.length - 1].e * FPS) + 240;       // the end card holds 8 s after the last word
  const cards = CHAPTERS.map((c, n) => ({ a: Math.round(c.s * FPS), b: Math.round(c.e * FPS), title: c.title, n: n + 1 }));
  const out: Shot[] = [];
  SHOTLIST.forEach(([line, , kind, p, marks, flag], k) => {
    let end = k + 1 < SHOTLIST.length ? starts[k + 1] : total;
    const card = cards.find((c) => c.a >= starts[k] && c.a < end);
    const nextStart = end;
    if (card) end = card.a;
    const m: Record<string, number> = {};
    Object.entries(marks ?? {}).forEach(([name, w]) => { m[name] = Math.round(WORDS[findIn(w, line, idx[k])].s * FPS) - starts[k]; });
    const C0 = KINDS[kind];
    if (!C0) throw new Error(`unknown kind ${kind}`);
    out.push({ start: starts[k], d: end - starts[k], C: C0, p: p ?? {}, m, words: WORDS.slice(idx[k], k + 1 < idx.length ? idx[k + 1] : WORDS.length), card: flag === 'card', whip: flag === 'whip', kind, line });
    if (card) {
      out.push({ start: card.a, d: card.b - card.a, C: Card, p: {}, m: {}, words: [], chapter: { title: card.title, n: card.n }, kind: 'chapter', line });
      // the next shot starts when the card ends
      starts[k + 1] = Math.min(nextStart, card.b);
    }
  });
  return out;
})();
export const TOTAL = SHOTS[SHOTS.length - 1].start + SHOTS[SHOTS.length - 1].d;
