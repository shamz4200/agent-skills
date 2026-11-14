// Night Dossier, scenes built for "The Dropout Who Stole $240 Million in Bitcoin": the scam call (split screen), the
// supercar garage, the nightclub, the leaked screen-share, the blockchain trail, the watch and the soft toys.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Bean, Bokeh, C, Cam, HAND, INK, LABEL, Layer, LocTag, NameTag, Night, Rain, Stamp, View, W, H, count, easeIO, easeOut, lerp } from './dossier';
import { Bubble, LOOKS, SP, T } from './kit2';

// ------------------------------------------------------------------ the call: victim at home | caller in the dark
/** p: { who: caller cast key, claim: 'GOOGLE SUPPORT' | 'GEMINI SUPPORT', line?: string (caller bubble), vline?: string (victim bubble), face? } */
export const Call: React.FC<SP> = ({ f, d, m, p }) => {
  const ring = f < 14 ? Math.sin(f * 1.6) * 6 : 0;
  const split = lerp(f, [0, 10], [W, 960], easeOut);
  return (
    <Cam f={f} d={d} z={[1.0, 1.05]}>
      <Layer>
        {/* left: the victim's home office, warm */}
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#3a2f3a" />
        <rect x={120} y={140} width={560} height={420} fill="#0c1230" stroke={INK} strokeWidth={10} />
        {Array.from({ length: 6 }).map((_, i) => { const bh = 120 + ((i * 97) % 180); return <rect key={i} x={140 + i * 88} y={560 - bh} width={70} height={bh} fill="#18204a" />; })}
        <circle cx={600} cy={220} r={26} fill="#f3efd9" />
        <rect x={-400} y={860} width={W + 800} height={500} fill="#2a2030" />
        <Bean {...LOOKS.victim} x={480} y={980} s={2.2} f={f} seed={4} legs={false} lit={1} tilt={ring * 0.3} arms={[null, [44, -196]]} eyes={p.vface?.eyes ?? 'open'} mouth={p.vface?.mouth ?? 'line'} look={[1, -0.2]}
          hold={<g transform="translate(40 -206) rotate(-14)" stroke={INK} strokeWidth={4}><rect x={-14} y={-28} width={28} height={54} rx={7} fill="#22252f" /></g>} />
        <g stroke={INK} strokeWidth={9}><rect x={80} y={800} width={760} height={56} fill={C.wood} /><rect x={120} y={856} width={680} height={300} fill={C.woodD} /></g>
        <g stroke={INK} strokeWidth={7}><rect x={560} y={660} width={230} height={140} rx={8} fill="#22252f" /><rect x={574} y={674} width={202} height={112} fill="#1c3f8a" /><text x={675} y={740} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={26} fill="#fff" stroke="none">₿ 4,100</text></g>
        <Night id="callL" amt={0.38} lights={[{ x: 480, y: 700, r: 520, ry: 460 }]} />
        {/* right: the caller, cold blue, sliding in */}
        <g transform={`translate(${split - 960} 0)`}>
          <rect x={960} y={-300} width={W} height={H + 600} fill="#101626" />
          <line x1={960} y1={-300} x2={960} y2={H + 300} stroke="#fff" strokeWidth={10} />
          {Array.from({ length: 4 }).map((_, i) => <rect key={i} x={1040 + i * 210} y={180} width={160} height={110} rx={6} fill="#16203a" stroke="#2a3a66" strokeWidth={5} />)}
          <Bean {...LOOKS[p.who ?? 'caller']} x={1440} y={980} s={2.2} f={f} seed={9} legs={false} lit={-1} litC="#6f8cff" flip mouth="talk" look={[1, 0]} {...(p.face ?? {})}
            hold={<g stroke={INK} strokeWidth={5}><path d="M -60 -300 q 60 -60 120 0" fill="none" strokeWidth={9} /><rect x={-74} y={-290} width={22} height={40} rx={8} fill="#22252f" /><rect x={52} y={-290} width={22} height={40} rx={8} fill="#22252f" /><path d="M 60 -255 q 10 60 -40 80" fill="none" strokeWidth={5} /></g>} />
          <g stroke={INK} strokeWidth={9}><rect x={1000} y={800} width={880} height={56} fill="#3a4055" /></g>
          <Night id="callR" amt={0.42} tint="#03050e" lights={[{ x: 1440, y: 700, r: 520, ry: 460, color: '#8fb0ff' }]} />
          <g transform="translate(1440 120)"><rect x={-230} y={-44} width={460} height={76} rx={10} fill="#0c0e16" opacity={0.9} /><text y={10} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={40} fill="#cfe0ff" letterSpacing={5}>"{p.claim ?? 'GOOGLE SUPPORT'}"</text></g>
        </g>
        {f < 14 && <g transform="translate(480 300)" opacity={0.8}>{[0, 1, 2].map((i) => <circle key={i} r={40 + i * 30 + (f % 6) * 5} fill="none" stroke="#fff" strokeWidth={4} opacity={0.5 - i * 0.15} />)}</g>}
      </Layer>
      <Layer depth={1.1}>
        {p.line && <Bubble f={f} at={m.line ?? 8} x={1000} y={300} text={p.line} tail="r" s={52} />}
        {p.vline && <Bubble f={f} at={m.vline ?? 8} x={260} y={300} text={p.vline} s={52} />}
        {p.loc && <LocTag f={f} at={8} text={p.loc} />}
        {p.stamp && <Stamp f={f} at={m.stamp ?? Math.round(d * 0.55)} x={1440} y={250} text={p.stamp} size={90} rot={-7} />}
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ a wallet screen draining
/** p: { from, to, label? } */
export const Wallet: React.FC<SP> = ({ f, d, m, p }) => {
  const a = m.go ?? 6, b = Math.min(d - 8, a + 40);
  const n = count(f, a, b, p.from ?? 4100, p.to ?? 0);
  const empty = (p.to ?? 0) === 0 && n === 0 && f > b;
  return (
    <Cam f={f} d={d} z={[1.0, 1.12]} bg="#070b18">
      <Layer>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#0b1020" />
        <g transform="translate(560 120)">
          <rect x={8} y={12} width={800} height={840} rx={40} fill="#000" opacity={0.4} />
          <rect width={800} height={840} rx={40} fill="#151a2c" stroke={INK} strokeWidth={10} />
          <rect x={30} y={30} width={740} height={110} rx={20} fill="#22294a" /><T x={400} y={104} s={46} c="#fff" a="middle" ls={4}>{p.label ?? 'MY WALLET'}</T>
          <circle cx={400} cy={300} r={110} fill="#f7931a" stroke={INK} strokeWidth={9} /><text x={400} y={345} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={140} fill="#fff">₿</text>
          <text x={400} y={560} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={120} fill={empty ? C.red : '#fff'} letterSpacing={4}>{n.toLocaleString('en-US')}</text>
          <T x={400} y={630} s={44} c="#8d93a6" a="middle" ls={6}>BITCOIN</T>
          {f > a && f < b + 4 && Array.from({ length: 6 }).map((_, i) => { const t = ((f - a + i * 7) % 28) / 28; return <g key={i} transform={`translate(${400 + t * 700} ${300 - Math.sin(t * Math.PI) * 120})`} opacity={1 - t}><circle r={26} fill="#f7931a" stroke={INK} strokeWidth={5} /><text y={11} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={30} fill="#fff">₿</text></g>; })}
          {empty && <g><rect x={170} y={690} width={460} height={90} rx={14} fill="#3a0d12" stroke={C.red} strokeWidth={6} /><T x={400} y={752} s={52} c="#ffb4ae" a="middle" ls={6}>EMPTY</T></g>}
        </g>
        <Night id="wal" amt={0.4} lights={[{ x: 960, y: 520, r: 900, ry: 600, color: '#ffcf8a' }]} glow={0.08} />
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ the blockchain trail
/** p: { hops?: number, title? } */
export const Chain: React.FC<SP> = ({ f, d, m, p }) => {
  const hops = p.hops ?? 9;
  const at = m.go ?? 6;
  const pos = (i: number): [number, number] => [200 + i * ((W - 400) / (hops - 1)), 540 + Math.sin(i * 1.3) * 200];
  const k = lerp(f, [at, Math.min(d - 6, at + hops * 6)], [0, hops - 1]);
  const i0 = Math.min(hops - 2, Math.floor(k)), fr = k - i0;
  const [x0, y0] = pos(i0), [x1, y1] = pos(i0 + 1);
  return (
    <Cam f={f} d={d} v={[[960, 540, 1.0], [1000, 540, 1.08]]} bg="#070b18">
      <Layer>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#0b1020" />
        <g stroke="#fff" opacity={0.04} strokeWidth={2}>{Array.from({ length: 22 }).map((_, i) => <line key={i} x1={i * 90} x2={i * 90} y1={-100} y2={1200} />)}</g>
        {p.title && <T x={960} y={130} s={58} c="#fff" a="middle" ls={6}>{p.title}</T>}
        {Array.from({ length: hops - 1 }).map((_, i) => { const [a1, b1] = pos(i), [a2, b2] = pos(i + 1); return <line key={i} x1={a1} y1={b1} x2={a2} y2={b2} stroke={i < k ? '#f7931a' : '#3a4055'} strokeWidth={6} strokeDasharray="10 12" />; })}
        {Array.from({ length: hops }).map((_, i) => { const [x, y] = pos(i); const on = i <= k; return <g key={i} transform={`translate(${x} ${y})`}>
          <rect x={-70} y={-50} width={140} height={100} rx={12} fill={on ? '#2a1d08' : '#151a2c'} stroke={on ? '#f7931a' : '#3a4055'} strokeWidth={6} />
          <text y={-6} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={22} fill={on ? '#ffcf8a' : '#8d93a6'} letterSpacing={2}>{i === 0 ? 'STOLEN' : p.exch && i % 3 === 0 ? 'EXCHANGE' : 'WALLET'}</text>
          <text y={28} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={20} fill="#8d93a6">{['bc1q7x', '3Fq9aK', 'bc1p0m', '1Lz8vR', 'bc1q3n', '3Jk2tY', 'bc1qa9', '1Hc5wE', 'bc1p4s', '3Mn7uB'][i % 10]}…</text></g>; })}
        <g transform={`translate(${x0 + (x1 - x0) * fr} ${y0 + (y1 - y0) * fr})`}><circle r={30} fill="#f7931a" stroke={INK} strokeWidth={6} /><text y={12} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={34} fill="#fff">₿</text></g>
        {p.eye && <g opacity={lerp(f, [m.eye ?? 20, (m.eye ?? 20) + 10], [0, 1])}><circle cx={1700} cy={180} r={70} fill="#0c0e16" stroke="#fff" strokeWidth={6} /><ellipse cx={1700} cy={180} rx={44} ry={26} fill="#fff" /><circle cx={1700 + Math.sin(f / 10) * 14} cy={180} r={16} fill={INK} /><T x={1700} y={290} s={30} c="#fff" a="middle" ls={4}>ANYONE CAN LOOK</T></g>}
        <Night id="chain" amt={0.35} lights={[{ x: 960, y: 540, r: 1100, ry: 640, color: '#ffcf8a' }]} glow={0.06} />
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ the garage of supercars
const CarS: React.FC<{ x: number; y: number; col: string; s?: number }> = ({ x, y, col, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={7} strokeLinejoin="round">
    <ellipse cx={0} cy={6} rx={200} ry={16} fill="#000" opacity={0.35} />
    <path d="M -190 -20 L -170 -60 Q -100 -78 -40 -110 L 70 -110 Q 130 -80 180 -64 L 196 -24 L 190 -6 L -186 -6 Z" fill={col} />
    <path d="M -30 -100 L 60 -100 Q 100 -80 118 -66 L -60 -66 Z" fill="#1c2a44" />
    <circle cx={-110} cy={-6} r={34} fill="#1b1d26" /><circle cx={-110} cy={-6} r={16} fill="#8d93a6" />
    <circle cx={120} cy={-6} r={34} fill="#1b1d26" /><circle cx={120} cy={-6} r={16} fill="#8d93a6" />
    <rect x={170} y={-54} width={22} height={12} fill="#ffe08a" strokeWidth={3} />
  </g>
);
/** p: { n?: number (cars shown, counts up), counter?: boolean } */
export const Garage: React.FC<SP> = ({ f, d, m, p }) => {
  const total = p.n ?? 30;
  const cols = ['#e2b441', '#d8433b', '#1f1f26', '#55d66b', '#f2f2f2', '#3b6ee0', '#ff7a1a', '#8a55c0'];
  const shown = Math.round(lerp(f, [m.go ?? 4, Math.min(d - 10, (m.go ?? 4) + 50)], [p.from ?? 1, total], easeIO));
  return (
    <Cam f={f} d={d} v={[[960, 560, 1.15], [960, 540, 1.0]]} ease>
      <Layer depth={0.5}>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#1d2232" />
        {Array.from({ length: 10 }).map((_, i) => <g key={i}><rect x={-200 + i * 240} y={60} width={140} height={16} fill="#fff" opacity={0.6} /><ellipse cx={-130 + i * 240} cy={80} rx={140} ry={30} fill="#fff" opacity={0.06} /></g>)}
      </Layer>
      <Layer>
        <rect x={-400} y={360} width={W + 800} height={900} fill="#2a3044" />
        {Array.from({ length: 4 }).map((_, r) => <line key={r} x1={-400} x2={W + 400} y1={520 + r * 190} y2={520 + r * 190} stroke="#e8d98a" strokeWidth={4} opacity={0.4} />)}
        {Array.from({ length: 24 }).map((_, i) => { const r = Math.floor(i / 6), c = i % 6; if (i >= Math.min(24, shown)) return null;
          const k = lerp(f, [(m.go ?? 4) + i * 2, (m.go ?? 4) + i * 2 + 8], [0, 1], easeOut);
          return <g key={i} opacity={k} transform={`translate(${(1 - k) * 80} 0)`}><CarS x={170 + c * 320 + (r % 2) * 60} y={500 + r * 190} col={cols[(i * 3) % cols.length]} s={0.7 + r * 0.12} /></g>; })}
        <Night id="gar" amt={0.4} lights={[{ x: 960, y: 560, r: 1100, ry: 600, color: '#fff2d0' }]} />
      </Layer>
      {p.counter !== false && <Layer depth={1.1}><g transform="translate(1500 200)"><rect x={-250} y={-90} width={500} height={150} rx={16} fill="#0c0e16" opacity={0.9} /><text y={36} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={110} fill={C.gold} letterSpacing={4}>{shown}+ CARS</text></g></Layer>}
    </Cam>
  );
};

// ------------------------------------------------------------------ the nightclub
/** p: { cast?: who list, bottles?: boolean, bill?: boolean, bags?: boolean } */
export const Club: React.FC<SP> = ({ f, d, m, p }) => {
  const beat = Math.floor(f / 8) % 2;
  const cast = p.cast ?? ['lam', 'crew1', 'crew2', 'crew3'];
  return (
    <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 560, 1.08]]}>
      <Layer depth={0.4}>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#150a20" />
        {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M ${200 + i * 220} -100 L ${100 + i * 220 + Math.sin(f / 12 + i) * 160} 900 L ${300 + i * 220 + Math.sin(f / 12 + i) * 160} 900 Z`} fill={['#ff5fa8', '#5fd6ff', '#ffd24a', '#9a6bff'][i % 4]} opacity={0.08 + 0.05 * ((i + beat) % 2)} />)}
        <Bokeh f={f} seed={14} n={20} color="#ff8fd0" />
        <rect x={560} y={120} width={800} height={110} rx={16} fill="#0c0612" stroke="#ff5fa8" strokeWidth={6} /><text x={960} y={198} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={70} fill={beat ? '#ff5fa8' : '#ffd24a'} letterSpacing={20}>VIP</text>
      </Layer>
      <Layer>
        <rect x={-400} y={860} width={W + 800} height={500} fill="#0e0614" />
        {cast.map((k: string, i: number) => <Bean key={i} {...LOOKS[k]} x={480 + i * 320} y={980 + (i % 2) * 20} s={1.7} f={f} seed={i + 3} legs={false} eyes="happy" mouth={i % 2 ? 'smile' : 'talk'} lit={i % 2 ? 1 : -1} litC="#ff8fd0" bob={1.6}
          arms={i === 0 && p.bags ? [null, [120, -260]] : i % 2 ? [[-90, -250], [90, -250]] : undefined}
          hold={i === 0 && p.bags ? <g transform="translate(120 -260)" stroke={INK} strokeWidth={5}><path d="M -40 0 L 40 0 L 34 70 L -34 70 Z" fill="#b8853f" /><path d="M -20 0 q 20 -40 40 0" fill="none" /></g> : undefined} />)}
        <g stroke={INK} strokeWidth={9}><rect x={300} y={860} width={1320} height={50} fill="#3a1d3a" /></g>
        {p.bottles !== false && Array.from({ length: 5 }).map((_, i) => { const t = ((f + i * 14) % 70) / 70; const x = -100 + t * 2100; return <g key={i} transform={`translate(${x} ${820 - Math.abs(Math.sin(t * 9)) * 6})`}>
          <rect x={-14} y={-90} width={28} height={80} rx={8} fill="#1f5a3a" stroke={INK} strokeWidth={5} /><rect x={-7} y={-120} width={14} height={34} fill="#1f5a3a" stroke={INK} strokeWidth={4} />
          {Array.from({ length: 6 }).map((__, j) => <line key={j} x1={0} y1={-126} x2={Math.cos(j + f) * 30} y2={-126 + Math.sin(j + f) * 30 - 20} stroke="#ffe08a" strokeWidth={4} strokeLinecap="round" />)}</g>; })}
        <Night id="club" amt={0.45} tint="#0a0310" lights={[{ x: 960, y: 760, r: 1000, ry: 460, color: '#ff8fd0' }]} glow={0.14} />
      </Layer>
      <Layer depth={1.1}>
        {p.bill && <g transform={`translate(${lerp(f, [m.bill ?? 10, (m.bill ?? 10) + 10], [2200, 1500], easeOut)} 330) rotate(5)`}>
          <rect x={8} y={10} width={380} height={480} fill="#000" opacity={0.35} /><rect width={380} height={480} fill={C.paper} stroke={INK} strokeWidth={8} />
          <T x={190} y={70} s={42} a="middle" ls={4}>THE BILL</T><line x1={30} x2={350} y1={96} y2={96} stroke={INK} strokeWidth={5} />
          {['Bottles x 40', 'Table', 'Sparklers', 'Tip'].map((t, i) => <T key={i} x={40} y={160 + i * 56} s={30} c="#6b6250">{t}</T>)}
          <line x1={30} x2={350} y1={380} y2={380} stroke={INK} strokeWidth={4} /><text x={190} y={448} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={66} fill={C.red}>$500,000</text>
        </g>}
        {p.loc && <LocTag f={f} at={8} text={p.loc} />}
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ the leaked screen-share
/** p: { mode: share|rec|names|inbox } */
export const ScreenShare: React.FC<SP> = ({ f, d, m, p }) => {
  const mode = p.mode ?? 'share';
  const rec = mode !== 'share' && f >= (m.rec ?? 6);
  const names = mode === 'names' || mode === 'inbox';
  const tiles = ['crew1', 'crew2', 'crew3', 'friend'];
  return (
    <Cam f={f} d={d} v={mode === 'inbox' ? [[960, 540, 1.0], [960, 540, 0.9]] : [[960, 540, 1.0], [960, 540, 1.08]]} bg="#0a0d1c">
      <Layer>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#0e1228" />
        <g transform={mode === 'inbox' ? 'translate(560 300) scale(0.42)' : ''}>
          <rect x={80} y={70} width={1760} height={940} rx={24} fill="#1b1f33" stroke={INK} strokeWidth={10} />
          <rect x={80} y={70} width={1760} height={80} rx={24} fill="#2a3050" /><T x={130} y={124} s={36} c="#cfd6ea" ls={3}>GROUP CALL · 5 PEOPLE</T>
          {/* the shared screen */}
          <rect x={120} y={180} width={1200} height={780} fill="#0c1424" stroke="#55d66b" strokeWidth={6} />
          <T x={150} y={230} s={30} c="#55d66b" ls={3}>SHARING SCREEN</T>
          {['wallet 1 ....... ₿ 1,000', 'wallet 2 ....... ₿ 1,200', 'wallet 3 ....... ₿ 900', 'wallet 4 ....... ₿ 1,000'].map((t, i) => <T key={i} x={170} y={330 + i * 90} s={46} c="#ffcf8a" ls={2}>{t}</T>)}
          <text x={720} y={800} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={90} fill="#f7931a">₿ 4,100</text>
          {tiles.map((k, i) => <g key={k} transform={`translate(1350 ${180 + i * 196})`}>
            <rect width={460} height={180} rx={12} fill="#141a30" stroke={INK} strokeWidth={5} />
            <clipPath id={`tile${i}`}><rect width={460} height={180} rx={12} /></clipPath>
            <g clipPath={`url(#tile${i})`}><Bean {...LOOKS[k]} x={230} y={360} s={1.1} f={f} seed={i + 2} legs={false} eyes={k === 'friend' ? 'open' : 'happy'} mouth={k === 'friend' ? 'line' : 'talk'} /></g>
            {names && k !== 'friend' && <g><rect x={10} y={136} width={220} height={36} fill="#0c0e16" opacity={0.9} /><text x={20} y={162} fontFamily={LABEL} fontWeight={700} fontSize={22} fill={C.gold}>NAME HEARD ✓</text></g>}
            {k === 'friend' && rec && <g><circle cx={430} cy={30} r={12} fill={C.red} opacity={Math.floor(f / 8) % 2 ? 1 : 0.3} /><text x={410} y={38} textAnchor="end" fontFamily={LABEL} fontWeight={700} fontSize={22} fill={C.red}>REC</text></g>}
          </g>)}
        </g>
        {mode === 'inbox' && <g>
          <rect x={1100} y={300} width={640} height={420} rx={16} fill="#eef0f7" stroke={INK} strokeWidth={8} />
          <rect x={1100} y={300} width={640} height={70} rx={16} fill="#22294a" /><T x={1130} y={348} s={30} c="#fff">INBOX · ZACHXBT</T>
          <T x={1130} y={430} s={30} c="#6b6250">FROM: AN INFORMANT</T><T x={1130} y={490} s={36}>"You need to see this."</T>
          <g transform="translate(1130 540)"><rect width={300} height={120} rx={12} fill="#dfe4f2" stroke={INK} strokeWidth={6} /><path d="M 40 30 L 40 90 L 90 60 Z" fill={C.red} /><T x={110} y={74} s={30}>video.mp4</T></g>
        </g>}
        {rec && mode === 'rec' && <g><circle cx={150} cy={1040} r={16} fill={C.red} /><T x={180} y={1052} s={36} c="#fff">SOMEONE IS RECORDING</T></g>}
        <Night id={`ss${mode}`} amt={0.35} lights={[{ x: 960, y: 540, r: 1100, ry: 640, color: '#cfe0ff' }]} glow={0.06} />
      </Layer>
    </Cam>
  );
};

/** The $2 million watch. */
export const Watch: React.FC<SP> = ({ f, d }) => (
  <Cam f={f} d={d} v={[[960, 540, 1.2], [960, 540, 1.4]]} ease bg="#0a0a12">
    <Layer>
      <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#0e0e18" /><Bokeh f={f} seed={31} n={18} color="#ffd98a" />
      <g transform="translate(960 520)" stroke={INK} strokeWidth={9}>
        <rect x={-110} y={-420} width={220} height={260} rx={30} fill="#c9a23a" /><rect x={-110} y={160} width={220} height={260} rx={30} fill="#c9a23a" />
        <circle r={230} fill="#e2b441" /><circle r={190} fill="#0e1a30" />
        {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={Math.cos(i * 0.5236) * 160} cy={Math.sin(i * 0.5236) * 160} r={12} fill="#cfe9ff" strokeWidth={3} />)}
        <line x1={0} y1={0} x2={0} y2={-130} strokeWidth={10} stroke="#fff" transform={`rotate(${f * 6})`} /><line x1={0} y1={0} x2={90} y2={0} strokeWidth={12} stroke="#fff" transform={`rotate(${f * 0.5 + 30})`} />
        <circle r={18} fill="#e2b441" />
        {Array.from({ length: 6 }).map((_, i) => { const a = f / 20 + i; return <path key={i} d="M 0 -14 L 6 0 L 0 14 L -6 0 Z" fill="#fff" stroke="none" transform={`translate(${Math.cos(a) * 250} ${Math.sin(a) * 250}) scale(${0.6 + 0.6 * Math.abs(Math.sin(f / 6 + i))})`} />; })}
      </g>
      <g transform="translate(1460 300)"><rect x={-230} y={-70} width={460} height={120} rx={14} fill="#0c0e16" opacity={0.9} /><text y={20} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={76} fill={C.gold}>$2,000,000</text></g>
      <Night id="watch" amt={0.4} lights={[{ x: 960, y: 520, r: 800, color: '#ffe08a' }]} glow={0.16} />
    </Layer>
  </Cam>
);

/** Cash hidden in soft toys, in a parcel. */
export const Toys: React.FC<SP> = ({ f, d, m }) => {
  const open = lerp(f, [m.open ?? 12, (m.open ?? 12) + 12], [0, 1], easeOut);
  return (
    <Cam f={f} d={d} z={[1.0, 1.1]} bg="#1a1410">
      <Layer>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill={C.woodD} />
        <g transform="translate(960 640)" stroke={INK} strokeWidth={9} strokeLinejoin="round">
          <rect x={-420} y={-180} width={840} height={360} fill="#b98a55" /><line x1={-420} y1={-60} x2={420} y2={-60} />
          <g transform={`translate(-420 -180) rotate(${-110 * open})`}><rect width={420} height={60} fill="#c99a65" /></g>
          <g transform={`translate(420 -180) scale(-1 1) rotate(${-110 * open})`}><rect width={420} height={60} fill="#c99a65" /></g>
          <rect x={-160} y={60} width={320} height={60} fill={C.paper} strokeWidth={5} /><text y={102} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={30} fill={INK} stroke="none">FRAGILE · TOYS</text>
        </g>
        {[-260, 0, 260].map((x, i) => { const up = open * (160 + i * 30); return <g key={i} transform={`translate(${960 + x} ${560 - up})`} stroke={INK} strokeWidth={7}>
          <ellipse rx={110} ry={100} fill={['#f2a7c5', '#9fd6ff', '#c9b0ff'][i]} /><ellipse cx={-62} cy={-80} rx={24} ry={30} fill={['#f2a7c5', '#9fd6ff', '#c9b0ff'][i]} /><ellipse cx={62} cy={-80} rx={24} ry={30} fill={['#f2a7c5', '#9fd6ff', '#c9b0ff'][i]} />
          <circle cx={-30} cy={-10} r={8} fill={INK} /><circle cx={30} cy={-10} r={8} fill={INK} /><path d="M -12 20 q 12 10 24 0" fill="none" strokeWidth={5} />
          {open > 0.6 && <g transform="translate(40 60) rotate(-20)">{[0, 1, 2].map((j) => <rect key={j} x={-50 + j * 6} y={-24 - j * 8} width={100} height={46} rx={4} fill="#4fbf68" strokeWidth={4} />)}</g>}</g>; })}
        <Night id="toys" amt={0.55} lights={[{ x: 960, y: 560, r: 760, ry: 520 }]} />
      </Layer>
    </Cam>
  );
};

/** A dark van on a road in daylight-dusk, a car pulled over. p: { stamp? } */
export const Van: React.FC<SP> = ({ f, d, m, p }) => {
  const k = lerp(f, [4, 30], [0, 1], easeIO);
  return (
    <Cam f={f} d={d} v={[[960, 600, 1.0], [960, 600, 1.08]]}>
      <Layer depth={0.2}><rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#7a8fb0" /><path d="M -400 640 Q 400 520 1000 600 Q 1600 520 2400 620 L 2400 900 L -400 900 Z" fill="#4f6a52" /></Layer>
      <Layer depth={0.5}>{Array.from({ length: 9 }).map((_, i) => <g key={i} transform={`translate(${-100 + i * 260} 700)`} stroke={INK} strokeWidth={6}><rect x={-10} y={-10} width={20} height={120} fill="#5a3a26" /><circle cy={-60} r={70} fill="#3f6a42" /></g>)}</Layer>
      <Layer>
        <rect x={-400} y={800} width={W + 800} height={600} fill="#3a3f4a" />{Array.from({ length: 10 }).map((_, i) => <rect key={i} x={-200 + i * 260} y={920} width={130} height={14} fill="#e8d98a" opacity={0.6} />)}
        <g transform="translate(1200 900)" stroke={INK} strokeWidth={8} strokeLinejoin="round"><path d="M -230 -20 L -210 -70 Q -140 -90 -60 -120 L 80 -120 Q 150 -86 210 -70 L 226 -24 L -226 -20 Z" fill="#e2b441" /><circle cx={-130} cy={-10} r={38} fill="#1b1d26" /><circle cx={140} cy={-10} r={38} fill="#1b1d26" /></g>
        <g transform={`translate(${lerp(k, [0, 1], [-500, 560])} 900)`} stroke={INK} strokeWidth={8} strokeLinejoin="round"><rect x={-240} y={-240} width={480} height={220} rx={20} fill="#2a2d36" /><rect x={120} y={-220} width={100} height={80} fill="#6f86b8" /><circle cx={-140} cy={-10} r={40} fill="#1b1d26" /><circle cx={140} cy={-10} r={40} fill="#1b1d26" /></g>
        <Night id="van" amt={0.3} tint="#1a1a2a" lights={[{ x: 960, y: 700, r: 1100, ry: 500 }]} />
      </Layer>
      <Layer depth={1.1}>
        {p.loc && <LocTag f={f} at={8} text={p.loc} />}
        {p.stamp && <Stamp f={f} at={m.stamp ?? Math.round(d * 0.5)} x={960} y={380} text={p.stamp} size={100} rot={-8} />}
      </Layer>
    </Cam>
  );
};

/** Three hang-up rules on cards: the safety tip. p: { n: how many shown } */
export const Rules: React.FC<SP> = ({ f, d, m, p }) => {
  const rules = ['Google will never call you', 'Your bank never asks for passwords', 'Never read out a code you were sent'];
  return (
    <Cam f={f} d={d} z={[1.0, 1.06]} bg="#0a0f22">
      <Layer>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#101733" />
        <T x={960} y={170} s={66} c="#fff" a="middle" ls={6}>{p.title ?? 'REMEMBER'}</T>
        {rules.slice(0, p.n ?? 3).map((r, i) => { const k = lerp(f, [4 + i * 8, 12 + i * 8], [0, 1], easeOut); return <g key={i} transform={`translate(${960 + (1 - k) * 300} ${340 + i * 210})`} opacity={k}>
          <rect x={-700} y={-80} width={1400} height={160} rx={18} fill="#1d2a55" stroke={INK} strokeWidth={7} />
          <circle cx={-600} cy={0} r={52} fill={C.red} stroke={INK} strokeWidth={6} /><path d="M -626 -26 L -574 26 M -574 -26 L -626 26" stroke="#fff" strokeWidth={10} strokeLinecap="round" />
          <text x={-520} y={20} fontFamily={LABEL} fontWeight={700} fontSize={56} fill="#fff" letterSpacing={2}>{r}</text></g>; })}
        {p.hang && <g opacity={lerp(f, [m.hang ?? 10, (m.hang ?? 10) + 8], [0, 1])}><rect x={460} y={900} width={1000} height={120} rx={60} fill="#1f7a3a" stroke={INK} strokeWidth={8} /><T x={960} y={980} s={58} c="#fff" a="middle" ls={4}>HANG UP. CALL THEM BACK.</T></g>}
        <Night id="rules" amt={0.35} lights={[{ x: 960, y: 560, r: 1100, ry: 640, color: '#cfe0ff' }]} glow={0.06} />
      </Layer>
    </Cam>
  );
};
