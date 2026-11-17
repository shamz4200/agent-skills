// Glow style engine: glowing white figures in line-art night rooms, word-by-word captions, glowing stats.
// Everything is SVG drawn by code, 1920x1080 at 30 fps.
import React from 'react';
import { AbsoluteFill, Img, interpolate, Easing, staticFile, random } from 'remotion';
import { loadFont } from '@remotion/fonts';

loadFont({ family: 'Inter', url: staticFile('fonts/inter-latin-700-normal.woff2'), weight: '700' });
loadFont({ family: 'Inter', url: staticFile('fonts/inter-latin-800-normal.woff2'), weight: '800' });
loadFont({ family: 'Inter', url: staticFile('fonts/inter-latin-900-normal.woff2'), weight: '900' });
loadFont({ family: 'JBMono', url: staticFile('fonts/jetbrains-mono-latin-500-normal.woff2'), weight: '500' });
loadFont({ family: 'JBMono', url: staticFile('fonts/jetbrains-mono-latin-700-normal.woff2'), weight: '700' });

export const W = 1920, H = 1080, FPS = 30;
export const SANS = 'Inter, sans-serif', MONO = 'JBMono, monospace';
export const G = {
  wall: '#1a2452', wall2: '#0e1534', floor: '#0b1028', line: '#8ea2e6', lineDim: '#4a5ca8', fill: '#121a3d',
  win: '#24388c', moon: '#eef2ff', warm: '#ffc96b', warmWall: '#5a4033', yellow: '#FFC54D', red: '#FF5D5D',
  white: '#f5f7ff', shade: '#c3cbe8', back: '#9aa6cf', ink: '#141a33', blue: '#5b8cff', green: '#5fe08a', pink: '#ff7fb0',
};
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (f: number, r: [number, number], o: [number, number], e?: (t: number) => number) =>
  interpolate(f, r, o, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e });
export const easeOut = Easing.out(Easing.cubic), easeIO = Easing.inOut(Easing.cubic);
const rad = (d: number) => (d * Math.PI) / 180;

// ------------------------------------------------------------------ shared SVG defs (bloom, light pools)
export const Defs: React.FC = () => (
  <defs>
    <filter id="bloom" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="b2" />
      <feMerge><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <filter id="blur30"><feGaussianBlur stdDeviation="30" /></filter>
    <radialGradient id="warmPool"><stop offset="0" stopColor="#ffd38a" stopOpacity="0.55" /><stop offset="1" stopColor="#ffd38a" stopOpacity="0" /></radialGradient>
    <radialGradient id="moonPool"><stop offset="0" stopColor="#9fb6ff" stopOpacity="0.45" /><stop offset="1" stopColor="#9fb6ff" stopOpacity="0" /></radialGradient>
    <radialGradient id="whitePool"><stop offset="0" stopColor="#ffffff" stopOpacity="0.5" /><stop offset="1" stopColor="#ffffff" stopOpacity="0" /></radialGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff6dc" stopOpacity="0.55" /><stop offset="1" stopColor="#fff6dc" stopOpacity="0.08" /></linearGradient>
    <linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1f2b62" /><stop offset="1" stopColor="#121a40" /></linearGradient>
    <linearGradient id="wallWarm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a3a3e" /><stop offset="1" stopColor="#2a2030" /></linearGradient>
    <pattern id="paper" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="none" /><circle cx="1" cy="1" r="0.6" fill="#ffffff" opacity="0.05" /></pattern>
  </defs>
);

// ------------------------------------------------------------------ camera: slow push / drift between two views
export type View = [number, number, number]; // focus x, focus y, zoom
export const Cam: React.FC<{ f: number; d: number; v?: [View, View]; children: React.ReactNode; shake?: number }> = ({ f, d, v, children, shake = 0 }) => {
  const [a, b] = v ?? [[960, 540, 1.0], [960, 540, 1.07]];
  const t = lerp(f, [0, Math.max(1, d)], [0, 1], easeIO);
  const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t, z = a[2] + (b[2] - a[2]) * t;
  const sx = shake ? Math.sin(f * 2.1) * shake : 0, sy = shake ? Math.cos(f * 2.7) * shake : 0;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      <Defs />
      <g transform={`translate(${W / 2 + sx} ${H / 2 + sy}) scale(${z}) translate(${-x} ${-y})`}>{children}</g>
    </svg>
  );
};

// ------------------------------------------------------------------ the figure
export type Pose = {
  lean?: number; hipY?: number;                       // torso lean (deg, + = forward), hip height offset
  la?: [number, number]; ra?: [number, number];       // arms: [upper angle from down (+ forward), elbow bend (+ forward)]
  ll?: [number, number]; rl?: [number, number];       // legs: [thigh angle from down (+ forward), knee bend (+ back)]
  head?: number;                                      // head tilt (deg)
};
export const POSES: Record<string, Pose> = {
  stand: { la: [8, 10], ra: [-6, 12], ll: [3, 0], rl: [-3, 0] },
  sit: { hipY: 80, lean: -4, la: [30, 50], ra: [20, 60], ll: [88, 88], rl: [82, 82] },
  phone: { ra: [10, 10], la: [40, 105], ll: [3, 0], rl: [-3, 0], head: 8 },
  sitPhone: { hipY: 80, lean: -2, ra: [30, 50], la: [45, 100], ll: [88, 88], rl: [82, 82], head: 10 },
  fall: { lean: 52, hipY: 18, la: [150, 10], ra: [125, 20], ll: [40, 40], rl: [-35, 50], head: -10 },
  floor: { hipY: 150, lean: -12, la: [40, 20], ra: [160, 60], ll: [84, 0], rl: [70, 10], head: 6 },
  facepalm: { lean: 6, ra: [10, 10], la: [30, 150], ll: [3, 0], rl: [-3, 0], head: 12 },
  shrug: { la: [-40, -90], ra: [40, 90], ll: [3, 0], rl: [-3, 0] },
  point: { ra: [8, 10], la: [85, 5], ll: [3, 0], rl: [-3, 0] },
  wave: { ra: [8, 10], la: [150, 30], ll: [3, 0], rl: [-3, 0] },
  clip: { la: [35, 75], ra: [30, 85], ll: [3, 0], rl: [-3, 0] },        // holding a clipboard
  shirt: { lean: 14, la: [25, 40], ra: [30, 45], ll: [3, 0], rl: [-3, 0], head: 22 },  // looking down at own shirt
};
const mixPose = (a: Pose, b: Pose, t: number): Pose => {
  const m = (x?: number, y?: number) => (x ?? 0) + ((y ?? 0) - (x ?? 0)) * t;
  const m2 = (x?: [number, number], y?: [number, number]): [number, number] => [m(x?.[0], y?.[0]), m(x?.[1], y?.[1])];
  return { lean: m(a.lean, b.lean), hipY: m(a.hipY, b.hipY), head: m(a.head, b.head), la: m2(a.la, b.la), ra: m2(a.ra, b.ra), ll: m2(a.ll, b.ll), rl: m2(a.rl, b.rl) };
};
export const blend = (a: string | Pose, b: string | Pose, t: number) =>
  mixPose(typeof a === 'string' ? POSES[a] : a, typeof b === 'string' ? POSES[b] : b, clamp(t));
/** A walk cycle at phase p (radians). */
export const walk = (p: number, amp = 1): Pose => ({
  lean: 4 * amp, hipY: -Math.abs(Math.cos(p)) * 5 * amp,
  ll: [26 * Math.sin(p) * amp, Math.max(0, 40 * Math.sin(p + 1.6)) * amp], rl: [-26 * Math.sin(p) * amp, Math.max(0, 40 * Math.sin(p + 1.6 + Math.PI)) * amp],
  la: [-20 * Math.sin(p) * amp, 18], ra: [20 * Math.sin(p) * amp, 18],
});

export type Eyes = 'open' | 'wide' | 'closed' | 'happy' | 'worried' | 'angry' | 'down';
export type Mouth = 'smile' | 'line' | 'o' | 'frown' | 'talk' | 'grin' | 'wobble';
export type FigP = {
  x: number; y: number; s?: number; f: number; flip?: boolean; pose?: Pose | string;
  eyes?: Eyes; mouth?: Mouth; look?: number; blink?: number; tint?: string; glow?: boolean; opacity?: number;
  hair?: 'cap' | 'bun' | 'pony' | 'none'; hairC?: string; shamz?: boolean;
  shirt?: string; print?: 'cat' | 'heart' | 'star'; phone?: boolean; talking?: boolean; seed?: number;
};
const THIGH = 80, SHIN = 80, TORSO = 108, UARM = 64, FARM = 60, HR = 52;

export const Fig: React.FC<FigP> = (p) => {
  const s = p.s ?? 1, f = p.f, seed = p.seed ?? 0;
  const pose = typeof p.pose === 'string' ? POSES[p.pose] : (p.pose ?? POSES.stand);
  // idle breathing and sway, so nobody is ever frozen
  const br = Math.sin(f / 14 + seed) * 1.6;
  const lean = rad((pose.lean ?? 0) + Math.sin(f / 23 + seed) * 1.2);
  const hip: [number, number] = [0, -(THIGH + SHIN + 10) + (pose.hipY ?? 0)];
  const sh: [number, number] = [hip[0] + Math.sin(lean) * TORSO, hip[1] - Math.cos(lean) * (TORSO + br)];
  const hc: [number, number] = [sh[0] + Math.sin(lean) * (HR + 6), sh[1] - Math.cos(lean) * (HR + 6)];
  const tint = p.tint ?? G.white;
  const light = tint, shade = p.tint ? tint : G.shade, back = p.tint ? tint : G.back;
  const limb = (o: [number, number], a1: number, l1: number, a2: number, l2: number) => {
    const j: [number, number] = [o[0] + Math.sin(rad(a1)) * l1, o[1] + Math.cos(rad(a1)) * l1];
    const e: [number, number] = [j[0] + Math.sin(rad(a2)) * l2, j[1] + Math.cos(rad(a2)) * l2];
    return { j, e, d: `M ${o[0]} ${o[1]} L ${j[0]} ${j[1]} L ${e[0]} ${e[1]}` };
  };
  const leg = (q?: [number, number]) => { const [a, k] = q ?? [0, 0]; return limb([hip[0], hip[1] + 6], a, THIGH, a - k, SHIN); };
  const arm = (q?: [number, number]) => { const [a, e] = q ?? [0, 0]; const so: [number, number] = [sh[0] - Math.sin(lean) * 20, sh[1] + Math.cos(lean) * 20]; return limb(so, a + (pose.lean ?? 0), UARM, a + e + (pose.lean ?? 0), FARM); };
  const L = leg(pose.ll), R = leg(pose.rl), A = arm(pose.la), B = arm(pose.ra);
  const stroke = (d: string, w: number, c: string, hi = true) => <g>
    <path d={d} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {hi && <path d={d} stroke={light} strokeWidth={w * 0.62} fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`translate(${-w * 0.12} ${-w * 0.06})`} />}
  </g>;
  const foot = (l: { e: [number, number] }, c: string) => <ellipse cx={l.e[0] + 9} cy={l.e[1] + 2} rx={21} ry={12} fill={c} />;
  // blink: a short close every few seconds
  const bl = p.blink ?? ((f + seed * 37) % 104 < 4 ? 1 : 0);
  const eyes: Eyes = bl ? 'closed' : (p.eyes ?? 'open');
  const look = (p.look ?? 0.3) * 12;
  const talk = p.talking ? (Math.sin(f * 0.9) > 0 ? 'o' : 'line') : undefined;
  const mouth = talk ?? p.mouth ?? 'smile';
  const head = pose.head ?? 0;
  return (
    <g transform={`translate(${p.x} ${p.y}) scale(${(p.flip ? -1 : 1) * s} ${s})`} opacity={p.opacity ?? 1}>
      <ellipse cx={0} cy={4} rx={58} ry={9} fill="#000" opacity={0.35} />
      <g filter={p.glow === false ? undefined : 'url(#bloom)'}>
        {/* far side limbs */}
        {stroke(R.d, 32, back, false)}{foot(R, back)}
        {stroke(B.d, 27, back, false)}<circle cx={B.e[0]} cy={B.e[1]} r={14} fill={back} />
        {p.shamz && <ShamzLocs hc={hc} head={head} back />}
        {/* torso */}
        {stroke(`M ${hip[0]} ${hip[1]} L ${sh[0]} ${sh[1]}`, 68, shade)}
        {p.shirt && <g>
          <path d={`M ${hip[0]} ${hip[1]} L ${sh[0]} ${sh[1]}`} stroke={p.shirt} strokeWidth={70} strokeLinecap="round" />
          <g transform={`translate(${(hip[0] + sh[0]) / 2} ${(hip[1] + sh[1]) / 2 - 6}) rotate(${(pose.lean ?? 0)})`}>
            {p.print === 'cat' && <g stroke={G.ink} strokeWidth={2.4} fill="#fff"><path d="M -14 -6 L -12 -20 L -4 -11 L 4 -11 L 12 -20 L 14 -6 Q 14 12 0 12 Q -14 12 -14 -6 Z" /><circle cx={-5} cy={-2} r={1.8} fill={G.ink} /><circle cx={5} cy={-2} r={1.8} fill={G.ink} /><path d="M -3 4 q 3 3 6 0" fill="none" /></g>}
            {p.print === 'heart' && <path d="M 0 10 C -20 -4 -10 -18 0 -8 C 10 -18 20 -4 0 10 Z" fill="#fff" />}
            {p.print === 'star' && <path d="M 0 -14 L 4 -4 L 14 -4 L 6 3 L 9 13 L 0 7 L -9 13 L -6 3 L -14 -4 L -4 -4 Z" fill="#fff" />}
          </g>
        </g>}
        {/* near side limbs */}
        {stroke(L.d, 32, shade)}{foot(L, light)}
        {/* head */}
        <g transform={`translate(${hc[0]} ${hc[1]}) rotate(${head})`}>
          <circle r={HR} fill={shade} />
          <circle cx={-5} cy={-4} r={HR - 4} fill={light} />
          {p.hair === 'cap' && <g><path d={`M -44 -12 Q -44 -50 0 -50 Q 44 -50 44 -12 Z`} fill={p.hairC ?? '#22263a'} /><rect x={-58} y={-18} width={40} height={10} rx={5} fill={p.hairC ?? '#22263a'} /></g>}
          {p.hair === 'bun' && <g fill={p.hairC ?? '#2a2638'}><path d={`M -46 2 Q -50 -50 0 -48 Q 50 -50 46 2 Q 30 -26 0 -24 Q -30 -26 -46 2`} /><circle cx={6} cy={-56} r={18} /></g>}
          {p.hair === 'pony' && <g fill={p.hairC ?? '#2a2638'}><path d={`M -46 2 Q -50 -50 0 -48 Q 50 -50 46 2 Q 30 -26 0 -24 Q -30 -26 -46 2`} /><path d="M -40 -20 Q -78 0 -64 46 Q -54 10 -38 -2 Z" /></g>}
          {p.shamz && <ShamzHat />}
          <Face eyes={eyes} mouth={mouth} look={look} shamz={p.shamz} f={f} />
        </g>
        {p.shamz && <ShamzLocs hc={hc} head={head} />}
        {stroke(A.d, 27, shade)}<circle cx={A.e[0]} cy={A.e[1]} r={14} fill={light} />
        {p.phone && <g transform={`translate(${A.e[0]} ${A.e[1]}) rotate(-20)`}>
          <polygon points={`8,-20 ${hc[0] - A.e[0] + 10},${hc[1] - A.e[1] - 40} ${hc[0] - A.e[0] + 30},${hc[1] - A.e[1] + 30}`} fill="url(#beam)" opacity={0.6} />
          <rect x={-6} y={-30} width={24} height={42} rx={5} fill="#cfe0ff" stroke="#24305e" strokeWidth={3} />
        </g>}
      </g>
    </g>
  );
};

/** A head on its own (for a sleeper on a pillow, or a face peeking in): same look as Fig's head. */
export const Head: React.FC<{ x: number; y: number; s?: number; rot?: number; f: number; shamz?: boolean; hair?: FigP['hair']; hairC?: string; eyes?: Eyes; mouth?: Mouth; look?: number }> = (p) => {
  const bl = (p.f % 104) < 4;
  return (
    <g transform={`translate(${p.x} ${p.y}) rotate(${p.rot ?? 0}) scale(${p.s ?? 1})`} filter="url(#bloom)">
      {p.shamz && <ShamzLocs hc={[0, 0]} head={0} back />}
      <circle r={HR} fill={G.shade} /><circle cx={-5} cy={-4} r={HR - 4} fill={G.white} />
      {p.hair === 'cap' && <g><path d={`M -44 -12 Q -44 -50 0 -50 Q 44 -50 44 -12 Z`} fill={p.hairC ?? '#22263a'} /></g>}
      {p.shamz && <ShamzHat />}
      <Face eyes={bl ? 'closed' : (p.eyes ?? 'open')} mouth={p.mouth ?? 'line'} look={(p.look ?? 0) * 12} shamz={p.shamz} f={p.f} />
      {p.shamz && <ShamzLocs hc={[0, 0]} head={0} />}
    </g>
  );
};

const Face: React.FC<{ eyes: Eyes; mouth: Mouth; look: number; shamz?: boolean; f: number }> = ({ eyes, mouth, look, shamz, f }) => {
  const ex = [-17 + look, 17 + look], ey = shamz ? 8 : -2;
  const eye = (x: number) => {
    if (eyes === 'closed') return <path d={`M ${x - 8} ${ey} q 8 5 16 0`} stroke={G.ink} strokeWidth={4} fill="none" strokeLinecap="round" />;
    if (eyes === 'happy') return <path d={`M ${x - 8} ${ey + 2} q 8 -10 16 0`} stroke={G.ink} strokeWidth={4} fill="none" strokeLinecap="round" />;
    const big = eyes === 'wide' ? 1.25 : 1, dy = eyes === 'down' ? 4 : 0;
    if (shamz) {
      // Shamz's eyes: red iris, dark pupil, three dots round it, a glint
      return <g>
        <ellipse cx={x} cy={ey} rx={11.5 * big} ry={12.5 * big} fill="#fff" stroke={G.ink} strokeWidth={2.4} />
        <circle cx={x + look * 0.15} cy={ey + dy} r={8.6 * big} fill="#D3202A" stroke="#5A0A10" strokeWidth={1.6} />
        <circle cx={x + look * 0.15} cy={ey + dy} r={3.2 * big} fill="#14080A" />
        {[0, 1, 2].map((k) => { const a = -Math.PI / 2 + (k * 2 * Math.PI) / 3; return <circle key={k} cx={x + look * 0.15 + Math.cos(a) * 5.9 * big} cy={ey + dy + Math.sin(a) * 5.9 * big} r={1.35 * big} fill="#14080A" />; })}
        <circle cx={x + look * 0.15 + 3.4} cy={ey + dy - 4} r={2} fill="#fff" />
      </g>;
    }
    return <g><ellipse cx={x} cy={ey + dy} rx={6.5 * big} ry={9 * big} fill={G.ink} /><circle cx={x + 2.2} cy={ey + dy - 3.4} r={2.2} fill="#fff" /></g>;
  };
  const by = shamz ? -16 : -18;
  return (
    <g>
      {ex.map((x) => <g key={x}>{eye(x)}</g>)}
      {eyes === 'worried' && <g stroke={G.ink} strokeWidth={3.6} strokeLinecap="round"><line x1={ex[0] - 9} y1={by + 2} x2={ex[0] + 6} y2={by - 4} /><line x1={ex[1] + 9} y1={by + 2} x2={ex[1] - 6} y2={by - 4} /></g>}
      {eyes === 'angry' && <g stroke={G.ink} strokeWidth={3.6} strokeLinecap="round"><line x1={ex[0] - 9} y1={by - 4} x2={ex[0] + 7} y2={by + 2} /><line x1={ex[1] + 9} y1={by - 4} x2={ex[1] - 7} y2={by + 2} /></g>}
      {(eyes === 'open' || eyes === 'wide' || eyes === 'down') && !shamz && <g stroke={G.ink} strokeWidth={3.2} strokeLinecap="round"><line x1={ex[0] - 7} y1={by - 2} x2={ex[0] + 6} y2={by - 3} /><line x1={ex[1] - 6} y1={by - 3} x2={ex[1] + 7} y2={by - 2} /></g>}
      <g transform={`translate(${look * 0.8} ${shamz ? 7 : 0})`} stroke={G.ink} strokeWidth={3.8} strokeLinecap="round" fill="none">
        {mouth === 'smile' && <path d="M -10 20 q 10 9 20 0" />}
        {mouth === 'grin' && <path d="M -13 17 q 13 15 26 0 Z" fill={G.ink} />}
        {mouth === 'line' && <line x1={-8} y1={22} x2={8} y2={22} />}
        {mouth === 'frown' && <path d="M -10 25 q 10 -8 20 0" />}
        {mouth === 'o' && <ellipse cx={0} cy={22} rx={6} ry={7.5} fill={G.ink} stroke="none" />}
        {mouth === 'talk' && <ellipse cx={0} cy={22} rx={7} ry={3 + Math.abs(Math.sin(f * 0.8)) * 5} fill={G.ink} stroke="none" />}
        {mouth === 'wobble' && <path d={`M -11 23 q 4 -4 7 0 q 4 4 7 0 q 4 -4 7 0`} />}
      </g>
    </g>
  );
};

// Shamz in the Glow style: the same glowing body as everyone, plus his permanent marks: the black ribbed beanie with
// the gold patch and black cloud, golden locs, and red eyes with three dots round the pupil.
const ShamzHat: React.FC = () => (
  <g transform="translate(0 -10)">
    <path d="M -47 -10 Q -50 -66 0 -68 Q 50 -66 47 -10 Z" fill="#1E1C24" />
    {[-30, -15, 0, 15, 30].map((x) => <path key={x} d={`M ${x} -22 Q ${x * 1.05} -48 ${x * 0.5} -64`} stroke="#3a3844" strokeWidth={2.6} fill="none" />)}
    <rect x={-51} y={-26} width={102} height={22} rx={8} fill="#26242C" />
    {[-38, -26, -14, -2, 10, 22, 34].map((x) => <line key={x} x1={x} y1={-23} x2={x} y2={-7} stroke="#3c3a46" strokeWidth={2.6} />)}
    <g transform="translate(26 -15)">
      <rect x={-14} y={-9} width={28} height={18} rx={2} fill="#F2B233" stroke="#7a5608" strokeWidth={1.4} />
      <g fill="#14121C"><circle cx={-5} cy={2} r={4.2} /><circle cx={1} cy={-2} r={5} /><circle cx={6.5} cy={2} r={3.8} /><rect x={-9} y={2} width={19} height={4.2} rx={2} /></g>
    </g>
  </g>
);
const ShamzLocs: React.FC<{ hc: [number, number]; head: number; back?: boolean }> = ({ hc, head, back }) => {
  const xs = back ? [-34, -20, 20, 34] : [-46, 46];
  return (
    <g transform={`translate(${hc[0]} ${hc[1]}) rotate(${head})`}>
      {xs.map((x, i) => <g key={x}>
        <rect x={x - 8} y={-12} width={16} height={back ? 74 + (i % 2) * 10 : 66} rx={8} fill={back ? '#c98e1c' : '#F2B233'} />
        {[0, 1, 2, 3].map((t) => <line key={t} x1={x - 6} y1={-2 + t * 16} x2={x + 6} y2={4 + t * 16} stroke="#9c6c0a" strokeWidth={2.2} strokeLinecap="round" />)}
      </g>)}
    </g>
  );
};

// ------------------------------------------------------------------ atmosphere and finish
export const Dust: React.FC<{ f: number; n?: number; seed?: number; warm?: boolean }> = ({ f, n = 70, seed = 1, warm }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const x = (random(`dx${seed}${i}`) * W * 1.2 + f * (0.15 + random(`dv${i}`) * 0.35)) % (W * 1.2) - W * 0.1;
      const y = (random(`dy${seed}${i}`) * H - f * (0.1 + random(`du${i}`) * 0.25) + H * 4) % H;
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / (12 + random(`dt${i}`) * 20) + i));
      return <circle key={i} cx={x} cy={y} r={1 + random(`dr${seed}${i}`) * 2.2} fill={warm ? '#ffe2a8' : '#dfe6ff'} opacity={0.5 * tw} />;
    })}
  </g>
);
export const Finish: React.FC<{ v?: number }> = ({ v = 0.6 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 50%, rgba(2,4,14,${v}) 100%)` }} />
);

// ------------------------------------------------------------------ captions: one short phrase at a time, word by word
export type Word = { w: string; s: number; e: number };
export const Captions: React.FC<{ t: number; words: Word[]; hl: Record<string, string>; hide?: boolean }> = ({ t, words, hl, hide }) => {
  if (hide) return null;
  // chunks of up to 3 words, broken after punctuation
  const chunks: number[][] = []; let cur: number[] = [];
  words.forEach((w, i) => {
    cur.push(i);
    const gap = i + 1 < words.length ? words[i + 1].s - w.e : 9;
    if (cur.length >= 3 || /[.,?!:;]$/.test(w.w) || gap > 0.35) { chunks.push(cur); cur = []; }
  });
  if (cur.length) chunks.push(cur);
  const c = chunks.find((ch) => t >= words[ch[0]].s - 0.08 && t < (words[ch[ch.length - 1]].e + 0.25));
  if (!c) return null;
  const pop = clamp((t - words[c[0]].s + 0.08) / 0.12);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 92, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 68, letterSpacing: -0.5, transform: `scale(${0.94 + 0.06 * pop})` }}>
      {c.map((i) => {
        const k = words[i].w.toLowerCase().replace(/[^a-z0-9']/g, '');
        const said = t >= words[i].s - 0.05;
        const col = hl[k] ?? '#ffffff';
        return <span key={i} style={{ color: col, opacity: said ? 1 : 0.38, textShadow: `0 4px 14px rgba(0,0,10,0.9), 0 0 ${col === '#ffffff' ? 0 : 22}px ${col}66`, marginRight: 18 }}>{words[i].w}</span>;
      })}
    </div>
  );
};

// ------------------------------------------------------------------ overlays
export const Tag: React.FC<{ f: number; text: string; x?: number; y?: number; color?: string; at?: number }> = ({ f, text, x = 64, y = 56, color = '#fff', at = 0 }) => {
  const k = lerp(f, [at, at + 8], [0, 1], easeOut);
  return <div style={{ position: 'absolute', left: x, top: y, opacity: k, transform: `scale(${0.8 + 0.2 * k})`, transformOrigin: 'left center', fontFamily: SANS, fontWeight: 800, fontSize: 30, color, padding: '8px 22px', border: `3px solid ${color}`, borderRadius: 40, background: 'rgba(8,10,28,0.85)', letterSpacing: 0.5 }}>{text}</div>;
};
export const BigStat: React.FC<{ f: number; text: string; sub?: string; x?: number; y?: number; size?: number; color?: string; at?: number; count?: number }> = ({ f, text, sub, x = 960, y = 150, size = 150, color = G.yellow, at = 0, count }) => {
  const k = lerp(f, [at, at + 10], [0, 1], easeOut);
  const shown = count !== undefined ? text.replace(/[0-9]+/, String(Math.round(count * lerp(f, [at, at + 24], [0, 1], easeOut)))) : text;
  return (
    <div style={{ position: 'absolute', left: x - 900, width: 1800, top: y - size * 0.7, textAlign: 'center', opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: size, color, lineHeight: 1, textShadow: `0 0 34px ${color}aa, 0 0 8px ${color}` }}>{shown}</div>
      {sub && <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 26, color: '#cfd8ff', letterSpacing: 9, marginTop: 18, opacity: lerp(f, [at + 8, at + 18], [0, 1]) }}>{sub}</div>}
    </div>
  );
};
export const Cite: React.FC<{ f: number; text: string; at?: number; y?: number }> = ({ f, text, at = 0, y = 40 }) => (
  <div style={{ position: 'absolute', top: y, left: 0, right: 0, textAlign: 'center', fontFamily: MONO, fontWeight: 500, fontSize: 24, letterSpacing: 8, color: '#b9c4f0', opacity: lerp(f, [at, at + 10], [0, 0.9]) }}>{text}</div>
);
/** A thought bubble (top right of a head) whose content is drawn by children in a 0..1 box of size w x h. */
export const Bubble: React.FC<{ x: number; y: number; w: number; h: number; k: number; children?: React.ReactNode }> = ({ x, y, w, h, k, children }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`} opacity={k}>
    <circle cx={-w / 2 - 30} cy={h / 2 + 50} r={10} fill="#0f1636" stroke={G.line} strokeWidth={3} />
    <circle cx={-w / 2 - 6} cy={h / 2 + 18} r={16} fill="#0f1636" stroke={G.line} strokeWidth={3} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={34} fill="#0f1636" stroke={G.line} strokeWidth={4} filter="url(#soft)" />
    <g transform={`translate(${-w / 2} ${-h / 2})`}>{children}</g>
  </g>
);

// ------------------------------------------------------------------ detailed painted backgrounds (the "detailed" look)
/** true = paint every location from public/bg/<name>.png; false = the line-art rooms. Set per composition. */
export const DetailCtx = React.createContext(false);
/** Where each plate's floor line is (y in the 1080-high picture), so figures stand on it; undefined = place as is. */
const PLATE: Record<string, { y: number; s?: number; floorFrom?: number }> = {
  hall: { y: -60 }, lawn: { y: -60 }, stage: { y: -150, s: 1.15 },
  bedroom: { y: 0, floorFrom: 1060 }, bedroom_warm: { y: 0, floorFrom: 1060 }, lab: { y: 0, floorFrom: 1060 }, desk: { y: -100 },
};
/** A painted plate inside a Cam, slightly dimmed (and optionally blurred for depth) so the glowing figures pop. */
export const Plate: React.FC<{ name: string; floorY?: number; blur?: number; dim?: number }> = ({ name, floorY = 860, blur = 0, dim = 0.18 }) => {
  const c = PLATE[name] ?? { y: 0 };
  const s = c.s ?? 1.104, w = 1920 * s, h = 1080 * s, x = 960 - w / 2;
  const y = c.floorFrom ? floorY - c.floorFrom * s : c.y;
  return (
    <g>
      <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill="#070a1c" />
      <image href={staticFile(`bg/${name}.png`)} x={x} y={y} width={w} height={h} preserveAspectRatio="none" style={blur ? { filter: `blur(${blur}px)` } : undefined} />
      <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill="#0a1030" opacity={dim} />
      {c.floorFrom && <g>
        <rect x={-600} y={floorY - 4} width={W + 1200} height={700} fill="#0d1230" />
        <line x1={-600} y1={floorY - 4} x2={W + 600} y2={floorY - 4} stroke="#4a5ca8" strokeWidth={3} opacity={0.6} />
        {Array.from({ length: 14 }).map((_, i) => <line key={i} x1={-400 + i * 200} y1={floorY + 30 + (i % 3) * 40} x2={-260 + i * 200} y2={floorY + 30 + (i % 3) * 40} stroke="#ffffff" opacity={0.05} strokeWidth={3} />)}
      </g>}
    </g>
  );
};
