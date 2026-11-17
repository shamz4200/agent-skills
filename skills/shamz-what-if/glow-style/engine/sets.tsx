// Glow style sets: line-art night rooms and data shots. Each set takes (f, d, p) and draws inside a Cam.
import React, { useContext } from 'react';
import { AbsoluteFill, random } from 'remotion';
import { Bubble, BigStat, Cam, Cite, clamp, DetailCtx, Dust, easeOut, Fig, Head, Plate, G, H, lerp, MONO, SANS, Tag, W, walk, blend, View } from './glow';

export type SP = { f: number; d: number; p: any; m: Record<string, number> };
const L = { stroke: G.line, strokeWidth: 3.2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

// ------------------------------------------------------------------ room pieces
export const Wall: React.FC<{ warm?: boolean; floorY?: number }> = ({ warm, floorY = 860 }) => (
  <g>
    <rect x={-400} y={-300} width={W + 800} height={floorY + 300} fill={warm ? 'url(#wallWarm)' : 'url(#wallG)'} />
    {Array.from({ length: 34 }).map((_, i) => <line key={i} x1={-400 + i * 80} y1={-300} x2={-400 + i * 80} y2={floorY} stroke="#ffffff" opacity={0.035} strokeWidth={2} />)}
    {Array.from({ length: 16 }).map((_, i) => <line key={`h${i}`} x1={-400} y1={-300 + i * 80} x2={W + 400} y2={-300 + i * 80} stroke="#ffffff" opacity={0.025} strokeWidth={2} />)}
    <rect x={-400} y={floorY} width={W + 800} height={H - floorY + 300} fill={warm ? '#1f1620' : G.floor} />
    <line x1={-400} y1={floorY} x2={W + 400} y2={floorY} stroke={warm ? '#c79a6a' : G.lineDim} strokeWidth={3} opacity={0.7} />
    <rect x={-400} y={floorY - 26} width={W + 800} height={26} fill={warm ? '#2c2028' : '#141c44'} />
  </g>
);
export const Window: React.FC<{ x: number; y: number; w?: number; h?: number; f: number; warm?: boolean }> = ({ x, y, w = 420, h = 340, f, warm }) => (
  <g>
    <circle cx={x + w * 0.5} cy={y + h * 0.4} r={w * 0.8} fill="url(#moonPool)" opacity={warm ? 0.3 : 0.6} />
    <rect x={x} y={y} width={w} height={h} fill={warm ? '#1d2a66' : G.win} {...L} />
    {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={x + 20 + random(`ws${i}`) * (w - 40)} cy={y + 20 + random(`wy${i}`) * (h * 0.6)} r={1.5 + random(`wr${i}`) * 1.5} fill="#fff" opacity={0.4 + 0.5 * Math.abs(Math.sin(f / 15 + i))} />)}
    <circle cx={x + w * 0.72} cy={y + h * 0.3} r={w * 0.11} fill={G.moon} filter="url(#bloom)" />
    <path d={`M ${x} ${y + h * 0.8} Q ${x + w * 0.3} ${y + h * 0.66} ${x + w * 0.6} ${y + h * 0.76} T ${x + w} ${y + h * 0.7} L ${x + w} ${y + h} L ${x} ${y + h} Z`} fill="#16245c" />
    <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} {...L} />
    <rect x={x - 14} y={y + h} width={w + 28} height={14} fill={G.fill} {...L} />
  </g>
);
export const Lamp: React.FC<{ x: number; y: number; on?: number }> = ({ x, y, on = 1 }) => (
  <g>
    <circle cx={x} cy={y + 40} r={260} fill="url(#warmPool)" opacity={on} />
    <path d={`M ${x} ${y + 60} q 0 40 -26 60`} stroke="#c9a066" strokeWidth={5} fill="none" />
    <path d={`M ${x - 40} ${y + 60} L ${x - 26} ${y} L ${x + 26} ${y} L ${x + 40} ${y + 60} Z`} fill={on > 0.5 ? '#ffd88f' : '#5a5060'} filter="url(#bloom)" />
  </g>
);
export const Door: React.FC<{ x: number; floorY?: number; open?: number; warm?: boolean }> = ({ x, floorY = 860, open = 0, warm }) => (
  <g>
    <rect x={x} y={floorY - 420} width={210} height={420} fill={open ? '#ffcf86' : G.fill} {...L} opacity={1} />
    {open > 0 && <rect x={x} y={floorY - 420} width={210} height={420} fill="url(#warmPool)" />}
    <path d={`M ${x} ${floorY - 420} L ${x + 210 * (1 - open * 0.75)} ${floorY - 420 + open * 30} L ${x + 210 * (1 - open * 0.75)} ${floorY - open * 30} L ${x} ${floorY} Z`} fill={warm ? '#3a2a2c' : '#18214a'} {...L} />
    <circle cx={x + 180 * (1 - open * 0.75)} cy={floorY - 210} r={7} fill={G.line} />
  </g>
);
export const Shelf: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x} y={y} width={240} height={10} fill={G.fill} {...L} />
    {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={x + 16 + i * 30} y={y - 54 + (i % 3) * 6} width={22} height={54 - (i % 3) * 6} fill="#1a2350" {...L} strokeWidth={2.4} />)}
    <circle cx={x + 214} cy={y - 18} r={16} fill="#1a2350" {...L} strokeWidth={2.4} />
  </g>
);
export const Plant: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g>
    {[-40, -15, 10, 35].map((a, i) => <path key={i} d={`M ${x} ${y - 50} q ${a * 0.6 + Math.sin(f / 30 + i) * 3} -50 ${a * 1.4} -110`} stroke="#3c7a5c" strokeWidth={10} fill="none" strokeLinecap="round" />)}
    <path d={`M ${x - 34} ${y - 60} L ${x + 34} ${y - 60} L ${x + 26} ${y} L ${x - 26} ${y} Z`} fill={G.fill} {...L} />
  </g>
);
export const Bed: React.FC<{ x: number; floorY?: number; w?: number; children?: React.ReactNode; warm?: boolean }> = ({ x, floorY = 860, w = 860, children, warm }) => (
  <g>
    <rect x={x} y={floorY - 300} width={30} height={300} rx={8} fill={G.fill} {...L} />
    <rect x={x} y={floorY - 150} width={w} height={110} rx={14} fill={warm ? '#3a2c34' : '#1a2350'} {...L} />
    {children}
    <rect x={x + w - 22} y={floorY - 190} width={26} height={190} rx={8} fill={G.fill} {...L} />
  </g>
);
export const Clock: React.FC<{ x: number; y: number; t: string; f: number; big?: boolean }> = ({ x, y, t, f, big }) => (
  <g>
    <rect x={x} y={y} width={big ? 300 : 210} height={big ? 130 : 96} rx={14} fill="#0a0f26" {...L} />
    <text x={x + (big ? 150 : 105)} y={y + (big ? 92 : 68)} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={big ? 84 : 56} fill="#ff6a5a" filter="url(#soft)" opacity={0.85 + 0.15 * Math.sin(f / 6)}>{t}</text>
  </g>
);
export const Nightstand: React.FC<{ x: number; floorY?: number; t?: string; f: number }> = ({ x, floorY = 860, t, f }) => (
  <g>
    <rect x={x} y={floorY - 200} width={230} height={200} rx={10} fill={G.fill} {...L} />
    <line x1={x + 20} y1={floorY - 110} x2={x + 210} y2={floorY - 110} {...L} />
    {t && <Clock x={x + 10} y={floorY - 300} t={t} f={f} />}
  </g>
);

/** A standard bedroom: window, lamp, shelf, plant, bed with Shamz (or anyone) lying in it. */
export const Bedroom: React.FC<SP> = ({ f, d, p }) => {
  const warm = p.warm;
  const who = p.who ?? { shamz: true };
  const det = useContext(DetailCtx);
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [1000, 600, 1.12]]}>
        {det ? <Plate name={warm ? 'bedroom_warm' : 'bedroom'} floorY={860} blur={1} /> : <>
        <Wall warm={warm} />
        <Window x={1100} y={150} f={f} warm={warm} />
        <Lamp x={330} y={250} on={p.lamp ?? (warm ? 1 : 0.6)} />
        <Shelf x={620} y={290} />
        <Plant x={1680} y={860} f={f} /></>}
        <Nightstand x={190} t={p.clock ?? '2:00'} f={f} />
        <Bed x={450}>
          {/* pillow, the sleeper's head on it, then the blanket over the body */}
          <ellipse cx={600} cy={700} rx={120} ry={36} fill="#cfd8f5" opacity={0.9} filter="url(#soft)" />
          <path d="M 640 720 Q 760 610 1020 640 Q 1250 650 1290 720 L 1290 760 L 640 760 Z" fill={warm ? '#5a4a66' : '#3a4c9c'} {...L} />
          <path d="M 720 710 Q 860 668 1000 696" stroke={G.line} strokeWidth={2.4} fill="none" opacity={0.6} />
          <Head x={600} y={640} s={1.05} rot={-12} f={f} {...who} eyes={p.eyes ?? 'wide'} mouth={p.mouth ?? 'line'} look={0.3} />
          <path d="M 640 720 Q 700 700 760 712 L 760 760 L 640 760 Z" fill={warm ? '#5a4a66' : '#3a4c9c'} />
        </Bed>
        {p.bubble && <Bubble x={980} y={300} w={460} h={280} k={lerp(f, [p.bubbleAt ?? 6, (p.bubbleAt ?? 6) + 10], [0, 1], easeOut)}>
          <MiniReplay f={f - (p.bubbleAt ?? 6)} n={p.replays ?? 1} />
        </Bubble>}
        <Dust f={f} warm={warm} />
      </Cam>
      {p.tag && <Tag f={f} text={p.tag} />}
    </AbsoluteFill>
  );
};

/** The trip, looping small inside a thought bubble, with a replay counter. */
const MiniReplay: React.FC<{ f: number; n: number }> = ({ f, n }) => {
  const loop = 40, k = ((f % loop) + loop) % loop, t = clamp(k / 26);
  const times = n;
  return (
    <g>
      <rect x={20} y={20} width={420} height={240} rx={22} fill="#141d48" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={250 + i * 44} y={210 - i * 34} width={190 - i * 44} height={34} fill={G.fill} stroke={G.line} strokeWidth={2.4} />)}
      <g transform="translate(0 0)"><Fig x={150 + t * 120} y={240 - t * 10} s={0.42} f={f} shamz pose={blend(walk(f / 3), 'fall', clamp((k - 14) / 8))} eyes={t > 0.6 ? 'wide' : 'open'} mouth={t > 0.6 ? 'o' : 'smile'} /></g>
      <text x={40} y={60} fontFamily={MONO} fontWeight={700} fontSize={34} fill={G.yellow}>⟲ x{times}</text>
    </g>
  );
};

// ------------------------------------------------------------------ school hallway with stairs
export const Hall: React.FC<SP> = ({ f, d, p }) => {
  const floorY = 880;
  const mode = p.mode ?? 'trip';
  // Shamz walks to the stairs and trips; books fly
  const tt = p.tripAt ?? 18;
  const k = clamp((f - tt) / 9);
  const sx = mode === 'trip' ? 520 + Math.min(f, tt + 6) * 9 : 900;
  const fallen = mode === 'floor' || mode === 'crowd' || mode === 'ignored';
  const pose = fallen ? 'floor' : f < tt ? walk(f / 2.6) : blend(walk(tt / 2.6), 'fall', k);
  const crowd = mode === 'crowd' || mode === 'ignored';
  const det = useContext(DetailCtx);
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={p.v ?? [[960, 540, 1.0], [960, 560, 1.08]]} shake={mode === 'trip' && f > tt && f < tt + 8 ? 6 : 0}>
        {det && <Plate name="hall" />}
        {!det && <><Wall floorY={floorY} />
        {/* lockers */}
        {Array.from({ length: 16 }).map((_, i) => <g key={i}>
          <rect x={-200 + i * 120} y={300} width={110} height={floorY - 330} fill={i % 5 === 2 ? '#1c2a5c' : '#16204a'} {...L} strokeWidth={2.6} />
          {[0, 1, 2].map((j) => <line key={j} x1={-180 + i * 120} y1={330 + j * 14} x2={-110 + i * 120} y2={330 + j * 14} stroke={G.line} strokeWidth={2} opacity={0.6} />)}
          <rect x={-120 + i * 120} y={560} width={10} height={36} rx={4} fill={G.line} opacity={0.7} />
        </g>)}
        <rect x={-200} y={130} width={2400} height={36} fill="#121a3d" {...L} />
        <text x={250} y={158} fontFamily={MONO} fontWeight={700} fontSize={24} fill={G.line} letterSpacing={8}>HALL B · STAIRS ↗</text>
        {/* the stairs */}
        <g>
          {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={1180 + i * 70} y={floorY - 50 - i * 50} width={900} height={50} fill={i % 2 ? '#18214a' : '#1b2652'} {...L} />)}
          <line x1={1180} y1={floorY - 120} x2={1670} y2={floorY - 470} stroke={G.line} strokeWidth={6} />
        </g></>}
        {/* lookers */}
        {crowd && Array.from({ length: 9 }).map((_, i) => {
          const x = 80 + i * 170 + (i > 3 ? 560 : 0);
          if (x > 1900) return null;
          const ignored = mode === 'ignored';
          return <Fig key={i} x={x} y={floorY + 10 + (i % 2) * 20} s={0.92} f={f} seed={i * 3} flip={x > 900} phone={ignored && i % 2 === 0} pose={ignored ? (i % 2 === 0 ? 'phone' : 'stand') : 'stand'} eyes={ignored ? (i % 2 === 0 ? 'down' : 'open') : 'wide'} mouth={ignored ? 'line' : 'o'} look={ignored ? (i % 2 ? -0.5 : 0.2) : 0.6} hair={(['cap', 'bun', 'none', 'pony'] as const)[i % 4]} opacity={0.95} />;
        })}
        {/* books */}
        {(mode === 'trip' && f >= tt) || fallen ? [0, 1, 2, 3].map((i) => {
          const bt = fallen ? 1 : clamp((f - tt) / 16);
          const bx = sx + 60 + i * 80 * bt + i * 20, by = floorY - 120 - Math.sin(bt * Math.PI) * (140 + i * 30) + bt * 110;
          return <rect key={i} x={fallen ? 700 + i * 140 : bx} y={fallen ? floorY - 14 - (i % 2) * 6 : by} width={56} height={14 + (i % 2) * 6} rx={3} fill={[G.red, G.blue, G.yellow, G.green][i]} transform={`rotate(${(fallen ? i * 25 : bt * 300 + i * 40)} ${fallen ? 728 + i * 140 : bx + 28} ${fallen ? floorY - 8 : by + 8})`} stroke={G.ink} strokeWidth={2.4} />;
        }) : null}
        <Fig x={sx} y={floorY + 10} s={1.0} f={f} {...(p.who ?? { shamz: true })} pose={pose} eyes={fallen ? 'worried' : f > tt ? 'wide' : 'open'} mouth={fallen ? 'wobble' : f > tt ? 'o' : 'smile'} look={0.5} />
        <Dust f={f} />
      </Cam>
      {p.tag && <Tag f={f} text={p.tag} />}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the experiment room
export const Lab: React.FC<SP> = ({ f, d, p }) => {
  const floorY = 880, mode = p.mode ?? 'enter';
  const enterX = mode === 'enter' ? lerp(f, [0, 40], [1500, 1180]) : 1180;
  const det = useContext(DetailCtx);
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={p.v ?? [[960, 540, 1.0], [1000, 540, 1.08]]}>
        {det ? <Plate name="lab" floorY={floorY} blur={1} /> : <><Wall floorY={floorY} />
        <Window x={180} y={150} f={f} w={380} h={300} /></>}
        <rect x={700} y={170} width={420} height={230} fill="#0e1636" {...L} />
        <text x={910} y={300} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={40} fill={G.line} opacity={0.8}>STUDY 1</text>
        <Door x={1480} floorY={floorY} open={mode === 'enter' ? 1 : 0} />
        {/* seated observers */}
        {[0, 1, 2, 3].map((i) => <g key={i}>
          <Chair x={260 + i * 210} s={0.88} floorY={floorY + 10} />
          <Fig x={260 + i * 210} y={floorY + 10} s={0.88} f={f} seed={i * 5} pose="sit" look={0.6} eyes={mode === 'ask' ? 'open' : 'open'} mouth="line" hair={(['bun', 'none', 'cap', 'pony'] as const)[i]} />

        </g>)}
        {mode !== 'enter' && <Fig x={1650} y={floorY + 10} s={1.0} f={f} pose="clip" flip eyes="open" mouth={mode === 'ask' ? 'talk' : 'line'} talking={mode === 'ask'} hair="none" />}
        {mode !== 'enter' && <rect x={1560} y={floorY - 240} width={56} height={72} rx={4} fill="#e9eefc" stroke={G.ink} strokeWidth={3} transform={`rotate(-8 1588 ${floorY - 204})`} />}
        {mode !== 'wait' && <Fig x={enterX} y={floorY + 10} s={1.0} f={f} pose={mode === 'enter' ? walk(f / 2.8) : 'stand'} flip={mode === 'enter'} shirt="#ff6fa8" print="cat" eyes={mode === 'ask' ? 'worried' : 'open'} mouth={mode === 'ask' ? 'wobble' : 'line'} hair="cap" hairC="#3a2f5a" look={-0.4} />}
        {mode === 'ask' && <Bubble x={1250} y={440} w={180} h={150} k={lerp(f, [8, 18], [0, 1], easeOut)}><text x={90} y={115} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={110} fill={G.yellow} filter="url(#soft)">?</text></Bubble>}
        <Dust f={f} />
      </Cam>
      {p.tag && <Tag f={f} text={p.tag} />}
      {p.cite && <Cite f={f} text={p.cite} at={4} />}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ a crowd standing on a horizon (a study's sample)
export const Crowd: React.FC<SP> = ({ f, d, p, m }) => {
  const n = p.n ?? 20, lit = p.lit ?? 0, lit2 = p.lit2, at2 = m?.go ?? p.at2 ?? 999;
  const nl = f >= at2 ? lit2 : lit;
  const order = Array.from({ length: n }).map((_, i) => i).sort((a, b) => random(`co${a}`) - random(`co${b}`));
  const litSet = new Set(order.slice(0, Math.round(nl)));
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 580, 1.06]]}>
        {useContext(DetailCtx) ? <Plate name="lawn" dim={0.25} /> : <>
        <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#1a2a78" />
        <rect x={-300} y={-300} width={W + 600} height={700} fill="#16236a" />
        <circle cx={960} cy={300} r={700} fill="url(#moonPool)" opacity={0.5} />
        <path d={`M -300 840 Q 960 790 2220 840 L 2220 1400 L -300 1400 Z`} fill="#0c1230" /></>}
        {Array.from({ length: n }).map((_, i) => {
          const row = i % 2, col = Math.floor(i / 2), cols = Math.ceil(n / 2);
          const x = 200 + (col + (row ? 0.5 : 0)) * (1520 / cols), y = 850 + row * 70;
          const on = litSet.has(i);
          const pop = on ? lerp(f, [(f >= at2 ? at2 : 4) + (i % 7), (f >= at2 ? at2 : 4) + (i % 7) + 8], [0, 1]) : 0;
          return <g key={i}>
            <Fig x={x} y={y} s={0.55} f={f} seed={i} flip={i % 3 === 0} hair={(['cap', 'bun', 'none', 'pony', 'none'] as const)[i % 5]} tint={on && pop > 0.5 ? G.yellow : undefined} eyes={on ? 'wide' : 'open'} mouth={on ? 'o' : 'line'} look={on ? 0.8 : (i % 2 ? -0.5 : 0.4)} pose={p.phones && !on && i % 2 ? 'phone' : 'stand'} phone={p.phones && !on && i % 2 === 1} />
            {on && <text x={x} y={y - 290 - pop * 10} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={46} fill={G.yellow} opacity={pop} filter="url(#soft)">!</text>}
          </g>;
        })}
        <Dust f={f} n={40} />
      </Cam>
      {p.stat && <BigStat f={f} text={f >= at2 && p.stat2 ? p.stat2 : p.stat} sub={f >= at2 && p.sub2 ? p.sub2 : p.sub} at={f >= at2 ? at2 : 2} y={160} size={120} color={f >= at2 && p.color2 ? p.color2 : G.yellow} />}
      {p.cite && <Cite f={f} text={p.cite} at={6} y={1000} />}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ spotlight stage: one light, then everyone's
export const Spot: React.FC<SP> = ({ f, d, p }) => {
  const many = p.mode === 'many', follow = p.mode === 'follow';
  const z = many ? lerp(f, [0, Math.min(d, 50)], [1.9, 1.0], easeOut) : 1.0;
  const sx = follow ? 560 + f * 6 : 960;
  const spots = many ? [200, 520, 960, 1400, 1720] : [sx];
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={many ? [[960, 600, z], [960, 600, z]] : (p.v ?? [[960, 560, 1.05], [960, 560, 1.12]])}>
        {useContext(DetailCtx) ? <Plate name="stage" dim={0.45} /> : <>
        <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill="#090c1e" />
        <rect x={-600} y={860} width={W + 1200} height={600} fill="#060814" /></>}
        {spots.map((x, i) => <g key={i}>
          <polygon points={`${x - 60},-200 ${x + 60},-200 ${x + 240},880 ${x - 240},880`} fill="url(#beam)" opacity={0.8} />
          <ellipse cx={x} cy={880} rx={250} ry={40} fill="url(#whitePool)" />
          <Fig x={x} y={890} s={many ? 0.8 : 1.05} f={f} seed={i * 4} shamz={x === 960 || follow ? true : false} pose={follow ? walk(f / 2.6) : i % 2 && many ? 'shirt' : 'stand'} eyes={many ? (i === 2 ? 'worried' : 'down') : 'worried'} mouth={many ? 'line' : 'wobble'} look={many ? 0 : 0.2} hair={!many || i === 2 ? 'none' : (['cap', 'bun', 'none', 'pony', 'cap'] as const)[i]} />
        </g>)}
        <Dust f={f} n={50} />
      </Cam>
      {p.title && <BigStat f={f} text={p.title} at={p.titleAt ?? 4} y={170} size={96} />}
      {p.cite && <Cite f={f} text={p.cite} at={10} y={290} />}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ guess vs real: two filling bars
export const Bars: React.FC<SP> = ({ f, d, p, m }) => {
  const at2 = m?.go ?? p.at2 ?? 26;
  const a = lerp(f, [2, 16], [0, 0.5], easeOut), b = lerp(f, [at2, at2 + 16], [0, 0.23], easeOut);
  const row = (y: number, label: string, v: number, c: string, txt: string, show: boolean) => (
    <g opacity={show ? 1 : 0.25}>
      <text x={360} y={y - 24} fontFamily={SANS} fontWeight={800} fontSize={40} fill="#dfe6ff">{label}</text>
      <rect x={360} y={y} width={1200} height={56} rx={28} fill="#1a2350" stroke={G.lineDim} strokeWidth={3} />
      <rect x={360} y={y} width={v > 0 ? Math.max(56, 1200 * v) : 0} height={56} rx={28} fill={c} filter="url(#soft)" />
      <text x={360 + Math.max(56, 1200 * v) + 24} y={y + 44} fontFamily={MONO} fontWeight={700} fontSize={46} fill={c}>{txt}</text>
    </g>
  );
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, #1d2a6a 0%, #0b1030 75%)' }}>
      <Cam f={f} d={d} v={[[960, 540, 1.0], [960, 540, 1.04]]}>
        <text x={360} y={270} fontFamily={SANS} fontWeight={800} fontSize={34} fill="#9fb0e8" letterSpacing={3}>HOW MANY PEOPLE NOTICED THE SHIRT?</text>
        {row(440, 'What the wearers guessed', a, G.yellow, `~${Math.round(a * 100)}%`, true)}
        {row(660, 'What really happened', b, G.red, `${Math.round(b * 100)}%`, f >= at2 - 4)}
        <Dust f={f} n={40} />
      </Cam>
      <Cite f={f} text="GILOVICH, MEDVEC & SAVITSKY (2000) · J. PERS. SOC. PSYCHOL." at={8} y={960} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ close-up of one figure (reaction / speaking)
export const Close: React.FC<SP> = ({ f, d, p }) => {
  const warm = p.warm;
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={p.v ?? [[960, 480, 1.0], [960, 470, 1.08]]}>
        {useContext(DetailCtx) ? <Plate name={warm ? 'bedroom_warm' : 'bedroom'} floorY={1200} blur={7} dim={0.25} /> : <>
        <Wall warm={warm} floorY={1200} />
        <Window x={1180} y={120} f={f} warm={warm} />
        <Lamp x={360} y={200} on={1} /></>}
        <Fig x={900} y={1440} s={2.4} f={f} shamz={p.shamz ?? true} shirt={p.shirt} print={p.print} hairC={p.hairC} pose={p.pose ?? 'stand'} eyes={p.eyes ?? 'open'} mouth={p.mouth ?? 'smile'} look={p.look ?? 0.2} talking={p.talking} hair={p.hair} tint={p.tint} />
        <Dust f={f} warm={warm} />
      </Cam>
      {p.tag && <Tag f={f} text={p.tag} />}
      {p.big && <BigStat f={f} text={p.big} at={p.bigAt ?? 3} x={p.bigX ?? 1400} y={p.bigY ?? 420} size={p.bigSize ?? 150} color={p.bigC ?? G.yellow} />}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ a big clock time for "tonight"
export const Time: React.FC<SP> = ({ f, d, p }) => (
  <AbsoluteFill>
    <Cam f={f} d={d} v={[[960, 540, 1.0], [960, 540, 1.1]]}>
      {useContext(DetailCtx) ? <Plate name="desk" blur={5} dim={0.3} /> : <><Wall />
      <Window x={1200} y={170} f={f} /></>}
      <Chair x={560} s={1.2} />
      <Fig x={560} y={870} s={1.2} f={f} shamz pose="sitPhone" phone eyes="open" mouth="line" look={0.4} />
      <Dust f={f} />
    </Cam>
    <BigStat f={f} text={p.t ?? '2:00 AM'} at={2} x={1300} y={500} size={170} color={G.yellow} />
    {p.tag && <Tag f={f} text={p.tag} />}
  </AbsoluteFill>
);

/** A desk chair seen from the side, for a figure sitting at (x, floor) with pose 'sit' at scale s (back on the left). */
export const Chair: React.FC<{ x: number; s?: number; floorY?: number }> = ({ x, s = 1, floorY = 870 }) => (
  <g transform={`translate(${x} ${floorY}) scale(${s})`}>
    <rect x={-70} y={-96} width={130} height={18} rx={8} fill={G.fill} {...L} />
    <rect x={-84} y={-250} width={20} height={170} rx={9} fill={G.fill} {...L} />
    <line x1={-6} y1={-78} x2={-6} y2={-20} {...L} strokeWidth={6} />
    <path d="M -50 -6 L 40 -6" {...L} strokeWidth={6} />
    <circle cx={-50} cy={-4} r={6} fill={G.line} /><circle cx={40} cy={-4} r={6} fill={G.line} />
  </g>
);

// ------------------------------------------------------------------ the end card
export const End: React.FC<SP> = (sp) => {
  const { f } = sp;
  const k = lerp(f, [14, 28], [0, 1], easeOut);
  return (
    <AbsoluteFill>
      <Bedroom {...sp} p={{ warm: true, lamp: 1, eyes: 'happy', mouth: 'smile', clock: '2:01', v: [[960, 560, 1.06], [960, 560, 1.0]] }} />
      <AbsoluteFill style={{ background: `rgba(4,6,20,${0.6 * k})`, alignItems: 'center', justifyContent: 'center', opacity: k }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 88, color: '#fff', textAlign: 'center', lineHeight: 1.1, textShadow: '0 0 30px #ffc54d66' }}>WHAT MOMENT DO <span style={{ color: G.yellow }}>YOU</span><br />STILL REPLAY?</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: '#dfe6ff', marginTop: 26 }}>Tell me in the comments</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 50, color: '#1a0a0a', background: G.red, borderRadius: 60, padding: '12px 56px', marginTop: 34, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.sin(f / 6)})`, boxShadow: `0 0 40px ${G.red}88` }}>SUBSCRIBE</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SETS: Record<string, React.FC<SP>> = { bedroom: Bedroom, hall: Hall, lab: Lab, crowd: Crowd, spot: Spot, bars: Bars, close: Close, time: Time, end: End };
export type { View };
