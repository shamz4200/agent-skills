// Scenes for "What If You Were Locked Inside a Bank Vault Overnight?" (Glow style, painted plates).
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { BigStat, Cam, Cite, clamp, Dust, easeOut, easeIO, Fig, G, H, lerp, MONO, Plate, Pose, SANS, Tag, W, walk, blend } from './glow';
import { Chair } from './sets';

type SP = { f: number; d: number; p: any; m: Record<string, number> };
const L = { stroke: G.line, strokeWidth: 3.2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

// ------------------------------------------------------------------ poses for this episode
const P: Record<string, Pose> = {
  bang1: { lean: 12, ra: [150, 20], la: [120, 30], ll: [8, 0], rl: [-6, 0], head: -6 },
  bang2: { lean: 8, ra: [120, 30], la: [155, 15], ll: [8, 0], rl: [-6, 0], head: -4 },
  floorSit: { hipY: 150, lean: -6, la: [70, 30], ra: [60, 40], ll: [120, 79], rl: [110, 70], head: 4 },
  doze: { hipY: 150, lean: -14, la: [60, 30], ra: [50, 30], ll: [120, 79], rl: [110, 70], head: 28 },
  crouch: { hipY: 70, lean: 25, la: [80, 8], ra: [50, 30], ll: [60, 90], rl: [20, 60], head: 10 },
  look: { la: [8, 10], ra: [-6, 12], ll: [3, 0], rl: [-3, 0], head: -14 },
  box: { lean: 14, la: [55, 35], ra: [45, 40], ll: [3, 0], rl: [-3, 0], head: 16 },
  cheer: { la: [135, -35], ra: [-130, 30], ll: [6, 0], rl: [-6, 0], head: -8 },
  torch: { lean: 10, la: [80, 20], ra: [70, 30], ll: [10, 0], rl: [-10, 0] },
};

// ------------------------------------------------------------------ the vault door seen from inside (right side of the room)
const DoorIn: React.FC<{ f: number; shut: number; warm?: boolean }> = ({ f, shut, warm }) => {
  const cx = 1700, cy = 560, r = 300;
  const dx = (1 - shut) * 760;
  return (
    <g>
      {/* the opening, lit from the lobby while open */}
      <circle cx={cx} cy={cy} r={r + 22} fill="#1b2140" stroke={G.line} strokeWidth={4} />
      <circle cx={cx} cy={cy} r={r} fill={warm ? '#ffcf86' : '#c9a066'} opacity={0.95} />
      <circle cx={cx} cy={cy} r={r * 1.8} fill="url(#warmPool)" opacity={(1 - shut) * 0.9} />
      {/* the door slab sliding across as it swings shut */}
      <g transform={`translate(${dx} 0)`}>
        <circle cx={cx} cy={cy} r={r} fill="#3a4466" stroke="#9fb0e0" strokeWidth={5} />
        <circle cx={cx} cy={cy} r={r * 0.78} fill="#2d3654" stroke="#6f80b8" strokeWidth={3} />
        {Array.from({ length: 12 }).map((_, i) => { const a = (i / 12) * Math.PI * 2; return <circle key={i} cx={cx + Math.cos(a) * r * 0.9} cy={cy + Math.sin(a) * r * 0.9} r={10} fill="#8fa0d0" />; })}
        <rect x={cx - 110} y={cy - 70} width={220} height={140} rx={10} fill="#202842" stroke="#6f80b8" strokeWidth={3} />
        {[0, 1, 2].map((i) => <g key={i}><circle cx={cx - 66 + i * 66} cy={cy} r={24} fill="#e9eefc" opacity={0.9} /><line x1={cx - 66 + i * 66} y1={cy} x2={cx - 66 + i * 66 + Math.cos(f / 30 + i) * 16} y2={cy + Math.sin(f / 30 + i) * 16} stroke={G.ink} strokeWidth={3} /></g>)}
      </g>
    </g>
  );
};

/** Little breath puffs from a mouth: calm = slow and small, panic = fast and big. */
const Breath: React.FC<{ f: number; x: number; y: number; panic?: boolean }> = ({ f, x, y, panic }) => {
  const per = panic ? 22 : 60, n = panic ? 4 : 2;
  return <g>{Array.from({ length: n }).map((_, i) => {
    const t = ((f + i * (per / n)) % per) / per;
    return <circle key={i} cx={x + t * (panic ? 140 : 90)} cy={y - t * 30} r={(panic ? 16 : 10) + t * (panic ? 40 : 24)} fill="#dfe6ff" opacity={(1 - t) * (panic ? 0.35 : 0.22)} />;
  })}</g>;
};

// ------------------------------------------------------------------ inside the vault
export const VaultIn: React.FC<SP> = ({ f, d, p, m }) => {
  const mode = p.mode ?? 'stand', fy = 890;
  const ca = m?.close ?? p.closeAt ?? 999;
  const shut = p.door === 'open' ? 0 : p.door === 'opening' ? 1 - clamp((f - (m?.go ?? 10)) / 50) : f >= ca ? clamp((f - ca) / 36) : (p.door === 'closing' ? 0 : 1);
  const who = p.who ?? { shamz: true };
  let x = p.x ?? 820, pose: Pose | string = 'stand', flip = false, eyes = p.eyes ?? 'open', mouth = p.mouth ?? 'line', look = 0.4;
  if (mode === 'box') { x = 760; pose = 'box' as any; pose = P.box; eyes = 'down'; mouth = 'smile'; }
  if (mode === 'bang') { x = 1300; pose = Math.floor(f / 7) % 2 ? P.bang1 : P.bang2; eyes = 'angry'; mouth = 'o'; }
  if (mode === 'sit' || mode === 'count' || mode === 'breathe') { x = p.x ?? 700; pose = P.floorSit; }
  if (mode === 'doze') { x = 700; pose = P.doze; eyes = 'closed'; mouth = 'line'; }
  if (mode === 'wake') { x = 700; pose = blend(P.doze, P.floorSit, clamp(f / 14)); eyes = f < 10 ? 'closed' : 'wide'; mouth = 'o'; }
  if (mode === 'pace') { const s = Math.sin(f / 26); x = 820 + 330 * s; pose = walk(f / 1.6, 1.2); flip = Math.cos(f / 26) < 0; eyes = 'worried'; mouth = 'wobble'; }
  if (mode === 'vent') { x = 1270; pose = P.crouch; eyes = 'wide'; look = 0.8; }
  if (mode === 'look') { pose = P.look; look = 0.2; }
  if (mode === 'phone') { pose = 'phone'; eyes = p.eyes ?? 'worried'; }
  if (mode === 'cheer') { pose = P.cheer; eyes = 'happy'; mouth = 'grin'; }
  if (mode === 'turn') { pose = blend('stand', P.look, clamp(f / 10)); flip = false; look = 0.9; }
  const ta = m?.turn ?? p.turnAt ?? 8;
  const ang = mode === 'vent' ? lerp(f, [ta, ta + 18], [0, 90], easeOut) : 0;
  const airOn = mode === 'vent' && f > ta + 12;
  const plate = p.plate ?? 'vault';
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 560, 1.07]]} shake={mode === 'bang' ? 2.5 : 0}>
        <Plate name={plate} dim={p.dim ?? 0.15} blur={1} />
        {p.door !== 'none' && <DoorIn f={f} shut={shut} warm={plate === 'vault_morning'} />}
        {/* the emergency ventilator, low on the wall by the door */}
        {(mode === 'vent' || p.vent) && <g transform="translate(1450 790)">
          <circle r={46} fill="#26304e" stroke={G.line} strokeWidth={4} />
          {[-24, -8, 8, 24].map((y) => <line key={y} x1={-30} x2={30} y1={y} y2={y} stroke="#6f80b8" strokeWidth={4} />)}
          <g transform={`rotate(${ang})`}><rect x={-8} y={-62} width={16} height={124} rx={8} fill="#f2c94c" stroke={G.ink} strokeWidth={3} /></g>
          {airOn && Array.from({ length: 10 }).map((_, i) => { const t = ((f * 2 + i * 17) % 90) / 90; return <path key={i} d={`M ${-20 - t * 380} ${-30 + (i % 5) * 14 - t * 60} q -30 -10 -60 0`} stroke="#bfe8ff" strokeWidth={4} fill="none" opacity={(1 - t) * 0.7} strokeLinecap="round" />; })}
        </g>}
        {mode === 'box' && <g>
          <rect x={860} y={730} width={300} height={22} fill="#2a3456" {...L} />
          <line x1={880} y1={752} x2={880} y2={fy - 10} {...L} strokeWidth={6} /><line x1={1140} y1={752} x2={1140} y2={fy - 10} {...L} strokeWidth={6} />
          <rect x={900} y={694} width={220} height={40} rx={4} fill="#9aa6cf" stroke={G.ink} strokeWidth={3} />
          <rect x={920} y={680} width={60} height={20} rx={3} fill="#f2c94c" stroke={G.ink} strokeWidth={2} />
        </g>}
        <Fig x={x} y={fy} s={p.s ?? 1.05} f={f} {...who} flip={flip} pose={pose} eyes={eyes as any} mouth={mouth as any} look={look} phone={mode === 'phone'} />
        {p.breath && <Breath f={f} x={x + 70} y={fy - (mode === 'pace' ? 330 : 190)} panic={p.breath === 'panic'} />}
        {mode === 'bang' && Math.floor(f / 7) % 2 === 0 && <g transform={`translate(${x + 150} ${fy - 470})`}>{[0, 1, 2].map((i) => <path key={i} d={`M ${20 + i * 18} ${-30 + i * 22} l 30 ${-12 + i * 12}`} stroke={G.yellow} strokeWidth={6} strokeLinecap="round" />)}</g>}
        {mode === 'count' && Array.from({ length: 6 }).map((_, i) => { const k = clamp((f - i * 8) / 6); return <circle key={i} cx={300 + i * 230} cy={380 + (i % 2) * 120} r={30} fill="none" stroke={G.yellow} strokeWidth={5} opacity={k * (1 - clamp((f - i * 8 - 20) / 20)) } />; })}
        <Dust f={f} warm={plate === 'vault_morning'} />
      </Cam>
      {p.cctv && <Cctv f={f} text={p.cctv} />}
      {p.tag && <Tag f={f} text={p.tag} />}
      {mode === 'count' && <BigStat f={f} text="212" count={212} at={4} x={1450} y={220} size={150} />}
    </AbsoluteFill>
  );
};

/** A security-camera look: grain, a REC dot and a caption. */
const Cctv: React.FC<{ f: number; text: string }> = ({ f, text }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <AbsoluteFill style={{ background: 'rgba(40,80,60,0.18)', mixBlendMode: 'screen' }} />
    <AbsoluteFill style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 5px)' }} />
    <div style={{ position: 'absolute', left: 60, top: 50, fontFamily: MONO, fontWeight: 700, fontSize: 34, color: '#e8f0ff' }}>
      <span style={{ color: '#ff4040', opacity: Math.floor(f / 15) % 2 ? 1 : 0.2 }}>●</span> REC  {text}
    </div>
    <div style={{ position: 'absolute', inset: 30, border: '3px solid rgba(220,235,255,0.5)' }} />
  </AbsoluteFill>
);

// ------------------------------------------------------------------ the lobby, outside the vault door
export const DoorOut: React.FC<SP> = ({ f, d, p }) => {
  const mode = p.mode ?? 'empty', fy = 880;
  const crew = mode === 'fire' || mode === 'drill' || mode === 'phone' || mode === 'morning';
  const flash = crew && mode !== 'morning' ? 0.5 + 0.5 * Math.sin(f / 4) : 0;
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 560, 1.06]]}>
        <Plate name="lobby" dim={0.12} />
        {crew && <rect x={-400} y={-400} width={W + 800} height={H + 800} fill={Math.floor(f / 8) % 2 ? '#ff2a2a' : '#2a5bff'} opacity={0.08 * flash + 0.03} />}
        {crew && [0, 1, 2].map((i) => {
          const x = [560, 1360, 1560][i];
          const ph = mode === 'phone' && i === 0;
          const dr = mode === 'drill' && i === 0;
          return <g key={i}>
            <Fig x={dr ? 820 : x} y={fy + 10} s={1.0} f={f} seed={i * 7} hair="helmet" flip={x > 960 && !dr} pose={dr ? P.torch : ph ? 'phone' : i === 2 ? 'point' : 'stand'} phone={ph} talking={ph} eyes={mode === 'morning' ? 'open' : 'worried'} mouth={ph ? 'talk' : 'line'} look={0.3} />
          </g>;
        })}
        {mode === 'staff' && <Fig x={1180} y={fy + 10} s={1.0} f={f} seed={3} hair="bun" flip pose="shrug" eyes="worried" mouth="wobble" />}
        {mode === 'morning' && <Fig x={1180} y={fy + 10} s={1.0} f={f} seed={11} hair="bun" flip pose="stand" eyes="open" mouth="smile" />}
        {mode === 'drill' && Array.from({ length: 14 }).map((_, i) => { const t = ((f * 3 + i * 13) % 40) / 40; return <circle key={i} cx={930 + t * (60 + (i % 5) * 30) * (i % 2 ? 1 : -0.6)} cy={560 - t * 80 + t * t * 200} r={4} fill={G.yellow} opacity={1 - t} />; })}
        {p.clock && <g transform="translate(976 210)"><rect x={-150} y={-46} width={300} height={92} rx={14} fill="#0a0f26" {...L} /><text y={28} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={64} fill="#ff6a5a" filter="url(#soft)">{p.clock}</text></g>}
        <Dust f={f} />
      </Cam>
      {p.tag && <Tag f={f} text={p.tag} />}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the street outside, fire crew arriving
export const Street: React.FC<SP> = ({ f, d, p }) => (
  <AbsoluteFill>
    <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 560, 1.06]]}>
      <Plate name="street" dim={0.1} />
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill={Math.floor(f / 8) % 2 ? '#ff2a2a' : '#2a5bff'} opacity={0.1} />
      {[0, 1, 2].map((i) => <Fig key={i} x={lerp(f, [0, 60], [-100 - i * 160, 640 - i * 170])} y={900} s={0.95} f={f} seed={i * 5} hair="helmet" pose={f < 60 ? walk(f / 2.4 + i) : 'stand'} eyes="open" mouth="line" look={0.5} />)}
      <Dust f={f} />
    </Cam>
    {p.tag && <Tag f={f} text={p.tag} />}
  </AbsoluteFill>
);

// ------------------------------------------------------------------ the time lock, opened up
export const TimeLock: React.FC<SP> = ({ f, d, p, m }) => {
  const open = p.mode === 'open' ? clamp((f - (m?.go ?? 10)) / 18) : 0;
  const combo = p.combo;
  const left = p.left ?? '13:59';
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, #1d2a6a 0%, #0a0e28 75%)' }}>
      <Cam f={f} d={d} v={p.v ?? [[960, 540, 1.0], [960, 540, 1.05]]}>
        <rect x={360} y={260} width={1200} height={440} rx={30} fill="#141b3d" stroke={G.line} strokeWidth={4} />
        <text x={400} y={312} fontFamily={MONO} fontWeight={700} fontSize={26} fill="#9fb0e8" letterSpacing={6}>TIME LOCK · INSIDE THE DOOR</text>
        {[0, 1, 2].map((i) => {
          const cx = 620 + i * 340, cy = 470;
          const a = (f / 6 + i * 40) * (open ? 0 : 1);
          return <g key={i}>
            <circle cx={cx} cy={cy} r={110} fill="#f1f4ff" filter="url(#bloom)" />
            {Array.from({ length: 12 }).map((_, k) => <line key={k} x1={cx + Math.cos(k / 12 * 6.283) * 92} y1={cy + Math.sin(k / 12 * 6.283) * 92} x2={cx + Math.cos(k / 12 * 6.283) * 104} y2={cy + Math.sin(k / 12 * 6.283) * 104} stroke={G.ink} strokeWidth={4} />)}
            <line x1={cx} y1={cy} x2={cx + Math.cos((a - 90) * Math.PI / 180) * 80} y2={cy + Math.sin((a - 90) * Math.PI / 180) * 80} stroke={G.ink} strokeWidth={7} strokeLinecap="round" />
            <line x1={cx} y1={cy} x2={cx + Math.cos((a / 12 - 90) * Math.PI / 180) * 54} y2={cy + Math.sin((a / 12 - 90) * Math.PI / 180) * 54} stroke={G.red} strokeWidth={9} strokeLinecap="round" />
            <text x={cx} y={cy + 160} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={22} fill="#9fb0e8" letterSpacing={4}>CLOCK {i + 1}</text>
          </g>;
        })}
        {/* the bolts */}
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={1580 - open * 160} y={300 + i * 80} width={220} height={34} rx={8} fill={open > 0.5 ? G.green : '#c3cbe8'} stroke={G.ink} strokeWidth={3} />)}
        <rect x={1560} y={250} width={16} height={460} fill={G.line} />
        {combo && <g transform="translate(220 480)">
          <circle r={110} fill="#2a3456" stroke={G.line} strokeWidth={5} />
          <g transform={`rotate(${f * 9})`}>{Array.from({ length: 20 }).map((_, k) => <line key={k} x1={0} y1={-92} x2={0} y2={-104} stroke="#dfe6ff" strokeWidth={3} transform={`rotate(${k * 18})`} />)}<circle r={30} fill="#3a4466" /></g>
          <text y={170} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={24} fill="#9fb0e8">COMBINATION</text>
          {f > 20 && <text y={20} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={120} fill={G.red} filter="url(#soft)" opacity={clamp((f - 20) / 6)}>✕</text>}
        </g>}
      </Cam>
      <BigStat f={f} text={open > 0.5 ? 'OPEN' : `LOCKED · ${left}`} at={2} y={150} size={84} color={open > 0.5 ? G.green : G.yellow} />
      {p.cite && <Cite f={f} text={p.cite} at={8} y={960} />}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the inventor's workshop, 1873
export const Workshop: React.FC<SP> = ({ f, d, p }) => (
  <AbsoluteFill>
    <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 560, 1.08]]}>
      <Plate name="workshop" floorY={880} dim={0.12} blur={1} />
      <Fig x={760} y={890} s={1.05} f={f} hair="tophat" beard pose="clip" eyes="down" mouth="line" look={0.6} />
      <g transform="translate(1010 760)"><circle r={46} fill="#f1f4ff" filter="url(#bloom)" /><line x1={0} y1={0} x2={Math.cos(f / 8) * 34} y2={Math.sin(f / 8) * 34} stroke={G.ink} strokeWidth={5} /><line x1={0} y1={0} x2={0} y2={-24} stroke={G.ink} strokeWidth={6} /></g>
      <rect x={880} y={800} width={300} height={20} fill="#5a4030" stroke={G.line} strokeWidth={3} />
      <Dust f={f} warm />
    </Cam>
    {p.tag && <Tag f={f} text={p.tag} />}
  </AbsoluteFill>
);

// ------------------------------------------------------------------ New York, the real case
export const Avenue: React.FC<SP> = ({ f, d, p }) => (
  <AbsoluteFill>
    <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 560, 1.08]]}>
      <Plate name="fifth" dim={0.1} />
      <Fig x={lerp(f, [0, d], [500, 1000])} y={900} s={1.0} f={f} hair="none" pose={walk(f / 2.6)} eyes="open" mouth="line" look={0.5} />
      <Dust f={f} />
    </Cam>
    {p.tag && <Tag f={f} text={p.tag} />}
  </AbsoluteFill>
);

// ------------------------------------------------------------------ the wall, cut open: concrete, then steel
export const WallCut: React.FC<SP> = ({ f, d, p, m }) => {
  const stop = Math.max(8, m?.stop ?? 60);
  const cut = Math.min(lerp(f, [4, stop], [0, 1]), 1);
  const cutting = f < stop;
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, #1d2a6a 0%, #0a0e28 75%)' }}>
      <Cam f={f} d={d} v={[[960, 540, 1.0], [960, 540, 1.05]]}>
        <rect x={700} y={200} width={300} height={620} fill="#6b7187" />
        {Array.from({ length: 70 }).map((_, i) => <circle key={i} cx={710 + random(`c${i}`) * 280} cy={210 + random(`d${i}`) * 600} r={3 + random(`e${i}`) * 5} fill="#4c5268" />)}
        <rect x={1000} y={200} width={70} height={620} fill="#9fb4e8" />
        {[0, 1, 2, 3].map((i) => <line key={i} x1={1000 + i * 18} y1={200} x2={1000 + i * 18} y2={820} stroke="#6f80b8" strokeWidth={3} />)}
        <text x={850} y={180} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={30} fill="#dfe6ff" letterSpacing={4}>CONCRETE</text>
        <text x={1035} y={860} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={30} fill="#9fb4e8" letterSpacing={4}>STEEL PLATING</text>
        {/* the cut */}
        <rect x={700} y={470} width={300 * cut} height={70} fill="#0a0e28" />
        {cutting && Array.from({ length: 16 }).map((_, i) => { const t = ((f * 2 + i * 11) % 30) / 30; return <circle key={i} cx={700 + 300 * cut - t * 120} cy={505 + (i % 2 ? -1 : 1) * t * (40 + i * 6)} r={4} fill={G.yellow} opacity={1 - t} />; })}
        <Fig x={520} y={880} s={0.95} f={f} hair="helmet" pose={P.torch} eyes="worried" mouth="line" look={0.6} />
        <Fig x={1360} y={880} s={0.95} f={f} hair="none" flip pose="stand" eyes="wide" mouth="o" look={-0.4} />
        {!cutting && <text x={1035} y={520} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={110} fill={G.red} filter="url(#soft)" opacity={clamp((f - stop) / 6)}>STOP</text>}
      </Cam>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the vault as a box with its measurements
export const BoxDims: React.FC<SP> = ({ f, d, p, m }) => {
  const shrink = p.shrink ? lerp(f, [6, 40], [1, 0.55], easeIO) : 1;
  const k = (t: number) => clamp((f - t) / 10);
  const S = 1 * shrink, ox = 960, oy = 600;
  const pt = (x: number, y: number, z: number) => [ox + (x - z * 0.55) * 170 * S, oy - y * 170 * S + z * 0.35 * 170 * S] as const;
  const [w, dp, h] = [4, 3, 2.5];
  const c = [[0, 0, 0], [w, 0, 0], [w, h, 0], [0, h, 0], [0, 0, dp], [w, 0, dp], [w, h, dp], [0, h, dp]].map(([x, y, z]) => pt(x - w / 2, y - h / 2, z - dp / 2));
  const E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, #1d2a6a 0%, #0a0e28 75%)' }}>
      <Cam f={f} d={d} v={[[960, 560, 1.0], [960, 560, 1.05]]}>
        {E.map(([a, b], i) => <g key={i} opacity={k(i * 1.5)}><line x1={c[a][0]} y1={c[a][1]} x2={c[b][0]} y2={c[b][1]} stroke="#5b8cff" strokeWidth={16} opacity={0.35} strokeLinecap="round" /><line x1={c[a][0]} y1={c[a][1]} x2={c[b][0]} y2={c[b][1]} stroke="#dff0ff" strokeWidth={5} strokeLinecap="round" /></g>)}
        <polygon points={[0, 1, 5, 4].map((i) => c[i].join(',')).join(' ')} fill="#5b8cff" opacity={0.12} />
        <Fig x={960} y={c[0][1] - 40 * S} s={0.6 * S} f={f} shamz pose={P.floorSit} eyes="open" mouth="line" />
        {!p.shrink && <>
          <text x={(c[0][0] + c[1][0]) / 2} y={c[0][1] + 60} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={44} fill={G.yellow} opacity={k(16)}>4 m</text>
          <text x={c[1][0] + 70} y={(c[1][1] + c[5][1]) / 2 + 40} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={44} fill={G.yellow} opacity={k(m?.b ?? 26)}>3 m</text>
          <text x={c[0][0] - 90} y={(c[0][1] + c[3][1]) / 2} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={44} fill={G.yellow} opacity={k(m?.c ?? 36)}>2.5 m</text>
        </>}
      </Cam>
      {p.stat && <BigStat f={f} text={p.stat} sub={p.sub} at={m?.go ?? 40} y={140} size={92} color={p.statC ?? G.yellow} />}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the CO2 meter
export const Gauge: React.FC<SP> = ({ f, d, p, m }) => {
  const x0 = 260, x1 = 1660, max = 5;
  const X = (v: number) => x0 + (v / max) * (x1 - x0);
  const lv = f >= (m?.go ?? 1e9) ? lerp(f, [m.go, m.go + 30], [p.level, p.level2], easeOut) : lerp(f, [4, 34], [0.04, p.level ?? 0.6], easeOut);
  const col = lv >= 4 ? G.red : lv > 1.2 ? '#ff9a4d' : G.green;
  const marks: [number, string, string][] = p.marks ?? [[0.04, 'FRESH AIR 0.04%', '#9fb0e8'], [4, 'NIOSH: IMMEDIATELY DANGEROUS', G.red]];
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, #1d2a6a 0%, #0a0e28 75%)' }}>
      <Cam f={f} d={d} v={[[960, 540, 1.0], [960, 540, 1.04]]}>
        <text x={x0} y={330} fontFamily={SANS} fontWeight={800} fontSize={36} fill="#9fb0e8" letterSpacing={3}>CARBON DIOXIDE IN THE VAULT</text>
        <rect x={x0} y={420} width={x1 - x0} height={90} rx={45} fill="#141b3d" stroke={G.lineDim} strokeWidth={4} />
        <rect x={X(4)} y={420} width={x1 - X(4)} height={90} rx={0} fill={G.red} opacity={0.18} />
        <rect x={x0} y={420} width={Math.max(90, X(lv) - x0)} height={90} rx={45} fill={col} filter="url(#soft)" />
        {[0, 1, 2, 3, 4, 5].map((v) => <text key={v} x={X(v)} y={570} textAnchor="middle" fontFamily={MONO} fontWeight={500} fontSize={26} fill="#9fb0e8">{v}%</text>)}
        {marks.map(([v, t, c], i) => <g key={i} opacity={clamp((f - 6 - i * 10) / 8)}>
          <line x1={X(v)} y1={400} x2={X(v)} y2={i % 2 ? 640 : 380} stroke={c} strokeWidth={4} />
          <text x={Math.min(X(v), 1500)} y={i % 2 ? 680 : 365} textAnchor={X(v) > 1500 ? 'end' : 'middle'} fontFamily={MONO} fontWeight={700} fontSize={26} fill={c}>{t}</text>
        </g>)}
      </Cam>
      <BigStat f={f} text={p.big ?? `${lv.toFixed(1)}%`} sub={p.sub} at={2} y={170} size={110} color={col} />
      <Cite f={f} text="NIOSH POCKET GUIDE: CARBON DIOXIDE · OUR ESTIMATE FOR A SEALED 30 m³ VAULT" at={10} y={960} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the phone
export const PhoneUI: React.FC<SP> = ({ f, d, p }) => {
  const dead = p.mode === 'dead';
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={[[960, 560, 1.0], [960, 560, 1.03]]}>
        <Plate name="vault" blur={10} dim={0.45} />
        <g transform={`translate(960 560) rotate(${Math.sin(f / 30) * 1.5})`}>
          <rect x={-230} y={-430} width={460} height={860} rx={60} fill="#0b0f22" stroke="#cfe0ff" strokeWidth={6} filter="url(#soft)" />
          {!dead && <g>
            <text x={-170} y={-360} fontFamily={MONO} fontWeight={700} fontSize={30} fill="#dfe6ff">{p.time ?? '6:05'}</text>
            {[0, 1, 2, 3].map((i) => <rect key={i} x={70 + i * 16} y={-372 - i * 6} width={10} height={10 + i * 6} rx={2} fill={i === 0 ? '#dfe6ff' : '#3a4466'} />)}
            <rect x={140} y={-384} width={56} height={26} rx={6} fill="none" stroke="#dfe6ff" strokeWidth={3} /><rect x={144} y={-380} width={8} height={18} rx={2} fill={G.red} />
            <text x={0} y={-180} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={40} fill="#9fb0e8">Calling</text>
            <text x={0} y={-100} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={96} fill="#fff">911</text>
            {[0, 1, 2].map((i) => { const t = ((f + i * 15) % 45) / 45; return <circle key={i} cx={0} cy={140} r={60 + t * 110} fill="none" stroke={G.green} strokeWidth={4} opacity={1 - t} />; })}
            <circle cx={0} cy={140} r={56} fill={G.green} />
            <text x={0} y={330} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={34} fill={G.red}>12%</text>
          </g>}
          {dead && <g opacity={0.9}>
            <rect x={-60} y={-40} width={120} height={64} rx={10} fill="none" stroke={G.red} strokeWidth={6} /><rect x={60} y={-20} width={12} height={24} rx={3} fill={G.red} />
            <rect x={-50} y={-30} width={10} height={44} fill={G.red} opacity={Math.floor(f / 10) % 2} />
          </g>}
        </g>
        <Dust f={f} n={40} />
      </Cam>
      {p.tag && <Tag f={f} text={p.tag} />}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the cave, 1962
export const Cave: React.FC<SP> = ({ f, d, p }) => (
  <AbsoluteFill>
    <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 560, 1.1]]}>
      <Plate name="cave" dim={0.1} />
      <Chair x={980} s={1.0} floorY={900} />
      <Fig x={980} y={900} s={1.0} f={f} hair="none" beard={false} pose="sit" eyes={p.eyes ?? 'open'} mouth="line" look={0.5} />
      <circle cx={1180} cy={760} r={140} fill="url(#warmPool)" />
      <Dust f={f} warm />
    </Cam>
    {p.tag && <Tag f={f} text={p.tag} />}
  </AbsoluteFill>
);

/** Two calendar pages: what he thought vs the real date. */
export const Dates: React.FC<SP> = ({ f, d, m }) => {
  const page = (x: number, at: number, top: string, mon: string, day: string, c: string) => {
    const k = clamp((f - at) / 10);
    return <g transform={`translate(${x} ${560 + (1 - k) * 40})`} opacity={k}>
      <text x={0} y={-300} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} fill="#9fb0e8" letterSpacing={2}>{top}</text>
      <rect x={-200} y={-240} width={400} height={440} rx={26} fill="#f1f4ff" filter="url(#soft)" />
      <rect x={-200} y={-240} width={400} height={110} rx={26} fill={c} />
      <text x={0} y={-160} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={60} fill="#fff">{mon}</text>
      <text x={0} y={110} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={220} fill={G.ink}>{day}</text>
    </g>;
  };
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, #1d2a6a 0%, #0a0e28 75%)' }}>
      <Cam f={f} d={d} v={[[960, 540, 1.0], [960, 540, 1.04]]}>
        {page(600, 4, 'WHAT HE THOUGHT', 'AUGUST', '20', '#d99a1e')}
        {page(1320, m?.go ?? 22, 'THE REAL DATE', 'SEPTEMBER', '14', G.red)}
      </Cam>
      <Cite f={f} text="MICHEL SIFFRE · SCARASSON CAVE · 1962" at={8} y={980} />
    </AbsoluteFill>
  );
};

export const VSETS: Record<string, React.FC<SP>> = { vin: VaultIn, door: DoorOut, street: Street, lock: TimeLock, workshop: Workshop, avenue: Avenue, wall: WallCut, box: BoxDims, gauge: Gauge, phone: PhoneUI, cave: Cave, dates: Dates };
