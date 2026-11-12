// Night Dossier engine (style reference 6): bean characters, night lighting, a parallax camera and the dossier kit
// (type-on text cards, name tags, location tags, stamps, counters). Everything is SVG drawn in code.
import React, { createContext, useContext } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

// Fonts are loaded from public/fonts (the render browser cannot reach Google Fonts through the sandbox proxy).
loadFont({ family: 'Caveat', url: staticFile('fonts/caveat-700.woff2'), weight: '700' });
loadFont({ family: 'Kalam', url: staticFile('fonts/kalam-400.woff2'), weight: '400' });
loadFont({ family: 'Kalam', url: staticFile('fonts/kalam-700.woff2'), weight: '700' });

export const W = 1920;
export const H = 1080;
export const INK = '#15121c';
export const HAND = 'Caveat';
export const LABEL = 'Kalam';
export const C = {
  navy: '#141a33', night: '#0b0f22', felt: '#1f4a36', feltD: '#173a2a', wood: '#5a3a26', woodD: '#3c2618',
  cream: '#f1e6cc', paper: '#f4ecd8', gold: '#e2b441', green: '#55d66b', greenD: '#1f7a3a', red: '#d8433b',
  warm: '#ffc76b', skin: '#f2c79a', skin2: '#c98d5e', skin3: '#f6d9b8', grey: '#8d93a6', steel: '#56607a',
};

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
export const lerp = (f: number, a: [number, number], b: [number, number], ease?: (n: number) => number) =>
  interpolate(f, a, b, { ...clamp, easing: ease });
export const easeOut = Easing.out(Easing.cubic);
export const easeIO = Easing.inOut(Easing.cubic);
/** 0 -> 1 pop with a small overshoot, starting at frame t. */
export const pop = (f: number, t: number, d = 9) => {
  const k = lerp(f, [t, t + d], [0, 1]);
  return k <= 0 ? 0 : 1 + 0.18 * Math.sin(k * Math.PI) * (1 - k) + (k - 1) * (1 - k) * 0 - (1 - k) * (1 - k);
};

// ------------------------------------------------------------------------------------------------ camera
type CamState = { x: number; y: number; z: number };
const CamCtx = createContext<CamState>({ x: 0, y: 0, z: 1 });

/** A camera move over a shot: zoom z (1 = full frame) and a pan in px, from -> to. Layers inside move by depth. */
export const Cam: React.FC<{
  f: number; d: number; z?: [number, number]; x?: [number, number]; y?: [number, number]; ease?: boolean;
  bg?: string; children: React.ReactNode;
}> = ({ f, d, z = [1, 1.08], x = [0, 0], y = [0, 0], ease, bg = C.night, children }) => {
  const e = ease ? easeIO : undefined;
  const st = { z: lerp(f, [0, d], z, e), x: lerp(f, [0, d], x, e), y: lerp(f, [0, d], y, e) };
  return (
    <CamCtx.Provider value={st}>
      <AbsoluteFill style={{ background: bg, overflow: 'hidden' }}>{children}</AbsoluteFill>
    </CamCtx.Provider>
  );
};

/** One parallax layer. depth 1 = moves fully with the camera (foreground action); 0.2 = far background. */
export const Layer: React.FC<{ depth?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ depth = 1, children, style }) => {
  const c = useContext(CamCtx);
  const z = 1 + (c.z - 1) * depth;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}
      style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '50% 50%', transform: `translate(${-c.x * depth}px, ${-c.y * depth}px) scale(${z})`, overflow: 'visible', ...style }}>
      {children}
    </svg>
  );
};

// ------------------------------------------------------------------------------------------------ lighting
export type Light = { x: number; y: number; r: number; ry?: number; power?: number; color?: string };

/** Night: a dark wash over the layer with holes of light, plus a warm glow at each light. Put it last in a Layer. */
export const Night: React.FC<{ id: string; lights: Light[]; amt?: number; tint?: string; glow?: number }> = ({ id, lights, amt = 0.78, tint = '#070a1c', glow = 0.32 }) => (
  <g>
    <defs>
      {lights.map((l, i) => (
        <radialGradient key={i} id={`${id}h${i}`}>
          <stop offset="0" stopColor="#000" stopOpacity={l.power ?? 1} />
          <stop offset="0.55" stopColor="#000" stopOpacity={(l.power ?? 1) * 0.55} />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      ))}
      {lights.map((l, i) => (
        <radialGradient key={i} id={`${id}g${i}`}>
          <stop offset="0" stopColor={l.color ?? C.warm} stopOpacity={glow} />
          <stop offset="1" stopColor={l.color ?? C.warm} stopOpacity="0" />
        </radialGradient>
      ))}
      <mask id={`${id}m`}>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#fff" />
        {lights.map((l, i) => <ellipse key={i} cx={l.x} cy={l.y} rx={l.r} ry={l.ry ?? l.r} fill={`url(#${id}h${i})`} />)}
      </mask>
    </defs>
    <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={tint} opacity={amt} mask={`url(#${id}m)`} />
    {lights.map((l, i) => <ellipse key={i} cx={l.x} cy={l.y} rx={l.r * 0.9} ry={(l.ry ?? l.r) * 0.9} fill={`url(#${id}g${i})`} style={{ mixBlendMode: 'screen' }} />)}
  </g>
);

/** Fixed finishing pass over every shot: vignette + paper grain. */
export const Finish: React.FC<{ v?: number }> = ({ v = 0.6 }) => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
    <defs>
      <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75">
        <stop offset="0.45" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity={v} />
      </radialGradient>
      <filter id="grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
        <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.9 -0.25" />
      </filter>
    </defs>
    <rect width={W} height={H} filter="url(#grain)" opacity="0.16" style={{ mixBlendMode: 'overlay' }} />
    <rect width={W} height={H} fill="url(#vig)" />
  </svg>
);

/** Soft out-of-focus light dots behind a close-up. */
export const Bokeh: React.FC<{ seed?: number; n?: number; color?: string; f: number }> = ({ seed = 1, n = 14, color = C.warm, f }) => (
  <g style={{ mixBlendMode: 'screen' }}>
    {Array.from({ length: n }).map((_, i) => {
      const r = (k: number) => { const v = Math.sin((i + 1) * 12.9898 * k + seed * 78.233) * 43758.5453; return v - Math.floor(v); };
      return <circle key={i} cx={r(1) * W} cy={r(2) * H * 0.7} r={24 + r(3) * 46} fill={color} opacity={0.05 + 0.07 * r(4) + 0.02 * Math.sin(f / 14 + i)} />;
    })}
  </g>
);

export const Rain: React.FC<{ f: number; n?: number; op?: number }> = ({ f, n = 90, op = 0.22 }) => (
  <g stroke="#cfe0ff" strokeWidth="2" opacity={op} strokeLinecap="round">
    {Array.from({ length: n }).map((_, i) => {
      const r = (k: number) => { const v = Math.sin((i + 1) * 91.7 * k) * 9973.1; return v - Math.floor(v); };
      const y = ((r(2) * H + f * (34 + r(3) * 14)) % (H + 80)) - 40;
      const x = r(1) * (W + 300) - 150 - y * 0.12;
      return <line key={i} x1={x} y1={y} x2={x - 4} y2={y + 30} />;
    })}
  </g>
);

// ------------------------------------------------------------------------------------------------ the bean
export type BeanLook = {
  skin?: string; body: string; hair?: 'short' | 'side' | 'bob' | 'bald' | 'tuft'; hairC?: string; glasses?: boolean;
  hat?: 'pilot' | 'wig' | 'guard'; tie?: string; stubble?: boolean; collar?: string;
};
export type BeanP = BeanLook & {
  x: number; y: number; s?: number; flip?: boolean; f: number; seed?: number;
  eyes?: 'open' | 'closed' | 'happy' | 'wide' | 'worried'; mouth?: 'line' | 'smile' | 'o' | 'frown' | 'talk' | 'smirk';
  look?: [number, number]; arms?: Array<[number, number] | null>; tilt?: number; bob?: number; legs?: boolean; walk?: number;
  lit?: number; litC?: string; hold?: React.ReactNode;
};

/** A bean: big round head, pill body, stick legs. (x, y) is where the feet stand. arms = [left hand, right hand] as
 *  offsets from the body centre (null = no arm drawn). lit = -1..1: which side the warm light falls on. */
export const Bean: React.FC<BeanP> = (p) => {
  const s = p.s ?? 1, skin = p.skin ?? C.skin, seed = p.seed ?? 0;
  const blink = (p.f + seed * 37) % 104 < 4;
  const eyes = blink && p.eyes !== 'happy' ? 'closed' : p.eyes ?? 'open';
  const bob = (p.bob ?? 1) * Math.sin((p.f + seed * 11) / 13) * 2.2;
  const wk = p.walk ? Math.sin(p.f * 0.55) * p.walk : 0;
  const [lx, ly] = p.look ?? [0, 0];
  const hy = -212 + bob, hr = 68, ow = 5.5;
  const talkOpen = p.mouth === 'talk' ? 5 + 9 * Math.abs(Math.sin(p.f * 0.62)) : 0;
  const lit = p.lit ?? 0;
  const cid = `b${Math.round(p.x)}_${Math.round(p.y)}_${seed}`;
  const arm = (a: [number, number] | null | undefined, side: number) => a ? (
    <g>
      <path d={`M ${side * 30} ${-128 + bob} Q ${(side * 30 + a[0]) / 2 + side * 14} ${(-128 + a[1]) / 2 + 22} ${a[0]} ${a[1]}`} fill="none" stroke={INK} strokeWidth={ow + 1} strokeLinecap="round" />
      <circle cx={a[0]} cy={a[1]} r={10} fill={skin} stroke={INK} strokeWidth={4} />
    </g>
  ) : null;
  return (
    <g transform={`translate(${p.x} ${p.y}) scale(${(p.flip ? -1 : 1) * s} ${s}) rotate(${p.tilt ?? 0})`}>
      <ellipse cx={0} cy={4} rx={62} ry={11} fill="#000" opacity={0.32} />
      {p.legs !== false && <g stroke={INK} strokeWidth={ow + 1} strokeLinecap="round">
        <line x1={-15} y1={-52} x2={-15 + wk * 10} y2={-4 - Math.max(0, wk) * 7} />
        <line x1={15} y1={-52} x2={15 - wk * 10} y2={-4 - Math.max(0, -wk) * 7} />
        <line x1={-15 + wk * 10} y1={-4 - Math.max(0, wk) * 7} x2={-1 + wk * 10} y2={-4 - Math.max(0, wk) * 7} />
        <line x1={15 - wk * 10} y1={-4 - Math.max(0, -wk) * 7} x2={29 - wk * 10} y2={-4 - Math.max(0, -wk) * 7} />
      </g>}
      {/* body */}
      <rect x={-40} y={-152 + bob} width={80} height={106} rx={40} fill={p.body} stroke={INK} strokeWidth={ow} />
      {p.collar && <path d={`M -16 ${-150 + bob} L 0 ${-128 + bob} L 16 ${-150 + bob}`} fill={p.collar} stroke={INK} strokeWidth={3} />}
      {p.tie && <path d={`M -6 ${-146 + bob} L 6 ${-146 + bob} L 9 ${-100 + bob} L 0 ${-88 + bob} L -9 ${-100 + bob} Z`} fill={p.tie} stroke={INK} strokeWidth={3} />}
      {lit !== 0 && <g>
        <clipPath id={`${cid}c`}><rect x={-40} y={-152 + bob} width={80} height={106} rx={40} /></clipPath>
        <ellipse cx={lit * 52} cy={-110 + bob} rx={34} ry={70} fill={p.litC ?? C.warm} opacity={0.28} clipPath={`url(#${cid}c)`} />
      </g>}
      {arm(p.arms?.[0], -1)}{arm(p.arms?.[1], 1)}
      {p.hold}
      {/* head */}
      <g transform={`translate(0 ${hy})`}>
        {p.hair === 'bob' && <path d={`M -74 30 Q -84 -78 0 -80 Q 84 -78 74 30 L 56 30 L 52 -20 L -52 -20 L -56 30 Z`} fill={p.hairC ?? INK} stroke={INK} strokeWidth={ow} />}
        <circle r={hr} fill={skin} stroke={INK} strokeWidth={ow} />
        {lit !== 0 && <g>
          <clipPath id={`${cid}h`}><circle r={hr - 2} /></clipPath>
          <ellipse cx={lit * 78} cy={-8} rx={50} ry={86} fill={p.litC ?? C.warm} opacity={0.3} clipPath={`url(#${cid}h)`} />
          <ellipse cx={-lit * 84} cy={10} rx={46} ry={90} fill="#0a0d24" opacity={0.26} clipPath={`url(#${cid}h)`} />
        </g>}
        {p.stubble && <path d={`M -52 22 Q 0 78 52 22 Q 30 60 0 62 Q -30 60 -52 22`} fill="#000" opacity={0.13} />}
        {p.hair === 'short' && <path d={`M -67 -8 Q -72 -74 0 -72 Q 72 -74 67 -8 Q 40 -40 0 -38 Q -40 -40 -67 -8`} fill={p.hairC ?? INK} stroke={INK} strokeWidth={ow} strokeLinejoin="round" />}
        {p.hair === 'side' && <path d={`M -68 -4 Q -74 -76 4 -72 Q 70 -70 68 -14 Q 30 -46 -20 -34 Q -50 -28 -68 -4`} fill={p.hairC ?? INK} stroke={INK} strokeWidth={ow} strokeLinejoin="round" />}
        {p.hair === 'tuft' && <path d={`M -40 -56 Q -30 -86 0 -74 Q 26 -90 42 -54 Q 0 -66 -40 -56`} fill={p.hairC ?? INK} stroke={INK} strokeWidth={ow} strokeLinejoin="round" />}
        {p.hair === 'bob' && <path d={`M -66 -14 Q -60 -72 0 -70 Q 60 -72 66 -14 Q 30 -42 0 -40 Q -30 -42 -66 -14`} fill={p.hairC ?? INK} />}
        {p.hat === 'pilot' && <g>
          <path d={`M -66 -30 Q -60 -92 0 -92 Q 60 -92 66 -30 Z`} fill="#1c2748" stroke={INK} strokeWidth={ow} strokeLinejoin="round" />
          <path d={`M -74 -30 Q 0 -52 74 -30 L 74 -20 Q 0 -40 -74 -20 Z`} fill={INK} />
          <circle cx={0} cy={-62} r={9} fill={C.gold} stroke={INK} strokeWidth={3} />
        </g>}
        {p.hat === 'guard' && <g>
          <path d={`M -64 -34 Q -58 -86 0 -86 Q 58 -86 64 -34 Z`} fill="#2a3350" stroke={INK} strokeWidth={ow} strokeLinejoin="round" />
          <path d={`M -20 -34 Q 40 -40 86 -22 L 84 -14 Q 40 -28 -20 -24 Z`} fill={INK} />
        </g>}
        {p.hat === 'wig' && <g fill="#e9e6de" stroke={INK} strokeWidth={ow} strokeLinejoin="round">
          <path d={`M -70 34 Q -92 -84 0 -84 Q 92 -84 70 34 L 52 34 Q 58 -30 0 -34 Q -58 -30 -52 34 Z`} />
          {[-48, -24, 0, 24, 48].map((x) => <path key={x} d={`M ${x - 11} -58 q 11 -12 22 0`} fill="none" strokeWidth={3} />)}
        </g>}
        {/* face */}
        <g transform={`translate(${lx * 9} ${ly * 7})`}>
          {eyes === 'open' && <><circle cx={-24} cy={-6} r={7} fill={INK} /><circle cx={24} cy={-6} r={7} fill={INK} /></>}
          {eyes === 'wide' && <><circle cx={-24} cy={-6} r={12} fill="#fff" stroke={INK} strokeWidth={3} /><circle cx={24} cy={-6} r={12} fill="#fff" stroke={INK} strokeWidth={3} /><circle cx={-24 + lx * 3} cy={-6} r={5} fill={INK} /><circle cx={24 + lx * 3} cy={-6} r={5} fill={INK} /></>}
          {eyes === 'closed' && <g stroke={INK} strokeWidth={5} strokeLinecap="round"><line x1={-33} y1={-5} x2={-15} y2={-5} /><line x1={15} y1={-5} x2={33} y2={-5} /></g>}
          {eyes === 'happy' && <g stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none"><path d="M -34 -3 q 10 -11 20 0" /><path d="M 14 -3 q 10 -11 20 0" /></g>}
          {eyes === 'worried' && <g><circle cx={-24} cy={-4} r={7} fill={INK} /><circle cx={24} cy={-4} r={7} fill={INK} /><g stroke={INK} strokeWidth={5} strokeLinecap="round"><line x1={-38} y1={-20} x2={-16} y2={-28} /><line x1={38} y1={-20} x2={16} y2={-28} /></g></g>}
          {p.glasses && <g fill="rgba(255,255,255,0.14)" stroke={INK} strokeWidth={4}><circle cx={-24} cy={-6} r={17} /><circle cx={24} cy={-6} r={17} /><line x1={-7} y1={-6} x2={7} y2={-6} /></g>}
          {(p.mouth ?? 'line') === 'line' && <line x1={-12} y1={28} x2={12} y2={28} stroke={INK} strokeWidth={5} strokeLinecap="round" />}
          {p.mouth === 'smile' && <path d="M -16 24 q 16 16 32 0" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />}
          {p.mouth === 'smirk' && <path d="M -10 28 q 14 8 24 -6" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />}
          {p.mouth === 'frown' && <path d="M -14 32 q 14 -12 28 0" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />}
          {p.mouth === 'o' && <ellipse cx={0} cy={30} rx={8} ry={10} fill={INK} />}
          {p.mouth === 'talk' && <ellipse cx={0} cy={28} rx={11} ry={talkOpen / 1.4 + 2} fill={INK} />}
        </g>
      </g>
    </g>
  );
};

// ------------------------------------------------------------------------------------------------ dossier kit
export type Word = { w: string; s: number; e: number; p: string };

/** The black card: one line of narration in handwriting, typed on in time with the voice. `start` = the frame the
 *  card began (global), words carry global seconds. */
export const TypeCard: React.FC<{ words: Word[]; fps: number; gf: number; size?: number; title?: boolean }> = ({ words, fps, gf, size = 76, title }) => {
  const parts: Array<{ ch: string; t: number }> = [];
  words.forEach((w, i) => {
    const txt = (i ? ' ' : '') + w.w + (w.p || '');
    const s = w.s * fps, e = Math.max(s + 2, w.e * fps - 1);
    [...txt].forEach((ch, k) => parts.push({ ch, t: s + ((e - s) * k) / txt.length }));
  });
  return (
    <AbsoluteFill style={{ background: '#050507', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, color: '#f6f1e6', maxWidth: 1500, textAlign: 'center', lineHeight: 1.25, letterSpacing: title ? 2 : 0.5, whiteSpace: 'pre-wrap' }}>
        {parts.map((c, i) => <span key={i} style={{ opacity: gf >= c.t ? 1 : 0 }}>{c.ch}</span>)}
      </div>
    </AbsoluteFill>
  );
};

/** Name tag that slides in with a dotted connector to a point (the person). */
export const NameTag: React.FC<{ f: number; at: number; x: number; y: number; name: string; sub?: string; to?: [number, number]; color?: string }> = ({ f, at, x, y, name, sub, to, color = C.green }) => {
  const k = lerp(f, [at, at + 10], [0, 1], easeOut);
  if (k <= 0) return null;
  const w = Math.max(name.length * 27 + 60, (sub?.length ?? 0) * 18 + 60);
  return (
    <g opacity={k}>
      {to && <line x1={x} y1={y + 30} x2={x + (to[0] - x) * k} y2={y + 30 + (to[1] - y - 30) * k} stroke="#fff" strokeWidth={3} strokeDasharray="3 9" strokeLinecap="round" opacity={0.85} />}
      <g transform={`translate(${x + (1 - k) * 60} ${y})`}>
        <rect x={0} y={0} width={w} height={sub ? 96 : 60} fill="#0c0e16" opacity={0.86} />
        <rect x={0} y={0} width={6} height={sub ? 96 : 60} fill={color} />
        <text x={26} y={43} fontFamily={LABEL} fontWeight={700} fontSize={38} fill="#fff" letterSpacing={1.5}>{name.toUpperCase()}</text>
        {sub && <text x={26} y={80} fontFamily={LABEL} fontSize={27} fill={color} letterSpacing={2}>{sub.toUpperCase()}</text>}
      </g>
    </g>
  );
};

/** Small location / date tag in a corner. */
export const LocTag: React.FC<{ f: number; at?: number; x?: number; y?: number; text: string }> = ({ f, at = 6, x = 70, y = 940, text }) => {
  const k = lerp(f, [at, at + 10], [0, 1], easeOut);
  const w = text.length * 21 + 50;
  return k <= 0 ? null : (
    <g transform={`translate(${x - (1 - k) * 40} ${y})`} opacity={k}>
      <rect width={w} height={60} fill="#0c0e16" opacity={0.82} />
      <rect width={5} height={60} fill="#fff" />
      <text x={26} y={42} fontFamily={LABEL} fontWeight={700} fontSize={34} fill="#fff" letterSpacing={2.5}>{text.toUpperCase()}</text>
    </g>
  );
};

/** A rubber stamp that slams down at frame `at`. */
export const Stamp: React.FC<{ f: number; at: number; x: number; y: number; text: string; rot?: number; color?: string; size?: number }> = ({ f, at, x, y, text, rot = -12, color = C.red, size = 64 }) => {
  if (f < at) return null;
  const k = lerp(f, [at, at + 5], [2.4, 1], easeOut);
  const w = text.length * size * 0.62 + 50;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`} opacity={lerp(f, [at, at + 3], [0, 0.92])}>
      <rect x={-w / 2} y={-size * 0.75} width={w} height={size * 1.5} fill="none" stroke={color} strokeWidth={8} rx={8} />
      <text x={0} y={size * 0.34} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={size} fill={color} letterSpacing={4}>{text}</text>
    </g>
  );
};

/** A number that counts up from `from` to `to` between two frames. */
export const count = (f: number, a: number, b: number, from: number, to: number) => Math.round(lerp(f, [a, b], [from, to], easeOut));
export const euro = (n: number) => '€' + n.toLocaleString('en-US');

/** A sheet of paper with ruled lines (for files, ledgers, warrants). */
export const Paper: React.FC<{ x: number; y: number; w: number; h: number; rot?: number; lines?: number; fill?: string; children?: React.ReactNode }> = ({ x, y, w, h, rot = 0, lines = 0, fill = C.paper, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={6} y={8} width={w} height={h} fill="#000" opacity={0.3} />
    <rect width={w} height={h} fill={fill} stroke={INK} strokeWidth={5} />
    {Array.from({ length: lines }).map((_, i) => <line key={i} x1={40} x2={w - 40} y1={h - 50 - i * 46} y2={h - 50 - i * 46} stroke="#b9ad92" strokeWidth={3} />)}
    {children}
  </g>
);

/** A hand reaching in (an arm sleeve + a skin hand), pointing from (x0,y0) to (x,y). */
export const Hand: React.FC<{ x: number; y: number; x0: number; y0: number; sleeve?: string; skin?: string; pen?: boolean }> = ({ x, y, x0, y0, sleeve = '#22252f', skin = C.skin, pen }) => {
  const a = (Math.atan2(y - y0, x - x0) * 180) / Math.PI;
  const len = Math.hypot(x - x0, y - y0);
  return (
    <g transform={`translate(${x0} ${y0}) rotate(${a})`}>
      <rect x={0} y={-46} width={len - 70} height={92} fill={sleeve} stroke={INK} strokeWidth={6} />
      <rect x={len - 84} y={-50} width={22} height={100} fill="#fff" stroke={INK} strokeWidth={5} />
      <ellipse cx={len - 30} cy={0} rx={44} ry={38} fill={skin} stroke={INK} strokeWidth={6} />
      {pen && <g transform={`translate(${len - 10} 0) rotate(38)`}><rect x={-10} y={-90} width={18} height={150} rx={6} fill="#1b1d26" stroke={INK} strokeWidth={4} /><path d="M -8 60 L 0 84 L 8 60 Z" fill={C.gold} stroke={INK} strokeWidth={3} /></g>}
    </g>
  );
};
