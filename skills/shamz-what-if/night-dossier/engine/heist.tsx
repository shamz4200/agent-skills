// Night Dossier, extra scenes built for "The Typo That Stopped a $1 Billion Bank Robbery": a world map that reaches
// New York, the printer room, the phishing email, the time-zone board, the 35 payment orders, the typo and the ship.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Bean, Bokeh, C, Cam, HAND, INK, LABEL, Layer, LocTag, Night, Rain, Stamp, View, W, H, count, easeIO, easeOut, lerp } from './dossier';
import { Bubble, LOOKS, SP, T, CITY } from './kit2';
import { Cast, CastP } from './sets';

// ------------------------------------------------------------------ world map (the Americas to East Asia)
const LON0 = -135, LON1 = 150, LAT0 = 74, LAT1 = -14;
const g2 = (lon: number, lat: number): [number, number] => [((lon - LON0) / (LON1 - LON0)) * W, ((LAT0 - lat) / (LAT0 - LAT1)) * H];
const WLAND: Array<Array<[number, number]>> = [
  // North and Central America, the top of South America
  [[-168, 66], [-150, 71], [-125, 71], [-95, 73], [-80, 73], [-62, 60], [-56, 52], [-66, 45], [-70, 42], [-75, 36], [-81, 31], [-80, 25], [-84, 30], [-90, 29], [-97, 27], [-97, 19], [-91, 19], [-87, 21], [-88, 16], [-83, 10], [-77, 8], [-72, 12], [-62, 10], [-52, 5], [-50, 0], [-35, -6], [-36, -20], [-82, -20], [-80, -4], [-78, 2], [-84, 9], [-92, 15], [-105, 20], [-110, 24], [-117, 32], [-124, 41], [-124, 48], [-135, 58], [-150, 60], [-165, 60]],
  // Europe and Asia
  [[-9, 43.5], [-9.5, 37], [-5.5, 36], [-0.5, 38], [3, 42], [8, 44], [12, 44], [16, 38], [18, 40], [13.5, 45.5], [19, 42], [22.5, 37], [26, 40.5], [29, 41], [36, 36.5], [36, 33], [34.5, 29.5], [39, 21], [43, 13], [52, 16.5], [59.5, 22.5], [56, 26.5], [51.5, 24.5], [50, 30], [56.5, 27], [61, 25], [67, 25], [72.5, 21], [73, 16], [77, 8], [80, 15], [87, 21.5], [92, 22], [94.5, 16], [98, 16], [98.5, 8], [103.5, 1.5], [104, 9], [106, 10], [109, 12], [108.5, 16], [106, 20.5], [110, 21.5], [118, 24.5], [122, 30.5], [119, 35], [122.5, 37], [118, 39], [122, 40.5], [125, 39], [126.5, 34.5], [129.5, 36], [128, 40], [131, 43], [140, 50], [142, 58], [160, 62], [160, 76], [-20, 76], [5, 62], [5, 58.5], [8.5, 57], [8.5, 54], [4, 52.5], [-2, 49.5], [-4.5, 48.5], [-1.5, 46], [-2, 43.5]],
  [[-5.5, 50], [1.5, 51], [1.5, 53], [-2, 55.5], [-3, 58.5], [-6, 57.5], [-5, 54.5], [-3, 53.5], [-5, 52]],
  [[-17, 36], [-6, 35.8], [10, 37], [11, 33.5], [20, 31], [25, 32], [32, 31.2], [34, 28], [37, 21], [42.5, 12], [51, 12], [47, 4], [40, -4], [40, -20], [12, -20], [9, 4], [-8, 4.5], [-17, 14], [-17, 28]],
  [[95.5, 5.5], [98, 3.5], [103.5, 0], [106, -3], [106, -6], [102, -4], [97, 1]],
  [[109, 1.5], [110, -3], [117.5, -4], [119, 5], [117, 7], [113, 4]],
  [[120.3, 18.5], [122.2, 18.3], [122, 14.5], [124, 13], [121, 13.5], [120, 15.5]],
  [[122, 8], [126.3, 9.5], [126, 6], [123.5, 6]],
  [[79.7, 9.6], [81.8, 7.5], [80.5, 6], [79.8, 7.5]],
  [[130, 31.5], [131.5, 34], [136, 35], [140.5, 36], [141.5, 40.5], [140, 41], [139, 37.5], [136, 36.5], [132.5, 35.5]],
  [[114, -14], [130, -12], [137, -12], [142, -11], [146, -19], [114, -22]],
];
const WAREA: Record<string, Array<[number, number]>> = {
  bangladesh: [[88.2, 26.4], [92.3, 25], [92.4, 21], [89, 21.7]],
  nkorea: [[124.3, 40], [126, 41.8], [130.6, 42.6], [129.5, 40.8], [128.3, 38.6], [126.6, 37.8], [124.8, 38.2]],
  philippines: [[119, 19.5], [123.5, 19.5], [127.5, 9], [126.5, 5], [121.5, 5.5], [119, 12]],
  srilanka: [[79.7, 9.6], [81.8, 7.5], [80.5, 6], [79.8, 7.5]],
  usa: [[-124, 48], [-95, 49], [-83, 46], [-67, 45], [-75, 36], [-81, 31], [-80, 25], [-84, 30], [-90, 29], [-97, 27], [-106, 31], [-117, 32], [-124, 41]],
};
/** p: like MapShot: { v?, pins: [{c, label?, at?, color?, side?}], routes: [{a, b, at?, dur?, plane?, color?, bend?, coins?}], hi: [{k, label?, color?, at?, dx?, dy?}], title? } */
export const World: React.FC<SP> = ({ f, d, m, p }) => {
  const sea = '#0c1433', land = '#24356b', edge = '#5b77c9';
  const v: [View, View] = p.v ?? [[960, 540, 1], [960, 540, 1.07]];
  const zk = (v[0][2] + v[1][2]) / 2;
  const fr = (x: any) => (typeof x === 'number' ? x : x ? m[x] ?? 6 : 6);
  const path = (poly: Array<[number, number]>) => poly.map(([lo, la], k) => `${k ? 'L' : 'M'} ${g2(lo, la)[0]} ${g2(lo, la)[1]}`).join(' ') + ' Z';
  return (
    <Cam f={f} d={d} v={v} ease bg={sea}>
      <Layer>
        <rect x={-800} y={-600} width={W + 1600} height={H + 1200} fill={sea} />
        <g stroke="#fff" opacity={0.045} strokeWidth={2}>{Array.from({ length: 19 }).map((_, i) => <line key={i} x1={i * 110} x2={i * 110} y1={-200} y2={1300} />)}{Array.from({ length: 12 }).map((_, i) => <line key={i} x1={-200} x2={2200} y1={i * 110} y2={i * 110} />)}</g>
        {WLAND.map((poly, i) => <path key={i} d={path(poly)} fill={land} stroke={edge} strokeWidth={3 / zk + 1} strokeLinejoin="round" />)}
        {(p.hi ?? []).map((h: any, i: number) => {
          const o = lerp(f, [fr(h.at), fr(h.at) + 10], [0, 1]);
          const poly = WAREA[h.k];
          const cx = poly.reduce((s, q) => s + g2(q[0], q[1])[0], 0) / poly.length, cy = poly.reduce((s, q) => s + g2(q[0], q[1])[1], 0) / poly.length;
          return <g key={i} opacity={o}><path d={path(poly)} fill={h.color ?? C.red} opacity={0.6} stroke={h.color ?? C.red} strokeWidth={3} />
            {h.label && <text x={cx + (h.dx ?? 0)} y={cy + (h.dy ?? 0)} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={30 / zk + 8} fill="#fff" letterSpacing={5}>{h.label}</text>}</g>;
        })}
        {(p.routes ?? []).map((r: any, i: number) => {
          const A = g2(...CITY[r.a]), B = g2(...CITY[r.b]);
          const at = fr(r.at), k = lerp(f, [at, at + (r.dur ?? 34)], [0, 1], easeIO);
          if (f < at) return null;
          const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2 - Math.hypot(B[0] - A[0], B[1] - A[1]) * (r.bend ?? 0.2);
          const q = (a: number, b: number, c: number, t: number) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
          const col = r.color ?? '#fff';
          return <g key={i}>
            <path d={`M ${A[0]} ${A[1]} Q ${mx} ${my} ${B[0]} ${B[1]}`} fill="none" stroke={col} strokeWidth={5 / zk + 1} strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} opacity={0.9} />
            {r.coins && k >= 1 && [0, 0.33, 0.66].map((o) => { const t = (((f - at) % 50) / 50 + o) % 1; return <g key={o} transform={`translate(${q(A[0], mx, B[0], t)} ${q(A[1], my, B[1], t)}) scale(${1 / zk + 0.2})`}><circle r={18} fill={C.green} stroke={INK} strokeWidth={5} /><text y={8} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={22} fill={INK}>$</text></g>; })}
            {r.msg && k < 1 && <g transform={`translate(${q(A[0], mx, B[0], k)} ${q(A[1], my, B[1], k)}) scale(${1 / zk + 0.2})`} stroke={INK} strokeWidth={4}><rect x={-22} y={-15} width={44} height={30} fill={C.paper} /><path d="M -22 -15 L 0 4 L 22 -15" fill="none" /></g>}
          </g>;
        })}
        {(p.pins ?? []).map((pn: any, i: number) => {
          const [x, y] = g2(...CITY[pn.c]);
          const at = fr(pn.at);
          if (f < at) return null;
          const k = lerp(f, [at, at + 7], [0, 1], easeOut);
          const col = pn.color ?? C.red, s = 1 / zk + 0.2;
          const lab = (pn.label ?? pn.c).toUpperCase(), left = pn.side === 'l';
          return <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <circle r={12 + ((f * 1.5 + i * 9) % 34)} fill="none" stroke={col} strokeWidth={3} opacity={1 - ((f * 1.5 + i * 9) % 34) / 34} />
            <g transform={`translate(0 ${-(1 - k) * 200})`} opacity={k}><path d="M 0 0 L -22 -52 A 28 28 0 1 1 22 -52 Z" fill={col} stroke={INK} strokeWidth={5} /><circle cx={0} cy={-62} r={10} fill="#fff" stroke={INK} strokeWidth={4} /></g>
            <g opacity={lerp(f, [at + 5, at + 11], [0, 1])} transform={`translate(${left ? -(lab.length * 19 + 74) : 34} -84)`}><rect width={lab.length * 19 + 36} height={48} fill="#060914" opacity={0.9} /><text x={18} y={34} fontFamily={LABEL} fontWeight={700} fontSize={30} fill="#fff" letterSpacing={2.5}>{lab}</text></g>
          </g>;
        })}
        <Night id={`w${(p.pins ?? []).length}${(p.routes ?? []).length}${Math.round(v[0][0])}`} amt={0.3} tint="#000" lights={[{ x: v[1][0], y: v[1][1], r: 900 / zk, ry: 600 / zk, color: '#9fb4ff' }]} glow={0.08} />
      </Layer>
      {p.title && <AbsoluteFill style={{ padding: 60 }}><div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: '#fff', letterSpacing: 5, background: 'rgba(6,9,20,0.85)', padding: '10px 24px', alignSelf: 'flex-start', borderLeft: '6px solid #fff' }}>{p.title}</div></AbsoluteFill>}
    </Cam>
  );
};
export const wgeo = g2;

// ------------------------------------------------------------------ the printer room on the tenth floor
/** p: { mode: dead|shrug|off|print|read, cast?: CastP[], v?, loc?, bubble? } */
export const PrinterRoom: React.FC<SP> = ({ f, d, m, p }) => {
  const mode = p.mode ?? 'dead';
  const printing = mode === 'print' || mode === 'read';
  const v: [View, View] = Array.isArray(p.v) ? p.v : p.v === 'close' ? [[1240, 600, 1.7], [1240, 590, 1.95]] : p.v === 'pull' ? [[1240, 600, 1.6], [960, 540, 1.0]] : [[960, 540, 1.0], [1000, 540, 1.1]];
  const pages = printing ? Math.min(9, Math.floor(f / 7)) : 0;
  return (
    <Cam f={f} d={d} v={v} ease={p.v === 'pull'}>
      <Layer depth={0.6}>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#27344d" />
        {Array.from({ length: 14 }).map((_, i) => <line key={i} x1={-300 + i * 190} x2={-300 + i * 190} y1={-300} y2={1300} stroke="#1f2a40" strokeWidth={8} />)}
        <g><rect x={160} y={150} width={560} height={400} fill="#0c1230" stroke={INK} strokeWidth={10} />
          {Array.from({ length: 7 }).map((_, i) => { const bh = 120 + ((i * 97) % 200); return <g key={i}><rect x={176 + i * 76} y={540 - bh} width={62} height={bh} fill="#18204a" />{Array.from({ length: Math.floor(bh / 38) }).map((__, j) => <rect key={j} x={186 + i * 76 + (j % 2) * 22} y={548 - bh + j * 38} width={14} height={16} fill={(i + j) % 3 ? '#ffd98a' : '#27306a'} />)}</g>; })}
          <circle cx={600} cy={230} r={28} fill="#f3efd9" /><line x1={440} y1={150} x2={440} y2={550} stroke={INK} strokeWidth={7} /></g>
        <g><rect x={820} y={130} width={640} height={84} fill="#12303a" stroke={INK} strokeWidth={8} /><T x={1140} y={188} s={42} c={C.gold} a="middle" ls={5}>PAYMENTS ROOM · FLOOR 10</T></g>
        <g transform="translate(1620 300)" stroke={INK} strokeWidth={7}><circle r={64} fill="#fff" /><line x1={0} y1={0} x2={0} y2={-44} transform={`rotate(${f * 1.5})`} /><line x1={0} y1={0} x2={28} y2={0} transform={`rotate(${f * 0.12 + 40})`} /></g>
      </Layer>
      <Layer>
        <rect x={-400} y={880} width={W + 800} height={500} fill="#171c33" />
        <Cast list={(p.cast ?? []).filter((c: CastP) => !c.hold)} f={f} d={d} m={m} gy={960} />
        {/* the printer on its table */}
        <g stroke={INK} strokeWidth={9} strokeLinejoin="round">
          <rect x={980} y={760} width={560} height={50} fill={C.wood} /><rect x={1010} y={810} width={500} height={300} fill={C.woodD} />
          <rect x={1080} y={600} width={340} height={160} rx={16} fill="#cfd4de" /><rect x={1110} y={560} width={280} height={50} fill="#aeb4c2" />
          <rect x={1130} y={690} width={240} height={26} fill="#22252f" />
        </g>
        <circle cx={1385} cy={640} r={11} fill={printing ? C.green : C.red} opacity={printing ? 1 : mode === 'off' ? 0.25 : 0.45 + 0.55 * (Math.floor(f / 9) % 2)} />
        {mode === 'off' && <g stroke={INK} strokeWidth={7} fill="none"><path d="M 1420 700 q 80 30 70 120" /><rect x={1476} y={816} width={30} height={22} fill="#8d93a6" /><path d="M 1540 860 l 50 34 M 1590 860 l -50 34" stroke={C.red} strokeWidth={8} /></g>}
        {Array.from({ length: pages }).map((_, i) => { const k = lerp(f, [i * 7, i * 7 + 10], [0, 1], easeOut); return <g key={i} transform={`translate(${1150 + ((i * 37) % 60)} ${700 + k * (60 + i * 12)}) rotate(${(i % 2 ? 6 : -7) * k})`} stroke={INK} strokeWidth={5}><rect width={200} height={130} fill={C.paper} />{[0, 1, 2].map((r) => <line key={r} x1={18} x2={182 - r * 30} y1={30 + r * 30} y2={30 + r * 30} stroke={r === 0 ? C.red : '#8a8170'} strokeWidth={5} />)}</g>; })}
        <Cast list={(p.cast ?? []).filter((c: CastP) => c.hold)} f={f} d={d} m={m} gy={960} />
        <Night id={`pr${mode}`} amt={0.66} lights={[{ x: 1250, y: 660, r: 560, ry: 420, color: printing ? '#d9ffe0' : C.warm }, { x: 520, y: 760, r: 520, ry: 380, power: 0.7 }]} />
      </Layer>
      <Layer depth={1.15}>
        {p.loc && <LocTag f={f} at={8} text={p.loc} />}
        {p.stamp && <Stamp f={f} at={m.stamp ?? Math.round(d * 0.5)} x={p.stampX ?? 1240} y={p.stampY ?? 420} text={p.stamp} size={96} rot={-9} />}
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ the email with the CV
/** p: { mode: arrive|open|trap } */
export const Email: React.FC<SP> = ({ f, d, m, p }) => {
  const mode = p.mode ?? 'arrive';
  const click = m.click ?? Math.round(d * 0.45);
  const bad = mode === 'trap' ? 1 : mode === 'open' ? lerp(f, [click, click + 8], [0, 1]) : 0;
  const k = lerp(f, [0, 10], [0, 1], easeOut);
  return (
    <Cam f={f} d={d} z={[1.0, 1.1]} bg="#0a0f22">
      <Layer depth={0.4}><rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#101733" /><Bokeh f={f} seed={8} n={12} color={bad > 0.5 ? '#ff6b6b' : '#6f8cff'} /></Layer>
      <Layer>
        <g transform={`translate(960 ${560 + (1 - k) * 80})`} opacity={k}>
          <rect x={-690} y={-390} width={1400} height={800} rx={18} fill="#000" opacity={0.35} />
          <rect x={-700} y={-400} width={1400} height={800} rx={18} fill="#eef0f7" stroke={INK} strokeWidth={9} />
          <rect x={-700} y={-400} width={1400} height={90} rx={18} fill="#22294a" stroke={INK} strokeWidth={9} /><rect x={-696} y={-340} width={1392} height={30} fill="#22294a" />
          {[0, 1, 2].map((i) => <circle key={i} cx={-650 + i * 40} cy={-355} r={12} fill={['#d8433b', '#e2b441', '#55d66b'][i]} />)}
          <T x={-520} y={-340} s={38} c="#fff">INBOX · BANGLADESH BANK</T>
          <T x={-640} y={-230} s={36} c="#6b6250">FROM</T><T x={-460} y={-230} s={44}>A JOB SEEKER</T>
          <T x={-640} y={-150} s={36} c="#6b6250">SUBJECT</T><T x={-460} y={-150} s={44}>LOOKING FOR WORK</T>
          <line x1={-640} x2={640} y1={-110} y2={-110} stroke="#b8bfd0" strokeWidth={4} />
          <text x={-640} y={-30} fontFamily={HAND} fontWeight={700} fontSize={58} fill={INK}>Dear Sir, I would love to work with you.</text>
          <text x={-640} y={50} fontFamily={HAND} fontWeight={700} fontSize={58} fill={INK}>Please see my CV, attached. Thank you!</text>
          <g transform="translate(-640 130)"><rect width={520} height={150} rx={14} fill={bad > 0.5 ? '#3a0d12' : '#dfe4f2'} stroke={bad > 0.5 ? C.red : INK} strokeWidth={8} />
            <rect x={30} y={26} width={76} height={98} fill="#fff" stroke={INK} strokeWidth={5} /><path d="M 82 26 L 106 50 L 82 50 Z" fill="#b8bfd0" stroke={INK} strokeWidth={4} />
            <T x={140} y={72} s={44} c={bad > 0.5 ? '#ffb4ae' : INK}>MY_CV.ZIP</T><T x={140} y={116} s={28} c={bad > 0.5 ? '#ff8a80' : '#6b6250'}>{bad > 0.5 ? 'HIDDEN SOFTWARE INSIDE' : 'attachment'}</T></g>
          {mode !== 'arrive' && <g transform={`translate(${lerp(f, [0, click], [420, -340], easeIO)} ${lerp(f, [0, click], [330, 230], easeIO)}) scale(${f >= click && f < click + 5 ? 0.85 : 1})`}><path d="M 0 0 L 0 72 L 20 54 L 36 90 L 52 82 L 36 48 L 62 48 Z" fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" /></g>}
          {bad > 0.5 && [0, 1, 2, 3, 4, 5].map((i) => { const t = lerp(f, [click + 6 + i * 2, click + 26 + i * 2], [0, 1], easeOut); const a = (i / 6) * Math.PI * 2 + 0.4; return <g key={i} transform={`translate(${-380 + Math.cos(a) * 520 * t} ${205 + Math.sin(a) * 300 * t})`} opacity={t > 0 ? 1 : 0}><circle r={20} fill={C.red} stroke={INK} strokeWidth={5} /><g stroke={INK} strokeWidth={4}>{[-1, 1].map((sgn) => [0, 1, 2].map((j) => <line key={`${sgn}${j}`} x1={sgn * 16} y1={-10 + j * 10} x2={sgn * 34} y2={-18 + j * 16} />))}</g></g>; })}
        </g>
        <Night id={`em${mode}`} amt={0.45} tint={bad > 0.5 ? '#14040a' : '#070a1c'} lights={[{ x: 960, y: 540, r: 1100, ry: 640, color: bad > 0.5 ? '#ff9a8a' : '#cfe0ff' }]} glow={0.1} />
      </Layer>
      <Layer depth={1.15}>{p.stamp && <Stamp f={f} at={m.stamp ?? click + 10} x={1300} y={760} text={p.stamp} size={96} rot={-9} />}</Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ the time-zone board: three cities, six days
const DAYS = ['THU', 'FRI', 'SAT', 'SUN', 'MON', 'TUE'];
const OPEN: Record<string, number[]> = { DHAKA: [1, 0, 0, 1, 1, 1], 'NEW YORK': [1, 1, 0, 0, 1, 1], MANILA: [1, 1, 0, 0, 0, 1] };
const WHY: Record<string, string[]> = { DHAKA: ['', 'WEEKEND', 'WEEKEND', '', '', ''], 'NEW YORK': ['', '', 'WEEKEND', 'WEEKEND', '', ''], MANILA: ['', '', 'WEEKEND', 'WEEKEND', 'HOLIDAY', ''] };
/** p: { rows?: number (how many city rows are lit), upto?: number (how many day columns are revealed), focus?: [row, col], gap?: boolean } */
export const Zones: React.FC<SP> = ({ f, d, m, p }) => {
  const rows = p.rows ?? 3, upto = p.upto ?? 6;
  const cities = Object.keys(OPEN);
  const v: [View, View] = p.v ?? [[960, 540, 1.0], [960, 540, 1.06]];
  return (
    <Cam f={f} d={d} v={v} bg="#0a0f22">
      <Layer>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#101733" />
        <T x={960} y={120} s={60} c="#fff" a="middle" ls={8}>{p.title ?? 'WHO IS AWAKE?'}</T>
        {DAYS.map((dy, c) => <g key={dy} opacity={c < upto ? 1 : 0.2}><T x={560 + c * 210} y={230} s={46} c={c === 0 ? C.gold : '#cfd6ea'} a="middle" ls={4}>{dy}</T></g>)}
        {cities.map((ct, r) => {
          const on = r < rows;
          return <g key={ct} opacity={on ? 1 : 0.18}>
            <T x={120} y={372 + r * 230} s={56} c="#fff" ls={4}>{ct}</T>
            {DAYS.map((_, c) => {
              const show = on && c < upto;
              const at = (m.go ?? 6) + c * (p.step ?? 5) + r * 2;
              const k = show ? lerp(f, [at, at + 6], [0, 1], easeOut) : 0;
              const open = OPEN[ct][c] === 1;
              const hot = p.focus && p.focus[0] === r && p.focus[1] === c;
              return <g key={c} transform={`translate(${560 + c * 210} ${350 + r * 230})`}>
                <rect x={-92} y={-86} width={184} height={172} rx={14} fill="#18204a" stroke={INK} strokeWidth={6} />
                <g opacity={k} transform={`scale(${0.7 + 0.3 * k})`}>
                  <rect x={-92} y={-86} width={184} height={172} rx={14} fill={open ? '#1f5a3a' : '#3a1418'} stroke={hot ? C.gold : open ? C.green : C.red} strokeWidth={hot ? 10 : 6} />
                  {open ? <g><circle r={34} fill="#ffe08a" stroke={INK} strokeWidth={5} />{Array.from({ length: 8 }).map((__, i) => <line key={i} x1={Math.cos(i * 0.785) * 44} y1={Math.sin(i * 0.785) * 44} x2={Math.cos(i * 0.785) * 58} y2={Math.sin(i * 0.785) * 58} stroke="#ffe08a" strokeWidth={6} strokeLinecap="round" />)}</g>
                    : <g><path d="M 14 -34 A 36 36 0 1 0 30 26 A 28 28 0 1 1 14 -34 Z" fill="#cfd6ea" stroke={INK} strokeWidth={5} /><text y={72} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={24} fill="#ffb4ae" letterSpacing={2}>{WHY[ct][c]}</text></g>}
                </g>
              </g>;
            })}
          </g>;
        })}
        {p.gap && <g opacity={lerp(f, [m.gap ?? 20, (m.gap ?? 20) + 10], [0, 1])}><rect x={664} y={940} width={846} height={14} fill={C.gold} /><T x={1087} y={1010} s={52} c={C.gold} a="middle" ls={4}>ALMOST 5 DAYS</T></g>}
        <Night id={`zn${rows}${upto}`} amt={0.4} lights={[{ x: 960, y: 560, r: 1100, ry: 640, color: '#cfe0ff' }]} glow={0.06} />
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ the 35 payment orders
/** p: { mode: send|reject|paid|held|final, total?: boolean } */
export const Orders: React.FC<SP> = ({ f, d, m, p }) => {
  const mode = p.mode ?? 'send';
  const go = m.go ?? 8;
  return (
    <Cam f={f} d={d} z={[1.0, 1.07]} bg="#0a0f22">
      <Layer>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#101733" />
        <T x={960} y={110} s={54} c="#fff" a="middle" ls={6}>{p.title ?? '35 PAYMENT ORDERS'}</T>
        {Array.from({ length: 35 }).map((_, i) => {
          const c = i % 7, r = Math.floor(i / 7), x = 330 + c * 210, y = 250 + r * 150;
          const at = mode === 'send' ? go + i * 1.2 : go + (i % 7) + r * 2;
          const k = mode === 'send' ? lerp(f, [at, at + 6], [0, 1], easeOut) : 1;
          const paid = i < 5;
          const st = mode === 'reject' ? (f >= at ? 'rej' : 'none') : mode === 'paid' ? (paid && f >= go + i * 5 ? 'paid' : 'none') : mode === 'held' ? (paid ? 'paid' : f >= at ? 'held' : 'none') : mode === 'final' ? (paid ? (i === 4 ? (f >= go ? 'held' : 'paid') : 'paid') : 'held') : 'none';
          const col = st === 'paid' ? C.green : st === 'held' || st === 'rej' ? C.red : '#8d93a6';
          return <g key={i} transform={`translate(${x} ${y + (1 - k) * 40})`} opacity={k}>
            <rect x={-90} y={-58} width={180} height={116} rx={10} fill={st === 'paid' ? '#12351f' : st === 'held' || st === 'rej' ? '#3a1418' : '#1d2a55'} stroke={col} strokeWidth={6} />
            <text x={0} y={-12} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={30} fill="#fff" letterSpacing={2}>ORDER {i + 1}</text>
            <text x={0} y={30} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={28} fill={col} letterSpacing={3}>{st === 'paid' ? 'PAID' : st === 'held' ? 'STOPPED' : st === 'rej' ? 'REJECTED' : '$ $ $'}</text>
          </g>;
        })}
        {p.total && <text x={960} y={1020} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={84} fill={mode === 'held' || mode === 'final' ? C.red : C.green} letterSpacing={5}>{p.totalText ?? '$' + count(f, go, go + 40, 0, 951000000).toLocaleString('en-US')}</text>}
        <Night id={`or${mode}`} amt={0.4} lights={[{ x: 960, y: 560, r: 1100, ry: 640, color: '#cfe0ff' }]} glow={0.06} />
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ the two words
/** A typed payment line with one word wrong. p: { } */
export const Typo: React.FC<SP> = ({ f, d, m, p }) => {
  const txt = 'PAY TO: SHALIKA ';
  const word = p.right ? 'FOUNDATION' : 'FANDATION';
  const at = m.word ?? 16;
  const n1 = Math.round(lerp(f, [4, at], [0, txt.length]));
  const n2 = Math.round(lerp(f, [at, at + 12], [0, word.length]));
  const circ = lerp(f, [at + 16, at + 30], [0, 1], easeIO);
  return (
    <Cam f={f} d={d} v={[[960, 540, 1.0], [1010, 540, 1.14]]} ease bg="#04100a">
      <Layer>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#06140d" />
        <rect x={120} y={200} width={1680} height={680} rx={26} fill="#082016" stroke={INK} strokeWidth={12} />
        <rect x={120} y={200} width={1680} height={84} fill="#0c3020" /><T x={160} y={258} s={44} c="#58e07a" ls={4}>PAYMENT ORDER 5 · $20,000,000 · SRI LANKA</T>
        <text x={190} y={600} fontFamily={LABEL} fontWeight={700} fontSize={104} fill="#58e07a" letterSpacing={6}>{txt.slice(0, n1)}<tspan fill={p.right ? '#58e07a' : '#ffb4ae'}>{word.slice(0, n2)}</tspan>{Math.floor(f / 5) % 2 ? '_' : ''}</text>
        {!p.right && <g>
          <ellipse cx={1385} cy={562} rx={370} ry={110} fill="none" stroke={C.red} strokeWidth={12} pathLength={1} strokeDasharray={`${circ} 1`} />
          <text x={1385} y={780} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={110} fill="#fff" opacity={lerp(f, [at + 28, at + 36], [0, 1])}>"foundation"?</text>
        </g>}
        <g opacity={0.07}>{Array.from({ length: 86 }).map((_, i) => <rect key={i} x={120} y={200 + i * 8} width={1680} height={3} fill="#000" />)}</g>
        <Night id="typo" amt={0.35} tint="#000" lights={[{ x: 1100, y: 540, r: 1000, ry: 560, color: '#58e07a' }]} glow={0.1} />
      </Layer>
    </Cam>
  );
};

/** A tanker at sea with a name on its hull, and a sanctions list. p: { name, list?: boolean } */
export const Ship: React.FC<SP> = ({ f, d, m, p }) => {
  const bobY = Math.sin(f / 14) * 8;
  return (
    <Cam f={f} d={d} v={[[960, 560, 1.0], [1000, 560, 1.12]]}>
      <Layer depth={0.2}>
        <defs><linearGradient id="shsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#070b1f" /><stop offset="1" stopColor="#26356b" /></linearGradient></defs>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="url(#shsky)" /><circle cx={1500} cy={190} r={60} fill="#f3efd9" /><circle cx={1500} cy={190} r={130} fill="#f3efd9" opacity={0.08} />
      </Layer>
      <Layer>
        <g transform={`translate(0 ${bobY}) rotate(${Math.sin(f / 14) * 0.6} 900 700)`} stroke={INK} strokeWidth={9} strokeLinejoin="round">
          <path d="M 260 620 L 1560 620 L 1480 800 L 360 800 Z" fill="#7a2f2a" /><path d="M 260 620 L 1560 620 L 1540 664 L 280 664 Z" fill="#1b1d26" />
          <rect x={1180} y={440} width={220} height={180} fill="#e9edf5" /><rect x={1210} y={470} width={160} height={40} fill="#27306a" /><rect x={1250} y={360} width={70} height={84} fill="#b8433a" />
          {[420, 620, 820, 1020].map((x) => <g key={x}><rect x={x} y={570} width={150} height={50} fill="#8d93a6" /><circle cx={x + 75} cy={570} r={36} fill="#aeb4c2" /></g>)}
          <text x={700} y={756} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={96} fill="#fff" stroke="none" letterSpacing={14}>{p.name ?? 'JUPITER'}</text>
        </g>
        <rect x={-400} y={770} width={W + 800} height={600} fill="#0e1c40" />
        {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M ${-200 + i * 150 + Math.sin(f / 12 + i) * 24} ${800 + (i % 3) * 60} q 40 -16 80 0 q 40 16 80 0`} fill="none" stroke="#cfe0ff" strokeWidth={5} opacity={0.3} />)}
        <Night id="ship" amt={0.5} lights={[{ x: 900, y: 600, r: 900, ry: 420 }, { x: 1500, y: 190, r: 300, color: '#cfe0ff', power: 0.5 }]} />
        <Rain f={f} op={0.1} n={50} />
      </Layer>
      <Layer depth={1.15}>
        {p.list && <g transform={`translate(${lerp(f, [m.list ?? 8, (m.list ?? 8) + 10], [2100, 1260], easeOut)} 150) rotate(4)`}>
          <rect x={8} y={10} width={540} height={420} fill="#000" opacity={0.35} /><rect width={540} height={420} fill={C.paper} stroke={INK} strokeWidth={8} />
          <T x={270} y={76} s={46} a="middle" ls={4}>US SANCTIONS LIST</T><line x1={40} x2={500} y1={100} y2={100} stroke={INK} strokeWidth={5} />
          {[0, 1, 3, 4].map((i) => <rect key={i} x={50} y={140 + i * 54} width={300 + ((i * 53) % 140)} height={22} fill="#8a8170" />)}
          <rect x={40} y={236} width={460} height={52} fill="#ffe08a" /><T x={56} y={276} s={40} c={C.red}>JUPITER (vessel, Iran)</T>
        </g>}
        {p.loc && <LocTag f={f} at={8} text={p.loc} />}
        {p.stamp && <Stamp f={f} at={m.stamp ?? Math.round(d * 0.5)} x={760} y={380} text={p.stamp} size={90} rot={-8} />}
      </Layer>
    </Cam>
  );
};

/** A big street sign. p: { text, sub? } */
export const StreetSign: React.FC<SP> = ({ f, d, p }) => (
  <Cam f={f} d={d} v={[[960, 560, 1.25], [960, 500, 1.0]]} ease>
    <Layer depth={0.3}><rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#101733" /><Bokeh f={f} seed={6} n={14} color="#ffd98a" /></Layer>
    <Layer>
      <rect x={930} y={300} width={60} height={900} fill="#8d93a6" stroke={INK} strokeWidth={9} />
      <g transform={`rotate(${Math.sin(f / 20) * 0.8} 960 400)`}>
        <rect x={370} y={250} width={1200} height={280} rx={30} fill="#000" opacity={0.35} />
        <rect x={360} y={240} width={1200} height={280} rx={30} fill="#1f7a3a" stroke={INK} strokeWidth={12} /><rect x={386} y={266} width={1148} height={228} rx={18} fill="none" stroke="#fff" strokeWidth={8} />
        <text x={960} y={440} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={190} fill="#fff" letterSpacing={18}>{p.text}</text>
      </g>
      {p.sub && <g><rect x={960 - p.sub.length * 21 - 40} y={636} width={p.sub.length * 42 + 80} height={90} fill="#060914" opacity={0.92} /><T x={960} y={700} s={56} c="#fff" a="middle" ls={6}>{p.sub}</T></g>}
      <Night id="ssign" amt={0.5} lights={[{ x: 960, y: 400, r: 900, ry: 460 }]} />
      <Rain f={f} op={0.12} n={50} />
    </Layer>
  </Cam>
);

/** The title over a dark sky. p: { l1, l2, accent, sub } */
export const TitleShot: React.FC<SP> = ({ f, d, m, p }) => {
  const at = m.go ?? 20;
  const tk = lerp(f, [at, at + 30], [0, 1]);
  const n = Math.round(tk * (p.l1.length + p.l2.length));
  return (
    <Cam f={f} d={d} z={[1.0, 1.1]}>
      <Layer depth={0.2}><rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#080c1c" /><Bokeh f={f} seed={21} n={18} color="#58e07a" /></Layer>
      <Layer>
        <g opacity={0.5}>{Array.from({ length: 35 }).map((_, i) => <rect key={i} x={150 + (i % 7) * 240} y={120 + Math.floor(i / 7) * 180} width={180} height={110} rx={10} fill="none" stroke={i < 5 ? C.green : C.red} strokeWidth={5} opacity={0.35} />)}</g>
        <Night id="title" amt={0.5} lights={[{ x: 960, y: 560, r: 1000, ry: 520, color: '#cfe0ff' }]} glow={0.1} />
      </Layer>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 118, color: '#fff', letterSpacing: 6, textAlign: 'center', lineHeight: 1.12, textShadow: '0 6px 0 #0a0d1e, 0 0 40px rgba(0,0,0,0.8)', whiteSpace: 'pre' }}>
          {[...p.l1].map((ch: string, i: number) => <span key={i} style={{ opacity: i < n ? 1 : 0 }}>{ch}</span>)}<br />
          {[...p.l2].map((ch: string, i: number) => <span key={i} style={{ opacity: i + p.l1.length < n ? 1 : 0, color: C.gold }}>{ch}</span>)}
        </div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: C.green, opacity: lerp(f, [at + 34, at + 44], [0, 1]), marginTop: 10 }}>{p.sub}</div>
      </AbsoluteFill>
    </Cam>
  );
};
