import React from 'react';

// The doodle rig: the POV world-building look (research/style_ref5): long thin stick limbs, a small flat torso, a round
// flat head, scribbled hair, dot eyes and wobbly ink outlines, no shading. Limited animation by design: poses hold,
// faces swap, arms move, the energy comes from cuts and effects.

export type DHair = 'afro' | 'locs' | 'bob' | 'spiky' | 'bald' | 'bun' | 'braids' | 'short' | 'curly';
export type DExpr = 'neutral' | 'happy' | 'smug' | 'shock' | 'worried' | 'angry' | 'sad' | 'think' | 'blank';
export type DLook = {
  skin: string; hair: DHair; hairCol: string; shirt: string; shirt2?: string;
  top?: 'tee' | 'suit' | 'hivis' | 'robe' | 'hoodie' | 'dress'; tie?: string; beanie?: string; beanieBand?: string;
  iris?: string; specs?: boolean; legs?: string; h?: number; // h: height factor (kids ~0.75)
};
export type DPose = {
  x: number; ground: number; scale?: number; facing?: 1 | -1; expr?: DExpr; blink?: number; talk?: number;
  armL?: [number, number]; armR?: [number, number]; // [shoulder angle from straight down (deg, + = outwards), elbow bend]
  walk?: number; // walk phase in radians (0 = standing)
  tilt?: number; bob?: number; lookX?: number; // lookX -1..1 moves the eyes
  sit?: boolean;
};

export const INK = '#1A1418';
const W = 5; // line width at scale 1

export const DoodleDefs: React.FC = () => (
  <defs>
    <filter id="dwob" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={3} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={4} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
);

const rad = (d: number) => (d * Math.PI) / 180;
const limb = (x: number, y: number, a: number, b: number, l1: number, l2: number, side: 1 | -1) => {
  // a: angle from straight down, measured outwards for this side; b: elbow/knee bend
  const a1 = rad(a) * side;
  const ex = x + Math.sin(a1) * l1;
  const ey = y + Math.cos(a1) * l1;
  const a2 = a1 + rad(b) * side;
  return { ex, ey, hx: ex + Math.sin(a2) * l2, hy: ey + Math.cos(a2) * l2 };
};

const Hair: React.FC<{ k: DHair; c: string; r: number; back?: boolean }> = ({ k, c, r, back }) => {
  const s = { fill: c, stroke: INK, strokeWidth: W * 0.8, strokeLinejoin: 'round' as const };
  if (k === 'bald') return null;
  if (k === 'afro' || k === 'curly') {
    if (!back) return null;
    const n = k === 'afro' ? 14 : 10;
    const R = k === 'afro' ? r * 1.35 : r * 1.12;
    return <g>{Array.from({ length: n }).map((_, i) => { const a = (i / n) * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * R * 0.7} cy={-r * 0.35 + Math.sin(a) * R * 0.62} r={R * 0.42} {...s} />; })}
      <ellipse cx={0} cy={-r * 0.35} rx={R * 0.8} ry={R * 0.66} fill={c} /></g>;
  }
  if (k === 'locs') {
    if (back) return <g>{[-1, 1].map((sd) => [0, 1, 2].map((j) => <rect key={`${sd}${j}`} x={sd * (r * 0.78 + j * r * 0.2) - r * 0.13} y={-r * 0.35} width={r * 0.26} height={r * (1.5 - j * 0.12)} rx={r * 0.13} {...s} />))}</g>;
    return null;
  }
  if (k === 'bob') return back ? <path d={`M ${-r * 1.08} ${r * 0.4} Q ${-r * 1.2} ${-r * 1.3} 0 ${-r * 1.2} Q ${r * 1.2} ${-r * 1.3} ${r * 1.08} ${r * 0.4} Z`} {...s} /> : <path d={`M ${-r * 0.95} ${-r * 0.2} Q ${-r * 0.6} ${-r * 1.05} ${r * 0.2} ${-r * 0.95} Q ${r * 0.9} ${-r * 0.9} ${r * 0.95} ${-r * 0.2} Q ${r * 0.3} ${-r * 0.65} ${-r * 0.95} ${-r * 0.2} Z`} {...s} />;
  if (k === 'braids') return back ? <g>{[-1, 1].map((sd) => <rect key={sd} x={sd * r * 0.9 - r * 0.16} y={-r * 0.3} width={r * 0.32} height={r * 1.9} rx={r * 0.16} {...s} />)}</g> : <path d={`M ${-r * 0.98} ${-r * 0.1} Q ${-r * 0.8} ${-r * 1.08} 0 ${-r * 1.04} Q ${r * 0.8} ${-r * 1.08} ${r * 0.98} ${-r * 0.1} Q 0 ${-r * 0.7} ${-r * 0.98} ${-r * 0.1} Z`} {...s} />;
  if (k === 'bun') return back ? <circle cx={0} cy={-r * 1.15} r={r * 0.38} {...s} /> : <path d={`M ${-r * 0.98} ${-r * 0.15} Q ${-r * 0.8} ${-r * 1.08} 0 ${-r * 1.04} Q ${r * 0.8} ${-r * 1.08} ${r * 0.98} ${-r * 0.15} Q 0 ${-r * 0.65} ${-r * 0.98} ${-r * 0.15} Z`} {...s} />;
  if (k === 'spiky') return back ? null : <path d={`M ${-r * 0.95} ${-r * 0.3} L ${-r * 0.8} ${-r * 1.25} L ${-r * 0.45} ${-r * 0.85} L ${-r * 0.2} ${-r * 1.35} L ${r * 0.1} ${-r * 0.9} L ${r * 0.4} ${-r * 1.3} L ${r * 0.6} ${-r * 0.85} L ${r * 0.95} ${-r * 1.1} L ${r * 0.95} ${-r * 0.3} Q 0 ${-r * 0.6} ${-r * 0.95} ${-r * 0.3} Z`} {...s} />;
  // short
  return back ? null : <path d={`M ${-r * 0.97} ${-r * 0.25} Q ${-r * 0.9} ${-r * 1.08} 0 ${-r * 1.05} Q ${r * 0.9} ${-r * 1.08} ${r * 0.97} ${-r * 0.25} Q 0 ${-r * 0.75} ${-r * 0.97} ${-r * 0.25} Z`} {...s} />;
};

const Face: React.FC<{ e: DExpr; r: number; blink: number; talk: number; iris?: string; lookX: number; specs?: boolean }> = ({ e, r, blink, talk, iris, lookX, specs }) => {
  const ex = r * 0.36;
  const ey = -r * 0.08;
  const lx = lookX * r * 0.12;
  const shut = blink > 0.5;
  const eye = (sx: number) => {
    const cx = sx * ex + lx;
    if (shut || e === 'happy') return <path d={`M ${cx - r * 0.13} ${ey} Q ${cx} ${ey - r * 0.12} ${cx + r * 0.13} ${ey}`} stroke={INK} strokeWidth={W * 0.8} fill="none" strokeLinecap="round" />;
    const er = e === 'shock' ? r * 0.17 : r * 0.12;
    return iris ? <g><circle cx={cx} cy={ey} r={er * 1.25} fill="#fff" stroke={INK} strokeWidth={W * 0.6} /><circle cx={cx} cy={ey} r={er * 0.85} fill={iris} /><circle cx={cx} cy={ey} r={er * 0.38} fill={INK} /></g>
      : <circle cx={cx} cy={ey} r={er * 0.75} fill={INK} />;
  };
  const brow = (sx: number) => {
    const cx = sx * ex + lx;
    const by = ey - r * 0.32;
    const t = e === 'angry' ? 0.18 : e === 'worried' || e === 'sad' ? -0.15 : e === 'smug' ? (sx < 0 ? 0.08 : -0.05) : e === 'shock' ? -0.02 : 0;
    const lift = e === 'shock' ? -r * 0.12 : 0;
    return <path d={`M ${cx - r * 0.17} ${by + lift + sx * t * r} L ${cx + r * 0.17} ${by + lift - sx * t * r}`} stroke={INK} strokeWidth={W * 0.8} strokeLinecap="round" />;
  };
  const my = r * 0.42;
  let mouth: React.ReactNode;
  if (talk > 0.3 || e === 'shock') mouth = <ellipse cx={lx * 0.5} cy={my} rx={r * 0.14} ry={r * (e === 'shock' ? 0.18 : 0.1)} fill={INK} />;
  else if (e === 'happy') mouth = <path d={`M ${-r * 0.25} ${my - r * 0.05} Q 0 ${my + r * 0.25} ${r * 0.25} ${my - r * 0.05} Z`} fill={INK} />;
  else if (e === 'smug') mouth = <path d={`M ${-r * 0.2} ${my} Q ${r * 0.05} ${my + r * 0.08} ${r * 0.24} ${my - r * 0.12}`} stroke={INK} strokeWidth={W * 0.8} fill="none" strokeLinecap="round" />;
  else if (e === 'sad' || e === 'worried') mouth = <path d={`M ${-r * 0.2} ${my + r * 0.06} Q 0 ${my - r * 0.1} ${r * 0.2} ${my + r * 0.06}`} stroke={INK} strokeWidth={W * 0.8} fill="none" strokeLinecap="round" />;
  else if (e === 'angry') mouth = <path d={`M ${-r * 0.22} ${my + r * 0.04} L ${r * 0.22} ${my - r * 0.02}`} stroke={INK} strokeWidth={W * 0.9} strokeLinecap="round" />;
  else if (e === 'think') mouth = <path d={`M ${-r * 0.1} ${my} L ${r * 0.18} ${my - r * 0.04}`} stroke={INK} strokeWidth={W * 0.8} strokeLinecap="round" />;
  else if (e === 'blank') mouth = <path d={`M ${-r * 0.16} ${my} L ${r * 0.16} ${my}`} stroke={INK} strokeWidth={W * 0.8} strokeLinecap="round" />;
  else mouth = <path d={`M ${-r * 0.16} ${my} Q 0 ${my + r * 0.07} ${r * 0.16} ${my}`} stroke={INK} strokeWidth={W * 0.8} fill="none" strokeLinecap="round" />;
  return (
    <g>
      {eye(-1)}{eye(1)}{brow(-1)}{brow(1)}{mouth}
      {specs ? <g stroke={INK} strokeWidth={W * 0.6} fill="none"><circle cx={-ex + lx} cy={ey} r={r * 0.24} /><circle cx={ex + lx} cy={ey} r={r * 0.24} /><path d={`M ${-ex + lx + r * 0.24} ${ey} L ${ex + lx - r * 0.24} ${ey}`} /></g> : null}
    </g>
  );
};

/** One doodle character. Feet on `ground` at `x`. Height at scale 1 is about 330 px. */
export const Doodle: React.FC<{ look: DLook; pose: DPose }> = ({ look: L, pose: P }) => {
  const s = (P.scale ?? 1) * (L.h ?? 1);
  const f = P.facing ?? 1;
  const legLen = P.sit ? 0 : 150;
  const torsoH = 82;
  const torsoW = L.top === 'robe' || L.top === 'dress' ? 70 : 58;
  const r = 50;
  const bob = (P.bob ?? 0) + (P.walk ? Math.abs(Math.sin(P.walk)) * -6 : 0);
  const hipY = -legLen + bob;
  const shY = hipY - torsoH + 10;
  const headY = shY - r * 0.95;
  const ink = { stroke: INK, strokeWidth: W, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const legs = P.sit
    ? <g {...ink}><path d={`M -14 ${hipY} L -14 ${hipY + 4} L 46 ${hipY + 6} L 46 ${hipY + 70}`} /><path d={`M 14 ${hipY} L 14 ${hipY + 4} L 72 ${hipY + 6} L 72 ${hipY + 70}`} /></g>
    : <g {...ink} stroke={L.legs ?? INK}>{[-1, 1].map((sd) => {
        const sw = P.walk ? Math.sin(P.walk + (sd > 0 ? Math.PI : 0)) * 24 : 0;
        const l = limb(sd * 12, hipY, sd * 4 + sw * sd, P.walk ? Math.max(0, -Math.cos(P.walk + (sd > 0 ? Math.PI : 0))) * -20 * sd : 0, legLen * 0.52, legLen * 0.5, sd as 1 | -1);
        return <g key={sd}><path d={`M ${sd * 12} ${hipY} L ${l.ex} ${l.ey} L ${l.hx} ${Math.min(l.hy, 0)}`} /><path d={`M ${l.hx} ${Math.min(l.hy, 0)} l ${f * 14} 0`} strokeWidth={W * 1.3} /></g>;
      })}</g>;
  const arm = (sd: 1 | -1, v: [number, number] | undefined) => {
    const [a, b] = v ?? [12, -8];
    const l = limb(sd * (torsoW / 2 - 4), shY + 6, a, b, 62, 58, sd);
    return <g key={sd}><path d={`M ${sd * (torsoW / 2 - 4)} ${shY + 6} L ${l.ex} ${l.ey} L ${l.hx} ${l.hy}`} {...ink} /><circle cx={l.hx} cy={l.hy} r={7} fill={L.skin} stroke={INK} strokeWidth={W * 0.7} /></g>;
  };
  const top = L.top ?? 'tee';
  return (
    <g transform={`translate(${P.x} ${P.ground}) scale(${s}) rotate(${P.tilt ?? 0} 0 ${hipY})`} filter="url(#dwob)">
      <ellipse cx={0} cy={4} rx={46} ry={8} fill="#000" opacity={0.14} />
      {legs}
      {arm(-1, f > 0 ? P.armL : P.armR)}
      {/* torso */}
      <path d={top === 'robe' || top === 'dress' ? `M ${-torsoW / 2 + 6} ${shY} L ${torsoW / 2 - 6} ${shY} L ${torsoW / 2 + 8} ${hipY + 26} L ${-torsoW / 2 - 8} ${hipY + 26} Z` : `M ${-torsoW / 2} ${shY + 8} Q ${-torsoW / 2} ${shY} ${-torsoW / 2 + 10} ${shY} L ${torsoW / 2 - 10} ${shY} Q ${torsoW / 2} ${shY} ${torsoW / 2} ${shY + 8} L ${torsoW / 2 - 2} ${hipY + 6} L ${-torsoW / 2 + 2} ${hipY + 6} Z`}
        fill={L.shirt} stroke={INK} strokeWidth={W} strokeLinejoin="round" />
      {top === 'suit' ? <g><path d={`M -10 ${shY} L 0 ${shY + 22} L 10 ${shY}`} fill={L.shirt2 ?? '#F4F1EA'} stroke={INK} strokeWidth={W * 0.6} />{L.tie ? <path d={`M 0 ${shY + 10} l -7 12 l 7 34 l 7 -34 z`} fill={L.tie} stroke={INK} strokeWidth={W * 0.5} /> : null}</g> : null}
      {top === 'hivis' ? <g><rect x={-torsoW / 2 + 2} y={shY + 34} width={torsoW - 4} height={9} fill="#E9E2D3" /><rect x={-torsoW / 2 + 2} y={shY + 52} width={torsoW - 4} height={9} fill="#E9E2D3" /></g> : null}
      {top === 'hoodie' ? <path d={`M -16 ${shY + 2} Q 0 ${shY + 20} 16 ${shY + 2}`} stroke={INK} strokeWidth={W * 0.6} fill="none" /> : null}
      {arm(1, f > 0 ? P.armR : P.armL)}
      {/* head */}
      <g transform={`translate(0 ${headY})`}>
        <Hair k={L.hair} c={L.hairCol} r={r} back />
        <ellipse cx={0} cy={0} rx={r * 0.98} ry={r} fill={L.skin} stroke={INK} strokeWidth={W} />
        <Face e={P.expr ?? 'neutral'} r={r} blink={P.blink ?? 0} talk={P.talk ?? 0} iris={L.iris} lookX={(P.lookX ?? 0.2) * f} specs={L.specs} />
        <Hair k={L.hair} c={L.hairCol} r={r} />
        {L.beanie ? <g><path d={`M ${-r * 1.02} ${-r * 0.42} Q ${-r * 1.05} ${-r * 1.42} 0 ${-r * 1.42} Q ${r * 1.05} ${-r * 1.42} ${r * 1.02} ${-r * 0.42} Z`} fill={L.beanie} stroke={INK} strokeWidth={W} />
          <rect x={-r * 1.08} y={-r * 0.62} width={r * 2.16} height={r * 0.3} rx={r * 0.12} fill={L.beanieBand ?? '#EFE6D2'} stroke={INK} strokeWidth={W * 0.8} />
          <rect x={r * 0.45} y={-r * 0.57} width={r * 0.3} height={r * 0.2} fill="#D3202A" /></g> : null}
      </g>
    </g>
  );
};

/** Head height above the ground for a pose (for placing thought bubbles). */
export const doodleHeadY = (ground: number, scale = 1, h = 1, sit = false) => ground - (sit ? 82 + 48 : 150 + 82 + 38) * scale * h;

/** The cast in the doodle style. Shamz keeps his identity: brown skin, red eyes, orange locs, green beanie. */
export const DLOOKS = {
  shamz: { skin: '#7A4A2C', hair: 'locs', hairCol: '#F08A1C', shirt: '#2F6B48', beanie: '#2F6B48', beanieBand: '#EFE6D2', iris: '#D3202A' } as DLook,
  mo: { skin: '#C98E68', hair: 'curly', hairCol: '#2A1C18', shirt: '#E9C46A' } as DLook,
  date: { skin: '#F2D3B8', hair: 'bob', hairCol: '#8A3E2A', shirt: '#E46BA6', top: 'dress' } as DLook,
  dateGuy: { skin: '#E8C4A0', hair: 'short', hairCol: '#3A2A20', shirt: '#3A86FF', top: 'suit', tie: '#2A2E44' } as DLook,
  boss: { skin: '#D9B48A', hair: 'bald', hairCol: '#000', shirt: '#2B2F3A', top: 'suit', tie: '#C8382E', specs: true } as DLook,
  student1: { skin: '#AE734B', hair: 'braids', hairCol: '#1E1410', shirt: '#5E7A9A', h: 0.86 } as DLook,
  student2: { skin: '#F2D3B8', hair: 'spiky', hairCol: '#E9C46A', shirt: '#8AB86A', h: 0.86 } as DLook,
  student3: { skin: '#8E5A38', hair: 'short', hairCol: '#1E1410', shirt: '#E5484D', h: 0.86 } as DLook,
  judge: { skin: '#EECBA8', hair: 'bun', hairCol: '#D9D4CC', shirt: '#1E1A22', top: 'robe', specs: true } as DLook,
  lawyer: { skin: '#C79067', hair: 'short', hairCol: '#1E1410', shirt: '#4A4E5A', top: 'suit', tie: '#3A86FF' } as DLook,
  poker1: { skin: '#E8C4A0', hair: 'short', hairCol: '#5A3A2A', shirt: '#1E1A22', top: 'suit', tie: '#B98CFF', specs: true } as DLook,
  poker2: { skin: '#714429', hair: 'bald', hairCol: '#000', shirt: '#7A2E3A', top: 'suit' } as DLook,
  shopkeeper: { skin: '#DDAE84', hair: 'bun', hairCol: '#2A1C18', shirt: '#F28C6A' } as DLook,
  extraA: { skin: '#F7E1CC', hair: 'short', hairCol: '#C8382E', shirt: '#3FA36B' } as DLook,
  extraB: { skin: '#55321E', hair: 'afro', hairCol: '#1E1410', shirt: '#F2B33D' } as DLook,
  extraC: { skin: '#EECBA8', hair: 'bob', hairCol: '#1E1410', shirt: '#B98CFF', top: 'dress' } as DLook,
  extraD: { skin: '#C98E68', hair: 'spiky', hairCol: '#3A2A20', shirt: '#8FB8DE', top: 'hoodie' } as DLook,
  watcher: { skin: '#2A2430', hair: 'short', hairCol: '#14121C', shirt: '#14121C', top: 'hoodie', iris: '#FF3B3B' } as DLook,
};

/** A thought bubble: a cloud with the thought written in it, and a tail of small circles to the head. */
export const Thought: React.FC<{ x: number; y: number; hx: number; hy: number; text: string; t: number; w?: number; size?: number; whisper?: boolean; col?: string }> = ({ x, y, hx, hy, text, t, w = 360, size = 38, whisper, col = '#FFFFFF' }) => {
  const on = Math.max(0, Math.min(1, t / 5));
  const sc = 0.6 + 0.4 * on;
  const lines = text.split('\n');
  const h = 70 + lines.length * size * 1.1;
  const bumps = 10;
  return (
    <g opacity={on * (whisper ? 0.55 : 1)}>
      {[0.25, 0.5, 0.72].map((k, i) => <circle key={i} cx={hx + (x - hx) * k} cy={hy + (y + h / 2 - hy) * k} r={6 + i * 5} fill={col} stroke={INK} strokeWidth={3} />)}
      <g transform={`translate(${x} ${y}) scale(${sc})`}>
        {Array.from({ length: bumps }).map((_, i) => { const a = (i / bumps) * Math.PI * 2; return <ellipse key={i} cx={Math.cos(a) * w * 0.44} cy={Math.sin(a) * h * 0.42} rx={w * 0.17} ry={h * 0.3} fill={col} stroke={INK} strokeWidth={4} />; })}
        <ellipse cx={0} cy={0} rx={w * 0.48} ry={h * 0.44} fill={col} />
        {lines.map((l, i) => <text key={i} x={0} y={(i - (lines.length - 1) / 2) * size * 1.1 + size * 0.35} textAnchor="middle" fontFamily="Kalam" fontSize={whisper ? size * 0.8 : size} fill={INK} fontStyle={whisper ? 'italic' : 'normal'}>{l}</text>)}
      </g>
    </g>
  );
};

/** The 3-metre hearing radius: a dashed ring on the floor around someone. */
export const HearRing: React.FC<{ x: number; ground: number; r: number; t: number; col?: string }> = ({ x, ground, r, t, col = '#3A86FF' }) => {
  const on = Math.max(0, Math.min(1, t / 8));
  return <ellipse cx={x} cy={ground} rx={r * on} ry={r * 0.22 * on} fill={col} fillOpacity={0.12} stroke={col} strokeWidth={4} strokeDasharray="16 12" strokeDashoffset={-t * 2} />;
};
