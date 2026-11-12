// Night Dossier test: the Wirecard cold open. One component per shot. Props: f (local frame), d (shot length),
// m (named marks as local frames, from cue words), gf (global frame), words (the shot's words, for type-on cards).
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Bean, BeanLook, Bokeh, C, Cam, HAND, Hand, INK, LABEL, Layer, LocTag, NameTag, Night, Paper, Rain, Stamp, TypeCard, W, H, Word, count, easeOut, easeIO, euro, lerp } from './dossier';

export type ShotP = { f: number; d: number; m: Record<string, number>; gf: number; words: Word[] };
const FPS = 30;

const MARS: BeanLook = { body: '#262b40', hair: 'short', hairC: '#2a2018', stubble: true, collar: '#e9e9ee', skin: C.skin3 };
const PILOT: BeanLook = { body: '#1c2748', hat: 'pilot', tie: '#11131c', collar: '#fff' };

const T: React.FC<{ x: number; y: number; s?: number; c?: string; a?: 'start' | 'middle' | 'end'; hand?: boolean; w?: number; ls?: number; o?: number; children: React.ReactNode }> =
  ({ x, y, s = 30, c = INK, a = 'start', hand, w = 700, ls = 1.5, o = 1, children }) => (
    <text x={x} y={y} fontSize={s} fill={c} textAnchor={a} fontFamily={hand ? HAND : LABEL} fontWeight={w} letterSpacing={ls} opacity={o}>{children}</text>
  );

const Stars: React.FC<{ n?: number; f: number }> = ({ n = 60, f }) => (
  <g fill="#dfe8ff">
    {Array.from({ length: n }).map((_, i) => {
      const r = (k: number) => { const v = Math.sin((i + 1) * 47.3 * k) * 9341.7; return v - Math.floor(v); };
      return <circle key={i} cx={r(1) * W * 1.2 - 100} cy={r(2) * 520} r={1.5 + r(3) * 2} opacity={0.4 + 0.4 * Math.sin(f / 9 + i)} />;
    })}
  </g>
);

const Sky: React.FC<{ id: string; a?: string; b?: string }> = ({ id, a = '#070b1f', b = '#26356b' }) => (
  <g>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
    <rect x={-400} y={-300} width={W + 800} height={H + 600} fill={`url(#${id})`} />
  </g>
);

/** A small business jet, nose to the right; (0,0) is the ground under its middle. */
const Jet: React.FC<{ x: number; y: number; s?: number; door?: boolean; lit?: boolean }> = ({ x, y, s = 1, door = true, lit = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
    <ellipse cx={0} cy={6} rx={430} ry={20} fill="#000" opacity={0.35} />
    <g stroke={INK} strokeWidth={6}>
      <line x1={-120} y1={-78} x2={-120} y2={-18} /><line x1={270} y1={-78} x2={270} y2={-18} />
      <circle cx={-120} cy={-14} r={15} fill="#2b2f3d" /><circle cx={270} cy={-14} r={13} fill="#2b2f3d" />
      <path d="M -400 -150 L -480 -300 L -400 -300 L -290 -166 Z" fill="#d7deeb" />
      <path d="M -462 -282 l -86 -8 l 0 -16 l 96 0 Z" fill="#c4ccdc" />
      <path d="M -420 -112 Q -400 -162 -300 -166 L 250 -166 Q 384 -160 446 -114 Q 384 -80 250 -76 L -300 -76 Q -400 -80 -420 -112 Z" fill="#eef1f7" />
      <path d="M 326 -152 Q 392 -142 414 -120 L 338 -120 Z" fill="#8fbbe6" />
      <ellipse cx={-255} cy={-158} rx={84} ry={30} fill="#c5ccdb" /><ellipse cx={-178} cy={-158} rx={10} ry={24} fill="#3a4055" />
      <path d="M -40 -86 L -230 -36 L -130 -36 L 110 -86 Z" fill="#cdd4e2" />
    </g>
    <path d="M -410 -112 L 440 -112" stroke={C.greenD} strokeWidth={7} opacity={0.8} />
    {[-150, -70, 10, 90].map((wx) => <rect key={wx} x={wx} y={-150} width={44} height={30} rx={14} fill={lit ? '#ffd98a' : '#39425c'} stroke={INK} strokeWidth={5} />)}
    {door && <g>
      <rect x={176} y={-158} width={62} height={82} rx={10} fill="#ffd98a" stroke={INK} strokeWidth={6} />
      <path d="M 176 -76 L 238 -76 L 176 0 L 114 0 Z" fill="#aeb6c8" stroke={INK} strokeWidth={6} />
      {[0, 1, 2, 3].map((i) => <line key={i} x1={176 - i * 15.5 + 4} y1={-76 + i * 19 + 10} x2={238 - i * 15.5 - 4} y2={-76 + i * 19 + 10} stroke={INK} strokeWidth={5} />)}
    </g>}
  </g>
);

// ------------------------------------------------------------------ S1: the airfield at night
export const S1Airfield: React.FC<ShotP> = ({ f, d, m }) => (
  <Cam f={f} d={d} z={[1.0, 1.12]} x={[-30, 40]} y={[0, 20]}>
    <Layer depth={0.15}><Sky id="s1" /><Stars f={f} /><circle cx={1500} cy={170} r={62} fill="#f3efd9" /><circle cx={1500} cy={170} r={130} fill="#f3efd9" opacity={0.08} /></Layer>
    <Layer depth={0.35}>
      <path d={`M -300 640 Q 200 520 620 600 Q 1000 500 1400 590 Q 1800 520 2300 620 L 2300 800 L -300 800 Z`} fill="#131a38" />
      <g stroke={INK} strokeWidth={6}>
        <rect x={1560} y={360} width={46} height={270} fill="#39425f" /><path d="M 1528 300 L 1638 300 L 1620 364 L 1546 364 Z" fill="#6f86b8" /><rect x={1576} y={262} width={14} height={40} fill="#39425f" />
      </g>
      <circle cx={1583} cy={258} r={9} fill={C.red} opacity={0.4 + 0.6 * (Math.sin(f / 6) > 0 ? 1 : 0)} />
    </Layer>
    <Layer depth={0.6}>
      <g stroke={INK} strokeWidth={7} strokeLinejoin="round">
        <path d="M 90 700 L 90 470 Q 400 330 710 470 L 710 700 Z" fill="#3b4563" />
        <rect x={250} y={520} width={300} height={180} fill="#ffcf7a" /><line x1={400} y1={520} x2={400} y2={700} />
      </g>
      <T x={400} y={452} s={34} c="#cfd6ea" a="middle">HANGAR 2</T>
    </Layer>
    <Layer>
      <rect x={-400} y={690} width={W + 800} height={600} fill="#222a44" />
      <rect x={-400} y={690} width={W + 800} height={10} fill="#121730" />
      {Array.from({ length: 12 }).map((_, i) => <g key={i}><circle cx={-200 + i * 220} cy={980} r={10} fill="#6fb6ff" /><circle cx={-200 + i * 220} cy={980} r={34} fill="#6fb6ff" opacity={0.16} /></g>)}
      {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-100 + i * 260} y={880} width={120} height={10} fill="#e8d98a" opacity={0.55} />)}
      <Jet x={1060} y={850} s={1.05} />
      <ellipse cx={1210} cy={860} rx={170} ry={26} fill="#ffd98a" opacity={0.32} />
      <Bean {...MARS} x={1120} y={862} s={0.62} f={f} lit={1} arms={[null, [44, -96]]} look={[1, 0]} />
      <Night id="n1" amt={0.5} lights={[{ x: 1240, y: 760, r: 330, ry: 220 }, { x: 400, y: 640, r: 300, ry: 200, power: 0.8 }, { x: 1500, y: 170, r: 260, power: 0.5, color: '#cfe0ff' }]} />
      <Rain f={f} op={0.18} />
    </Layer>
    <Layer depth={1.25}><LocTag f={f} at={m.tag ?? 20} text="Near Vienna · June 2020" /></Layer>
  </Cam>
);

// ------------------------------------------------------------------ S2: cash for the pilots
export const S2Cash: React.FC<ShotP> = ({ f, d, m }) => {
  const k = lerp(f, [m.cash ?? 20, (m.cash ?? 20) + 14], [0, 1], easeIO);
  const bx = 860 + k * 250, by = 640 - Math.sin(k * Math.PI) * 30;
  return (
    <Cam f={f} d={d} z={[1.04, 1.15]} x={[0, 30]}>
      <Layer depth={0.2}><Sky id="s2" /><Stars f={f} n={30} /></Layer>
      <Layer depth={0.7}><Jet x={1250} y={1000} s={2.5} /></Layer>
      <Layer>
        <rect x={-400} y={900} width={W + 800} height={400} fill="#222a44" />
        <Bean {...MARS} x={700} y={960} s={1.75} f={f} lit={1} arms={[null, [70 + k * 30, -128]]} mouth="smirk" look={[1, 0]} />
        <Bean {...PILOT} x={1260} y={950} s={1.6} f={f} seed={2} flip lit={-1} arms={[null, [70 - k * 10, -120]]} eyes={k > 0.9 ? 'happy' : 'open'} mouth={k > 0.9 ? 'smile' : 'line'} look={[1, 0]} />
        <Bean {...PILOT} x={1560} y={965} s={1.6} f={f} seed={5} flip lit={-1} skin={C.skin2} look={[1, 0]} mouth="smile" />
        <g transform={`translate(${bx} ${by}) rotate(${-8 + k * 14})`}>
          {[0, 1, 2].map((i) => <rect key={i} x={-52 + i * 5} y={-28 - i * 7} width={104} height={54} rx={4} fill="#4fbf68" stroke={INK} strokeWidth={5} />)}
          <circle cx={10} cy={-15} r={15} fill="#bff0c8" stroke={INK} strokeWidth={4} />
          <rect x={-18} y={-44} width={18} height={58} fill={C.paper} stroke={INK} strokeWidth={4} />
        </g>
        <Night id="n2" amt={0.5} lights={[{ x: 1050, y: 560, r: 620, ry: 460 }]} />
        <Rain f={f} op={0.2} n={70} />
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ S3: he boards
export const S3Board: React.FC<ShotP> = ({ f, d }) => {
  const k = lerp(f, [0, d * 0.8], [0, 1]);
  const px = 1040 + k * 190, py = 868 - Math.max(0, k - 0.25) / 0.75 * 96;
  return (
    <Cam f={f} d={d} z={[1.18, 1.3]} x={[60, 140]} y={[40, 20]}>
      <Layer depth={0.15}><Sky id="s3" /><Stars f={f} /><circle cx={1500} cy={170} r={62} fill="#f3efd9" /></Layer>
      <Layer depth={0.35}><path d={`M -300 640 Q 200 520 620 600 Q 1000 500 1400 590 Q 1800 520 2300 620 L 2300 800 L -300 800 Z`} fill="#131a38" /></Layer>
      <Layer>
        <rect x={-400} y={690} width={W + 800} height={600} fill="#222a44" />
        {Array.from({ length: 12 }).map((_, i) => <g key={i}><circle cx={-200 + i * 220} cy={980} r={10} fill="#6fb6ff" /><circle cx={-200 + i * 220} cy={980} r={34} fill="#6fb6ff" opacity={0.16} /></g>)}
        <Jet x={1060} y={850} s={1.05} />
        <g opacity={lerp(k, [0.88, 1], [1, 0])}><Bean {...MARS} x={px} y={py} s={0.62} f={f} lit={1} walk={1} look={[1, 0]} /></g>
        <Bean {...PILOT} x={930} y={872} s={0.6} f={f} seed={2} lit={1} look={[1, 0]} arms={[null, [52, -150]]} />
        <Night id="n3" amt={0.5} lights={[{ x: 1240, y: 760, r: 330, ry: 220 }, { x: 1500, y: 170, r: 260, power: 0.5, color: '#cfe0ff' }]} />
        <Rain f={f} op={0.18} />
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ S4 / S16: inside the jet
export const Cabin: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#d9cdb4" />
    <rect x={-400} y={700} width={W + 800} height={700} fill="#8a7a62" />
    <path d={`M -400 -300 L ${W + 400} -300 L ${W + 400} 80 Q ${W / 2} 20 -400 80 Z`} fill="#bfb296" />
    {[330, 1330].map((x, i) => (
      <g key={i}>
        <rect x={x - 150} y={170} width={300} height={380} rx={140} fill="#efe7d4" stroke={INK} strokeWidth={8} />
        <clipPath id={`win${i}`}><rect x={x - 118} y={202} width={236} height={316} rx={112} /></clipPath>
        <g clipPath={`url(#win${i})`}>
          <rect x={x - 130} y={190} width={260} height={340} fill="#0c1230" />
          <circle cx={x + 50} cy={280} r={30} fill="#f3efd9" opacity={0.9} />
          <g transform={`translate(${x - 960} -200)`}><Rain f={f} op={0.5} n={120} /></g>
        </g>
        <rect x={x - 118} y={202} width={236} height={316} rx={112} fill="none" stroke={INK} strokeWidth={7} />
      </g>
    ))}
  </g>
);
export const Seat: React.FC<{ x: number }> = ({ x }) => (
  <g stroke={INK} strokeWidth={9} strokeLinejoin="round">
    <path d={`M ${x - 290} 1300 L ${x - 290} 470 Q ${x - 290} 330 ${x - 150} 330 L ${x + 150} 330 Q ${x + 290} 330 ${x + 290} 470 L ${x + 290} 1300 Z`} fill="#c9a36b" />
    <path d={`M ${x - 190} 330 Q ${x} 250 ${x + 190} 330 L ${x + 170} 480 Q ${x} 440 ${x - 170} 480 Z`} fill="#b78f58" />
  </g>
);
export const S4Name: React.FC<ShotP> = ({ f, d, m }) => (
  <Cam f={f} d={d} z={[1.0, 1.1]} x={[0, -20]} bg="#d9cdb4">
    <Layer depth={0.6}><Cabin f={f} /></Layer>
    <Layer>
      <Seat x={900} />
      <Bean {...MARS} x={900} y={1250} s={3.1} f={f} lit={-1} legs={false} bob={0.4} look={[lerp(f, [0, 20], [-1, 0.6]), 0]} mouth="smirk" />
      <Night id="n4" amt={0.7} tint="#0a0c20" lights={[{ x: 820, y: 520, r: 560, ry: 520 }, { x: 330, y: 360, r: 260, power: 0.5, color: '#cfe0ff' }]} />
      <Bokeh f={f} seed={4} n={8} />
    </Layer>
    <Layer depth={1.2}><NameTag f={f} at={m.name ?? 8} x={1110} y={760} name="Jan Marsalek" sub="Wirecard · Chief Operating Officer" to={[1010, 640]} /></Layer>
  </Cam>
);
export const S16Gone: React.FC<ShotP> = ({ f, d, m }) => {
  const g = m.gone ?? 30;
  return (
    <Cam f={f} d={d} z={[1.12, 1.0]} bg="#d9cdb4">
      <Layer depth={0.6}><Cabin f={f} /></Layer>
      <Layer>
        <Seat x={900} />
        <g stroke={INK} strokeWidth={7}><path d="M 640 900 L 860 960" fill="none" /><rect x={850} y={940} width={70} height={44} rx={6} fill="#aeb6c8" /><path d="M 920 962 L 1160 900" fill="none" /></g>
        <g transform="translate(1290 830)" stroke={INK} strokeWidth={6}><path d="M -34 -70 L 34 -70 L 26 0 L -26 0 Z" fill="rgba(210,235,255,0.5)" /><path d="M -30 -34 L 30 -34 L 26 0 L -26 0 Z" fill="#c98a3a" /></g>
        <rect x={1180} y={830} width={260} height={30} rx={10} fill="#8a6a40" stroke={INK} strokeWidth={7} />
        <Night id="n16" amt={0.76} tint="#0a0c20" lights={[{ x: 880, y: 560, r: 520, ry: 480, power: lerp(f, [g, g + 20], [1, 0.45]) }, { x: 330, y: 360, r: 260, power: 0.5, color: '#cfe0ff' }]} />
      </Layer>
      <Layer depth={1.2}>
        <g opacity={f > g ? (Math.floor((f - g) / 3) % 2 === 0 && f < g + 14 ? 0.2 : 0.55) : 1}>
          <NameTag f={f + 30} at={0} x={1110} y={760} name="Jan Marsalek" sub="Whereabouts unknown" color={C.red} />
        </g>
        {f > g && <line x1={1120} y1={792} x2={lerp(f, [g, g + 8], [1120, 1510])} y2={792} stroke={C.red} strokeWidth={7} />}
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ S5: until yesterday (his empty office)
export const S5Office: React.FC<ShotP> = ({ f, d, m }) => (
  <Cam f={f} d={d} z={[1.0, 1.1]} x={[40, -20]}>
    <Layer depth={0.5}>
      <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#2b3350" />
      <rect x={980} y={130} width={760} height={520} fill="#0c1230" stroke={INK} strokeWidth={10} />
      <g>
        {Array.from({ length: 9 }).map((_, i) => {
          const h = 140 + ((i * 97) % 230);
          return <g key={i}><rect x={1000 + i * 80} y={640 - h} width={66} height={h} fill="#18204a" />
            {Array.from({ length: Math.floor(h / 40) }).map((__, j) => <rect key={j} x={1012 + i * 80 + (j % 2) * 26} y={650 - h + j * 40 + 8} width={16} height={18} fill={(i + j) % 3 ? '#ffd98a' : '#27306a'} />)}</g>;
        })}
      </g>
      <line x1={1360} y1={130} x2={1360} y2={650} stroke={INK} strokeWidth={8} />
      <g transform="translate(330 170)">
        <rect width={330} height={380} fill={C.paper} stroke={INK} strokeWidth={8} />
        <rect width={330} height={90} fill={C.red} stroke={INK} strokeWidth={8} />
        <T x={165} y={64} s={52} c="#fff" a="middle">JUNE 2020</T>
        <T x={165} y={290} s={210} a="middle" ls={0}>18</T>
        <Stamp f={f} at={m.stamp ?? 18} x={165} y={250} text="SUSPENDED" size={50} rot={-14} />
      </g>
    </Layer>
    <Layer>
      <rect x={-400} y={840} width={W + 800} height={500} fill="#171c33" />
      <g stroke={INK} strokeWidth={9} strokeLinejoin="round">
        <path d="M 760 880 L 760 520 Q 760 440 860 440 L 1060 440 Q 1160 440 1160 520 L 1160 880 Z" fill="#3a2b25" />
        <rect x={300} y={760} width={1320} height={60} fill={C.wood} /><rect x={340} y={820} width={1240} height={320} fill={C.woodD} />
        <rect x={840} y={690} width={390} height={70} fill="#161821" />
        <path d="M 520 760 L 560 620" /><path d="M 500 620 L 640 580 L 660 640 L 520 660 Z" fill={C.greenD} /><rect x={480} y={748} width={90} height={14} fill={C.gold} />
        <rect x={1330} y={700} width={150} height={60} fill="#242838" />
      </g>
      <T x={1035} y={738} s={30} c={C.gold} a="middle">J. MARSALEK · COO</T>
      <Night id="n5" amt={0.62} lights={[{ x: 700, y: 700, r: 640, ry: 420 }, { x: 495, y: 360, r: 400, power: 0.9 }, { x: 1360, y: 400, r: 420, power: 0.45, color: '#cfe0ff' }]} />
    </Layer>
  </Cam>
);

// ------------------------------------------------------------------ S6 / S19: Wirecard, the shops and the tower
const Tower: React.FC<{ x: number; y: number; s?: number; on?: number }> = ({ x, y, s = 1, on = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-150} y={-620} width={300} height={620} fill="#1d2748" stroke={INK} strokeWidth={8} />
    {Array.from({ length: 11 }).map((_, j) => Array.from({ length: 5 }).map((__, i) => (
      <rect key={`${i}${j}`} x={-126 + i * 53} y={-500 + j * 44} width={38} height={26} fill={(i * 3 + j * 5) % 4 ? '#ffd98a' : '#2c3766'} opacity={(i * 3 + j * 5) % 4 ? 0.35 + 0.65 * on : 1} />
    )))}
    <rect x={-170} y={-610} width={340} height={84} fill="#0d1226" stroke={INK} strokeWidth={7} />
    <text x={0} y={-550} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={54} fill={C.green} letterSpacing={5} opacity={0.3 + 0.7 * on}>WIRECARD</text>
  </g>
);
const Shop: React.FC<{ x: number; col: string; name: string; f: number }> = ({ x, col, name, f }) => (
  <g transform={`translate(${x} 0)`} stroke={INK} strokeWidth={7} strokeLinejoin="round">
    <rect x={0} y={560} width={400} height={340} fill="#39415e" />
    <rect x={30} y={690} width={210} height={170} fill="#ffd98a" /><rect x={270} y={690} width={100} height={210} fill="#5c4130" />
    <path d={`M -14 690 L 414 690 L 400 610 L 0 610 Z`} fill={col} />
    {[1, 2, 3, 4, 5].map((i) => <line key={i} x1={i * 68 - 6} y1={690} x2={i * 67} y2={610} strokeWidth={4} />)}
    <rect x={60} y={566} width={280} height={44} fill="#11152a" strokeWidth={5} />
    <text x={200} y={600} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={30} fill="#fff" stroke="none" letterSpacing={3}>{name}</text>
    <g transform="translate(120 800)"><rect x={-26} y={-44} width={52} height={74} rx={8} fill="#242838" strokeWidth={5} /><rect x={-18} y={-36} width={36} height={22} fill={C.green} stroke="none" opacity={0.6 + 0.4 * Math.sin(f / 5 + x)} /></g>
  </g>
);
export const S6Wirecard: React.FC<ShotP> = ({ f, d, m }) => {
  const t0 = m.moves ?? 24;
  return (
    <Cam f={f} d={d} z={[1.0, 1.08]} x={[-70, 70]}>
      <Layer depth={0.15}><Sky id="s6" /><Stars f={f} /></Layer>
      <Layer depth={0.45}>
        {[120, 420, 700, 1260, 1540, 1800].map((x, i) => <rect key={i} x={x} y={420 - (i * 71) % 160} width={200} height={600} fill="#141b3c" />)}
        <Tower x={1000} y={900} on={1} />
      </Layer>
      <Layer>
        <rect x={-400} y={900} width={W + 800} height={400} fill="#1b2140" /><rect x={-400} y={900} width={W + 800} height={12} fill="#0e1228" />
        <Shop x={-60} col="#c8473f" name="BAKERY" f={f} /><Shop x={400} col="#3f8fc8" name="BOOKS" f={f} /><Shop x={1160} col="#d8a23a" name="SHOES" f={f} /><Shop x={1620} col="#4aa86a" name="CAFE" f={f} />
        <Bean body="#b8553f" x={300} y={930} s={0.8} f={f} seed={3} hair="bob" hairC="#5a2f1c" arms={[null, [40, -110]]} flip />
        <Bean body="#3f6f9c" x={1560} y={930} s={0.8} f={f} seed={8} hair="tuft" skin={C.skin2} arms={[[-44, -110], null]} />
        {[60, 520, 1280, 1740].map((sx, i) => {
          const k = lerp(f, [t0 + i * 7, t0 + i * 7 + 26], [0, 1], easeIO);
          const loop = ((f - t0 - i * 7) % 40) / 40;
          const kk = f > t0 + i * 7 + 26 ? loop : k;
          if (f < t0 + i * 7) return null;
          const ex = 1000, ey = 262, x0 = sx, y0 = 760;
          const cx = (x0 + ex) / 2, cy = 220;
          const q = (a: number, b: number, c: number, t: number) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
          return <g key={i}>
            <path d={`M ${x0} ${y0} Q ${cx} ${cy} ${ex} ${ey}`} fill="none" stroke={C.green} strokeWidth={4} strokeDasharray="4 14" strokeLinecap="round" opacity={0.7 * k} />
            <g transform={`translate(${q(x0, cx, ex, kk)} ${q(y0, cy, ey, kk)})`}><circle r={20} fill={C.green} stroke={INK} strokeWidth={5} /><text y={10} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={26} fill={INK}>€</text></g>
          </g>;
        })}
        <Night id="n6" amt={0.6} lights={[{ x: 120, y: 780, r: 300 }, { x: 580, y: 780, r: 300 }, { x: 1340, y: 780, r: 300 }, { x: 1800, y: 780, r: 300 }, { x: 1000, y: 330, r: 330, color: C.green, power: 0.9 }]} />
      </Layer>
    </Cam>
  );
};
export const S19Invented: React.FC<ShotP> = ({ f, d, m }) => {
  const a = m.invented ?? 20, b = m.euros ?? 80;
  const off = lerp(f, [b + 2, b + 18], [1, 0]);
  const n = f < b + 2 ? count(f, a, a + 26, 0, 1900000000) : count(f, b + 2, b + 18, 1900000000, 0);
  return (
    <Cam f={f} d={d} z={[1.22, 1.0]} y={[-60, 0]}>
      <Layer depth={0.15}><Sky id="s19" /><Stars f={f} /></Layer>
      <Layer depth={0.5}>{[40, 330, 640, 1320, 1600, 1840].map((x, i) => <rect key={i} x={x} y={470 - (i * 71) % 160} width={210} height={700} fill="#141b3c" />)}</Layer>
      <Layer>
        <rect x={-400} y={960} width={W + 800} height={400} fill="#1b2140" />
        <Tower x={960} y={980} s={1.1} on={off} />
        <text x={960} y={210} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={120} fill={off > 0.4 ? C.green : C.red} letterSpacing={4} opacity={f < a ? 0 : (f > b + 2 && Math.floor(f / 2) % 3 === 0 ? 0.35 : 1)}>{euro(n)}</text>
        <Night id="n19" amt={0.62} lights={[{ x: 960, y: 330, r: 420, color: C.green, power: 0.3 + 0.7 * off }, { x: 960, y: 180, r: 520, ry: 170, color: C.green, power: 0.8 }]} />
        <Rain f={f} op={0.14} />
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ S7: worth more than Deutsche Bank
export const S7Scales: React.FC<ShotP> = ({ f, d, m }) => {
  const tip = m.tip ?? 30;
  const a = lerp(f, [tip, tip + 22], [9, -11], easeIO) + Math.sin(f / 9) * 0.8;
  const r = (a * Math.PI) / 180, L = 430;
  const lx = 960 - Math.cos(r) * L, ly = 400 - Math.sin(r) * L, rx = 960 + Math.cos(r) * L, ry = 400 + Math.sin(r) * L;
  const pan = (x: number, y: number, kid: React.ReactNode) => (
    <g>
      <g stroke={C.gold} strokeWidth={5}><line x1={x} y1={y} x2={x - 150} y2={y + 230} /><line x1={x} y1={y} x2={x + 150} y2={y + 230} /></g>
      <path d={`M ${x - 190} ${y + 230} L ${x + 190} ${y + 230} Q ${x} ${y + 300} ${x - 190} ${y + 230} Z`} fill={C.gold} stroke={INK} strokeWidth={7} />
      <g transform={`translate(${x} ${y + 230})`}>{kid}</g>
    </g>
  );
  return (
    <Cam f={f} d={d} z={[1.0, 1.09]} bg="#2a0f14">
      <Layer depth={0.3}><rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#3a1218" /><Bokeh f={f} seed={7} color="#ff9a6b" n={16} /></Layer>
      <Layer>
        <rect x={-400} y={930} width={W + 800} height={400} fill="#1c0a0e" />
        <g stroke={INK} strokeWidth={8} strokeLinejoin="round">
          <path d="M 930 930 L 944 420 L 976 420 L 990 930 Z" fill={C.gold} /><path d="M 760 960 Q 960 880 1160 960 Z" fill={C.gold} />
          <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={C.gold} strokeWidth={22} strokeLinecap="round" /><line x1={lx} y1={ly} x2={rx} y2={ry} stroke={INK} strokeWidth={4} />
          <circle cx={960} cy={400} r={30} fill={C.gold} />
        </g>
        {pan(lx, ly, <g>
          <rect x={-130} y={-150} width={260} height={150} rx={10} fill={C.greenD} stroke={INK} strokeWidth={7} />
          <rect x={-70} y={-116} width={140} height={84} fill={C.green} stroke={INK} strokeWidth={6} />
          {[-110, -85, 85, 110].map((x) => <line key={x} x1={x} y1={-150} x2={x} y2={-172} stroke={C.gold} strokeWidth={8} />)}
          <text y={120} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={50} fill={C.green} letterSpacing={4}>WIRECARD</text>
        </g>)}
        {pan(rx, ry, <g>
          <g stroke={INK} strokeWidth={7} strokeLinejoin="round"><path d="M -130 -130 L 0 -200 L 130 -130 Z" fill="#c9ccd6" /><rect x={-120} y={-130} width={240} height={26} fill="#aeb2bf" />{[-90, -30, 30, 90].map((x) => <rect key={x} x={x - 14} y={-104} width={28} height={84} fill="#d9dce4" />)}<rect x={-134} y={-20} width={268} height={22} fill="#aeb2bf" /></g>
          <text y={120} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={46} fill="#d9dce4" letterSpacing={3}>DEUTSCHE BANK</text>
        </g>)}
        <Night id="n7" amt={0.5} tint="#14040a" lights={[{ x: 960, y: 520, r: 900, ry: 520 }]} />
      </Layer>
      <Layer depth={1.2}><LocTag f={f} at={8} text="Frankfurt stock market · 2018" /></Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ type-on cards
export const Card: React.FC<ShotP> = ({ gf, words }) => <TypeCard words={words} fps={FPS} gf={gf} />;

// ------------------------------------------------------------------ desk-top inserts (seen from above on green felt)
const Desk: React.FC<{ children: React.ReactNode; id: string; f: number; light?: [number, number]; red?: boolean }> = ({ children, id, f, light = [960, 520], red }) => (
  <g>
    <rect x={-400} y={-300} width={W + 800} height={H + 600} fill={C.woodD} />
    <rect x={120} y={90} width={1680} height={900} rx={18} fill={C.felt} stroke={INK} strokeWidth={10} />
    <rect x={150} y={120} width={1620} height={840} rx={10} fill="none" stroke={C.feltD} strokeWidth={8} />
    <g transform="translate(250 230)" stroke={INK} strokeWidth={7}><circle r={78} fill="#2a2d3a" /><circle r={46} fill="#11131c" /><circle r={12} fill="#565b70" /></g>
    <g transform="translate(1640 850) rotate(-30)" stroke={INK} strokeWidth={5}><rect x={-120} y={-10} width={240} height={20} rx={8} fill="#1b1d26" /><path d="M 120 -10 L 150 0 L 120 10 Z" fill={C.gold} /></g>
    <g transform="translate(1650 240)" stroke={INK} strokeWidth={7}><circle r={64} fill="#e8e2d2" /><circle r={46} fill="#5a3418" /></g>
    {children}
    <Night id={id} amt={0.7} tint={red ? '#1a0508' : '#06100c'} lights={[{ x: light[0], y: light[1], r: 760, ry: 560, color: red ? '#ff8a6b' : C.warm }]} />
  </g>
);
export const S9Ledger: React.FC<ShotP> = ({ f, d, m }) => {
  const a = m.one ?? 30, b = m.euros ?? 70;
  const n = count(f, a, b, 0, 1900000000);
  const hx = lerp(f, [a, b], [820, 1330], easeOut);
  return (
    <Cam f={f} d={d} z={[1.0, 1.12]} y={[0, 30]} bg={C.woodD}>
      <Layer>
        <Desk id="n9" f={f}>
          <Paper x={500} y={170} w={920} h={760} rot={-2} lines={3}>
            <rect width={920} height={110} fill="#1d2748" /><T x={460} y={74} s={52} c="#fff" a="middle">WIRECARD · BALANCE SHEET 2019</T>
            <T x={60} y={210} s={38} c="#6b6250">CASH HELD IN TRUST ACCOUNTS</T>
            <line x1={60} x2={860} y1={236} y2={236} stroke="#b9ad92" strokeWidth={3} />
            <text x={60} y={400} fontFamily={HAND} fontWeight={700} fontSize={150} fill="#1c3f8a" opacity={f >= a ? 1 : 0}>{euro(n)}</text>
            <path d={`M 60 440 Q 300 425 ${60 + lerp(f, [b, b + 10], [0, 800])} 440`} fill="none" stroke={C.red} strokeWidth={8} strokeLinecap="round" opacity={f > b ? 1 : 0} />
            <T x={60} y={520} s={34} c="#6b6250" o={f > b + 6 ? 1 : 0}>= about a quarter of everything the company says it owns</T>
          </Paper>
          <Hand x={hx + 500} y={590} x0={hx + 760} y0={1300} pen />
        </Desk>
      </Layer>
    </Cam>
  );
};
export const S14Warrant: React.FC<ShotP> = ({ f, d, m }) => (
  <Cam f={f} d={d} z={[1.14, 1.0]} x={[20, 0]} bg={C.woodD}>
    <Layer>
      <Desk id="n14" f={f} red>
        <Paper x={540} y={130} w={840} h={830} rot={3} lines={5}>
          <T x={420} y={110} s={84} a="middle" ls={5}>ARREST WARRANT</T>
          <line x1={60} x2={780} y1={140} y2={140} stroke={INK} strokeWidth={6} />
          <T x={330} y={230} s={36} c="#6b6250">NAME</T><T x={330} y={292} s={58}>JAN MARSALEK</T>
          <T x={330} y={370} s={36} c="#6b6250">WANTED FOR</T><T x={330} y={428} s={48}>FRAUD · €1.9 BN</T>
          <g transform="translate(60 180) rotate(-4)">
            <rect width={230} height={270} fill="#fff" stroke={INK} strokeWidth={6} /><rect x={14} y={14} width={202} height={210} fill="#9aa6c4" />
            <clipPath id="ph14"><rect x={14} y={14} width={202} height={210} /></clipPath>
            <g clipPath="url(#ph14)"><Bean {...MARS} x={115} y={330} s={1.05} f={0} legs={false} bob={0} /></g>
            <path d="M 150 -16 q 26 -10 30 14 l -6 60 q -8 14 -18 0 l 6 -52 q -2 -10 -10 -6" fill="none" stroke="#8c93a8" strokeWidth={6} />
          </g>
          <Stamp f={f} at={m.warrant ?? 20} x={560} y={600} text="22 JUNE 2020" size={62} rot={-10} />
        </Paper>
      </Desk>
    </Layer>
  </Cam>
);
export const S18File: React.FC<ShotP> = ({ f, d, m }) => {
  const open = lerp(f, [0, 12], [0, 1], easeOut);
  return (
    <Cam f={f} d={d} z={[1.0, 1.12]} bg={C.woodD}>
      <Layer>
        <Desk id="n18" f={f} red>
          <g transform="translate(470 150)">
            <path d="M 0 40 L 0 800 L 980 800 L 980 40 L 420 40 L 380 0 L 40 0 Z" fill="#b9853f" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
            <Paper x={60} y={90} w={860} h={670} rot={-1.5} lines={2}>
              <T x={50} y={84} s={40} c="#6b6250">PROSECUTION CASE · LONDON</T>
              <T x={320} y={190} s={36} c="#6b6250">ORDERS CAME FROM</T><T x={320} y={256} s={60}>JAN MARSALEK</T>
              <T x={320} y={340} s={36} c="#6b6250">ON BEHALF OF</T>
              <g transform="translate(50 130)"><rect width={230} height={260} fill="#fff" stroke={INK} strokeWidth={6} /><rect x={14} y={14} width={202} height={200} fill="#9aa6c4" /><clipPath id="ph18"><rect x={14} y={14} width={202} height={200} /></clipPath><g clipPath="url(#ph18)"><Bean {...MARS} x={115} y={322} s={1.05} f={0} legs={false} bob={0} /></g></g>
              <Stamp f={f} at={m.russian ?? 6} x={470} y={480} text="RUSSIAN INTELLIGENCE" size={56} rot={-7} />
            </Paper>
            <g transform={`translate(0 800) scale(1 ${1 - open * 1.0})`} opacity={1 - open}><path d="M 0 -760 L 0 0 L 980 0 L 980 -760 Z" fill="#c9954c" stroke={INK} strokeWidth={8} /></g>
          </g>
        </Desk>
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ S10: two banks in the Philippines (map)
export const S10Map: React.FC<ShotP> = ({ f, d, m }) => {
  const land = '#e3d2a4', sh = '#c9b580';
  const pin = (x: number, y: number, at: number, label: string) => {
    if (f < at) return null;
    const k = lerp(f, [at, at + 7], [0, 1], easeOut);
    return <g transform={`translate(${x} ${y - (1 - k) * 260})`}>
      <ellipse cx={0} cy={(1 - k) * 260} rx={16} ry={6} fill="#000" opacity={0.3} />
      <path d="M 0 0 L -24 -56 A 30 30 0 1 1 24 -56 Z" fill={C.red} stroke={INK} strokeWidth={5} /><circle cx={0} cy={-66} r={11} fill="#fff" stroke={INK} strokeWidth={4} />
      <g opacity={lerp(f, [at + 6, at + 12], [0, 1])}><rect x={34} y={-92} width={label.length * 16 + 30} height={44} fill="#0c0e16" opacity={0.88} /><text x={48} y={-61} fontFamily={LABEL} fontWeight={700} fontSize={26} fill="#fff" letterSpacing={2}>{label}</text></g>
    </g>;
  };
  return (
    <Cam f={f} d={d} z={[1.0, 1.2]} x={[0, 70]} y={[0, 10]} ease bg="#9cc3d6">
      <Layer>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#a9cbdb" />
        {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M ${-200 + i * 260} ${130 + (i % 3) * 300} q 40 -16 80 0 q 40 16 80 0`} fill="none" stroke="#fff" strokeWidth={4} opacity={0.35} />)}
        <g fill={land} stroke={INK} strokeWidth={6} strokeLinejoin="round">
          {/* mainland Asia (left edge), Taiwan, Borneo, the Philippines */}
          <path d="M -100 -100 L 620 -100 Q 600 40 500 90 Q 420 170 300 190 Q 330 300 250 420 Q 300 560 210 700 Q 150 620 120 500 Q 40 420 -100 430 Z" />
          <path d="M 820 60 Q 870 20 890 80 Q 880 170 840 190 Q 800 130 820 60 Z" />
          <path d="M 380 1180 Q 420 900 620 820 Q 760 760 800 860 Q 760 960 800 1180 Z" />
          <path d="M 1020 330 Q 1090 270 1150 330 Q 1200 420 1150 500 Q 1180 570 1120 640 Q 1060 600 1050 520 Q 990 440 1020 330 Z" />
          <path d="M 1130 690 Q 1190 670 1230 720 Q 1200 770 1150 750 Z" /><path d="M 1010 720 Q 1050 700 1080 750 Q 1050 800 1010 770 Z" /><path d="M 1250 760 Q 1290 750 1300 800 Q 1270 830 1240 800 Z" />
          <path d="M 880 760 Q 960 800 990 870 Q 940 860 880 790 Z" />
          <path d="M 1120 850 Q 1220 800 1330 850 Q 1380 930 1310 1010 Q 1220 980 1160 1000 Q 1100 930 1120 850 Z" />
        </g>
        <g fill={sh} opacity={0.5}><path d="M 1050 520 Q 1100 560 1120 640 Q 1060 600 1050 520 Z" /><path d="M 1160 1000 Q 1220 980 1310 1010 Q 1230 1040 1160 1000 Z" /></g>
        <text x={1215} y={330} fontFamily={LABEL} fontWeight={700} fontSize={46} fill={INK} letterSpacing={8} opacity={lerp(f, [m.phil ?? 30, (m.phil ?? 30) + 8], [0, 1])}>PHILIPPINES</text>
        <T x={200} y={120} s={40} c="#8a7a52" ls={10}>CHINA</T><T x={560} y={1010} s={34} c="#8a7a52" ls={8}>BORNEO</T>
        <T x={1420} y={960} s={36} c="#6f9fb5" ls={12} hand>Pacific Ocean</T>
        {pin(1085, 470, m.two ?? 8, 'BANK 1')}
        {pin(1135, 560, (m.two ?? 8) + 9, 'BANK 2')}
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ S11: the banks have never heard of it
export const S11Bank: React.FC<ShotP> = ({ f, d, m }) => {
  const st = m.never ?? 30;
  const shake = f > 10 && f < st ? Math.sin(f * 0.5) : 0;
  return (
    <Cam f={f} d={d} z={[1.0, 1.1]} x={[-20, 20]} bg="#d8cfae">
      <Layer depth={0.6}>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#e4dab8" />
        <rect x={-400} y={-300} width={W + 800} height={420} fill="#2f6f73" />
        <rect x={560} y={150} width={800} height={130} fill="#12303a" stroke={INK} strokeWidth={8} />
        <T x={960} y={244} s={96} c={C.gold} a="middle" ls={26}>BANK</T>
        <g transform="translate(1560 420)" stroke={INK} strokeWidth={7}><circle r={70} fill="#fff" /><line x1={0} y1={0} x2={0} y2={-46} /><line x1={0} y1={0} x2={30} y2={14} /></g>
        <g transform="translate(250 380)" stroke={INK} strokeWidth={7}><rect width={200} height={250} fill="#cfe2d8" /><path d="M 20 210 L 70 120 L 110 170 L 150 90 L 190 210 Z" fill="#6aa58a" /></g>
      </Layer>
      <Layer>
        <Bean body="#2f6f73" x={960} y={1030} s={2.2} f={f} seed={4} hair="side" hairC="#30241c" glasses tie="#b8433a" collar="#fff" skin={C.skin2} legs={false}
          look={[shake, 0]} tilt={shake * 2.5} eyes={f > st ? 'closed' : 'worried'} mouth={f > st ? 'line' : 'frown'} arms={f > 8 ? [[-120, -118], [120, -118]] : undefined} />
        <rect x={560} y={330} width={800} height={470} fill="rgba(200,235,240,0.16)" stroke={INK} strokeWidth={10} />
        <line x1={560} y1={330} x2={700} y2={800} stroke="#fff" strokeWidth={6} opacity={0.25} />
        <rect x={-400} y={800} width={W + 800} height={500} fill="#6a4a30" /><rect x={-400} y={800} width={W + 800} height={46} fill="#8a6542" stroke={INK} strokeWidth={8} />
        <g transform={`translate(${lerp(f, [0, 10], [-700, 0], easeOut)} 0)`}>
          <Paper x={360} y={760} w={620} h={300} rot={-4}>
            <T x={40} y={70} s={40}>WIRECARD · ACCOUNT CONFIRMATION</T>
            <T x={40} y={150} s={80} c="#1c3f8a" hand>€1.9 billion</T>
            <T x={40} y={220} s={30} c="#6b6250">held at this bank. Signed, ________</T>
          </Paper>
          <Stamp f={f} at={st} x={690} y={900} text="NOT OUR CLIENT" size={66} rot={-9} />
        </g>
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ S12: the money isn't lost (the empty vault)
export const S12Vault: React.FC<ShotP> = ({ f, d }) => {
  const o = lerp(f, [4, 30], [0, 1], easeIO);
  return (
    <Cam f={f} d={d} z={[1.0, 1.14]} x={[0, 20]}>
      <Layer>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#3a4258" />
        <rect x={-400} y={880} width={W + 800} height={500} fill="#262c40" />
        {/* the vault mouth */}
        <circle cx={960} cy={520} r={380} fill="#0a0d18" stroke={INK} strokeWidth={14} />
        <clipPath id="vm"><circle cx={960} cy={520} r={372} /></clipPath>
        <g clipPath="url(#vm)">
          <path d="M 620 880 L 800 620 L 1120 620 L 1300 880 Z" fill="#151a2c" />
          <rect x={800} y={300} width={320} height={320} fill="#10142a" stroke="#1d2340" strokeWidth={6} />
          {[0, 1, 2].map((i) => <g key={i} stroke="#1d2340" strokeWidth={6}><line x1={620 + i * 60} y1={880 - i * 86} x2={620 + i * 60} y2={200} /><line x1={1300 - i * 60} y1={880 - i * 86} x2={1300 - i * 60} y2={200} /></g>)}
          <ellipse cx={960} cy={800} rx={190} ry={44} fill="#ffe7a8" opacity={0.5 * o} />
          <path d="M 930 240 L 990 240 L 1150 800 L 770 800 Z" fill="#ffe7a8" opacity={0.1 * o} />
          <g opacity={o}><rect x={915} y={742} width={90} height={58} fill={C.paper} stroke={INK} strokeWidth={5} transform="rotate(-8 960 770)" /><text x={960} y={782} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={28} fill={C.red} transform="rotate(-8 960 770)">€0</text></g>
          {Array.from({ length: 16 }).map((_, i) => <circle key={i} cx={840 + ((i * 53) % 240)} cy={300 + ((i * 97 + f * 1.2) % 480)} r={3} fill="#ffe7a8" opacity={0.5 * o} />)}
        </g>
        {/* the door swings to the left */}
        <g transform={`translate(${960 - o * 720} 520) scale(${1 - o * 0.72} 1)`}>
          <circle r={388} fill="#8b93a8" stroke={INK} strokeWidth={14} /><circle r={300} fill="#a3abc0" stroke={INK} strokeWidth={8} />
          {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={Math.cos(i * Math.PI / 6) * 344} cy={Math.sin(i * Math.PI / 6) * 344} r={16} fill="#6b7389" stroke={INK} strokeWidth={5} />)}
          <g transform={`rotate(${f * 3 * (1 - o)})`} stroke={INK} strokeWidth={10}><circle r={90} fill={C.gold} />{[0, 60, 120].map((a) => <line key={a} x1={-150} y1={0} x2={150} y2={0} transform={`rotate(${a})`} />)}</g>
        </g>
        <Bean body="#2a3350" x={1560} y={940} s={1.25} f={f} seed={6} hat="guard" flip eyes={o > 0.7 ? 'wide' : 'open'} mouth={o > 0.7 ? 'o' : 'line'} look={[1, 0]} arms={[null, [70, -120]]}
          hold={<g transform="translate(70 -120) rotate(-90)"><rect x={-12} y={-10} width={60} height={24} rx={6} fill="#22252f" stroke={INK} strokeWidth={5} /></g>} />
        <Night id="n12" amt={0.6} lights={[{ x: 960, y: 640, r: 460, ry: 380, power: 0.25 + 0.75 * o }, { x: 1500, y: 700, r: 280, power: 0.6 }]} />
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ S15: the jet has landed in Belarus (flight log)
export const S15Flight: React.FC<ShotP> = ({ f, d, m }) => {
  const k = lerp(f, [6, (m.landed ?? 40) + 4], [0, 1], easeIO);
  const A = [560, 720], B = [1380, 360], Cp = [900, 250];
  const q = (a: number, b: number, c: number, t: number) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
  const px = q(A[0], Cp[0], B[0], k), py = q(A[1], Cp[1], B[1], k);
  const ang = (Math.atan2(2 * (1 - k) * (Cp[1] - A[1]) + 2 * k * (B[1] - Cp[1]), 2 * (1 - k) * (Cp[0] - A[0]) + 2 * k * (B[0] - Cp[0])) * 180) / Math.PI;
  const G = '#58e07a';
  const landed = k >= 1;
  return (
    <Cam f={f} d={d} z={[1.0, 1.1]} x={[0, 40]} bg="#04100a">
      <Layer>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#06140d" />
        <rect x={160} y={110} width={1600} height={860} rx={26} fill="#082016" stroke={INK} strokeWidth={12} />
        <g stroke={G} opacity={0.14} strokeWidth={2}>
          {Array.from({ length: 20 }).map((_, i) => <line key={i} x1={160 + i * 80} y1={110} x2={160 + i * 80} y2={970} />)}
          {Array.from({ length: 11 }).map((_, i) => <line key={i} x1={160} y1={110 + i * 80} x2={1760} y2={110 + i * 80} />)}
        </g>
        <rect x={160} y={110} width={1600} height={84} fill="#0c3020" />
        <T x={200} y={168} s={44} c={G} ls={4}>FLIGHT LOG · 19 JUNE 2020</T>
        <T x={1720} y={168} s={34} c={G} a="end" ls={3} o={0.5 + 0.5 * (Math.floor(f / 8) % 2)}>● TRACKING</T>
        {/* Belarus, lit red when he lands */}
        <path d="M 1180 300 Q 1300 230 1470 260 Q 1600 300 1610 400 Q 1560 480 1440 470 Q 1300 500 1210 450 Q 1150 380 1180 300 Z" fill={landed ? '#7a1f22' : '#0f3a26'} stroke={landed ? C.red : G} strokeWidth={4} opacity={0.9} />
        <T x={1395} y={330} s={34} c={landed ? '#ffb4ae' : G} a="middle" ls={8}>BELARUS</T>
        <path d="M 400 640 Q 520 580 680 640 Q 720 720 640 780 Q 500 800 420 750 Z" fill="#0f3a26" stroke={G} strokeWidth={4} opacity={0.9} />
        <T x={540} y={680} s={30} c={G} a="middle" ls={6}>AUSTRIA</T>
        <path d={`M ${A[0]} ${A[1]} Q ${Cp[0]} ${Cp[1]} ${B[0]} ${B[1]}`} fill="none" stroke={G} strokeWidth={5} strokeDasharray="6 16" strokeLinecap="round" opacity={0.25} />
        <path d={`M ${A[0]} ${A[1]} Q ${Cp[0]} ${Cp[1]} ${B[0]} ${B[1]}`} fill="none" stroke={G} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
        <circle cx={A[0]} cy={A[1]} r={12} fill={G} /><T x={A[0] - 20} y={A[1] + 60} s={30} c={G} ls={3}>BAD VÖSLAU</T>
        <circle cx={B[0]} cy={B[1]} r={12} fill={landed ? C.red : G} /><circle cx={B[0]} cy={B[1]} r={12 + ((f * 2) % 40)} fill="none" stroke={landed ? C.red : G} strokeWidth={3} opacity={1 - ((f * 2) % 40) / 40} />
        <T x={B[0] + 30} y={B[1] + 50} s={30} c={landed ? '#ffb4ae' : G} ls={3}>MINSK</T>
        <g transform={`translate(${px} ${py}) rotate(${ang})`} fill="#eafff0" stroke={INK} strokeWidth={3}><path d="M 34 0 L -22 -9 L -30 -26 L -38 -26 L -32 -8 L -32 8 L -38 26 L -30 26 L -22 9 Z" /><path d="M 4 -4 L -14 -40 L -4 -40 L 14 -4 Z" /><path d="M 4 4 L -14 40 L -4 40 L 14 4 Z" /></g>
        {landed && <g opacity={Math.floor(f / 5) % 2 ? 1 : 0.5}><rect x={1130} y={520} width={420} height={84} fill="#2a090b" stroke={C.red} strokeWidth={5} /><T x={1340} y={580} s={52} c="#ffb4ae" a="middle" ls={8}>LANDED</T></g>}
        <T x={200} y={920} s={30} c={G} ls={3} o={0.75}>PRIVATE JET · 1 PASSENGER · PAID IN CASH</T>
        <g opacity={0.07}>{Array.from({ length: 108 }).map((_, i) => <rect key={i} x={160} y={110 + i * 8} width={1600} height={3} fill="#000" />)}</g>
      </Layer>
      <Layer depth={1.3}>
        <Bean body="#1b2233" x={150} y={1380} s={2.6} f={f} seed={9} hair="short" hairC="#0e0f16" legs={false} lit={1} litC={G} skin="#6f8f86" eyes="open" look={[1, -0.6]} />
      </Layer>
      <Layer><Night id="n15" amt={0.35} tint="#000" lights={[{ x: 960, y: 520, r: 1000, ry: 620, color: G }]} glow={0.1} /></Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ S17: a British court
export const S17Court: React.FC<ShotP> = ({ f, d }) => (
  <Cam f={f} d={d} z={[1.0, 1.08]} x={[-50, 30]}>
    <Layer depth={0.6}>
      <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#4a2f22" />
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-300 + i * 220} y={120} width={180} height={520} fill="#5a3a28" stroke="#33201a" strokeWidth={8} />)}
      <g transform="translate(960 250)" stroke={INK} strokeWidth={7}>
        <path d="M -70 -90 L 70 -90 L 70 10 Q 0 90 -70 10 Z" fill="#b8433a" /><path d="M -70 -40 L 70 -40" stroke={C.gold} strokeWidth={14} /><path d="M 0 -90 L 0 60" stroke={C.gold} strokeWidth={14} />
        <path d="M -110 30 Q -150 -60 -100 -120" fill="none" stroke={C.gold} strokeWidth={10} /><path d="M 110 30 Q 150 -60 100 -120" fill="none" stroke={C.gold} strokeWidth={10} />
      </g>
    </Layer>
    <Layer>
      <Bean body="#16161d" x={960} y={740} s={1.5} f={f} seed={3} hat="wig" glasses legs={false} collar="#fff" skin={C.skin3} look={[-1, 0.3]} mouth="line" />
      <g stroke={INK} strokeWidth={9} strokeLinejoin="round">
        <rect x={560} y={560} width={800} height={70} fill={C.wood} /><rect x={600} y={630} width={720} height={330} fill={C.woodD} />
        <rect x={880} y={690} width={160} height={200} fill="#4a2f22" />
      </g>
      <g transform="translate(1180 540) rotate(20)" stroke={INK} strokeWidth={6}><rect x={-50} y={-14} width={64} height={28} rx={6} fill="#6a4a30" /><rect x={10} y={-5} width={70} height={10} fill="#6a4a30" /></g>
      <rect x={-400} y={940} width={W + 800} height={400} fill="#2c1c15" />
      <Bean body="#16161d" x={380} y={1010} s={1.7} f={f} seed={1} hat="wig" collar="#fff" skin={C.skin2} look={[1, -0.4]} mouth="talk" arms={[null, [96, -150]]} lit={1}
        hold={<g transform="translate(96 -150) rotate(14)"><rect x={-10} y={-70} width={76} height={96} fill={C.paper} stroke={INK} strokeWidth={4} />{[0, 1, 2, 3].map((i) => <line key={i} x1={2} x2={54} y1={-52 + i * 18} y2={-52 + i * 18} stroke="#8a8170" strokeWidth={3} />)}</g>} />
      <g stroke={INK} strokeWidth={9} strokeLinejoin="round"><rect x={1420} y={700} width={360} height={260} fill={C.woodD} /><rect x={1400} y={680} width={400} height={36} fill={C.wood} /></g>
      <text x={1600} y={640} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={190} fill="#fff" opacity={0.75 + 0.2 * Math.sin(f / 6)}>?</text>
      <T x={1600} y={860} s={34} c={C.gold} a="middle" ls={4}>THE DOCK</T>
      <Night id="n17" amt={0.7} tint="#0c0508" lights={[{ x: 960, y: 500, r: 440, ry: 380 }, { x: 1600, y: 620, r: 320, ry: 330, power: 0.9, color: '#fff2d0' }, { x: 420, y: 700, r: 360, power: 0.8 }]} />
    </Layer>
    <Layer depth={1.2}><LocTag f={f} at={8} text="London · years later" /></Layer>
  </Cam>
);

// ------------------------------------------------------------------ S20: the man who vanished (title)
export const S20Vanish: React.FC<ShotP> = ({ f, d, m }) => {
  const v = m.vanished ?? 40;
  const jx = lerp(f, [0, v + 30], [-200, 1500]), jy = 520 - jx * 0.16;
  const tk = lerp(f, [v + 6, v + 34], [0, 1]);
  const title = 'THE MAN WHO VANISHED';
  return (
    <Cam f={f} d={d} z={[1.0, 1.1]} x={[0, 40]}>
      <Layer depth={0.1}><Sky id="s20" a="#050818" b="#1d2a5c" /><Stars f={f} n={90} /></Layer>
      <Layer depth={0.3}><circle cx={1280} cy={330} r={210} fill="#f3efd9" /><circle cx={1280} cy={330} r={400} fill="#f3efd9" opacity={0.07} /><circle cx={1210} cy={270} r={34} fill="#d9d4ba" /><circle cx={1340} cy={400} r={50} fill="#d9d4ba" /></Layer>
      <Layer depth={0.6}>
        <g opacity={lerp(f, [v, v + 24], [1, 0])} transform={`translate(${jx} ${jy}) rotate(-9) scale(0.42)`}><Jet x={0} y={110} door={false} /></g>
      </Layer>
      <Layer>
        {[[-200, 760, 1.4], [500, 860, 1.8], [1300, 780, 1.6], [1900, 880, 1.5]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x - f * (0.8 + i * 0.25)} ${y}) scale(${s})`} fill="#1a2348" opacity={0.96}>
            <ellipse cx={0} cy={0} rx={300} ry={90} /><ellipse cx={-150} cy={-40} rx={140} ry={80} /><ellipse cx={90} cy={-70} rx={170} ry={100} /><ellipse cx={260} cy={-20} rx={130} ry={70} />
          </g>
        ))}
        <rect x={-400} y={900} width={W + 800} height={500} fill="#1a2348" />
        <Night id="n20" amt={0.4} lights={[{ x: 1280, y: 330, r: 620, color: '#cfe0ff', power: 0.9 }]} glow={0.14} />
      </Layer>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 150 }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 124, color: '#fff', letterSpacing: 8, textShadow: '0 6px 0 #0a0d1e, 0 0 40px rgba(0,0,0,0.8)', whiteSpace: 'pre' }}>
          {[...title].map((ch, i) => <span key={i} style={{ opacity: tk * title.length > i ? 1 : 0 }}>{ch}</span>)}
        </div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: C.green, opacity: lerp(f, [v + 36, v + 46], [0, 1]), marginTop: 4 }}>with €1.9 billion that never existed</div>
      </AbsoluteFill>
    </Cam>
  );
};
