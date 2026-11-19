// Scenes for "What If the Whole World Lost Power for 24 Hours?" (Glow style, painted plates, Story Formula).
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { BigStat, Cam, Cite, clamp, Dust, easeOut, Fig, G, lerp, MONO, Plate, SANS, Tag, W, H, walk } from './glow';

type SP = { f: number; d: number; p: any; m: Record<string, number> };

/** How much power is on at frame f: p.power (0..1) or a fade from p.from to p.to around the mark m.cut/m.on. */
const powerAt = (f: number, p: any, m: Record<string, number>) => {
  if (m?.cut !== undefined) return 1 - clamp((f - m.cut) / 6);
  if (m?.on !== undefined) return clamp((f - m.on) / 10);
  return p.power ?? 1;
};
/** Darkness laid over a plate when the power is off (the plate's own lamps and windows die). */
const Dark: React.FC<{ power: number; amt?: number }> = ({ power, amt = 0.72 }) => (
  <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill="#02030b" opacity={(1 - power) * amt} />
);

/** Any painted place with a cast; the power can be on, off, cut or restored on a cue. */
export const Place: React.FC<SP> = ({ f, d, p, m }) => {
  const power = powerAt(f, p, m);
  const figs: any[] = p.figs ?? [];
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 560, 1.07]]} shake={p.shake ?? 0}>
        <Plate name={p.plate} floorY={860} blur={p.blur ?? 1} dim={p.dim ?? 0.12} />
        <Dark power={power} amt={p.darkAmt} />
        {p.traffic && <TrafficLight x={p.traffic} f={f} power={power} />}
        {figs.map((g, i) => {
          const x = g.x ?? 820 + i * 220;
          const wx = g.walk ? x + lerp(f, [0, d], [0, g.walk]) : x;
          return <Fig key={i} y={g.y ?? 890} s={g.s ?? 1.0} f={f} seed={i * 7} {...g} x={wx} pose={g.walk ? walk(f / 2.6 + i) : g.pose ?? 'stand'} />;
        })}
        <Dust f={f} warm={p.warm} n={power < 0.5 ? 40 : 70} />
      </Cam>
      {p.tag && <Tag f={f} text={p.tag} />}
    </AbsoluteFill>
  );
};

const TrafficLight: React.FC<{ x: number; f: number; power: number }> = ({ x, f, power }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={-8} y={300} width={16} height={560} fill="#20253a" stroke={G.line} strokeWidth={3} />
    <rect x={-40} y={180} width={80} height={210} rx={14} fill="#141a30" stroke={G.line} strokeWidth={3} />
    {[0, 1, 2].map((i) => <circle key={i} cx={0} cy={220 + i * 64} r={24} fill={power > 0.5 && i === Math.floor(f / 40) % 3 ? ['#ff5d5d', '#ffc54d', '#5fe08a'][i] : '#2a2f44'} filter={power > 0.5 && i === Math.floor(f / 40) % 3 ? 'url(#bloom)' : undefined} />)}
  </g>
);

/** A code-drawn skyline in front of the city plate: windows go dark in a wave (cut) or light up again (on). */
export const Skyline: React.FC<SP> = ({ f, d, p, m }) => {
  const cut = m?.cut, on = m?.on;
  const blds = Array.from({ length: 14 }).map((_, i) => ({ x: -120 + i * 150 + random(`bx${i}`) * 30, w: 120 + random(`bw${i}`) * 40, h: 260 + random(`bh${i}`) * 380 }));
  const lit = (bx: number, k: number) => {
    const delay = (bx + 200) / 2200 * 30 + random(`wd${k}`) * 6;
    if (cut !== undefined) return f < cut + delay;
    if (on !== undefined) return f >= on + delay;
    return p.power === 0 ? false : random(`wl${k}`) > 0.35;
  };
  const power = cut !== undefined ? 1 - clamp((f - cut) / 36) : on !== undefined ? clamp((f - on) / 36) : (p.power ?? 1);
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 560, 1.06]]}>
        <Plate name="city" blur={2} dim={0.2} />
        <Dark power={power} amt={0.6} />
        {blds.map((b, i) => <g key={i}>
          <rect x={b.x} y={900 - b.h} width={b.w} height={b.h + 300} fill="#0b1026" stroke={G.lineDim} strokeWidth={2} />
          {Array.from({ length: Math.floor(b.h / 46) * 3 }).map((_, k) => {
            const col = k % 3, row = Math.floor(k / 3), key = i * 100 + k;
            const on2 = lit(b.x, key) && random(`wl${key}`) > 0.35;
            return <rect key={k} x={b.x + 16 + col * (b.w - 32) / 3} y={900 - b.h + 20 + row * 46} width={(b.w - 32) / 3 - 10} height={26} fill={on2 ? '#ffd88f' : '#141a35'} opacity={on2 ? 0.9 : 1} />;
          })}
        </g>)}
        <rect x={-600} y={900} width={W + 1200} height={600} fill="#05070f" />
        {p.figs && p.figs.map((g: any, i: number) => <Fig key={i} y={1000} s={0.9} f={f} {...g} />)}
        <Dust f={f} n={40} />
      </Cam>
      {p.tag && <Tag f={f} text={p.tag} />}
    </AbsoluteFill>
  );
};

/** The phone alert: a viral clip claim, then the real alert, with a FALSE stamp when asked. */
export const Alert: React.FC<SP> = ({ f, d, p }) => {
  const mode = p.mode ?? 'alert';
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={[[960, 560, 1.0], [960, 560, 1.04]]}>
        <Plate name={p.plate ?? 'apartment'} blur={9} dim={0.45} />
        <g transform={`translate(960 560) rotate(${Math.sin(f / 30) * 1.2})`}>
          <rect x={-250} y={-440} width={500} height={880} rx={60} fill="#0b0f22" stroke="#cfe0ff" strokeWidth={6} filter="url(#soft)" />
          {mode === 'alert' && <g>
            <rect x={-210} y={-300} width={420} height={260} rx={24} fill={Math.floor(f / 8) % 2 ? '#3a1414' : '#5a1a1a'} stroke={G.red} strokeWidth={4} />
            <text x={0} y={-230} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={34} fill="#fff">EMERGENCY ALERT</text>
            <text x={0} y={-170} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={28} fill="#ffd0d0">This is a TEST of the</text>
            <text x={0} y={-130} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={28} fill="#ffd0d0">national alert system.</text>
            <text x={0} y={-80} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={28} fill="#ffd0d0">No action is required.</text>
            <text x={0} y={60} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={60} fill="#fff">2:20 PM</text>
          </g>}
          {mode === 'viral' && <g>
            <rect x={-210} y={-380} width={420} height={420} rx={20} fill="#1a2350" />
            <text x={0} y={-230} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={42} fill="#fff">"THEY PREDICTED</text>
            <text x={0} y={-180} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={42} fill="#fff">A GLOBAL</text>
            <text x={0} y={-130} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={42} fill={G.yellow}>BLACKOUT"</text>
            <text x={0} y={-60} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={30} fill="#9fb0e8">17 NOVEMBER</text>
            <text x={-170} y={110} fontFamily={SANS} fontWeight={800} fontSize={30} fill="#dfe6ff">♥ {(12 + Math.floor(f / 3)).toFixed(0)}M</text>
            <text x={40} y={110} fontFamily={SANS} fontWeight={800} fontSize={30} fill="#dfe6ff">↗ {(3 + Math.floor(f / 8)).toFixed(0)}M</text>
            {p.stamp && f > 10 && <g transform="rotate(-14)" opacity={clamp((f - 10) / 4)}><rect x={-190} y={-250} width={380} height={130} rx={16} fill="none" stroke={G.red} strokeWidth={12} /><text x={0} y={-155} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={100} fill={G.red}>FALSE</text></g>}
          </g>}
        </g>
        <Dust f={f} n={40} />
      </Cam>
      {p.tag && <Tag f={f} text={p.tag} />}
    </AbsoluteFill>
  );
};

/** A grid control room: wall map of regions; 'frozen' = the alarm screen stuck on OK while lines fail; 'restore' =
 * regions light back up one at a time. */
export const Control: React.FC<SP> = ({ f, d, p, m }) => {
  const mode = p.mode ?? 'frozen';
  const regions = Array.from({ length: 12 }).map((_, i) => ({ x: 560 + (i % 4) * 210, y: 180 + Math.floor(i / 4) * 130 }));
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 560, 1.06]]}>
        <Plate name="controlroom" blur={1.5} dim={0.3} />
        <rect x={520} y={140} width={880} height={420} rx={12} fill="#060a1c" stroke={G.line} strokeWidth={4} />
        {regions.map((r, i) => {
          const on = mode === 'restore' ? f > (m?.go ?? 6) + i * 6 : mode === 'frozen' ? !(f > 10 + i * 5 && i % 3 !== 1) : true;
          const fail = mode === 'frozen' && !on;
          return <rect key={i} x={r.x} y={r.y} width={180} height={100} rx={8} fill={on ? '#1e5a3a' : fail ? '#5a1a1a' : '#141a35'} stroke={on ? G.green : fail ? G.red : G.lineDim} strokeWidth={3} opacity={fail ? 0.6 + 0.4 * Math.sin(f / 3) : 1} />;
        })}
        {mode === 'frozen' && <g transform="translate(1500 640)">
          <rect x={-170} y={-70} width={340} height={140} rx={12} fill="#0b1026" stroke={G.green} strokeWidth={4} />
          <text y={-14} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={30} fill="#9fb0e8">ALARMS</text>
          <text y={40} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={44} fill={G.green}>ALL OK</text>
        </g>}
        {(p.figs ?? []).map((g: any, i: number) => <Fig key={i} y={890} s={1.0} f={f} seed={i * 3} {...g} />)}
        <Dust f={f} n={40} />
      </Cam>
      {p.tag && <Tag f={f} text={p.tag} />}
      {p.cite && <Cite f={f} text={p.cite} at={6} y={990} />}
    </AbsoluteFill>
  );
};

/** The fridge and freezer with their countdowns. */
export const Fridge: React.FC<SP> = ({ f, d, p, m }) => {
  const open = p.open && f > 12 && f < 40;
  const lost = p.open ? clamp((f - 12) / 28) * 0.4 : 0;
  const hrs = (4 - lost) * 3600 - f * 9;
  const t = (s: number) => `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}`;
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={[[960, 560, 1.0], [960, 560, 1.05]]}>
        <Plate name="kitchen" blur={4} dim={0.55} />
        <g transform="translate(760 880)">
          <rect x={-170} y={-760} width={340} height={760} rx={20} fill="#d9def0" stroke={G.ink} strokeWidth={5} />
          <line x1={-170} y1={-520} x2={170} y2={-520} stroke={G.ink} strokeWidth={5} />
          <rect x={130} y={-700} width={14} height={120} rx={7} fill="#8a92b0" /><rect x={130} y={-480} width={14} height={160} rx={7} fill="#8a92b0" />
          {open && <rect x={-170} y={-520} width={340} height={520} fill="#fff6dc" opacity={0.6} filter="url(#soft)" />}
        </g>
        <Fig x={1150} y={890} s={1.05} f={f} shamz pose={open ? 'point' : 'stand'} eyes={open ? 'wide' : 'open'} mouth={open ? 'o' : 'line'} look={-0.6} flip insight={p.insight ? clamp((f - 6) / 10) : 0} />
      </Cam>
      <BigStat f={f} text={p.freezer ? '48 H' : `${t(Math.max(0, hrs))} LEFT`} sub={p.freezer ? 'A FULL FREEZER, DOOR SHUT' : 'A CLOSED FRIDGE STAYS SAFE ABOUT 4 HOURS'} at={2} x={1400} y={300} size={110} color={open ? G.red : G.yellow} />
      <Cite f={f} text="USDA FOOD SAFETY AND INSPECTION SERVICE" at={8} y={990} />
    </AbsoluteFill>
  );
};

/** The emergency kit laid out on a table, item by item. */
export const Kit: React.FC<SP> = ({ f, d, p }) => {
  const items: [string, (x: number) => React.ReactNode][] = [
    ['TORCH', (x) => <g transform={`translate(${x} 0)`}><rect x={-80} y={-30} width={160} height={60} rx={14} fill="#3a3f55" stroke="#cfd8f5" strokeWidth={4} /><circle cx={90} cy={0} r={34} fill="#fff6dc" filter="url(#bloom)" /></g>],
    ['RADIO', (x) => <g transform={`translate(${x} 0)`}><rect x={-100} y={-70} width={200} height={140} rx={16} fill="#5a3a2a" stroke="#cfd8f5" strokeWidth={4} /><circle cx={-40} cy={0} r={40} fill="#2a1a12" stroke="#cfd8f5" strokeWidth={3} /><rect x={20} y={-30} width={60} height={20} rx={4} fill="#ffc54d" /><line x1={60} y1={-70} x2={110} y2={-170} stroke="#cfd8f5" strokeWidth={5} /></g>],
    ['BATTERIES', (x) => <g transform={`translate(${x} 0)`}>{[0, 1, 2].map((i) => <g key={i}><rect x={-70 + i * 50} y={-60} width={36} height={120} rx={6} fill="#2a3a7a" stroke="#cfd8f5" strokeWidth={3} /><rect x={-62 + i * 50} y={-72} width={20} height={14} rx={3} fill="#cfd8f5" /></g>)}</g>],
    ['WATER', (x) => <g transform={`translate(${x} 0)`}>{[0, 1].map((i) => <g key={i}><rect x={-80 + i * 90} y={-110} width={70} height={190} rx={18} fill="#6fd0ff" opacity={0.7} stroke="#cfd8f5" strokeWidth={4} /><rect x={-62 + i * 90} y={-130} width={34} height={24} rx={4} fill="#cfd8f5" /></g>)}</g>],
  ];
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, #2a2240 0%, #0b0d1e 75%)' }}>
      <Cam f={f} d={d} v={p?.v ?? [[960, 560, 1.0], [960, 560, 1.05]]}>
        <rect x={160} y={560} width={1600} height={60} rx={12} fill="#3a2c24" stroke="#c79a6a" strokeWidth={3} />
        {items.map(([label, draw], i) => {
          const k = clamp((f - 4 - i * 12) / 8), x = 330 + i * 420;
          return <g key={i} opacity={k} transform={`translate(0 ${(1 - k) * 30})`}>
            <g transform="translate(0 470)">{draw(x)}</g>
            {!p?.v && <text x={x} y={700} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={36} fill={G.yellow}>{label}</text>}
          </g>;
        })}
      </Cam>
      {!p?.v && <BigStat f={f} text="BE READY" sub="ABOUT 4 LITRES OF WATER PER PERSON, PER DAY" at={2} y={150} size={96} />}
      {!p?.v && <Cite f={f} text="READY.GOV · BUILD A KIT" at={8} y={990} />}
    </AbsoluteFill>
  );
};

/** Shamz's Rule card: the channel's recurring lesson, with the cloud patch glowing. */
export const Rule: React.FC<SP> = ({ f, d, p }) => {
  const k = clamp((f - 4) / 12);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, #2b2350 0%, #0a0b1c 75%)' }}>
      <Cam f={f} d={d} v={[[960, 540, 1.0], [960, 540, 1.04]]}>
        <Fig x={420} y={1250} s={2.1} f={f} shamz pose="stand" eyes="happy" mouth="smile" look={0.4} insight={clamp(f / 12)} />
        <Dust f={f} warm />
      </Cam>
      <div style={{ position: 'absolute', left: 760, right: 120, top: 300, opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: G.yellow, textShadow: `0 0 24px ${G.yellow}88` }}>SHAMZ'S RULE #{p.n ?? 3}</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 76, lineHeight: 1.1, color: '#fff', marginTop: 24, textShadow: '0 0 30px #ffffff44' }}>{p.text}</div>
      </div>
    </AbsoluteFill>
  );
};

export const BSETS: Record<string, React.FC<SP>> = { place: Place, skyline: Skyline, alert: Alert, control: Control, fridge: Fridge, kit: Kit, rule: Rule };
