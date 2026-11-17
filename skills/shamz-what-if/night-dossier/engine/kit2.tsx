// Night Dossier, data-driven inserts: documents, newspapers, charts, big numbers, calendars, the map, terminals, phone
// chats, the corkboard, flow diagrams and chapter cards. Each takes `p` (its content) so the timeline can reuse them.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Bean, BeanLook, Bokeh, C, Cam, HAND, Hand, INK, LABEL, Layer, Night, Paper, Stamp, View, W, H, Word, count, easeIO, easeOut, euro, lerp } from './dossier';

export type SP = { f: number; d: number; m: Record<string, number>; gf: number; words: Word[]; p: any };

export const T: React.FC<{ x: number; y: number; s?: number; c?: string; a?: 'start' | 'middle' | 'end'; hand?: boolean; w?: number; ls?: number; o?: number; children: React.ReactNode }> =
  ({ x, y, s = 30, c = INK, a = 'start', hand, w = 700, ls = 1.5, o = 1, children }) => (
    <text x={x} y={y} fontSize={s} fill={c} textAnchor={a} fontFamily={hand ? HAND : LABEL} fontWeight={w} letterSpacing={ls} opacity={o}>{children}</text>
  );

// ------------------------------------------------------------------ the cast
export const LOOKS: Record<string, BeanLook> = {
  // Shamz (the owner's own design, permanent): black ribbed beanie with the gold patch and black cloud, golden locs,
  // red eyes with three dots round the pupil. Default outfit: green jacket with a cream collar (new outfit per episode).
  shamz: { body: '#2F6B48', hair: 'locs', hairC: '#F2B233', hat: 'beanie', skin: '#7A4A2C', collar: '#EFE6D2', iris: '#D3202A', irisDots: 3 },
  mars: { body: '#262b40', hair: 'short', hairC: '#2a2018', stubble: true, collar: '#e9e9ee', skin: C.skin3 },
  braun: { body: '#15151b', hair: 'crop', hairC: '#2b2622', glasses: true, neck: '#15151b', skin: C.skin3 },
  braunS: { body: '#2e2e3c', hair: 'crop', hairC: '#2b2622', glasses: true, neck: '#2e2e3c', skin: C.skin3 },
  mccrum: { body: '#3f5f8a', hair: 'side', hairC: '#4a2f1e', collar: '#fff', skin: C.skin },
  editor: { body: '#7a4a3a', hair: 'bob', hairC: '#b9b2a4', glasses: true, skin: C.skin3 },
  lawyer: { body: '#2f5f57', hair: 'short', hairC: '#16120f', glasses: true, tie: '#b8433a', collar: '#fff', skin: '#b9825a' },
  merkel: { body: '#c0473f', hair: 'bob', hairC: '#d9c9a0', skin: C.skin3 },
  auditor: { body: '#5d6477', hair: 'side', hairC: '#3a3530', glasses: true, tie: '#1d2748', collar: '#fff', skin: C.skin },
  auditor2: { body: '#49506a', hair: 'bob', hairC: '#6b3f2a', tie: '#7a2f2a', collar: '#fff', skin: C.skin2 },
  watchdog: { body: '#3d4a3f', hair: 'bald', glasses: true, tie: '#c9a23a', collar: '#fff', skin: C.skin3 },
  trader: { body: '#31405e', hair: 'tuft', hairC: '#b8853f', tie: '#c8473f', collar: '#fff', skin: C.skin },
  trader2: { body: '#4a3a52', hair: 'short', hairC: '#1b1512', collar: '#fff', skin: C.skin2 },
  sailor: { body: '#e6e2d6', hat: 'cap', beard: '#d9d4c6', skin: '#b9825a' },
  grozev: { body: '#3a3f4a', hair: 'bald', beard: '#4a4038', glasses: true, skin: C.skin },
  roussev: { body: '#4a4238', hair: 'long', hairC: '#3a2f25', beard: '#3a2f25', glasses: true, skin: C.skin3 },
  police: { body: '#16213f', hat: 'police', skin: C.skin },
  police2: { body: '#16213f', hat: 'police', skin: C.skin2 },
  detective: { body: '#6b5a44', hat: 'cap', collar: '#3a3026', skin: C.skin3 },
  pilot: { body: '#1c2748', hat: 'pilot', tie: '#11131c', collar: '#fff' },
  saver: { body: '#8a6f4a', hair: 'bob', hairC: '#c9c2b4', glasses: true, skin: C.skin3 },
  saver2: { body: '#4f7a8a', hair: 'tuft', hairC: '#3a2a20', skin: C.skin2 },
  worker: { body: '#557a5a', hair: 'short', hairC: '#3a2a20', skin: C.skin },
  worker2: { body: '#8a5570', hair: 'long', hairC: '#1b1512', skin: C.skin2 },
  spy: { body: '#1b1d26', hair: 'short', hairC: '#0e0f16', skin: '#8f96a8' },
  bul1: { body: '#5a4a6a', hair: 'long', hairC: '#6b3f2a', skin: C.skin3 },
  bul2: { body: '#4a5a4a', hair: 'short', hairC: '#2a2018', stubble: true, skin: C.skin },
  bul3: { body: '#6a4a4a', hair: 'long', hairC: '#1b1512', skin: C.skin3 },
  bul4: { body: '#3f4f6a', hair: 'crop', hairC: '#3a2f25', skin: C.skin2 },
  bul5: { body: '#6a5f3f', hair: 'bob', hairC: '#b8853f', skin: C.skin3 },
  judge: { body: '#16161d', hat: 'wig', glasses: true, collar: '#fff', skin: C.skin3 },
  duty: { body: '#2f6f73', hair: 'short', hairC: '#16120f', glasses: true, collar: '#fff', skin: '#b9825a' },
  clerk: { body: '#8a5570', hair: 'long', hairC: '#16120f', skin: '#b9825a' },
  clerk2: { body: '#55708a', hair: 'side', hairC: '#16120f', tie: '#7a2f2a', collar: '#fff', skin: '#a8744c' },
  fed: { body: '#31405e', hair: 'side', hairC: '#6b4a2a', glasses: true, tie: '#7a2f2a', collar: '#fff', skin: C.skin },
  bmanager: { body: '#7a2f4a', hair: 'long', hairC: '#16120f', collar: '#fff', skin: '#c99a6a' },
  gambler: { body: '#3a3a44', hair: 'short', hairC: '#0e0f16', glasses: true, skin: C.skin3 },
  gambler2: { body: '#5a3a2a', hair: 'tuft', hairC: '#16120f', skin: '#c99a6a' },
  dealer: { body: '#16161d', hair: 'side', hairC: '#16120f', tie: '#b8433a', collar: '#fff', skin: '#c99a6a' },
  junket: { body: '#4a4a52', hair: 'crop', hairC: '#3a3530', glasses: true, collar: '#fff', skin: C.skin3 },
  senator: { body: '#3d3a52', hair: 'bob', hairC: '#b9b2a4', glasses: true, collar: '#fff', skin: '#c99a6a' },
  governor: { body: '#3a4a52', hair: 'bald', glasses: true, tie: '#1f5a3a', collar: '#fff', skin: '#a8744c' },
  hacker: { body: '#39425c', hair: 'short', hairC: '#0e0f16', skin: '#8f9aac', collar: '#232a3e' },
  agent: { body: '#1d2748', hair: 'crop', hairC: '#3a2f25', tie: '#b8433a', collar: '#fff', skin: C.skin },
  lam: { body: '#e8e4dc', hair: 'short', hairC: '#16120f', glasses: false, collar: '#c9a23a', skin: '#e8c49a' },
  victim: { body: '#55708a', hair: 'side', hairC: '#9a958c', glasses: true, collar: '#fff', skin: C.skin3 },
  caller: { body: '#1b1d26', hair: 'short', hairC: '#16120f', skin: '#c99a6a' },
  caller2: { body: '#2a2d36', hair: 'tuft', hairC: '#3a2a20', skin: C.skin },
  crew1: { body: '#b8433a', hair: 'short', hairC: '#16120f', skin: '#a8744c' },
  crew2: { body: '#3b6ee0', hair: 'tuft', hairC: '#3a2a20', skin: C.skin },
  crew3: { body: '#1f1f26', hair: 'crop', hairC: '#6b4a2a', skin: C.skin3 },
  friend: { body: '#4a7a5a', hair: 'side', hairC: '#16120f', skin: '#c99a6a' },
  zach: { body: '#1b1d26', hat: 'cap', skin: '#5a6070' },
  burglar: { body: '#15171f', hat: 'cap', skin: '#8f96a8' },
  dad: { body: '#7a5a3a', hair: 'side', hairC: '#9a958c', glasses: true, skin: '#c99a6a' },
  mum: { body: '#8a5570', hair: 'bob', hairC: '#3a3530', skin: '#c99a6a' },
  barrister: { body: '#16161d', hat: 'wig', collar: '#fff', skin: C.skin2 },
};

/** A photo print of a cast member (for files, boards, posters). */
export const Photo: React.FC<{ x: number; y: number; who: string; w?: number; rot?: number; label?: string; clip?: boolean; id: string; dim?: boolean }> = ({ x, y, who, w = 230, rot = 0, label, clip, id, dim }) => {
  const h = w * 1.18;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={5} y={7} width={w} height={h} fill="#000" opacity={0.3} />
      <rect width={w} height={h} fill="#fff" stroke={INK} strokeWidth={6} />
      <rect x={w * 0.06} y={w * 0.06} width={w * 0.88} height={h * 0.74} fill={dim ? '#3a4058' : '#9aa6c4'} />
      <clipPath id={`ph${id}`}><rect x={w * 0.06} y={w * 0.06} width={w * 0.88} height={h * 0.74} /></clipPath>
      <g clipPath={`url(#ph${id})`}><Bean {...LOOKS[who]} x={w / 2} y={h * 1.2} s={w / 220} f={0} legs={false} bob={0} /></g>
      {dim && <rect x={w * 0.06} y={w * 0.06} width={w * 0.88} height={h * 0.74} fill="#0a0d1e" opacity={0.55} />}
      {label && <text x={w / 2} y={h * 0.94} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={w * 0.15} fill={INK}>{label}</text>}
      {clip && <path d={`M ${w * 0.66} -16 q 26 -10 30 14 l -6 60 q -8 14 -18 0 l 6 -52 q -2 -10 -10 -6`} fill="none" stroke="#8c93a8" strokeWidth={6} />}
    </g>
  );
};

/** Speech bubble with a short line. */
export const Bubble: React.FC<{ f: number; at?: number; x: number; y: number; text: string; tail?: 'l' | 'r'; s?: number }> = ({ f, at = 4, x, y, text, tail = 'l', s = 44 }) => {
  const k = lerp(f, [at, at + 7], [0, 1], easeOut);
  if (k <= 0) return null;
  const w = text.length * s * 0.5 + 70, h = s * 1.9;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d={tail === 'l' ? `M 40 ${h - 4} L 20 ${h + 46} L 96 ${h - 4} Z` : `M ${w - 40} ${h - 4} L ${w - 20} ${h + 46} L ${w - 96} ${h - 4} Z`} fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <rect width={w} height={h} rx={h / 2.4} fill="#fff" stroke={INK} strokeWidth={6} />
      <rect x={tail === 'l' ? 38 : w - 98} y={h - 8} width={60} height={9} fill="#fff" />
      <text x={w / 2} y={h * 0.66} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={s} fill={INK}>{text}</text>
    </g>
  );
};

// ------------------------------------------------------------------ desk top (seen from above)
export const DeskTop: React.FC<{ children: React.ReactNode; id: string; red?: boolean; light?: [number, number] }> = ({ children, id, red, light = [960, 520] }) => (
  <g>
    <rect x={-400} y={-300} width={W + 800} height={H + 600} fill={C.woodD} />
    <rect x={120} y={90} width={1680} height={900} rx={18} fill={C.felt} stroke={INK} strokeWidth={10} />
    <rect x={150} y={120} width={1620} height={840} rx={10} fill="none" stroke={C.feltD} strokeWidth={8} />
    <g transform="translate(250 230)" stroke={INK} strokeWidth={7}><circle r={78} fill="#2a2d3a" /><circle r={46} fill="#11131c" /><circle r={12} fill="#565b70" /></g>
    <g transform="translate(1640 850) rotate(-30)" stroke={INK} strokeWidth={5}><rect x={-120} y={-10} width={240} height={20} rx={8} fill="#1b1d26" /><path d="M 120 -10 L 150 0 L 120 10 Z" fill={C.gold} /></g>
    <g transform="translate(1650 240)" stroke={INK} strokeWidth={7}><circle r={64} fill="#e8e2d2" /><circle r={46} fill="#5a3418" /></g>
    {children}
    <Night id={id} amt={0.66} tint={red ? '#1a0508' : '#06100c'} lights={[{ x: light[0], y: light[1], r: 780, ry: 580, color: red ? '#ff8a6b' : C.warm }]} />
  </g>
);

/** A document on the desk. p: { title, kicker?, rows?: [label, value][], big?, note?, photo?, stamp?, stampColor?, red?, pink?, hand?, zoomOut?, lines? } */
export const Doc: React.FC<SP> = ({ f, d, m, p }) => {
  const at = m.stamp ?? Math.round(d * 0.45);
  const px = p.photo ? 320 : 60;
  return (
    <Cam f={f} d={d} z={p.zoomOut ? [1.14, 1.0] : [1.0, 1.12]} x={[p.zoomOut ? 20 : 0, 0]} bg={C.woodD}>
      <Layer>
        <DeskTop id={`doc${p.title.length}${at}`} red={p.red}>
          <Paper x={540} y={130} w={840} h={830} rot={p.rot ?? 2.5} lines={p.lines ?? 3} fill={p.pink ? '#f6d5c0' : C.paper}>
            {p.kicker && <T x={60} y={70} s={34} c="#6b6250" ls={3}>{p.kicker}</T>}
            <T x={420} y={p.kicker ? 150 : 110} s={p.title.length > 16 ? 62 : 80} a="middle" ls={4}>{p.title}</T>
            <line x1={60} x2={780} y1={p.kicker ? 178 : 140} y2={p.kicker ? 178 : 140} stroke={INK} strokeWidth={6} />
            {p.photo && <Photo x={60} y={210} who={p.photo} id={`d${p.photo}`} rot={-4} clip />}
            {(p.rows ?? []).map(([a, b]: [string, string], i: number) => (
              <g key={i}><T x={px} y={258 + i * 136} s={32} c="#6b6250">{a}</T><T x={px} y={316 + i * 136} s={b.length > 18 ? 42 : 54}>{b}</T></g>
            ))}
            {p.formula && <g transform="translate(420 440)" stroke={INK} strokeWidth={7} fill="none">
              {[[-150, 0], [0, 0], [150, 0]].map(([x, y], i) => <path key={i} d={`M ${x} ${y - 70} l 60 35 l 0 70 l -60 35 l -60 -35 l 0 -70 Z`} />)}
              <line x1={-90} y1={-35} x2={-60} y2={-35} /><line x1={60} y1={35} x2={90} y2={35} /><line x1={150} y1={-70} x2={150} y2={-130} /><line x1={-150} y1={70} x2={-150} y2={130} />
              <text x={150} y={-150} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={44} fill={INK} stroke="none">P</text><text x={-150} y={176} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={44} fill={INK} stroke="none">F</text>
              {[0, 1, 2].map((i) => <rect key={i} x={-300} y={230 + i * 40} width={600 - i * 120} height={22} fill={INK} stroke="none" />)}
            </g>}
            {p.big && <text x={420} y={p.rows ? 560 : 420} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={p.big.length > 14 ? 96 : 140} fill="#1c3f8a">{p.big}</text>}
            {p.note && <T x={420} y={p.rows ? 640 : 520} s={34} c="#6b6250" a="middle">{p.note}</T>}
            {p.stamp && <Stamp f={f} at={at} x={p.stampX ?? 520} y={p.stampY ?? 640} text={p.stamp} size={p.stamp.length > 14 ? 50 : 64} rot={-9} color={p.stampColor ?? C.red} />}
          </Paper>
          {p.hand && <Hand x={1240 + Math.sin(f / 7) * 14} y={700} x0={1500} y0={1300} pen />}
        </DeskTop>
      </Layer>
    </Cam>
  );
};

/** A newspaper front page spinning in. p: { mast, head (lines split by |), date?, pink?, sub?, photo? } */
export const News: React.FC<SP> = ({ f, d, p }) => {
  const k = lerp(f, [0, 10], [0, 1], easeOut);
  const head: string[] = p.head.split('|');
  const fs = Math.min(128, 1500 / Math.max(...head.map((h: string) => h.length)) * 1.5);
  return (
    <Cam f={f} d={d} z={[1.0, 1.08]} bg="#101426">
      <Layer depth={0.4}><rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#141a33" /><Bokeh f={f} seed={p.head.length} n={10} color="#9fb4ff" /></Layer>
      <Layer>
        <g transform={`translate(960 560) rotate(${-3 + (1 - k) * 28}) scale(${1 + (1 - k) * 1.2})`} opacity={k}>
          <rect x={-688} y={-430} width={1390} height={900} fill="#000" opacity={0.35} />
          <rect x={-700} y={-440} width={1400} height={900} fill={p.pink ? '#f8d8c2' : '#f1ead8'} stroke={INK} strokeWidth={8} />
          <text x={0} y={-340} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={72} fill={INK} letterSpacing={6}>{p.mast}</text>
          <line x1={-650} x2={650} y1={-306} y2={-306} stroke={INK} strokeWidth={7} /><line x1={-650} x2={650} y1={-292} y2={-292} stroke={INK} strokeWidth={3} />
          {p.date && <T x={-650} y={-250} s={32} c="#5a5346" ls={3}>{p.date}</T>}
          {head.map((h, i) => <text key={i} x={p.photo ? -650 : 0} y={-120 + i * (fs * 1.08) + (3 - head.length) * 30} textAnchor={p.photo ? 'start' : 'middle'} fontFamily={LABEL} fontWeight={700} fontSize={p.photo ? fs * 0.82 : fs} fill={INK} letterSpacing={3}>{h}</text>)}
          {p.photo && <Photo x={330} y={-200} who={p.photo} w={300} id={`n${p.photo}`} rot={2} />}
          {[0, 1, 2, 3].map((i) => <g key={i} stroke="#9a917c" strokeWidth={6}>{[0, 1, 2].map((c) => <line key={c} x1={-650 + c * 440} x2={-650 + c * 440 + 400 - ((i * 53 + c * 31) % 120)} y1={300 + i * 34} y2={300 + i * 34} />)}</g>)}
          {p.sub && <T x={0} y={250} s={44} c="#5a5346" a="middle" hand>{p.sub}</T>}
        </g>
        <Night id={`nw${p.head.length}`} amt={0.5} lights={[{ x: 960, y: 520, r: 1000, ry: 640 }]} />
      </Layer>
    </Cam>
  );
};

/** A line chart drawn over the shot. p: { mode: rise|crash|smooth|risecrash|flat, title, tag?, unit?, red? } */
const CH: Record<string, number[]> = {
  rise: [0.06, 0.1, 0.09, 0.16, 0.2, 0.19, 0.28, 0.36, 0.34, 0.47, 0.58, 0.55, 0.7, 0.82, 0.92],
  smooth: [0.1, 0.16, 0.22, 0.28, 0.34, 0.4, 0.46, 0.52, 0.58, 0.64, 0.7, 0.76, 0.82, 0.88, 0.94],
  crash: [0.86, 0.9, 0.84, 0.88, 0.8, 0.83, 0.78, 0.8, 0.52, 0.3, 0.34, 0.2, 0.12, 0.08, 0.05],
  risecrash: [0.1, 0.2, 0.3, 0.42, 0.55, 0.7, 0.85, 0.94, 0.9, 0.86, 0.6, 0.3, 0.12, 0.05, 0.02],
  dip: [0.7, 0.74, 0.72, 0.78, 0.76, 0.8, 0.5, 0.42, 0.48, 0.44, 0.5, 0.47, 0.52, 0.5, 0.53],
};
export const Chart: React.FC<SP> = ({ f, d, m, p }) => {
  const pts = CH[p.mode ?? 'rise'];
  const X = (i: number) => 260 + (i / (pts.length - 1)) * 1400, Y = (v: number) => 880 - v * 620;
  const k = lerp(f, [4, Math.min(d - 8, m.end ?? d * 0.7)], [0, 1], p.mode === 'smooth' ? undefined : easeIO);
  const n = k * (pts.length - 1), i0 = Math.min(pts.length - 2, Math.floor(n)), fr = n - i0;
  const hx = X(i0) + (X(i0 + 1) - X(i0)) * fr, hy = Y(pts[i0]) + (Y(pts[i0 + 1]) - Y(pts[i0])) * fr;
  const dd = pts.map((v, i) => `${i ? 'L' : 'M'} ${X(i)} ${Y(v)}`).join(' ');
  const down = hy > Y(pts[Math.max(0, i0 - 1)]) && (p.mode === 'crash' || p.mode === 'risecrash' || p.mode === 'dip') && k > 0.5;
  const col = down || p.red ? C.red : C.green;
  return (
    <Cam f={f} d={d} z={[1.0, 1.07]} x={[0, 30]} bg="#070b18">
      <Layer>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill={down ? '#1a070b' : '#08101f'} />
        <rect x={160} y={120} width={1600} height={840} rx={20} fill={down ? '#210a10' : '#0b1730'} stroke={INK} strokeWidth={10} />
        <g stroke="#fff" opacity={0.07} strokeWidth={2}>{Array.from({ length: 9 }).map((_, i) => <line key={i} x1={200} x2={1720} y1={260 + i * 78} y2={260 + i * 78} />)}{Array.from({ length: 15 }).map((_, i) => <line key={i} x1={260 + i * 100} x2={260 + i * 100} y1={240} y2={900} />)}</g>
        <T x={220} y={212} s={50} c="#fff" ls={4}>{p.title}</T>
        <clipPath id={`cc${p.title.length}`}><rect x={0} y={0} width={hx} height={H} /></clipPath>
        <path d={`${dd} L ${X(pts.length - 1)} 900 L ${X(0)} 900 Z`} fill={col} opacity={0.12} clipPath={`url(#cc${p.title.length})`} />
        <path d={dd} fill="none" stroke={col} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" clipPath={`url(#cc${p.title.length})`} />
        <circle cx={hx} cy={hy} r={16} fill={col} /><circle cx={hx} cy={hy} r={16 + ((f * 2) % 30)} fill="none" stroke={col} strokeWidth={3} opacity={1 - ((f * 2) % 30) / 30} />
        {p.tag && k > 0.92 && <g transform={`translate(${Math.min(hx + 30, 1380)} ${Math.max(300, hy - 110)})`}><rect width={p.tag.length * 34 + 50} height={96} fill={col} stroke={INK} strokeWidth={6} /><T x={25} y={68} s={58} c={INK}>{p.tag}</T></g>}
        <Night id={`ch${p.title.length}`} amt={0.4} tint="#000" lights={[{ x: 960, y: 540, r: 1100, ry: 640, color: col }]} glow={0.08} />
      </Layer>
    </Cam>
  );
};

/** One big glowing number. p: { to, from?, prefix?, suffix?, caption, sub?, color?, down? } */
export const BigNum: React.FC<SP> = ({ f, d, m, p }) => {
  const a = m.go ?? 4, b = Math.min(d - 6, a + (p.fast ? 14 : 30));
  const n = count(f, a, b, p.from ?? 0, p.to);
  const col = p.color ?? C.green;
  const txt = (p.prefix ?? '') + n.toLocaleString('en-US') + (p.suffix ?? '');
  return (
    <Cam f={f} d={d} z={[1.0, 1.1]} bg="#060912">
      <Layer depth={0.4}><rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#080c1a" /><Bokeh f={f} seed={p.to % 97} n={14} color={col} /></Layer>
      <Layer>
        <text x={960} y={560} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={txt.length > 12 ? 170 : 250} fill={col} letterSpacing={6}>{txt}</text>
        <T x={960} y={700} s={62} c="#fff" a="middle" ls={5}>{p.caption}</T>
        {p.sub && <T x={960} y={780} s={48} c={col} a="middle" hand o={lerp(f, [b, b + 8], [0, 1])}>{p.sub}</T>}
        <Night id={`bn${p.to}`} amt={0.5} tint="#000" lights={[{ x: 960, y: 520, r: 1000, ry: 420, color: col }]} glow={0.2} />
      </Layer>
    </Cam>
  );
};

/** A wall calendar page. p: { month, day, caption?, stamp?, from? (a previous day that flips away) } */
export const Cal: React.FC<SP> = ({ f, d, m, p }) => {
  const flip = lerp(f, [2, 12], [0, 1], easeOut);
  return (
    <Cam f={f} d={d} z={[1.08, 1.0]} bg="#1b2140">
      <Layer depth={0.5}><rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#232b50" />{Array.from({ length: 12 }).map((_, i) => <line key={i} x1={-200 + i * 200} x2={-200 + i * 200} y1={-200} y2={1300} stroke="#1b2140" strokeWidth={6} />)}</Layer>
      <Layer>
        <g transform="translate(610 150)">
          <rect x={8} y={12} width={700} height={780} fill="#000" opacity={0.35} />
          <rect width={700} height={780} fill={C.paper} stroke={INK} strokeWidth={10} />
          <rect width={700} height={170} fill={C.red} stroke={INK} strokeWidth={10} />
          {[150, 550].map((x) => <g key={x}><circle cx={x} cy={0} r={22} fill="#565b70" stroke={INK} strokeWidth={6} /></g>)}
          <T x={350} y={120} s={96} c="#fff" a="middle" ls={8}>{p.month}</T>
          <text x={350} y={String(p.day).length > 2 ? 560 : 620} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={String(p.day).length > 2 ? 250 : 480} fill={INK}>{p.day}</text>
          {p.caption && <T x={350} y={736} s={48} c="#6b6250" a="middle" ls={3}>{p.caption}</T>}
          {p.from && flip < 1 && <g transform={`translate(0 170) scale(1 ${1 - flip})`} opacity={1 - flip * 0.6}><rect width={700} height={610} fill="#e8dfc8" stroke={INK} strokeWidth={10} /><text x={350} y={450} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={480} fill={INK}>{p.from}</text></g>}
          {p.stamp && <Stamp f={f} at={m.stamp ?? Math.round(d * 0.5)} x={350} y={470} text={p.stamp} size={p.stamp.length > 12 ? 62 : 84} rot={-13} />}
        </g>
        <Night id={`cal${p.day}`} amt={0.62} lights={[{ x: 960, y: 520, r: 760, ry: 620 }]} />
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ the map (Europe to South-East Asia)
const LON0 = -14, LON1 = 132, LAT0 = 64, LAT1 = -4;
export const geo = (lon: number, lat: number): [number, number] => [((lon - LON0) / (LON1 - LON0)) * W, ((LAT0 - lat) / (LAT0 - LAT1)) * H];
export const CITY: Record<string, [number, number]> = {
  london: [-0.1, 51.5], munich: [11.6, 48.1], vienna: [16.4, 48.2], minsk: [27.6, 53.9], moscow: [37.6, 55.8], dubai: [55.3, 25.2],
  miami: [-80.2, 25.8], losangeles: [-118.2, 34.1], washington: [-77.0, 38.9], albuquerque: [-106.6, 35.1], danbury: [-73.5, 41.4],
  dhaka: [90.4, 23.8], newyork: [-74.0, 40.7], colombo: [79.9, 6.9], pyongyang: [125.7, 39.0], hanoi: [105.8, 21.0], quito: [-78.5, -0.2],
  singapore: [103.8, 1.4], manila: [121.0, 14.6], beijing: [116.4, 39.9], tripoli: [13.2, 32.9], frankfurt: [8.7, 50.1], yarmouth: [1.7, 52.6],
  mumbai: [72.9, 19.1], hongkong: [114.2, 22.3], kuala: [101.7, 3.1], chennai: [80.3, 13.1], berlin: [13.4, 52.5],
};
const LAND: Array<Array<[number, number]>> = [
  [[-9, 43.5], [-9.5, 37], [-5.5, 36], [-0.5, 38], [3, 42], [8, 44], [12, 44], [16, 38], [18, 40], [13.5, 45.5], [19, 42], [22.5, 37], [26, 40.5], [29, 41], [36, 36.5], [36, 33], [34.5, 29.5], [39, 21], [43, 13], [52, 16.5], [59.5, 22.5], [56, 26.5], [51.5, 24.5], [50, 30], [56.5, 27], [61, 25], [67, 25], [72.5, 21], [73, 16], [77, 8], [80, 15], [87, 21.5], [92, 22], [94.5, 16], [98, 16], [98.5, 8], [103.5, 1.5], [104, 9], [106, 10], [109, 12], [108.5, 16], [106, 20.5], [110, 21.5], [118, 24.5], [122, 30.5], [119, 35], [122.5, 37], [118, 39], [122, 40.5], [125, 39], [126.5, 34.5], [129.5, 36], [128, 40], [131, 43], [136, 46], [136, 66], [-20, 66], [5, 62], [5, 58.5], [8.5, 57], [8.5, 54], [4, 52.5], [-2, 49.5], [-4.5, 48.5], [-1.5, 46], [-2, 43.5]],
  [[-5.5, 50], [1.5, 51], [1.5, 53], [-2, 55.5], [-3, 58.5], [-6, 57.5], [-5, 54.5], [-3, 53.5], [-5, 52]],
  [[-9.5, 51.5], [-6, 52], [-6, 55], [-10, 54]],
  [[-20, 36], [-6, 35.8], [10, 37], [11, 33.5], [20, 31], [25, 32], [32, 31.2], [34, 28], [37, 21], [42.5, 12], [51, 12], [47, 4], [42, -4], [-20, -4]],
  [[95.5, 5.5], [98, 3.5], [103.5, 0], [106, -3], [102, -4], [97, 1]],
  [[109, 1.5], [110, -3], [117.5, -4], [119, 5], [117, 7], [113, 4]],
  [[120.3, 18.5], [122.2, 18.3], [122, 14.5], [124, 13], [121, 13.5], [120, 15.5]],
  [[122, 8], [126.3, 9.5], [126, 6], [123.5, 6]],
  [[122.5, 11], [125, 11.5], [124.5, 10]],
  [[120, 23], [121.8, 25], [121, 22]],
  [[130, 31.5], [131.5, 34], [135, 34.5], [136, 36], [136, 33]],
];
const AREA: Record<string, Array<[number, number]>> = {
  belarus: [[23.5, 54], [26, 56], [31, 55.5], [32.5, 53], [30.5, 51.5], [24, 51.7]],
  germany: [[6, 51], [7, 53.5], [9, 54.8], [14, 54], [15, 51], [13, 50.3], [13.5, 48.6], [10, 47.4], [7.6, 47.6], [8.2, 49], [6.3, 49.5]],
  russia: [[28, 56], [28, 60], [31, 62], [40, 66], [136, 66], [136, 46], [131, 43], [120, 50], [100, 50], [80, 51], [60, 51], [47, 48], [40, 47], [38, 50], [32.5, 53], [31, 55.5]],
  libya: [[10, 33], [11.5, 24], [14, 22.5], [24, 19.5], [25, 31.5], [20, 31], [15, 32.3], [11, 33.3]],
  austria: [[9.6, 47.3], [13, 47.5], [13.5, 48.6], [17, 48.6], [16.6, 46.8], [13.5, 46.5]],
  philippines: [[119, 19.5], [123.5, 19.5], [127.5, 9], [126.5, 5], [121.5, 5.5], [119, 12]],
};
/** p: { v?: [View, View], pins: [{c, label?, at?, color?}], routes: [{a, b, at?, plane?, color?}], hi?: [{k, color, at?}], title? } */
export const MapShot: React.FC<SP> = ({ f, d, m, p }) => {
  const sea = '#0c1433', land = '#24356b', edge = '#5b77c9';
  const v: [View, View] = p.v ?? [[960, 540, 1], [960, 540, 1.08]];
  const zk = (v[0][2] + v[1][2]) / 2;
  const frame = (x: any) => (typeof x === 'number' ? x : x ? m[x] ?? 6 : 6);
  return (
    <Cam f={f} d={d} v={v} ease bg={sea}>
      <Layer>
        <rect x={-600} y={-500} width={W + 1200} height={H + 1000} fill={sea} />
        <g stroke="#fff" opacity={0.045} strokeWidth={2}>{Array.from({ length: 19 }).map((_, i) => <line key={i} x1={i * 110} x2={i * 110} y1={-200} y2={1300} />)}{Array.from({ length: 12 }).map((_, i) => <line key={i} x1={-200} x2={2200} y1={i * 110} y2={i * 110} />)}</g>
        {LAND.map((poly, i) => <path key={i} d={poly.map(([lo, la], k) => `${k ? 'L' : 'M'} ${geo(lo, la)[0]} ${geo(lo, la)[1]}`).join(' ') + ' Z'} fill={land} stroke={edge} strokeWidth={3 / zk + 1} strokeLinejoin="round" />)}
        {(p.hi ?? []).map((h: any, i: number) => {
          const o = lerp(f, [frame(h.at), frame(h.at) + 10], [0, 1]);
          const poly = AREA[h.k];
          const cx = poly.reduce((s, q) => s + geo(q[0], q[1])[0], 0) / poly.length, cy = poly.reduce((s, q) => s + geo(q[0], q[1])[1], 0) / poly.length;
          return <g key={i} opacity={o}>
            <path d={poly.map(([lo, la], k) => `${k ? 'L' : 'M'} ${geo(lo, la)[0]} ${geo(lo, la)[1]}`).join(' ') + ' Z'} fill={h.color ?? C.red} opacity={0.55} stroke={h.color ?? C.red} strokeWidth={3} />
            {h.label && <text x={cx + (h.dx ?? 0)} y={cy + (h.dy ?? 0)} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={30 / zk + 8} fill="#fff" letterSpacing={5}>{h.label}</text>}
          </g>;
        })}
        {(p.routes ?? []).map((r: any, i: number) => {
          const A = geo(...CITY[r.a]), B = geo(...CITY[r.b]);
          const at = frame(r.at), k = lerp(f, [at, at + (r.dur ?? 34)], [0, 1], easeIO);
          if (f < at) return null;
          const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2 - Math.hypot(B[0] - A[0], B[1] - A[1]) * (r.bend ?? 0.22);
          const q = (a: number, b: number, c: number, t: number) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
          const px = q(A[0], mx, B[0], k), py = q(A[1], my, B[1], k);
          const ang = (Math.atan2(2 * (1 - k) * (my - A[1]) + 2 * k * (B[1] - my), 2 * (1 - k) * (mx - A[0]) + 2 * k * (B[0] - mx)) * 180) / Math.PI;
          const col = r.color ?? '#fff';
          return <g key={i}>
            <path d={`M ${A[0]} ${A[1]} Q ${mx} ${my} ${B[0]} ${B[1]}`} fill="none" stroke={col} strokeWidth={5 / zk + 1} strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} opacity={0.9} />
            {r.plane !== false && <g transform={`translate(${px} ${py}) rotate(${ang}) scale(${1.1 / zk + 0.25})`} fill="#fff" stroke={INK} strokeWidth={3}><path d="M 34 0 L -22 -9 L -30 -26 L -38 -26 L -32 -8 L -32 8 L -38 26 L -30 26 L -22 9 Z" /><path d="M 4 -4 L -14 -40 L -4 -40 L 14 -4 Z" /><path d="M 4 4 L -14 40 L -4 40 L 14 4 Z" /></g>}
          </g>;
        })}
        {(p.pins ?? []).map((pn: any, i: number) => {
          const [x, y] = geo(...CITY[pn.c]);
          const at = frame(pn.at);
          if (f < at) return null;
          const k = lerp(f, [at, at + 7], [0, 1], easeOut);
          const col = pn.color ?? C.red, s = 1 / zk + 0.2;
          const lab = (pn.label ?? pn.c).toUpperCase();
          const left = pn.side === 'l';
          return <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <circle r={12 + ((f * 1.5 + i * 9) % 34)} fill="none" stroke={col} strokeWidth={3} opacity={1 - ((f * 1.5 + i * 9) % 34) / 34} />
            <g transform={`translate(0 ${-(1 - k) * 200})`} opacity={k}>
              <path d="M 0 0 L -22 -52 A 28 28 0 1 1 22 -52 Z" fill={col} stroke={INK} strokeWidth={5} /><circle cx={0} cy={-62} r={10} fill="#fff" stroke={INK} strokeWidth={4} />
            </g>
            <g opacity={lerp(f, [at + 5, at + 11], [0, 1])} transform={`translate(${left ? -(lab.length * 19 + 74) : 34} -84)`}>
              <rect width={lab.length * 19 + 36} height={48} fill="#060914" opacity={0.9} /><text x={18} y={34} fontFamily={LABEL} fontWeight={700} fontSize={30} fill="#fff" letterSpacing={2.5}>{lab}</text>
            </g>
          </g>;
        })}
        <Night id={`mp${(p.pins ?? []).length}${(p.routes ?? []).length}`} amt={0.3} tint="#000" lights={[{ x: v[1][0], y: v[1][1], r: 900 / zk, ry: 600 / zk, color: '#9fb4ff' }]} glow={0.08} />
      </Layer>
      {p.title && <AbsoluteFill style={{ padding: 60 }}><div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: '#fff', letterSpacing: 5, background: 'rgba(6,9,20,0.85)', padding: '10px 24px', alignSelf: 'flex-start', borderLeft: '6px solid #fff' }}>{p.title}</div></AbsoluteFill>}
    </Cam>
  );
};

// ------------------------------------------------------------------ a green terminal screen
/** p: { title, lines: string[], stamp?, watcher? (a cast key watching the screen), big? } */
export const Term: React.FC<SP> = ({ f, d, m, p }) => {
  const G = '#58e07a';
  const per = Math.max(6, Math.min(16, (d * 0.6) / p.lines.length));
  return (
    <Cam f={f} d={d} z={[1.0, 1.08]} x={[0, 30]} bg="#04100a">
      <Layer>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#06140d" />
        <rect x={160} y={110} width={1600} height={860} rx={26} fill="#082016" stroke={INK} strokeWidth={12} />
        <rect x={160} y={110} width={1600} height={84} fill="#0c3020" />
        <T x={200} y={168} s={44} c={G} ls={4}>{p.title}</T>
        <T x={1720} y={168} s={34} c={G} a="end" ls={3} o={0.5 + 0.5 * (Math.floor(f / 8) % 2)}>● LIVE</T>
        {p.lines.map((ln: string, i: number) => {
          const t0 = 6 + i * per, n = Math.round(lerp(f, [t0, t0 + per * 0.8], [0, ln.length]));
          return f < t0 ? null : <T key={i} x={220} y={300 + i * (p.big ? 110 : 84)} s={p.big ? 74 : 52} c={ln.startsWith('!') ? '#ffb4ae' : G} ls={3}>{ln.replace(/^!/, '').slice(0, n)}{n < ln.length && Math.floor(f / 4) % 2 ? '_' : ''}</T>;
        })}
        {p.stamp && <Stamp f={f} at={m.stamp ?? Math.round(d * 0.6)} x={1180} y={640} text={p.stamp} size={110} rot={-10} />}
        <g opacity={0.07}>{Array.from({ length: 108 }).map((_, i) => <rect key={i} x={160} y={110 + i * 8} width={1600} height={3} fill="#000" />)}</g>
      </Layer>
      {p.watcher && <Layer depth={1.3}><Bean {...LOOKS[p.watcher]} x={150} y={1380} s={2.6} f={f} seed={9} legs={false} lit={1} litC={G} look={[1, -0.6]} /></Layer>}
      <Layer><Night id={`tm${p.title.length}`} amt={0.35} tint="#000" lights={[{ x: 960, y: 520, r: 1000, ry: 620, color: G }]} glow={0.1} /></Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ a phone chat
/** p: { name, msgs: [{ t, me? }], counter?: number, counterLabel? } */
export const Chat: React.FC<SP> = ({ f, d, p }) => {
  const per = Math.max(5, Math.min(14, (d * 0.7) / p.msgs.length));
  const shown = p.msgs.filter((_: any, i: number) => f >= 6 + i * per);
  const scroll = Math.max(0, shown.length - 5) * 118;
  return (
    <Cam f={f} d={d} z={[1.0, 1.1]} bg="#0a0d1c">
      <Layer depth={0.4}><rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#0e1228" /><Bokeh f={f} seed={5} n={12} color="#6f8cff" /></Layer>
      <Layer>
        <g transform="translate(620 60)">
          <rect x={10} y={14} width={680} height={980} rx={70} fill="#000" opacity={0.4} />
          <rect width={680} height={980} rx={70} fill="#15182a" stroke={INK} strokeWidth={12} />
          <rect x={26} y={26} width={628} height={928} rx={48} fill="#eef0f7" />
          <rect x={26} y={26} width={628} height={120} rx={48} fill="#22294a" /><rect x={26} y={90} width={628} height={56} fill="#22294a" />
          <circle cx={96} cy={86} r={34} fill="#8f96a8" stroke={INK} strokeWidth={5} />
          <T x={150} y={100} s={40} c="#fff">{p.name}</T>
          <clipPath id="chat"><rect x={26} y={150} width={628} height={790} /></clipPath>
          <g clipPath="url(#chat)"><g transform={`translate(0 ${-scroll})`}>
            {p.msgs.map((ms: any, i: number) => {
              const t0 = 6 + i * per;
              if (f < t0) return null;
              const k = lerp(f, [t0, t0 + 5], [0, 1], easeOut), w = Math.min(520, ms.t.length * 21 + 50);
              return <g key={i} transform={`translate(${ms.me ? 634 - w : 46} ${180 + i * 118}) scale(${0.6 + 0.4 * k})`} opacity={k}>
                <rect width={w} height={90} rx={30} fill={ms.me ? '#3b6ee0' : '#fff'} stroke={INK} strokeWidth={5} />
                <text x={26} y={58} fontFamily={LABEL} fontWeight={700} fontSize={34} fill={ms.me ? '#fff' : INK}>{ms.t}</text>
              </g>;
            })}
          </g></g>
        </g>
        {p.counter && <g transform="translate(1360 430)">
          <text x={0} y={0} fontFamily={LABEL} fontWeight={700} fontSize={150} fill={C.green} letterSpacing={4}>{count(f, 8, d * 0.75, 0, p.counter).toLocaleString('en-US')}</text>
          <T x={0} y={70} s={44} c="#fff" ls={4}>{p.counterLabel ?? 'MESSAGES'}</T>
        </g>}
        <Night id="chatn" amt={0.45} lights={[{ x: 960, y: 520, r: 900, ry: 640, color: '#cfe0ff' }]} glow={0.1} />
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ flow diagram: boxes, arrows and moving coins
/** p: { title?, nodes: [{ x, y, label, sub?, icon?, color? }], edges: [[from, to]], loop?: boolean, q?: number (index of an edge shown with "?") } */
export const Flow: React.FC<SP> = ({ f, d, m, p }) => (
  <Cam f={f} d={d} z={[1.0, 1.07]} x={[-20, 20]} bg="#0a0f22">
    <Layer depth={0.4}><rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#101733" /><g stroke="#fff" opacity={0.04} strokeWidth={2}>{Array.from({ length: 24 }).map((_, i) => <line key={i} x1={-200 + i * 100} x2={-200 + i * 100} y1={-200} y2={1300} />)}{Array.from({ length: 14 }).map((_, i) => <line key={i} x1={-300} x2={2300} y1={i * 100} y2={i * 100} />)}</g></Layer>
    <Layer>
      {p.title && <T x={960} y={130} s={64} c="#fff" a="middle" ls={5}>{p.title}</T>}
      <g transform="translate(960 580) scale(1.2) translate(-960 -600)">
      {p.edges.map(([a, b]: [number, number], i: number) => {
        const A = p.nodes[a], B = p.nodes[b];
        const at = (m.go ?? 6) + i * (p.step ?? 10);
        const k = lerp(f, [at, at + 12], [0, 1], easeOut);
        const t = ((f - at) % 36) / 36;
        const dead = p.q === i;
        return f < at ? null : <g key={i}>
          <line x1={A.x} y1={A.y} x2={A.x + (B.x - A.x) * k} y2={A.y + (B.y - A.y) * k} stroke={dead ? C.red : C.green} strokeWidth={6} strokeDasharray="4 16" strokeLinecap="round" opacity={0.8} />
          {!dead && k >= 1 && [0, 0.5].map((o) => { const tt = (t + o) % 1; return <g key={o} transform={`translate(${A.x + (B.x - A.x) * tt} ${A.y + (B.y - A.y) * tt})`}><circle r={22} fill={C.green} stroke={INK} strokeWidth={5} /><text y={10} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={28} fill={INK}>€</text></g>; })}
          {dead && k >= 1 && <text x={(A.x + B.x) / 2} y={(A.y + B.y) / 2 - 20} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={130} fill={C.red}>?</text>}
        </g>;
      })}
      {p.nodes.map((n: any, i: number) => {
        const w = n.w ?? Math.max(260, n.label.length * 30 + 70);
        const at = n.at !== undefined ? (typeof n.at === 'number' ? n.at : m[n.at] ?? 0) : 0;
        const k = lerp(f, [at, at + 8], [0, 1], easeOut);
        return k <= 0 ? null : <g key={i} transform={`translate(${n.x} ${n.y}) scale(${0.7 + 0.3 * k})`} opacity={k}>
          <rect x={-w / 2 + 6} y={-62} width={w} height={n.sub ? 150 : 124} rx={14} fill="#000" opacity={0.35} />
          <rect x={-w / 2} y={-70} width={w} height={n.sub ? 150 : 124} rx={14} fill={n.color ?? '#1d2a55'} stroke={INK} strokeWidth={7} />
          <text x={0} y={n.sub ? -8 : 10} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={44} fill="#fff" letterSpacing={3}>{n.label}</text>
          {n.sub && <text x={0} y={46} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={28} fill={n.subC ?? C.green} letterSpacing={2}>{n.sub}</text>}
          {n.who && <g transform="translate(0 -70)"><Bean {...LOOKS[n.who]} x={0} y={0} s={1.15} f={f} seed={i} /></g>}
        </g>;
      })}
      </g>
      <Night id={`fl${p.nodes.length}`} amt={0.4} lights={[{ x: 960, y: 540, r: 1100, ry: 640, color: '#cfe0ff' }]} glow={0.06} />
    </Layer>
  </Cam>
);

// ------------------------------------------------------------------ chapter card (typed by time, not by words)
export const ChapterCard: React.FC<{ f: number; d: number; title: string; n: number }> = ({ f, d, title, n }) => {
  const shown = Math.round(lerp(f, [8, 8 + title.length * 1.3], [0, title.length]));
  return (
    <AbsoluteFill style={{ background: '#050507', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, f / 5, (d - f) / 5) }}>
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, color: C.green, letterSpacing: 10, marginBottom: 18, opacity: lerp(f, [2, 10], [0, 1]) }}>CHAPTER {n}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 104, color: '#f6f1e6', whiteSpace: 'pre' }}>
        {[...title].map((ch, i) => <span key={i} style={{ opacity: i < shown ? 1 : 0 }}>{ch}</span>)}
      </div>
    </AbsoluteFill>
  );
};
