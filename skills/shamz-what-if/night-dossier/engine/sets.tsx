// Night Dossier scene sets for the Wirecard episode: a handful of flexible sets (office, street, table, stage, Shamz's
// desk) that the timeline dresses with a cast list and props, so one set gives many shots through different views.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Bean, Bokeh, C, Cam, HAND, INK, LABEL, Layer, LocTag, NameTag, Night, Light, Rain, Stamp, View, W, H, easeIO, easeOut, lerp, count } from './dossier';
import { Bubble, LOOKS, Photo, SP, T } from './kit2';
import { Cabin, Seat } from './cold';

// ------------------------------------------------------------------ cast
export type CastP = {
  k: string; x: number; y?: number; s?: number; flip?: boolean; eyes?: any; mouth?: any; arms?: any; look?: [number, number]; tilt?: number;
  walk?: [number, number]; legs?: boolean; lit?: number; hold?: string; bubble?: string; bubbleAt?: string | number; seed?: number; shake?: boolean; hide?: string | number; show?: string | number;
};
const HOLD: Record<string, (f: number) => React.ReactNode> = {
  box: () => <g transform="translate(0 -96)" stroke={INK} strokeWidth={5}><rect x={-52} y={-40} width={104} height={74} fill="#b98a55" /><line x1={-52} y1={-18} x2={52} y2={-18} /><rect x={-20} y={-58} width={40} height={20} fill={C.paper} /></g>,
  case: () => <g transform="translate(58 -62)" stroke={INK} strokeWidth={5}><rect x={-30} y={0} width={60} height={46} rx={6} fill="#3a2b25" /><path d="M -12 0 q 12 -16 24 0" fill="none" /></g>,
  suitcase: () => <g transform="translate(70 -70)" stroke={INK} strokeWidth={5}><rect x={-26} y={-10} width={52} height={78} rx={8} fill="#2f6f73" /><line x1={-10} y1={-10} x2={-10} y2={-40} /><line x1={10} y1={-10} x2={10} y2={-40} /><line x1={-10} y1={-40} x2={10} y2={-40} /></g>,
  glass: () => <g transform="translate(62 -150)" stroke={INK} strokeWidth={4}><path d="M -14 -26 L 14 -26 L 10 12 L -10 12 Z" fill="rgba(210,235,255,0.5)" /><path d="M -12 -6 L 12 -6 L 10 12 L -10 12 Z" fill="#c98a3a" /></g>,
  paper: () => <g transform="translate(70 -150) rotate(12)" stroke={INK} strokeWidth={4}><rect x={-26} y={-44} width={62} height={80} fill={C.paper} />{[0, 1, 2].map((i) => <line key={i} x1={-16} x2={26} y1={-28 + i * 16} y2={-28 + i * 16} stroke="#8a8170" strokeWidth={3} />)}</g>,
  pink: () => <g transform="translate(70 -150) rotate(12)" stroke={INK} strokeWidth={4}><rect x={-30} y={-48} width={72} height={90} fill="#f6d5c0" />{[0, 1, 2].map((i) => <line key={i} x1={-20} x2={30} y1={-30 + i * 18} y2={-30 + i * 18} stroke="#8a8170" strokeWidth={3} />)}</g>,
  camera: () => <g transform="translate(64 -170)" stroke={INK} strokeWidth={4}><rect x={-26} y={-18} width={52} height={36} rx={6} fill="#22252f" /><circle cx={4} cy={0} r={12} fill="#6f86b8" /><rect x={-16} y={-28} width={18} height={12} fill="#22252f" /></g>,
  phone: () => <g transform="translate(46 -196) rotate(-12)" stroke={INK} strokeWidth={4}><rect x={-12} y={-24} width={24} height={46} rx={6} fill="#22252f" /></g>,
  usb: () => <g transform="translate(66 -150)" stroke={INK} strokeWidth={4}><rect x={-10} y={-22} width={20} height={34} rx={4} fill={C.red} /><rect x={-7} y={-34} width={14} height={13} fill="#cfd6e3" /></g>,
  ticket: () => <g transform="translate(70 -156) rotate(-10)" stroke={INK} strokeWidth={4}><rect x={-44} y={-22} width={96} height={46} rx={5} fill="#f3e3a8" /><text x={4} y={8} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={18} fill={INK} stroke="none">MANILA</text></g>,
  torch: () => <g transform="translate(70 -120) rotate(-90)"><rect x={-12} y={-10} width={60} height={24} rx={6} fill="#22252f" stroke={INK} strokeWidth={5} /></g>,
  piggy: () => <g transform="translate(0 -96)" stroke={INK} strokeWidth={5}><ellipse cx={0} cy={0} rx={50} ry={36} fill="#f2a7b5" /><circle cx={44} cy={-4} r={14} fill="#f2a7b5" /><rect x={-12} y={-40} width={24} height={7} fill={INK} /><text y={62} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={26} fill={C.red} stroke="none">€0</text></g>,
  money: () => <g transform="translate(72 -140) rotate(-8)" stroke={INK} strokeWidth={4}>{[0, 1, 2].map((i) => <rect key={i} x={-36 + i * 4} y={-20 - i * 6} width={72} height={38} rx={3} fill="#4fbf68" />)}</g>,
  notepad: () => <g transform="translate(64 -150) rotate(8)" stroke={INK} strokeWidth={4}><rect x={-22} y={-34} width={48} height={64} fill="#fff7d6" /><line x1={-22} y1={-22} x2={26} y2={-22} /></g>,
};
export const Cast: React.FC<{ list: CastP[]; f: number; d: number; m: Record<string, number>; gy?: number }> = ({ list, f, d, m, gy = 940 }) => (
  <>
    {list.map((c, i) => {
      const fr = (v: any, dflt: number) => (v === undefined ? dflt : typeof v === 'number' ? v : m[v] ?? dflt);
      if (c.show !== undefined && f < fr(c.show, 0)) return null;
      if (c.hide !== undefined && f >= fr(c.hide, 1e9)) return null;
      const x = c.walk ? lerp(f, [0, d], c.walk) : c.x;
      const s = c.s ?? 1.3;
      const hold = c.hold ? (c.hold.startsWith('sign:') ? <g transform="translate(0 -300)" stroke={INK} strokeWidth={5}><rect x={-80} y={-40} width={160} height={70} fill={C.paper} /><text y={10} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={30} fill={C.red} stroke="none">{c.hold.slice(5)}</text><line x1={0} y1={30} x2={0} y2={150} /></g> : HOLD[c.hold]?.(f)) : undefined;
      const arms = c.arms ?? (c.hold && c.hold !== 'box' && c.hold !== 'piggy' && !c.hold.startsWith('sign') ? [null, c.hold === 'phone' ? [46, -190] : c.hold === 'case' || c.hold === 'suitcase' ? [60, -70] : [66, -146]] : c.hold === 'box' || c.hold === 'piggy' ? [[-50, -100], [50, -100]] : undefined);
      const sh = c.shake ? Math.sin(f * 0.5) : 0;
      const bat = fr(c.bubbleAt, 6);
      const dir = c.flip ? -1 : 1;
      return (
        <g key={i}>
          <Bean {...LOOKS[c.k]} x={x} y={c.y ?? gy} s={s} f={f} seed={c.seed ?? i + 1} flip={c.flip} eyes={c.eyes} mouth={c.mouth} arms={arms} look={c.shake ? [sh, 0] : c.look ?? [0, 0]} tilt={c.tilt ?? sh * 2.5}
            walk={c.walk ? 1 : 0} legs={c.legs} lit={c.lit ?? 0} hold={hold} />
          {c.bubble && <Bubble f={f} at={bat} x={x + (dir > 0 ? 40 * s : -40 * s - (c.bubble.length * 22 + 70))} y={(c.y ?? gy) - 330 * s - 60} text={c.bubble} tail={dir > 0 ? 'l' : 'r'} />}
        </g>
      );
    })}
  </>
);

// ------------------------------------------------------------------ building blocks
const CityNight: React.FC<{ x: number; y: number; w: number; h: number; seed?: number; sg?: boolean }> = ({ x, y, w, h, seed = 1, sg }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#0c1230" />
    <clipPath id={`cn${x}${y}`}><rect x={x} y={y} width={w} height={h} /></clipPath>
    <g clipPath={`url(#cn${x}${y})`}>
      <circle cx={x + w * 0.8} cy={y + h * 0.2} r={26} fill="#f3efd9" opacity={0.9} />
      {Array.from({ length: Math.ceil(w / 76) }).map((_, i) => {
        const bh = h * (0.3 + (((i + seed) * 97) % 50) / 100);
        return <g key={i}><rect x={x + i * 76} y={y + h - bh} width={64} height={bh} fill="#18204a" />
          {Array.from({ length: Math.floor(bh / 36) }).map((__, j) => <rect key={j} x={x + i * 76 + 10 + (j % 2) * 24} y={y + h - bh + j * 36 + 8} width={15} height={17} fill={(i + j + seed) % 3 ? '#ffd98a' : '#27306a'} />)}</g>;
      })}
      {sg && <g stroke={INK} strokeWidth={4} fill="#2a356e">{[0, 1, 2].map((i) => <rect key={i} x={x + w * 0.3 + i * 44} y={y + h * 0.25} width={30} height={h * 0.75} />)}<path d={`M ${x + w * 0.3 - 16} ${y + h * 0.25} q 74 -30 150 0 l 0 12 q -76 -22 -150 0 Z`} fill="#3d4a8a" /></g>}
    </g>
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={INK} strokeWidth={10} />
    <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke={INK} strokeWidth={7} />
  </g>
);
const DayWin: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g><rect x={x} y={y} width={w} height={h} fill="#bfe3f2" /><circle cx={x + w * 0.75} cy={y + h * 0.3} r={34} fill="#ffe9a8" /><path d={`M ${x} ${y + h} L ${x} ${y + h * 0.7} q ${w * 0.25} -40 ${w * 0.5} 0 q ${w * 0.25} 40 ${w * 0.5} -10 L ${x + w} ${y + h} Z`} fill="#8fc39a" />
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={INK} strokeWidth={10} /><line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke={INK} strokeWidth={7} /></g>
);
const DeskSide: React.FC<{ x: number; w: number; y?: number; col?: string }> = ({ x, w, y = 760, col = C.wood }) => (
  <g stroke={INK} strokeWidth={9} strokeLinejoin="round"><rect x={x} y={y} width={w} height={58} fill={col} /><rect x={x + 40} y={y + 58} width={w - 80} height={340} fill={C.woodD} /></g>
);
const Lamp: React.FC<{ x: number; y?: number; col?: string }> = ({ x, y = 760, col = C.greenD }) => (
  <g stroke={INK} strokeWidth={8} strokeLinejoin="round"><path d={`M ${x} ${y} L ${x + 40} ${y - 140}`} /><path d={`M ${x - 20} ${y - 140} L ${x + 120} ${y - 180} L ${x + 140} ${y - 120} L ${x} ${y - 100} Z`} fill={col} /><rect x={x - 40} y={y - 12} width={90} height={14} fill={C.gold} /></g>
);
const Monitor: React.FC<{ x: number; y?: number; f: number; col?: string; crt?: boolean; kids?: React.ReactNode; w?: number }> = ({ x, y = 760, f, col = '#58e07a', crt, kids, w = 250 }) => (
  <g stroke={INK} strokeWidth={8} strokeLinejoin="round">
    <rect x={x - 30} y={y - 40} width={60} height={40} fill="#3a4055" /><rect x={x - 70} y={y - 10} width={140} height={12} fill="#3a4055" />
    <rect x={x - w / 2} y={y - 40 - w * 0.72} width={w} height={w * 0.72} rx={crt ? 26 : 8} fill={crt ? '#cfc6ad' : '#22252f'} />
    <rect x={x - w / 2 + 18} y={y - 22 - w * 0.72} width={w - 36} height={w * 0.72 - 40} rx={crt ? 16 : 2} fill="#0b1c14" strokeWidth={5} />
    <g stroke="none"><rect x={x - w / 2 + 18} y={y - 22 - w * 0.72} width={w - 36} height={w * 0.72 - 40} fill={col} opacity={0.14 + 0.05 * Math.sin(f / 5)} />
      {kids ?? [0, 1, 2, 3].map((i) => <rect key={i} x={x - w / 2 + 34} y={y - w * 0.72 + i * 26} width={(w - 90) * (0.5 + ((i * 37) % 50) / 100)} height={10} fill={col} opacity={0.8} />)}</g>
  </g>
);

// ------------------------------------------------------------------ Shamz's desk (the investigator and his board)
/** p: { mode?: intro|think|point|read|shock|smile|ask, pins?: string[] (cast keys on the board), note?: string, v?: 'close'|'board'|[View,View], file?: boolean } */
export const ShamzDesk: React.FC<SP> = ({ f, d, m, p }) => {
  const mode = p.mode ?? 'intro';
  const pins: string[] = p.pins ?? ['mars', 'braun'];
  const v: [View, View] = Array.isArray(p.v) ? p.v : p.v === 'close' ? [[960, 600, 1.55], [960, 590, 1.68]] : p.v === 'board' ? [[1000, 330, 1.7], [1040, 330, 1.85]] : [[960, 540, 1.0], [960, 530, 1.08]];
  const face: Record<string, any> = {
    intro: { eyes: 'open', mouth: 'talk' }, think: { eyes: 'worried', mouth: 'line', arms: [null, [38, -236]] }, point: { eyes: 'open', mouth: 'talk', arms: [null, [120, -250]], look: [1, -0.6] },
    read: { eyes: 'open', mouth: 'line', look: [0, 1], arms: [[-60, -70], [60, -70]] }, shock: { eyes: 'wide', mouth: 'o' }, smile: { eyes: 'happy', mouth: 'smile' }, ask: { eyes: 'open', mouth: 'talk', arms: [[-110, -120], [110, -120]] },
  };
  const pos = [[640, 160], [900, 150], [1160, 170], [1400, 150], [770, 380], [1280, 380]];
  return (
    <Cam f={f} d={d} v={v}>
      <Layer depth={0.7}>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#1d2b3f" />
        {Array.from({ length: 14 }).map((_, i) => <line key={i} x1={-300 + i * 190} x2={-300 + i * 190} y1={-300} y2={1300} stroke="#172334" strokeWidth={8} />)}
        <rect x={540} y={100} width={1120} height={560} fill="#9a6a3c" stroke={INK} strokeWidth={12} /><rect x={560} y={120} width={1080} height={520} fill="#b98a55" />
        {pins.map((k, i) => <g key={k}><Photo x={pos[i][0]} y={pos[i][1]} who={k} w={150} id={`sd${k}`} rot={(i % 2 ? 4 : -5)} /><circle cx={pos[i][0] + 75} cy={pos[i][1] + 4} r={10} fill={C.red} stroke={INK} strokeWidth={4} /></g>)}
        {pins.slice(1).map((k, i) => <line key={k} x1={pos[0][0] + 75} y1={pos[0][1] + 4} x2={pos[i + 1][0] + 75} y2={pos[i + 1][1] + 4} stroke={C.red} strokeWidth={5} />)}
        <g transform="translate(1040 400) rotate(3)"><rect width={190} height={120} fill={C.paper} stroke={INK} strokeWidth={5} /><text x={95} y={52} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={44} fill={C.red}>{p.note ?? '€1.9 bn?'}</text><text x={95} y={96} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={30} fill={INK}>{p.note2 ?? 'where is it'}</text></g>
        <g transform="translate(260 180)"><rect width={190} height={250} fill="#27344d" stroke={INK} strokeWidth={8} /><rect x={16} y={16} width={158} height={150} fill="#0c1230" /><circle cx={130} cy={56} r={18} fill="#f3efd9" /><T x={95} y={214} s={26} c="#9fb0d0" a="middle">{p.caseNo ?? 'CASE 05'}</T></g>
      </Layer>
      <Layer>
        <Bean {...LOOKS.shamz} x={960} y={1050} s={2.15} f={f} seed={7} legs={false} lit={-1} {...face[mode]} />
        <DeskSide x={220} w={1480} y={800} />
        <Lamp x={400} y={800} />
        <g stroke={INK} strokeWidth={7}>
          <g transform="translate(1250 728) rotate(-4)"><rect width={300} height={72} fill="#b9853f" /><rect x={10} y={-22} width={280} height={30} fill="#c9954c" /><text x={150} y={48} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={30} fill={INK} stroke="none" letterSpacing={3}>{p.caseName ?? 'WIRECARD'}</text></g>
          <g transform="translate(680 742)"><path d="M -30 -40 L 30 -40 L 24 58 L -24 58 Z" fill="#e8e2d2" /><path d="M 30 -20 q 30 6 0 44" fill="none" /></g>
        </g>
        {p.file && <g transform="translate(830 700) rotate(-3)" stroke={INK} strokeWidth={6}><rect width={270} height={100} fill={C.paper} />{[0, 1, 2].map((i) => <line key={i} x1={20} x2={250} y1={28 + i * 24} y2={28 + i * 24} stroke="#8a8170" strokeWidth={4} />)}</g>}
        <Night id="nsd" amt={0.66} tint="#070b18" lights={[{ x: 640, y: 660, r: 620, ry: 460 }, { x: 1100, y: 380, r: 640, ry: 360, power: 0.75 }]} />
      </Layer>
      {p.bubble && <Layer depth={1.1}><Bubble f={f} at={m.bubble ?? 8} x={1120} y={330} text={p.bubble} /></Layer>}
    </Cam>
  );
};

// ------------------------------------------------------------------ a room with someone at a desk
/** p: { who, who2?, wall?, win?: night|day|sg|none, plate?, tag?: [name, sub], tagAt?, bubble?, props?: string[], face?, v?, screen?, loc?, dark?, cast?: CastP[] } */
export const Office: React.FC<SP> = ({ f, d, m, p }) => {
  const props: string[] = p.props ?? [];
  const has = (k: string) => props.includes(k);
  const wall = p.wall ?? '#2b3350';
  const v: [View, View] = Array.isArray(p.v) ? p.v : p.v === 'close' ? [[940, 520, 1.6], [960, 510, 1.75]] : p.v === 'screen' ? [[1330, 600, 1.9], [1330, 590, 2.1]] : p.v === 'pull' ? [[960, 540, 1.25], [960, 540, 1.0]] : [[960, 540, 1.0], [980, 530, 1.1]];
  const day = p.win === 'day';
  const lights: Light[] = [{ x: 640, y: 690, r: 640, ry: 440 }, { x: 960, y: 420, r: 520, power: 0.55 }];
  if (has('monitor') || has('crt')) lights.push({ x: 1330, y: 600, r: 360, color: p.screenC ?? '#58e07a', power: 0.8 });
  return (
    <Cam f={f} d={d} v={v} bg={wall}>
      <Layer depth={0.6}>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill={wall} />
        {p.win === 'night' && <CityNight x={1040} y={130} w={700} h={470} />}
        {p.win === 'sg' && <CityNight x={1040} y={130} w={700} h={470} seed={4} sg />}
        {day && <DayWin x={1100} y={150} w={560} h={420} />}
        {has('shelf') && <g stroke={INK} strokeWidth={8}><rect x={200} y={160} width={420} height={420} fill="#3a2b25" />{[0, 1, 2].map((r) => <g key={r}><line x1={200} x2={620} y1={300 + r * 140} y2={300 + r * 140} />{Array.from({ length: 9 }).map((_, i) => <rect key={i} x={216 + i * 44} y={190 + r * 140 + ((i * 7) % 3) * 8} width={34} height={110 - ((i * 7) % 3) * 8} fill={['#b8433a', '#3f8fc8', '#d8a23a', '#4aa86a', '#8a5570'][(i + r) % 5]} strokeWidth={4} />)}</g>)}</g>}
        {has('emblem') && <g transform="translate(420 330)" stroke={INK} strokeWidth={7}><circle r={120} fill="#c9a23a" /><circle r={92} fill="#1d2748" /><path d="M -50 30 L 0 -60 L 50 30 Z" fill="#c9a23a" /><rect x={-60} y={34} width={120} height={18} fill="#c9a23a" /></g>}
        {has('poster') && <g transform="translate(300 180)"><rect width={280} height={360} fill={C.paper} stroke={INK} strokeWidth={8} /><T x={140} y={70} s={40} a="middle">WIRECARD</T><path d="M 40 300 L 100 220 L 150 250 L 240 120" fill="none" stroke={C.greenD} strokeWidth={10} /></g>}
        {has('map') && <g transform="translate(240 170)"><rect width={420} height={300} fill="#a9cbdb" stroke={INK} strokeWidth={8} /><path d="M 30 60 Q 120 20 220 70 Q 300 60 380 110 L 380 200 Q 280 230 200 200 Q 100 250 30 200 Z" fill="#e3d2a4" stroke={INK} strokeWidth={4} /><circle cx={300} cy={130} r={10} fill={C.red} /><circle cx={120} cy={110} r={10} fill={C.red} /><line x1={120} y1={110} x2={300} y2={130} stroke={C.red} strokeWidth={4} /></g>}
        {has('pinkwall') && Array.from({ length: 4 }).map((_, i) => <rect key={i} x={220 + i * 130} y={200 + (i % 2) * 40} width={110} height={150} fill="#f6d5c0" stroke={INK} strokeWidth={6} transform={`rotate(${i * 3 - 4} ${270 + i * 130} 270)`} />)}
        {has('keypad') && <g stroke={INK} strokeWidth={8}><rect x={1420} y={200} width={300} height={640} fill="#3a4055" /><circle cx={1460} cy={540} r={14} fill="#8d93a6" /><rect x={1330} y={420} width={60} height={100} fill="#22252f" /><circle cx={1360} cy={445} r={9} fill={C.red} opacity={0.5 + 0.5 * (Math.floor(f / 10) % 2)} stroke="none" /></g>}
        {p.plate && <g><rect x={700} y={110} width={520} height={84} fill="#12303a" stroke={INK} strokeWidth={8} /><T x={960} y={170} s={p.plate.length > 16 ? 36 : 50} c={C.gold} a="middle" ls={6}>{p.plate}</T></g>}
        {has('clock') && <g transform="translate(860 300)" stroke={INK} strokeWidth={7}><circle r={62} fill="#fff" /><line x1={0} y1={0} x2={0} y2={-42} transform={`rotate(${f * 14})`} /><line x1={0} y1={0} x2={26} y2={0} transform={`rotate(${f * 1.2})`} /></g>}
      </Layer>
      <Layer>
        <rect x={-400} y={880} width={W + 800} height={500} fill={day ? '#8a7a62' : '#171c33'} />
        {p.who2 && <Bean {...LOOKS[p.who2]} x={p.who2x ?? 420} y={950} s={1.6} f={f} seed={3} look={[1, 0]} lit={1} {...(p.face2 ?? {})} />}
        <g stroke={INK} strokeWidth={9} strokeLinejoin="round"><path d="M 760 900 L 760 520 Q 760 440 860 440 L 1060 440 Q 1160 440 1160 520 L 1160 900 Z" fill="#3a2b25" /></g>
        {p.who && <Bean {...LOOKS[p.who]} x={960} y={1010} s={1.95} f={f} seed={2} legs={false} lit={-1} {...(p.face ?? {})} />}
        <DeskSide x={300} w={1320} />
        {!has('nolamp') && <Lamp x={500} />}
        {has('monitor') && <Monitor x={1330} f={f} col={p.screenC} kids={p.screen ? <text x={1330} y={640} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={26} fill={p.screenC ?? '#58e07a'}>{p.screen}</text> : undefined} />}
        {has('crt') && <Monitor x={1330} f={f} crt />}
        {has('papers') && <g stroke={INK} strokeWidth={6}>{[0, 1, 2].map((i) => <rect key={i} x={700 + i * 16} y={724 - i * 12} width={220} height={36} fill={C.paper} transform={`rotate(${i * 3 - 3} 800 740)`} />)}</g>}
        {has('pink') && <g stroke={INK} strokeWidth={6}>{[0, 1].map((i) => <rect key={i} x={690 + i * 20} y={722 - i * 12} width={240} height={38} fill="#f6d5c0" transform={`rotate(${i * 4 - 3} 800 740)`} />)}</g>}
        {has('stack') && <g stroke={INK} strokeWidth={5}>{Array.from({ length: 10 }).map((_, i) => <g key={i}><rect x={640 + (i % 2) * 6} y={736 - i * 24} width={230} height={24} fill={C.paper} /><path d={`M ${800 + (i % 2) * 6} ${748 - i * 24} l 10 8 l 20 -18`} fill="none" stroke={C.greenD} strokeWidth={5} /></g>)}</g>}
        {has('phone') && <g stroke={INK} strokeWidth={7}><rect x={1050} y={722} width={120} height={38} rx={8} fill="#22252f" /><path d="M 1056 716 q 54 -30 108 0" fill="none" strokeWidth={12} /></g>}
        {has('cable') && <g stroke={INK} strokeWidth={7} fill="none"><path d="M 1450 800 q 60 60 30 130" /><rect x={1466} y={926} width={30} height={22} fill="#8d93a6" /><path d="M 1560 960 l 26 0" stroke={C.red} strokeWidth={9} /><path d="M 1540 940 l 60 40 M 1600 940 l -60 40" stroke={C.red} strokeWidth={7} /></g>}
        {p.plate2 && <g><rect x={840} y={690} width={400} height={70} fill="#161821" stroke={INK} strokeWidth={8} /><T x={1040} y={738} s={30} c={C.gold} a="middle">{p.plate2}</T></g>}
        {has('box') && <g transform="translate(560 690)" stroke={INK} strokeWidth={6}><rect width={170} height={110} fill="#b98a55" /><line x1={0} y1={30} x2={170} y2={30} /></g>}
        {p.cast && <Cast list={p.cast} f={f} d={d} m={m} gy={960} />}
        {!day && <Night id={`of${(p.who ?? 'x')}${props.length}`} amt={p.dark ? 0.8 : 0.66} lights={lights} />}
        {day && <Night id={`ofd${p.who ?? 'x'}`} amt={0.18} tint="#3a2a10" lights={[{ x: 960, y: 500, r: 1100, ry: 700 }]} glow={0.08} />}
        {has('rec') && <g><rect x={90} y={70} width={W - 180} height={H - 140} fill="none" stroke="#fff" strokeWidth={5} opacity={0.7} /><circle cx={150} cy={130} r={16} fill={C.red} opacity={Math.floor(f / 10) % 2 ? 1 : 0.3} /><T x={180} y={144} s={40} c="#fff">REC</T></g>}
      </Layer>
      <Layer depth={1.15}>
        {p.tag && <NameTag f={f} at={typeof p.tagAt === 'number' ? p.tagAt : m[p.tagAt ?? 'tag'] ?? 10} x={p.tagX ?? 1150} y={p.tagY ?? 600} name={p.tag[0]} sub={p.tag[1]} to={[1060, 560]} color={p.tagC} />}
        {p.bubble && <Bubble f={f} at={m.bubble ?? 8} x={p.bubbleX ?? 1080} y={p.bubbleY ?? 250} text={p.bubble} />}
        {p.loc && <LocTag f={f} at={8} text={p.loc} />}
        {p.stamp && <Stamp f={f} at={m.stamp ?? Math.round(d * 0.5)} x={960} y={520} text={p.stamp} size={110} rot={-10} />}
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ a night street with buildings and a cast
const Sky: React.FC<{ id: string; a?: string; b?: string }> = ({ id, a = '#070b1f', b = '#26356b' }) => (
  <g><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs><rect x={-400} y={-300} width={W + 800} height={H + 600} fill={`url(#${id})`} /></g>
);
const Stars: React.FC<{ f: number; n?: number }> = ({ f, n = 50 }) => (
  <g fill="#dfe8ff">{Array.from({ length: n }).map((_, i) => { const r = (k: number) => { const v = Math.sin((i + 1) * 47.3 * k) * 9341.7; return v - Math.floor(v); }; return <circle key={i} cx={r(1) * W * 1.2 - 100} cy={r(2) * 480} r={1.5 + r(3) * 2} opacity={0.4 + 0.4 * Math.sin(f / 9 + i)} />; })}</g>
);
const Tower: React.FC<{ x: number; y: number; s?: number; on?: number; label?: string; col?: string }> = ({ x, y, s = 1, on = 1, label = 'WIRECARD', col = C.green }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-150} y={-620} width={300} height={620} fill="#1d2748" stroke={INK} strokeWidth={8} />
    {Array.from({ length: 11 }).map((_, j) => Array.from({ length: 5 }).map((__, i) => <rect key={`${i}${j}`} x={-126 + i * 53} y={-500 + j * 44} width={38} height={26} fill={(i * 3 + j * 5) % 4 ? '#ffd98a' : '#2c3766'} opacity={(i * 3 + j * 5) % 4 ? 0.12 + 0.88 * on : 1} />))}
    <rect x={-170} y={-610} width={340} height={84} fill="#0d1226" stroke={INK} strokeWidth={7} />
    <text x={0} y={-550} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={label.length > 9 ? 40 : 54} fill={col} letterSpacing={5} opacity={0.25 + 0.75 * on}>{label}</text>
    <rect x={-50} y={-110} width={100} height={110} fill="#ffd98a" stroke={INK} strokeWidth={7} opacity={0.3 + 0.7 * on} />
  </g>
);
/** p: { kind: tower|villa|sg|sea|moscow|tropic|station|bank1870|shack|ghost|plain, cast: CastP[], loc?, tag?, v?, on?, sign?, rain?, cctv?, stampText? } */
export const Street: React.FC<SP> = ({ f, d, m, p }) => {
  const kind = p.kind ?? 'plain';
  const v: [View, View] = Array.isArray(p.v) ? p.v : p.v === 'close' ? [[p.cx ?? 960, 700, 1.5], [p.cx ?? 960, 690, 1.64]] : p.v === 'pull' ? [[960, 560, 1.3], [960, 540, 1.0]] : [[930, 540, 1.0], [990, 530, 1.08]];
  const day = kind === 'tropic' || kind === 'shack99';
  const gy = 930;
  const on = p.on === 'off' ? lerp(f, [m.off ?? 10, (m.off ?? 10) + 16], [1, 0]) : 1;
  let lights: Light[] = [{ x: 960, y: 760, r: 760, ry: 380 }];
  return (
    <Cam f={f} d={d} v={v}>
      <Layer depth={0.15}>
        {day ? <Sky id={`sk${kind}`} a="#7fc4e8" b="#d9f0e8" /> : kind === 'sea' ? <Sky id="sksea" a="#060a1c" b="#1b2d5c" /> : <Sky id={`sk${kind}`} />}
        {!day && <Stars f={f} />}
        {!day && <circle cx={kind === 'villa' ? 300 : 1560} cy={170} r={56} fill="#f3efd9" />}
        {day && <circle cx={1500} cy={200} r={80} fill="#fff3b8" />}
      </Layer>
      <Layer depth={0.45}>
        {(kind === 'tower' || kind === 'plain' || kind === 'station' || kind === 'bank1870' || kind === 'ghost' || kind === 'fed' || kind === 'bbank' || kind === 'branch' || kind === 'casino') && [80, 380, 680, 1300, 1580, 1840].map((x, i) => <rect key={i} x={x} y={440 - (i * 71) % 160} width={210} height={700} fill="#141b3c" />)}
        {kind === 'moscow' && <g stroke={INK} strokeWidth={7}>
          <rect x={-200} y={640} width={2400} height={400} fill="#3a1418" />{Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-200 + i * 80} y={600} width={46} height={46} fill="#3a1418" />)}
          {[[520, 1.0, '#c8473f'], [760, 1.35, '#d8a23a'], [1020, 1.1, '#3f8fc8'], [1240, 0.9, '#4aa86a']].map(([x, s, c]: any, i) => <g key={i} transform={`translate(${x} 640) scale(${s})`}><rect x={-46} y={-220} width={92} height={220} fill="#e9e1cf" /><path d="M -60 -220 Q -76 -300 0 -350 Q 76 -300 60 -220 Z" fill={c} /><line x1={0} y1={-350} x2={0} y2={-400} /><line x1={-14} y1={-384} x2={14} y2={-384} /></g>)}
          <g transform="translate(1560 640)"><rect x={-50} y={-360} width={100} height={360} fill="#8a2a2a" /><path d="M -60 -360 L 0 -480 L 60 -360 Z" fill="#2f6f4a" /><circle cx={0} cy={-500} r={16} fill={C.red} /></g>
        </g>}
        {kind === 'sea' && <g><rect x={-400} y={620} width={W + 800} height={500} fill="#0e1c40" />{Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M ${-200 + i * 170 + Math.sin(f / 12 + i) * 20} ${680 + (i % 3) * 50} q 40 -14 80 0 q 40 14 80 0`} fill="none" stroke="#cfe0ff" strokeWidth={4} opacity={0.25} />)}</g>}
        {kind === 'tropic' && <g><path d="M -400 760 Q 400 600 1000 700 Q 1600 620 2400 740 L 2400 1200 L -400 1200 Z" fill="#6fb37a" /></g>}
      </Layer>
      <Layer>
        <rect x={-400} y={gy - 30} width={W + 800} height={600} fill={day ? '#c9b98a' : kind === 'sea' ? '#2a2f44' : '#1b2140'} /><rect x={-400} y={gy - 30} width={W + 800} height={12} fill={day ? '#a8976a' : '#0e1228'} />
        {kind === 'tower' && <Tower x={p.tx ?? 960} y={gy - 26} s={1.12} on={on} label={p.sign} />}
        {kind === 'sg' && <g><rect x={560} y={300} width={800} height={600} fill="#27344d" stroke={INK} strokeWidth={10} />{Array.from({ length: 4 }).map((_, j) => Array.from({ length: 6 }).map((__, i) => <rect key={`${i}${j}`} x={600 + i * 124} y={340 + j * 110} width={90} height={70} fill={(i + j) % 3 ? '#ffd98a' : '#1b2440'} stroke={INK} strokeWidth={5} />))}
          <rect x={800} y={690} width={320} height={210} fill="#ffd98a" stroke={INK} strokeWidth={9} /><rect x={700} y={600} width={520} height={74} fill="#0d1226" stroke={INK} strokeWidth={8} /><T x={960} y={654} s={46} c={C.green} a="middle" ls={4}>{p.sign ?? 'WIRECARD ASIA'}</T></g>}
        {kind === 'villa' && <g stroke={INK} strokeWidth={9} strokeLinejoin="round">
          <rect x={120} y={430} width={620} height={470} fill="#d9cdb4" /><path d="M 90 430 L 430 250 L 770 430 Z" fill="#7a3a30" />
          {[190, 380, 570].map((x) => <rect key={x} x={x} y={520} width={100} height={140} fill="#ffd98a" />)}<rect x={380} y={730} width={110} height={170} fill="#5c4130" />
          {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={80 + i * 90} y1={800} x2={80 + i * 90} y2={900} strokeWidth={7} />)}<line x1={60} y1={810} x2={820} y2={810} strokeWidth={7} />
          <rect x={1160} y={380} width={640} height={520} fill="#b8b2a4" /><rect x={1160} y={340} width={640} height={46} fill="#8a8578" />
          {[1220, 1400, 1580].map((x) => <rect key={x} x={x} y={450} width={110} height={150} fill="#27306a" />)}<rect x={1420} y={700} width={130} height={200} fill="#3a2b25" />
          <line x1={1100} y1={900} x2={1100} y2={260} /><g strokeWidth={5}><rect x={1100} y={270} width={170} height={36} fill="#fff" /><rect x={1100} y={306} width={170} height={36} fill="#2a4fb0" /><rect x={1100} y={342} width={170} height={36} fill="#c8372f" /></g>
          <rect x={1580} y={720} width={190} height={66} fill="#12303a" strokeWidth={6} /><text x={1675} y={764} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={26} fill={C.gold} stroke="none" letterSpacing={2}>CONSULATE</text>
        </g>}
        {kind === 'sea' && <g stroke={INK} strokeWidth={9} strokeLinejoin="round">
          <rect x={620} y={420} width={680} height={480} fill="#b9a98c" /><path d="M 590 420 L 960 250 L 1330 420 Z" fill="#4a3a52" />
          {[680, 900, 1120].map((x) => <rect key={x} x={x} y={480} width={120} height={130} fill={x === 900 ? '#ffd98a' : '#27306a'} />)}{[680, 1120].map((x) => <rect key={x} x={x} y={690} width={120} height={130} fill="#27306a" />)}
          <rect x={900} y={700} width={120} height={200} fill="#5c4130" /><rect x={760} y={640} width={400} height={56} fill="#12303a" strokeWidth={6} /><text x={960} y={680} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={34} fill={C.gold} stroke="none" letterSpacing={4}>GUEST HOUSE</text>
          <g transform="translate(1480 820)"><rect x={-150} y={-90} width={300} height={110} rx={14} fill="#e9edf5" /><rect x={-150} y={-40} width={300} height={26} fill="#2a4fb0" /><circle cx={-90} cy={26} r={26} fill="#22252f" /><circle cx={90} cy={26} r={26} fill="#22252f" /><rect x={-20} y={-116} width={40} height={24} fill={Math.floor(f / 6) % 2 ? '#3b6ee0' : C.red} /></g>
        </g>}
        {kind === 'tropic' && <g stroke={INK} strokeWidth={9} strokeLinejoin="round">
          <rect x={620} y={520} width={620} height={380} fill="#f2e2b8" /><path d="M 570 520 L 930 350 L 1290 520 Z" fill="#b8553f" />
          <rect x={700} y={600} width={130} height={120} fill="#bfe3f2" /><rect x={1030} y={600} width={130} height={120} fill="#bfe3f2" /><rect x={880} y={680} width={110} height={220} fill="#7a4a30" />
          <path d="M 1500 900 Q 1490 640 1540 480" fill="none" strokeWidth={22} stroke="#7a5a3a" />{[-70, -30, 20, 60, 100].map((a, i) => <path key={i} d={`M 1540 480 q ${Math.cos(a / 57) * 120} ${-Math.sin((a + 40) / 57) * 60 - 20} ${Math.cos(a / 57) * 210} ${40 - Math.sin(a / 57) * 60}`} fill="none" stroke="#3f8f52" strokeWidth={22} strokeLinecap="round" />)}
          <rect x={420} y={760} width={90} height={130} fill="#cfc6ad" strokeWidth={6} /><text x={465} y={830} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={22} fill={INK} stroke="none">No. 12</text>
        </g>}
        {kind === 'station' && <g stroke={INK} strokeWidth={9}>
          <rect x={-400} y={200} width={W + 800} height={700} fill="#3a4258" />{Array.from({ length: 14 }).map((_, i) => <line key={i} x1={-300 + i * 190} x2={-300 + i * 190} y1={200} y2={900} strokeWidth={5} opacity={0.4} />)}
          <rect x={720} y={250} width={480} height={600} fill={C.paper} /><rect x={720} y={250} width={480} height={110} fill={C.red} /><text x={960} y={332} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={80} fill="#fff" stroke="none" letterSpacing={10}>WANTED</text>
          <text x={960} y={770} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={50} fill={INK} stroke="none" letterSpacing={3}>JAN MARSALEK</text><text x={960} y={822} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={30} fill="#6b6250" stroke="none" letterSpacing={3}>FRAUD · €1.9 BILLION</text>
          <rect x={300} y={300} width={260} height={150} fill="#12303a" /><text x={430} y={390} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={40} fill={C.gold} stroke="none">GLEIS 4</text>
        </g>}
        {kind === 'station' && <Photo x={845} y={385} who="mars" w={230} id="wanted" />}
        {kind === 'bank1870' && <g stroke={INK} strokeWidth={9} strokeLinejoin="round">
          <path d="M 520 420 L 960 240 L 1400 420 Z" fill="#c9ccd6" /><rect x={540} y={420} width={840} height={56} fill="#aeb2bf" />{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={590 + i * 140} y={476} width={70} height={380} fill="#d9dce4" />)}<rect x={500} y={856} width={920} height={48} fill="#aeb2bf" />
          <text x={960} y={462} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={40} fill={INK} stroke="none" letterSpacing={6}>COMMERZBANK · EST. 1870</text>
        </g>}
        {kind === 'fed' && <g stroke={INK} strokeWidth={9} strokeLinejoin="round">
          <rect x={420} y={300} width={1080} height={600} fill="#8f8a7c" />{Array.from({ length: 5 }).map((_, r) => Array.from({ length: 9 }).map((__, i) => <rect key={`${r}${i}`} x={470 + i * 114} y={350 + r * 96} width={62} height={62} fill={(r * 3 + i) % 4 ? '#ffd98a' : '#3a4055'} strokeWidth={5} />))}
          <rect x={860} y={740} width={200} height={160} fill="#3a2b25" /><path d="M 860 740 q 100 -90 200 0 Z" fill="#5c4130" />
          <rect x={560} y={236} width={800} height={70} fill="#12303a" strokeWidth={7} /><text x={960} y={286} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={38} fill={C.gold} stroke="none" letterSpacing={4}>FEDERAL RESERVE BANK OF NEW YORK</text>
          <line x1={1560} y1={900} x2={1560} y2={330} /><g strokeWidth={4}>{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={1560} y={340 + i * 16} width={170} height={16} fill={i % 2 ? '#fff' : '#c8372f'} />)}<rect x={1560} y={340} width={70} height={48} fill="#2a4fb0" /></g>
        </g>}
        {kind === 'bbank' && <g stroke={INK} strokeWidth={9} strokeLinejoin="round">
          <rect x={700} y={180} width={520} height={720} fill="#39506e" />{Array.from({ length: 10 }).map((_, r) => Array.from({ length: 6 }).map((__, i) => <rect key={`${r}${i}`} x={734 + i * 78} y={250 + r * 58} width={50} height={34} fill={r === 1 && p.floor ? (i === 2 ? '#ff6b6b' : '#ffd98a') : (r * 5 + i * 3) % 4 ? '#ffd98a' : '#27306a'} strokeWidth={4} opacity={p.asleep ? ((r * 5 + i * 3) % 7 ? 0.25 : 1) : 1} />))}
          <rect x={660} y={150} width={600} height={70} fill="#12303a" strokeWidth={7} /><text x={960} y={200} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={42} fill={C.gold} stroke="none" letterSpacing={5}>BANGLADESH BANK</text>
          <rect x={900} y={780} width={120} height={120} fill="#ffd98a" />
          {p.floor && <g strokeWidth={5}><line x1={1220} y1={325} x2={1340} y2={325} /><rect x={1340} y={296} width={250} height={58} fill="#0c0e16" /><text x={1465} y={336} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={30} fill="#fff" stroke="none" letterSpacing={3}>10TH FLOOR</text></g>}
        </g>}
        {kind === 'branch' && <g stroke={INK} strokeWidth={9} strokeLinejoin="round">
          <rect x={560} y={440} width={800} height={460} fill="#d9cdb4" /><rect x={520} y={400} width={880} height={56} fill="#8a2a2a" />
          <rect x={640} y={560} width={260} height={220} fill={p.closed ? '#27306a' : '#ffd98a'} /><rect x={1040} y={600} width={150} height={300} fill="#5c4130" />
          <rect x={700} y={470} width={520} height={64} fill="#12303a" strokeWidth={6} /><text x={960} y={516} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={40} fill={C.gold} stroke="none" letterSpacing={5}>BANK · MAKATI BRANCH</text>
          <line x1={300} y1={900} x2={300} y2={420} /><g strokeWidth={6}><rect x={170} y={430} width={300} height={74} rx={8} fill="#1f7a3a" /><text x={320} y={482} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={42} fill="#fff" stroke="none" letterSpacing={4}>JUPITER ST</text></g>
          {p.lanterns && [620, 820, 1020, 1220, 1340].map((x, i) => <g key={i} strokeWidth={5}><line x1={x} y1={456} x2={x} y2={500 + (i % 2) * 20} /><ellipse cx={x} cy={530 + (i % 2) * 20} rx={26} ry={32} fill="#d8433b" /><rect x={x - 10} y={560 + (i % 2) * 20} width={20} height={12} fill={C.gold} /></g>)}
          {p.closed && <g transform="translate(1115 720) rotate(-6)" strokeWidth={5}><rect x={-70} y={-30} width={140} height={60} fill={C.paper} /><text y={12} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={34} fill={C.red} stroke="none">CLOSED</text></g>}
        </g>}
        {kind === 'casino' && <g stroke={INK} strokeWidth={9} strokeLinejoin="round">
          <rect x={380} y={300} width={1160} height={600} fill="#2a1638" />{Array.from({ length: 4 }).map((_, r) => Array.from({ length: 12 }).map((__, i) => <rect key={`${r}${i}`} x={420 + i * 92} y={420 + r * 86} width={56} height={50} fill={(r + i) % 3 ? '#ffd98a' : '#4a2a66'} strokeWidth={4} />))}
          <rect x={560} y={210} width={800} height={150} rx={20} fill="#16081f" /><text x={960} y={318} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={120} fill={Math.floor(f / 8) % 2 ? '#ff5fa8' : '#ffd24a'} stroke="none" letterSpacing={18}>CASINO</text>
          {Array.from({ length: 16 }).map((_, i) => <circle key={i} cx={585 + i * 50} cy={376} r={9} fill={(i + Math.floor(f / 5)) % 2 ? '#ffd24a' : '#ff5fa8'} strokeWidth={3} />)}
          <rect x={860} y={700} width={200} height={200} fill="#ffd98a" /><path d="M 800 700 L 1120 700 L 1090 640 L 830 640 Z" fill="#b8433a" />
        </g>}
        {kind === 'shack' && <g stroke={INK} strokeWidth={9} strokeLinejoin="round"><rect x={780} y={640} width={300} height={260} fill="#6a5a4a" /><path d="M 750 640 L 930 540 L 1110 640 Z" fill="#4a3a30" /><rect x={880} y={760} width={90} height={140} fill="#3a2b25" /><rect x={800} y={680} width={60} height={60} fill="#ffd98a" />
          <g transform={`translate(1180 ${520 + Math.sin(f / 8) * 6}) rotate(8)`}><path d="M 0 0 L -60 -70" /><path d="M -40 0 L 60 -50 L 420 -50 L 420 110 L 60 110 Z" fill={C.paper} /><circle cx={30} cy={30} r={12} fill={C.woodD} /><text x={240} y={56} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={70} fill={C.red} stroke="none">€340 M</text></g></g>}
        {kind === 'ghost' && <g stroke={INK} strokeWidth={9} strokeLinejoin="round"><rect x={660} y={380} width={600} height={520} fill="#39415e" /><rect x={880} y={620} width={160} height={280} fill="#22252f" /><rect x={740} y={470} width={440} height={80} fill="#12303a" /><text x={960} y={528} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={40} fill="#8d93a6" stroke="none" letterSpacing={4}>PARTNER OFFICE</text>
          <path d="M 880 620 q 80 40 160 0 M 880 620 l 60 80 M 1040 620 l -50 90 M 900 660 q 60 20 120 0" fill="none" strokeWidth={3} stroke="#cfd6e3" opacity={0.6} /><text x={960} y={800} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={170} fill="#fff" stroke="none" opacity={0.8}>?</text></g>}
        {p.lamp && <g stroke={INK} strokeWidth={8}><line x1={p.lamp} y1={gy - 30} x2={p.lamp} y2={380} /><path d={`M ${p.lamp} 380 q 0 -40 60 -40`} fill="none" /><rect x={p.lamp + 50} y={326} width={70} height={26} fill="#ffd98a" /></g>}
        <Cast list={p.cast ?? []} f={f} d={d} m={m} gy={gy} />
        {!day && <Night id={`st${kind}${(p.cast ?? []).length}`} amt={p.dark ?? 0.56} lights={[...((p.cast ?? []).length ? [{ x: (p.cast as CastP[]).reduce((a: number, c: CastP) => a + (c.walk ? (c.walk[0] + c.walk[1]) / 2 : c.x), 0) / p.cast.length, y: 780, r: 460, ry: 320, power: 0.75 }] : []), ...(p.lights ?? (kind === 'tower' ? [{ x: p.tx ?? 960, y: 820, r: 560, ry: 300 }, { x: p.tx ?? 960, y: 300, r: 380, color: p.signC ?? C.green, power: 0.25 + 0.75 * on }] : kind === 'villa' ? [{ x: 430, y: 640, r: 520 }, { x: 1480, y: 600, r: 520, power: 0.7 }, { x: 960, y: 860, r: 420, ry: 200 }] : kind === 'sea' ? [{ x: 960, y: 640, r: 560 }, { x: 1480, y: 760, r: 380, color: Math.floor(f / 6) % 2 ? '#6f8cff' : '#ff6b6b' }] : p.lamp ? [{ x: p.lamp + 80, y: 640, r: 460, ry: 520 }, { x: 960, y: 800, r: 600, ry: 260, power: 0.5 }] : kind === 'moscow' ? [{ x: 960, y: 520, r: 1000, ry: 460, power: 0.85 }] : kind === 'fed' || kind === 'bbank' || kind === 'branch' ? [{ x: 960, y: 560, r: 900, ry: 520, power: 0.9 }] : kind === 'casino' ? [{ x: 960, y: 480, r: 900, ry: 520, color: '#ffb0e0' }] : lights))]} />}
        {(p.rain ?? (!day && kind !== 'station')) && <Rain f={f} op={0.14} n={60} />}
        {p.cctv && <g><rect x={80} y={60} width={W - 160} height={H - 120} fill="none" stroke="#fff" strokeWidth={5} opacity={0.7} /><circle cx={140} cy={120} r={16} fill={C.red} opacity={Math.floor(f / 10) % 2 ? 1 : 0.3} /><T x={170} y={134} s={40} c="#fff">REC</T><T x={W - 120} y={134} s={36} c="#fff" a="end">{p.cctv}</T></g>}
      </Layer>
      <Layer depth={1.15}>
        {p.loc && <LocTag f={f} at={8} text={p.loc} />}
        {p.tag && <NameTag f={f} at={m.tag ?? 10} x={p.tagX ?? 1100} y={p.tagY ?? 420} name={p.tag[0]} sub={p.tag[1]} to={p.tagTo ?? [1000, 560]} color={p.tagC} />}
        {p.stamp && <Stamp f={f} at={m.stamp ?? Math.round(d * 0.5)} x={p.stampX ?? 960} y={p.stampY ?? 420} text={p.stamp} size={120} rot={-10} />}
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ people at a table (restaurant, bar, meeting room)
/** p: { kind: lunch|bar|audit|news, left: CastP[], right: CastP[], docs?: boolean, loc?, v?, bubble? ... } */
export const Table: React.FC<SP> = ({ f, d, m, p }) => {
  const kind = p.kind ?? 'lunch';
  const v: [View, View] = Array.isArray(p.v) ? p.v : p.v === 'l' ? [[640, 560, 1.6], [660, 550, 1.75]] : p.v === 'r' ? [[1320, 560, 1.6], [1300, 550, 1.75]] : p.v === 'doc' ? [[960, 760, 2.2], [960, 750, 2.5]] : p.v === 'pull' ? [[960, 560, 1.3], [960, 540, 1.0]] : [[960, 540, 1.0], [960, 530, 1.09]];
  const wall = kind === 'audit' ? '#2a3147' : kind === 'bar' ? '#2a1820' : kind === 'casino' ? '#2a1232' : '#4a2f22';
  return (
    <Cam f={f} d={d} v={v} bg={wall}>
      <Layer depth={0.6}>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill={wall} />
        {kind !== 'audit' && Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-300 + i * 220} y={120} width={180} height={520} fill={kind === 'bar' ? '#3a2029' : '#5a3a28'} stroke="#33201a" strokeWidth={8} />)}
        {kind === 'lunch' && [420, 960, 1500].map((x) => <g key={x}><rect x={x - 16} y={240} width={32} height={50} fill={C.gold} stroke={INK} strokeWidth={5} /><path d={`M ${x - 40} 240 L ${x + 40} 240 L ${x + 24} 180 L ${x - 24} 180 Z`} fill="#ffd98a" stroke={INK} strokeWidth={5} /></g>)}
        {kind === 'bar' && <g stroke={INK} strokeWidth={7}><rect x={520} y={160} width={880} height={300} fill="#1b1016" />{Array.from({ length: 14 }).map((_, i) => <rect key={i} x={550 + i * 60} y={250 - ((i * 37) % 60)} width={30} height={110 + ((i * 37) % 60)} rx={8} fill={['#c98a3a', '#4aa86a', '#b8433a', '#d9dce4'][i % 4]} strokeWidth={4} />)}<line x1={520} y1={362} x2={1400} y2={362} /></g>}
        {kind === 'audit' && <g><rect x={300} y={150} width={620} height={380} fill="#e8e2d2" stroke={INK} strokeWidth={9} /><T x={610} y={250} s={50} a="middle">{p.head ?? 'SPECIAL AUDIT'}</T><T x={610} y={370} s={(p.board ?? 'Where is the money?').length > 14 ? 62 : 90} c={C.red} a="middle" hand>{p.board ?? 'Where is the money?'}</T>
          <g transform="translate(1400 330)" stroke={INK} strokeWidth={7}><circle r={80} fill="#fff" /><line x1={0} y1={0} x2={0} y2={-56} transform={`rotate(${f * (p.fast ? 30 : 3)})`} /><line x1={0} y1={0} x2={36} y2={0} transform={`rotate(${f * (p.fast ? 2.5 : 0.3)})`} /></g></g>}
      </Layer>
      <Layer>
        <rect x={-400} y={900} width={W + 800} height={500} fill={kind === 'audit' ? '#1a1f33' : '#1c0f0c'} />
        <Cast list={(p.left ?? []).map((c: CastP) => ({ s: 1.75, y: 950, legs: false, lit: 1, look: [1, 0] as [number, number], ...c }))} f={f} d={d} m={m} />
        <Cast list={(p.right ?? []).map((c: CastP) => ({ s: 1.75, y: 950, legs: false, lit: -1, flip: true, look: [1, 0] as [number, number], ...c }))} f={f} d={d} m={m} />
        {kind === 'lunch' ? <g stroke={INK} strokeWidth={9}><path d="M 500 800 Q 960 740 1420 800 L 1380 1200 L 540 1200 Z" fill="#f1e6cc" />
          <rect x={945} y={690} width={30} height={90} fill="#fff7d6" strokeWidth={6} /><path d={`M 960 690 q -14 -26 0 -${44 + Math.sin(f / 3) * 5} q 14 26 0 ${44 + Math.sin(f / 3) * 5}`} fill="#ffb347" strokeWidth={4} />
          {[700, 1220].map((x) => <g key={x} strokeWidth={6}><ellipse cx={x} cy={800} rx={90} ry={22} fill="#fff" /><path d={`M ${x + 120} 700 l 30 0 l -6 50 q -9 12 -18 0 Z`} fill="#b8433a" /><line x1={x + 135} y1={756} x2={x + 135} y2={800} /></g>)}</g>
          : kind === 'casino' ? <g stroke={INK} strokeWidth={9}><path d="M 300 800 Q 960 720 1620 800 L 1560 1200 L 360 1200 Z" fill="#1f6a45" /><path d="M 330 806 Q 960 730 1590 806" fill="none" stroke={C.gold} strokeWidth={6} />
            {Array.from({ length: 9 }).map((_, i) => { const t = ((f + i * 9) % 70) / 70; return <g key={i} transform={`translate(${520 + i * 110} ${840 + (i % 3) * 36})`} strokeWidth={4}>{[0, 1, 2, 3].map((k) => <ellipse key={k} cx={0} cy={-k * 9} rx={30} ry={11} fill={['#d8433b', '#3b6ee0', '#e2b441', '#fff'][(i + k) % 4]} />)}</g>; })}
            {[0, 1, 2].map((i) => { const t = ((f + i * 23) % 60) / 60; return <g key={i} transform={`translate(${700 + t * 520} ${790 - Math.sin(t * Math.PI) * 60})`} strokeWidth={4}><ellipse rx={26} ry={10} fill="#e2b441" /></g>; })}
            {[860, 930, 1000].map((x, i) => <rect key={x} x={x} y={770} width={52} height={74} rx={6} fill="#fff" strokeWidth={5} transform={`rotate(${i * 6 - 6} ${x + 26} 800)`} />)}</g>
          : <g stroke={INK} strokeWidth={9}><rect x={360} y={790} width={1200} height={60} fill={kind === 'audit' ? '#6a6f80' : C.wood} /><rect x={420} y={850} width={1080} height={300} fill={kind === 'audit' ? '#3a3f52' : C.woodD} /></g>}
        {p.docs && <g stroke={INK} strokeWidth={6}><rect x={840} y={760} width={150} height={44} fill={C.paper} transform="rotate(-6 915 780)" /><rect x={960} y={756} width={150} height={44} fill={C.paper} transform="rotate(5 1035 780)" /><text x={1036} y={790} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={22} fill={C.red} stroke="none" transform="rotate(5 1035 780)">SECRET</text></g>}
        {p.laptops && [640, 1280].map((x) => <g key={x} stroke={INK} strokeWidth={7}><rect x={x - 90} y={690} width={180} height={104} rx={8} fill="#22252f" /><rect x={x - 76} y={702} width={152} height={80} fill="#1c3f8a" opacity={0.7 + 0.2 * Math.sin(f / 6 + x)} strokeWidth={0} /><rect x={x - 110} y={792} width={220} height={12} fill="#3a4055" /></g>)}
        <Night id={`tb${kind}${(p.left ?? []).length}`} amt={kind === 'audit' ? 0.5 : 0.68} tint={kind === 'audit' ? '#070b18' : '#0c0508'} lights={[{ x: 960, y: 700, r: 820, ry: 520 }]} />
        {kind !== 'audit' && <Bokeh f={f} seed={3} n={8} color="#ffb070" />}
      </Layer>
      <Layer depth={1.15}>
        {p.loc && <LocTag f={f} at={8} text={p.loc} />}
        {p.tag && <NameTag f={f} at={m.tag ?? 10} x={p.tagX ?? 1100} y={p.tagY ?? 560} name={p.tag[0]} sub={p.tag[1]} to={p.tagTo} />}
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ a stage / podium / line-up under a spotlight
/** p: { kind: keynote|summit|spot|lineup|court|prison|dock, cast: CastP[], screen?: chart|text, text?, loc?, tag?, v?, crowd? } */
export const Stage: React.FC<SP> = ({ f, d, m, p }) => {
  const kind = p.kind ?? 'keynote';
  const v: [View, View] = Array.isArray(p.v) ? p.v : p.v === 'close' ? [[p.cx ?? 700, 620, 1.6], [p.cx ?? 700, 610, 1.75]] : p.v === 'pull' ? [[960, 560, 1.3], [960, 540, 1.0]] : kind === 'spot' ? [[p.cx ?? 960, 640, 1.45], [p.cx ?? 960, 630, 1.6]] : kind === 'summit' ? [[800, 600, 1.3], [800, 590, 1.42]] : [[960, 540, 1.0], [960, 530, 1.08]];
  const k = lerp(f, [6, d * 0.8], [0, 1], easeIO);
  const pts = [0.08, 0.12, 0.2, 0.26, 0.38, 0.5, 0.66, 0.84, 0.96];
  return (
    <Cam f={f} d={d} v={v}>
      <Layer depth={0.6}>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill={kind === 'court' || kind === 'dock' ? '#4a2f22' : kind === 'prison' ? '#2a2f3a' : kind === 'summit' ? '#5a1f22' : '#0e1228'} />
        {(kind === 'court' || kind === 'dock') && Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-300 + i * 220} y={120} width={180} height={520} fill="#5a3a28" stroke="#33201a" strokeWidth={8} />)}
        {kind === 'keynote' && <g><rect x={640} y={130} width={1100} height={560} fill="#0b1730" stroke={INK} strokeWidth={10} />
          {p.screen === 'text' ? <text x={1190} y={440} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={p.text.length > 12 ? 90 : 130} fill={C.green} letterSpacing={6}>{p.text}</text> : <g>
            <clipPath id="kn"><rect x={640} y={130} width={60 + k * 1040} height={560} /></clipPath>
            <path d={pts.map((y, i) => `${i ? 'L' : 'M'} ${720 + i * 118} ${640 - y * 440}`).join(' ')} fill="none" stroke={C.green} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" clipPath="url(#kn)" />
            <T x={700} y={210} s={44} c="#fff" ls={4}>{p.text ?? 'WIRECARD · REVENUE'}</T></g>}</g>}
        {kind === 'summit' && <g stroke={INK} strokeWidth={8}>
          <rect x={300} y={150} width={1320} height={110} fill="#8a2a2a" /><path d="M 240 150 L 1680 150 L 1600 80 L 320 80 Z" fill="#c9a23a" />{[420, 800, 1120, 1500].map((x) => <rect key={x} x={x - 30} y={260} width={60} height={500} fill="#8a2a2a" />)}
          {[[620, ['#111', '#c8372f', '#e9c23a']], [1300, ['#c8372f', '#c8372f', '#c8372f']]].map(([x, cols]: any, i) => <g key={i}><line x1={x} y1={840} x2={x} y2={330} /><g strokeWidth={4}>{cols.map((c: string, j: number) => <rect key={j} x={x} y={340 + j * 40} width={200} height={40} fill={c} />)}{i === 1 && <path d="M 1336 372 l 8 22 l 22 0 l -18 14 l 8 22 l -20 -14 l -20 14 l 8 -22 l -18 -14 l 22 0 Z" fill="#e9c23a" strokeWidth={0} />}</g></g>)}
        </g>}
        {kind === 'prison' && <g>{Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-200 + i * 300} y={150} width={220} height={150} fill="#1b1f2a" stroke={INK} strokeWidth={8} />)}</g>}
        {kind === 'lineup' && <g stroke="#fff" opacity={0.35} strokeWidth={5}>{Array.from({ length: 7 }).map((_, i) => <g key={i}><line x1={200} x2={1720} y1={260 + i * 90} y2={260 + i * 90} /><text x={150} y={272 + i * 90} fontFamily={LABEL} fontWeight={700} fontSize={30} fill="#fff" stroke="none">{190 - i * 10}</text></g>)}</g>}
        {(kind === 'court' || kind === 'dock') && <g transform="translate(960 250)" stroke={INK} strokeWidth={7}><path d="M -70 -90 L 70 -90 L 70 10 Q 0 90 -70 10 Z" fill={kind === 'dock' ? '#c9a23a' : '#b8433a'} /><path d="M -70 -40 L 70 -40" stroke={kind === 'dock' ? '#111' : C.gold} strokeWidth={14} /></g>}
      </Layer>
      <Layer>
        <rect x={-400} y={kind === 'keynote' ? 760 : 900} width={W + 800} height={600} fill={kind === 'keynote' ? '#1a2040' : kind === 'summit' ? '#7a2a2a' : kind === 'court' || kind === 'dock' ? '#2c1c15' : '#151a2c'} />
        {(kind === 'court' || kind === 'dock') && <g><Bean {...LOOKS.judge} x={960} y={740} s={1.5} f={f} seed={3} legs={false} look={[p.jlook ?? -1, 0.3]} />
          <g stroke={INK} strokeWidth={9} strokeLinejoin="round"><rect x={560} y={560} width={800} height={70} fill={C.wood} /><rect x={600} y={630} width={720} height={330} fill={C.woodD} /></g>
          <g stroke={INK} strokeWidth={9} strokeLinejoin="round"><rect x={1420} y={700} width={360} height={260} fill={C.woodD} /><rect x={1400} y={680} width={400} height={36} fill={C.wood} /></g><T x={1600} y={860} s={34} c={C.gold} a="middle" ls={4}>THE DOCK</T></g>}
        {kind === 'summit' && <g stroke={INK} strokeWidth={9}><rect x={860} y={700} width={200} height={240} fill="#3a2b25" /><rect x={840} y={680} width={240} height={30} fill={C.wood} /></g>}
        <Cast list={p.cast ?? []} f={f} d={d} m={m} gy={kind === 'keynote' ? 800 : 960} />
        {kind === 'prison' && <g>{Array.from({ length: 22 }).map((_, i) => <rect key={i} x={60 + i * 86} y={-100} width={22} height={1300} fill="#565b70" stroke={INK} strokeWidth={5} />)}<rect x={-100} y={520} width={2200} height={28} fill="#565b70" stroke={INK} strokeWidth={5} /></g>}
        {kind === 'keynote' && p.crowd !== false && <g fill="#0a0d1c">{Array.from({ length: 16 }).map((_, i) => <g key={i}><circle cx={60 + i * 122 + (i % 2) * 20} cy={1010 + (i % 3) * 16} r={58} /><rect x={10 + i * 122 + (i % 2) * 20} y={1050 + (i % 3) * 16} width={100} height={100} rx={40} /></g>)}</g>}
        <Night id={`sg${kind}${(p.cast ?? []).length}`} amt={kind === 'summit' ? 0.4 : kind === 'spot' || kind === 'lineup' ? 0.5 : 0.62} tint={kind === 'court' || kind === 'dock' ? '#0c0508' : '#070a1c'} lights={p.lights ?? (kind === 'keynote' ? [{ x: p.cx ?? 420, y: 560, r: 520, ry: 560 }, { x: 1190, y: 420, r: 700, ry: 400, color: C.green, power: 0.9 }] : kind === 'lineup' || kind === 'prison' ? [{ x: 960, y: 620, r: 1000, ry: 520, color: '#fff2d0' }] : kind === 'spot' ? [{ x: p.cx ?? 960, y: 640, r: 760, ry: 620, color: '#fff2d0' }] : kind === 'court' || kind === 'dock' ? [{ x: 960, y: 500, r: 440, ry: 380 }, { x: 1600, y: 620, r: 340, ry: 340, power: 0.95, color: '#fff2d0' }, { x: 420, y: 700, r: 380, power: 0.8 }] : [{ x: 960, y: 600, r: 1000, ry: 600 }])} />
        {p.q && <text x={1600} y={640} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={190} fill="#fff" opacity={0.75 + 0.2 * Math.sin(f / 6)}>?</text>}
      </Layer>
      <Layer depth={1.15}>
        {p.loc && <LocTag f={f} at={8} text={p.loc} />}
        {p.tag && <NameTag f={f} at={m.tag ?? 10} x={p.tagX ?? 1000} y={p.tagY ?? 520} name={p.tag[0]} sub={p.tag[1]} to={p.tagTo} color={p.tagC} />}
        {p.stamp && <Stamp f={f} at={m.stamp ?? Math.round(d * 0.5)} x={p.stampX ?? 960} y={p.stampY ?? 400} text={p.stamp} size={110} rot={-9} />}
      </Layer>
    </Cam>
  );
};

// ------------------------------------------------------------------ special inserts for this episode
/** The DAX board: 30 tiles. p: { mode: join|kick|collapse } */
export const Dax: React.FC<SP> = ({ f, d, m, p }) => {
  const names = ['AUTO', 'CHEM', 'BANK', 'INSUR', 'STEEL', 'PHARMA', 'TELE', 'POST', 'ENERGY', 'SOFT', 'AIR', 'TYRES', 'SPORT', 'GAS', 'RAIL', 'MEDIA', 'TECH', 'CARS', 'RETAIL', 'TOOLS', 'CEMENT', 'HEALTH', 'TRUCKS', 'POWER', 'CHIPS', 'LENS', 'FOOD', 'SHIPS', 'LABS', 'WIRECARD'];
  const at = m.go ?? 12;
  const k = lerp(f, [at, at + 14], [0, 1], easeIO);
  const mode = p.mode ?? 'join';
  return (
    <Cam f={f} d={d} v={mode === 'join' ? [[960, 540, 1.0], [1300, 760, 1.5]] : [[1300, 760, 1.5], [1300, 760, 1.7]]} ease bg="#070b18">
      <Layer>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#0a1022" />
        <T x={960} y={130} s={70} c="#fff" a="middle" ls={12}>DAX 30</T><T x={960} y={186} s={34} c="#8d93a6" a="middle" ls={6}>GERMANY'S THIRTY BIGGEST COMPANIES</T>
        {names.map((n, i) => {
          const x = 250 + (i % 6) * 240, y = 250 + Math.floor(i / 6) * 150, last = i === 29;
          const show = last ? (mode === 'join' ? k : 1) : 1;
          const dead = last && mode === 'collapse' ? lerp(f, [at, at + 10], [0, 1]) : 0;
          return <g key={i} transform={`translate(${x} ${y})`}>
            {last && mode !== 'collapse' && <g transform={`translate(${k * 420} ${k * 260}) rotate(${k * 24})`} opacity={1 - k * (mode === 'kick' ? 0.2 : 1)}><rect width={220} height={126} rx={10} fill="#39415e" stroke={INK} strokeWidth={7} /><text x={110} y={74} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={26} fill="#fff">COMMERZBANK</text></g>}
            <g opacity={show} transform={`translate(0 ${(1 - show) * -160})`}>
              <rect width={220} height={126} rx={10} fill={last ? (dead > 0.5 ? '#2a0d10' : '#0e3a22') : '#1d2a55'} stroke={last ? (dead > 0.5 ? C.red : C.green) : INK} strokeWidth={7} />
              <text x={110} y={76} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={last ? 36 : 34} fill={last ? (dead > 0.5 ? C.red : C.green) : '#cfd6ea'} letterSpacing={2}>{n}</text>
              {dead > 0 && <path d="M 30 0 L 80 50 L 60 70 L 120 126 M 150 0 L 130 60 L 170 90" fill="none" stroke={C.red} strokeWidth={6} opacity={dead} />}
            </g>
          </g>;
        })}
        <Night id="dax" amt={0.5} tint="#000" lights={[{ x: 1570, y: 910, r: 520, color: mode === 'collapse' ? C.red : C.green }, { x: 960, y: 500, r: 1100, ry: 600, power: 0.7, color: '#cfe0ff' }]} glow={0.12} />
        {p.stamp && <Stamp f={f} at={at + 12} x={1300} y={640} text={p.stamp} size={90} rot={-8} />}
      </Layer>
    </Cam>
  );
};

/** A spreadsheet where only the totals can be read. p: { title, total, clear?: boolean, pink?: boolean } */
export const Sheet: React.FC<SP> = ({ f, d, p }) => (
  <Cam f={f} d={d} v={[[960, 480, 1.0], [960, 720, 1.35]]} ease bg="#0a0f22">
    <Layer>
      <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#101733" />
      <rect x={270} y={90} width={1400} height={920} fill="#000" opacity={0.35} /><rect x={260} y={80} width={1400} height={920} fill={p.pink ? '#f8d8c2' : '#f4f6fb'} stroke={INK} strokeWidth={9} />
      <rect x={260} y={80} width={1400} height={90} fill="#1f7a3a" stroke={INK} strokeWidth={9} /><T x={300} y={142} s={48} c="#fff" ls={3}>{p.title}</T>
      {Array.from({ length: 9 }).map((_, r) => <g key={r}>
        <line x1={260} x2={1660} y1={250 + r * 74} y2={250 + r * 74} stroke="#b8bfd0" strokeWidth={3} />
        {[0, 1, 2, 3].map((c) => p.clear ? <text key={c} x={300 + c * 340} y={226 + r * 74} fontFamily={LABEL} fontWeight={700} fontSize={34} fill={INK}>{c === 0 ? `Customer ${((r * 37) % 90) + 10}` : `${((r * 53 + c * 91) % 900) + 100},${(r * 7 + c * 3) % 10}00`}</text>
          : <rect key={c} x={300 + c * 340} y={198 + r * 74} width={170 + ((r * 37 + c * 53) % 110)} height={30} rx={8} fill="#8d93a6" opacity={0.5} filter="url(#blurS)" />)}
      </g>)}
      <defs><filter id="blurS"><feGaussianBlur stdDeviation="6" /></filter></defs>
      {[1, 2, 3].map((c) => <line key={c} x1={260 + c * 340 + 20} x2={260 + c * 340 + 20} y1={170} y2={1000} stroke="#b8bfd0" strokeWidth={3} />)}
      <rect x={260} y={900} width={1400} height={100} fill="#d9f2df" stroke={INK} strokeWidth={9} /><T x={300} y={968} s={54}>TOTAL</T><T x={1620} y={968} s={60} c={C.greenD} a="end">{p.total}</T>
      <Night id="sheet" amt={0.4} lights={[{ x: 960, y: 760, r: 1000, ry: 560 }]} glow={0.1} />
    </Layer>
  </Cam>
);

/** Two old computer screens: the first customers. p: {} */
export const Sites: React.FC<SP> = ({ f, d, m }) => {
  const a = m.gamble ?? 10, b = m.adult ?? 40;
  return (
    <Cam f={f} d={d} v={[[960, 540, 1.0], [960, 530, 1.1]]} bg="#141a33">
      <Layer depth={0.6}><rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#1d2444" /></Layer>
      <Layer>
        <rect x={-400} y={860} width={W + 800} height={500} fill="#3a2b25" stroke={INK} strokeWidth={9} />
        {[[520, a, 'gamble'], [1400, b, 'adult']].map(([x, at, k]: any) => <g key={k} opacity={f >= at ? 1 : 0.6}>
          <g stroke={INK} strokeWidth={9} strokeLinejoin="round"><rect x={x - 60} y={800} width={120} height={60} fill="#b8b09a" /><rect x={x - 290} y={300} width={580} height={500} rx={44} fill="#cfc6ad" /><rect x={x - 240} y={346} width={480} height={380} rx={26} fill={k === 'gamble' ? '#0f4a2a' : '#4a1028'} /></g>
          {k === 'gamble' ? <g transform={`translate(${x} 536)`}><g transform={`rotate(${f * 5})`} stroke={INK} strokeWidth={5}><circle r={120} fill="#7a1f22" />{Array.from({ length: 12 }).map((_, i) => <path key={i} d="M 0 0 L 120 0 A 120 120 0 0 1 104 60 Z" fill={i % 2 ? '#111' : '#c8372f'} transform={`rotate(${i * 30})`} />)}<circle r={34} fill={C.gold} /></g><circle cx={0} cy={-98} r={12} fill="#fff" stroke={INK} strokeWidth={4} /><text y={176} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={44} fill={C.gold} letterSpacing={6}>CASINO</text></g>
            : <g transform={`translate(${x} 536)`}><circle r={120} fill="none" stroke="#ff6b8a" strokeWidth={16} /><text y={36} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={110} fill="#ff6b8a">18+</text><text y={176} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={40} fill="#ff6b8a" letterSpacing={6}>ADULTS ONLY</text></g>}
          {f >= at && [0, 1, 2].map((i) => { const t = ((f - at + i * 12) % 36) / 36; return <g key={i} transform={`translate(${x + (960 - x) * t} ${300 - Math.sin(t * Math.PI) * 130 - 30})`}><circle r={22} fill={C.green} stroke={INK} strokeWidth={5} /><text y={10} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={28} fill={INK}>€</text></g>; })}
        </g>)}
        <g transform="translate(960 250)"><rect x={-150} y={-60} width={300} height={110} rx={12} fill="#0e3a22" stroke={C.green} strokeWidth={7} /><text y={14} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={46} fill={C.green} letterSpacing={4}>{p.box ?? 'WIRECARD'}</text></g>
        <Night id="sites" amt={0.42} lights={[{ x: 520, y: 540, r: 480, color: '#7dffa0', power: f >= a ? 1 : 0.6 }, { x: 1400, y: 540, r: 480, color: '#ff8fb0', power: f >= b ? 1 : 0.6 }, { x: 960, y: 250, r: 300, color: C.green }]} />
      </Layer>
    </Cam>
  );
};

/** The seized spy kit, from above. p: {} */
export const Gadgets: React.FC<SP> = ({ f, d, m }) => {
  const a = m.cams ?? 6, b = m.pass ?? 50;
  const item = (at: number, x: number, y: number, kid: React.ReactNode, label: string) => f < at ? null : (
    <g transform={`translate(${x} ${y}) scale(${lerp(f, [at, at + 6], [2.2, 1.45], easeOut)})`} opacity={lerp(f, [at, at + 4], [0, 1])}>{kid}
      <g transform="translate(-70 120)"><rect width={label.length * 17 + 30} height={42} fill={C.paper} stroke={INK} strokeWidth={4} /><text x={15} y={30} fontFamily={LABEL} fontWeight={700} fontSize={26} fill={INK}>{label}</text></g></g>
  );
  return (
    <Cam f={f} d={d} v={[[960, 540, 1.0], [960, 540, 1.1]]} bg="#2a2f3a">
      <Layer>
        <rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#3a3f4a" /><rect x={100} y={80} width={1720} height={920} fill="#565b68" stroke={INK} strokeWidth={10} />
        {item(a, 360, 330, <g stroke={INK} strokeWidth={6}><path d="M -30 -110 L 30 -110 L 16 -70 L 50 90 L 0 130 L -50 90 L -16 -70 Z" fill="#7a2f2a" /><circle cx={0} cy={-20} r={10} fill="#111" /><circle cx={0} cy={-20} r={4} fill="#6fb6ff" stroke="none" /></g>, 'EXHIBIT 1 · TIE')}
        {item(a + 8, 760, 330, <g stroke={INK} strokeWidth={6}><rect x={-34} y={-90} width={68} height={190} rx={18} fill="rgba(160,210,240,0.8)" /><rect x={-20} y={-120} width={40} height={34} fill="#3b6ee0" /><rect x={-34} y={-20} width={68} height={50} fill="#fff" /><circle cx={0} cy={5} r={8} fill="#111" /></g>, 'EXHIBIT 2 · BOTTLE')}
        {item(a + 16, 1160, 330, <g stroke={INK} strokeWidth={6}><rect x={-70} y={-60} width={140} height={110} rx={12} fill="#22252f" /><circle cx={0} cy={-6} r={34} fill="#3a4055" /><circle cx={0} cy={-6} r={14} fill="#6fb6ff" /><rect x={-40} y={-84} width={40} height={26} fill="#22252f" /></g>, 'EXHIBIT 3 · CAMERA')}
        {item(a + 24, 1540, 330, <g stroke={INK} strokeWidth={6}><rect x={-80} y={-50} width={160} height={100} rx={8} fill="#1b1d26" /><rect x={-66} y={-36} width={132} height={60} fill="#0c3020" /><line x1={60} y1={-50} x2={96} y2={-120} /></g>, 'EXHIBIT 4 · TRACKER')}
        {f >= b && <g transform="translate(960 760)">{Array.from({ length: 9 }).map((_, i) => { const k = lerp(f, [b + i * 2, b + i * 2 + 8], [0, 1], easeOut); return <g key={i} transform={`translate(${(i - 4) * 150 * k} 0) rotate(${(i - 4) * 5 * k})`} opacity={k} stroke={INK} strokeWidth={6}><rect x={-60} y={-84} width={120} height={168} rx={8} fill={['#7a1f22', '#1d2748', '#1f5a3a'][i % 3]} /><circle cx={0} cy={-10} r={26} fill="none" stroke={C.gold} strokeWidth={5} /><rect x={-36} y={40} width={72} height={10} fill={C.gold} stroke="none" /></g>; })}
          <text x={0} y={-140} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={64} fill="#fff" letterSpacing={5}>{count(f, b, b + 30, 0, 75)} PASSPORTS AND ID CARDS</text></g>}
        <Night id="gad" amt={0.5} lights={[{ x: 960, y: 520, r: 1100, ry: 640, color: '#fff2d0' }]} />
      </Layer>
    </Cam>
  );
};

/** A photo in a crosshair. p: { who, name, sub } */
export const Target: React.FC<SP> = ({ f, d, m, p }) => {
  const at = m.lock ?? 14, k = lerp(f, [at, at + 10], [0, 1], easeOut);
  return (
    <Cam f={f} d={d} v={[[960, 540, 1.0], [960, 520, 1.12]]} bg="#12080a">
      <Layer depth={0.4}><rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#1a0a0e" /><Bokeh f={f} seed={9} n={12} color="#ff6b6b" /></Layer>
      <Layer>
        <Photo x={760} y={190} who={p.who} w={400} id="tg" rot={-2} />
        <g transform={`translate(960 400) scale(${2.2 - k * 1.2})`} opacity={k} stroke={C.red} strokeWidth={8} fill="none"><circle r={210} /><circle r={130} /><line x1={-270} y1={0} x2={-80} y2={0} /><line x1={80} y1={0} x2={270} y2={0} /><line x1={0} y1={-270} x2={0} y2={-80} /><line x1={0} y1={80} x2={0} y2={270} /></g>
        <Night id="tgn" amt={0.55} tint="#0c0204" lights={[{ x: 960, y: 420, r: 620, color: '#ff8a6b' }]} />
      </Layer>
      <Layer depth={1.15}><NameTag f={f} at={at} x={1200} y={700} name={p.name} sub={p.sub} color={C.red} /></Layer>
    </Cam>
  );
};

/** The end card over Shamz's desk: the question, "Tell me in the comments", SUBSCRIBE. */
export const EndCard: React.FC<SP> = (sp) => {
  const { f } = sp;
  const k = lerp(f, [10, 24], [0, 1], easeOut);
  return (
    <AbsoluteFill>
      <ShamzDesk {...sp} p={{ mode: 'smile', pins: ['mars', 'braun', 'mccrum', 'grozev'], v: [[960, 540, 1.0], [960, 540, 1.05]], ...(sp.p?.desk ?? {}) }} />
      <AbsoluteFill style={{ background: `rgba(5,7,16,${0.62 * k})`, alignItems: 'center', justifyContent: 'center', opacity: k }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 92, color: '#fff', letterSpacing: 4, textAlign: 'center', lineHeight: 1.12, textShadow: '0 6px 0 #0a0d1e' }}>{sp.p?.q1 ?? 'WHY DID IT TAKE '}<span style={{ color: C.gold }}>{sp.p?.qa ?? '5 YEARS'}</span><br />{sp.p?.q2 ?? 'FOR ANYONE TO LISTEN?'}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: '#f6f1e6', marginTop: 26 }}>Tell me in the comments</div>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 54, color: INK, background: C.gold, border: `6px solid ${INK}`, borderRadius: 60, padding: '10px 54px', marginTop: 30, letterSpacing: 6, transform: `scale(${1 + 0.04 * Math.sin(f / 6)})` }}>SUBSCRIBE</div>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, color: '#cfd6ea', marginTop: 16, letterSpacing: 4 }}>FOR THE NEXT FILE</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Inside the jet. p: { who?, face? } */
export const Jet: React.FC<SP> = ({ f, d, p }) => (
  <Cam f={f} d={d} z={[1.0, 1.1]} x={[0, -20]} bg="#d9cdb4">
    <Layer depth={0.6}><Cabin f={f} /></Layer>
    <Layer>
      <Seat x={900} />
      {p.who && <Bean {...LOOKS[p.who]} x={900} y={1250} s={3.1} f={f} legs={false} lit={-1} bob={0.4} {...(p.face ?? { mouth: 'smirk' })} />}
      <g transform="translate(1290 830)" stroke={INK} strokeWidth={6}><path d="M -34 -70 L 34 -70 L 26 0 L -26 0 Z" fill="rgba(210,235,255,0.5)" /><path d="M -30 -34 L 30 -34 L 26 0 L -26 0 Z" fill="#c98a3a" /></g>
      <rect x={1180} y={830} width={260} height={30} rx={10} fill="#8a6a40" stroke={INK} strokeWidth={7} />
      <Night id="njet" amt={0.7} tint="#0a0c20" lights={[{ x: 820, y: 520, r: 560, ry: 520 }, { x: 330, y: 360, r: 260, power: 0.5, color: '#cfe0ff' }]} />
      <Bokeh f={f} seed={4} n={8} />
    </Layer>
  </Cam>
);

/** A prepaid card, and wallets. p: {} */
export const PayCard: React.FC<SP> = ({ f, d }) => {
  const tilt = Math.sin(f / 14) * 5;
  return (
    <Cam f={f} d={d} z={[1.0, 1.1]} bg="#0a0f22">
      <Layer depth={0.4}><rect x={-400} y={-300} width={W + 800} height={H + 600} fill="#101733" /><Bokeh f={f} seed={12} n={14} color={C.green} /></Layer>
      <Layer>
        <g transform={`translate(960 430) rotate(${-8 + tilt})`}>
          <rect x={-330} y={-200} width={680} height={420} rx={36} fill="#000" opacity={0.35} />
          <rect x={-340} y={-210} width={680} height={420} rx={36} fill="#0e3a22" stroke={INK} strokeWidth={10} />
          <rect x={-290} y={-90} width={110} height={84} rx={12} fill={C.gold} stroke={INK} strokeWidth={6} />
          <text x={-290} y={-130} fontFamily={LABEL} fontWeight={700} fontSize={56} fill={C.green} letterSpacing={6}>{p.box ?? 'WIRECARD'}</text>
          <text x={-290} y={90} fontFamily={LABEL} fontWeight={700} fontSize={50} fill="#d9f2df" letterSpacing={8}>5200 •••• •••• 1999</text>
          <text x={-290} y={160} fontFamily={LABEL} fontWeight={700} fontSize={32} fill="#9fd9b0" letterSpacing={4}>PREPAID</text>
        </g>
        {Array.from({ length: 9 }).map((_, i) => { const k = lerp(f, [10 + i * 3, 18 + i * 3], [0, 1], easeOut); return <g key={i} transform={`translate(${200 + i * 190} ${880 + (1 - k) * 200})`} opacity={k} stroke={INK} strokeWidth={6}><rect x={-70} y={-50} width={140} height={100} rx={14} fill={['#7a4a30', '#3a2b25', '#5a3a52'][i % 3]} /><rect x={-50} y={-66} width={86} height={30} rx={6} fill="#0e3a22" /><circle cx={48} cy={0} r={9} fill={C.gold} /></g>; })}
        <Night id="pcard" amt={0.5} lights={[{ x: 960, y: 460, r: 760, ry: 460, color: '#cfe0ff' }, { x: 960, y: 880, r: 1000, ry: 220, power: 0.7 }]} />
      </Layer>
    </Cam>
  );
};
