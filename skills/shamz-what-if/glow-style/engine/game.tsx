// Scenes for "What If You Lived Inside an Open-World Game for a Week?" (Glow style, Story Formula, Rule #5).
// Everything here is our own original "Glow City": no real game's map, logos, characters or interface.
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { BigStat, Cam, Cite, clamp, Dust, easeOut, Fig, G, lerp, MONO, Plate, SANS, Tag, walk as walkCycle } from './glow';

type SP = { f: number; d: number; p: any; m: Record<string, number> };
const mk = (m: Record<string, number> | undefined, k: string, dflt: number) => (m && m[k] !== undefined ? m[k] : dflt);

/** A glowing quest marker (diamond with a glyph) bobbing in the air. */
const Marker: React.FC<{ x: number; y: number; f: number; c?: string; g?: string; k?: number; s?: number }> = ({ x, y, f, c = G.yellow, g = '!', k = 1, s = 1 }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 12 + x) * 8}) scale(${s * k})`} opacity={k}>
    <circle r={46} fill={c} opacity={0.25} filter="url(#blur30)" />
    <path d="M 0 -34 L 30 0 L 0 34 L -30 0 Z" fill="#0b1028" stroke={c} strokeWidth={5} filter="url(#soft)" />
    <text y={11} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={32} fill={c}>{g}</text>
  </g>
);

/** A health / progress bar. */
const Bar: React.FC<{ x: number; y: number; w: number; h: number; v: number; c: string; label?: string }> = ({ x, y, w, h, v, c, label }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="#0b1028" stroke="#cfe0ff" strokeWidth={3} opacity={0.95} />
    <rect x={x + 4} y={y + 4} width={Math.max(0, (w - 8) * clamp(v))} height={h - 8} rx={(h - 8) / 2} fill={c} filter="url(#soft)" />
    {label && <text x={x} y={y - 12} fontFamily={MONO} fontWeight={700} fontSize={22} letterSpacing={4} fill="#dfe6ff">{label}</text>}
  </g>
);

/**
 * The game world: any plate and cast, with the game's interface on top.
 * p.skybar (a huge health bar across the sky), p.arrow (a marker over the first figure), p.icons (n markers in the air),
 * p.hud (health + minimap corner UI), p.xp ([from, to] bar filling over the shot), p.quest (quest text), p.pop (a popup at mark 'go').
 */
export const Hud: React.FC<SP> = ({ f, d, p, m }) => {
  const figs: any[] = p.figs ?? [{ shamz: true }];
  const f0 = figs[0] ?? {};
  const go = mk(m, 'go', 10);
  const ni = p.icons ?? 0;
  const xp = p.xp ? lerp(f, [6, Math.max(12, d - 10)], p.xp, easeOut) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={p.rot ? { transform: `rotate(${p.rot}deg) scale(1.08)` } : undefined}>
      <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 560, 1.07]]}>
        <Plate name={p.plate ?? 'gamecity'} floorY={860} blur={p.blur ?? 1} dim={p.dim ?? 0.15} />
        {p.skybar && <g opacity={lerp(f, [2, 12], [0, 1])}>
          <Bar x={420} y={110} w={1080} h={46} v={lerp(f, [0, d], [1, 0.92])} c={G.green} />
          <text x={960} y={92} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={26} letterSpacing={8} fill="#dfffe8">SKY · 100 / 100</text>
        </g>}
        {Array.from({ length: ni }).map((_, i) => {
          const k = lerp(f, [3 + i * 3, 11 + i * 3], [0, 1], easeOut);
          return <Marker key={i} f={f} k={k} x={160 + random(`ix${i}`) * 1600} y={160 + random(`iy${i}`) * 380} s={0.6 + random(`is${i}`) * 0.6}
            c={[G.yellow, G.blue, G.pink, G.green][i % 4]} g={['!', '?', '$', '★'][i % 4]} />;
        })}
        {(p.props ?? []).filter((q: any) => !q.front).map((q: any, i: number) => <Prop key={`b${i}`} f={f} q={q} m={m} />)}
        {figs.map((g, i) => ({ g, i })).sort((a, b) => (a.g.y ?? 890) - (b.g.y ?? 890)).map(({ g, i }) => <g key={i}>
          {g.walk ? <Fig f={f} seed={i * 5} {...g} x={(g.x ?? 860) + g.walk * clamp(f / Math.max(1, d))} y={g.y ?? 890} s={g.s ?? 1.05} flip={g.walk < 0} pose={walkCycle(f / 4.5 + i)} />
            : <Fig x={g.x ?? 860 + i * 260} y={g.y ?? 890} s={g.s ?? 1.05} f={f} seed={i * 5} {...g} pose={g.pose ?? 'stand'} />}
          {g.sign && <g transform={`translate(${g.x} ${(g.y ?? 890) - 500 * (g.s ?? 1.05)}) scale(${g.s ?? 1.05})`}>
            <rect x={-95} y={-60} width={190} height={92} rx={8} fill="#f4ecd8" stroke="#c9b48a" strokeWidth={5} />
            <text y={0} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={g.sign.length > 9 ? 22 : 30} fill="#2a2140">{g.sign}</text>
          </g>}
        </g>)}
        {(p.props ?? []).filter((q: any) => q.front).map((q: any, i: number) => <Prop key={`f${i}`} f={f} q={q} m={m} />)}
        {p.fg && <g style={{ filter: `blur(${p.fg.blur ?? 7}px)` }} opacity={0.9}><Fig f={f} seed={77} pose="stand" {...p.fg} /></g>}
        {p.arrow && <g transform={`translate(${(figs[p.arrowOn ?? 0] ?? f0).x ?? 860} ${((figs[p.arrowOn ?? 0] ?? f0).y ?? 890) - 470 * ((figs[p.arrowOn ?? 0] ?? f0).s ?? 1.05) + Math.sin(f / 8) * 10})`} opacity={lerp(f, [2, 10], [0, 1])}>
          <path d="M -26 -40 L 26 -40 L 0 0 Z" fill={G.green} filter="url(#soft)" />
        </g>}
        {p.dream && Array.from({ length: 18 }).map((_, i) => {
          const x = 120 + random(`dx${i}`) * 1680, sp = 2 + random(`dv${i}`) * 3, y = ((f * sp + random(`dy${i}`) * 1200) % 1300) - 150;
          return i % 3 === 0 ? <Marker key={i} f={f} x={x} y={y} s={0.6} c={[G.yellow, G.blue, G.pink][i % 3]} g={['!', '?', '$'][i % 3]} k={0.7} />
            : <rect key={i} x={x - 30} y={y - 30} width={60} height={60} rx={8} fill={[G.blue, G.pink, G.green, G.yellow][i % 4]} opacity={0.55} filter="url(#soft)" />;
        })}
        <Dust f={f} n={30} warm={p.warm} />
      </Cam>
      </AbsoluteFill>
      {p.notifs && <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: p.notifs }).map((_, i) => {
          const k = lerp(f, [4 + i * 4, 10 + i * 4], [0, 1], easeOut);
          const r = random(`nx${i}`), x = i % 2 ? 1120 + r * 640 : 160 + r * 520, y = 120 + random(`ny${i}`) * 520;
          return <g key={i} transform={`translate(${x} ${y}) scale(${k})`} opacity={k}>
            <rect x={-70} y={-70} width={140} height={140} rx={32} fill={['#3a6cff', '#7a4cff', '#2d6b4a', '#ff7f50'][i % 4]} opacity={0.9} />
            <circle cx={62} cy={-62} r={30} fill={G.red} filter="url(#soft)" />
            <text x={62} y={-51} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={30} fill="#fff">{1 + (i * 7) % 9}</text>
          </g>;
        })}
      </svg>}
      {p.hud && <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <Bar x={70} y={70} w={420} h={34} v={p.health ?? 0.9} c={G.red} label="HEALTH" />
        <circle cx={1760} cy={170} r={110} fill="#0b1028" stroke="#cfe0ff" strokeWidth={4} opacity={0.9} />
        {[0, 1, 2, 3].map((i) => <line key={i} x1={1650} y1={120 + i * 34} x2={1870} y2={140 + i * 26} stroke="#4a5ca8" strokeWidth={6} />)}
        {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={1700 + random(`mx${i}`) * 120} cy={110 + random(`my${i}`) * 120} r={8} fill={[G.yellow, G.blue, G.pink, G.green, G.yellow][i]} />)}
        <path d="M 1760 156 L 1772 186 L 1760 178 L 1748 186 Z" fill="#fff" />
      </svg>}
      {p.xp && <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <Bar x={560} y={p.hud ? 150 : 90} w={800} h={40} v={xp} c={G.yellow} label={p.xpLabel ?? 'LEVEL 7'} />
      </svg>}
      {p.quest && <div style={{ position: 'absolute', left: 70, top: p.hud ? 150 : 70, padding: '16px 26px', borderRadius: 18, background: '#0b1028dd', border: '3px solid #cfe0ff', fontFamily: SANS, fontWeight: 800, fontSize: 32, color: '#fff', opacity: lerp(f, [4, 12], [0, 1]), maxWidth: 560 }}>
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 5, color: G.yellow, marginBottom: 6 }}>QUEST</div>{p.quest}</div>}
      {p.pop && f >= go && <BigStat f={f} text={p.pop} sub={p.popSub} at={go} y={p.popY ?? 200} size={110} color={p.popColor ?? G.yellow} />}
      {p.day && <DayCard f={f} c={p.day} />}
      {p.clock && <div style={{ position: 'absolute', left: p.clock.x ?? 1240, top: p.clock.y ?? 380, fontFamily: MONO, fontWeight: 700, fontSize: p.clock.size ?? 150, color: p.clock.c ?? G.yellow, textShadow: '0 0 30px #ffc54d88', opacity: lerp(f, [2, 10], [0, 1]) }}>{p.clock.t}</div>}
      {p.panel && <Panel f={f} d={d} c={p.panel} m={m} />}
      {p.tag && <Tag f={f} text={p.tag} />}
    </AbsoluteFill>
  );
};

/** A day title placed per shot (pos: tl, tr, bl, br, top), so day cards are part of a staged scene, never a template slide. */
const DayCard: React.FC<{ f: number; c: any }> = ({ f, c }) => {
  const k = lerp(f, [2, 12], [0, 1], easeOut);
  const pos = c.pos ?? 'tr';
  const st: React.CSSProperties = { position: 'absolute', opacity: k, textAlign: pos.endsWith('r') ? 'right' : pos === 'top' ? 'center' : 'left',
    ...(pos === 'top' ? { left: 0, right: 0, top: 70 } : {}), ...(pos[0] === 't' && pos !== 'top' ? { top: 70 } : {}), ...(pos[0] === 'b' ? { bottom: 200 } : {}),
    ...(pos.endsWith('l') ? { left: 90 } : {}), ...(pos.endsWith('r') ? { right: 90 } : {}) };
  return <div style={st}>
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: c.size ?? 130, color: G.yellow, letterSpacing: 6, textShadow: '0 0 40px #ffc54d88', transform: `translateY(${(1 - k) * 20}px)` }}>{c.t}</div>
    {c.sub && <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 10, color: '#dfe6ff', marginTop: 6 }}>{c.sub}</div>}
  </div>;
};

/** A research card that sits beside the staged scene (side: left or right): items tick in on marks i1.., bar rows fill. */
const Panel: React.FC<{ f: number; d: number; c: any; m: Record<string, number> }> = ({ f, d, c, m }) => {
  const right = c.side !== 'left';
  const items: string[] = c.items ?? [];
  const rows: any[] = c.rows ?? [];
  return <div style={{ position: 'absolute', top: c.top ?? 120, [right ? 'right' : 'left']: 80, width: c.w ?? 820, padding: '28px 34px', borderRadius: 26,
    background: '#0b1028e6', border: '3px solid #8ea2e6', boxShadow: '0 0 40px #5b8cff44', opacity: lerp(f, [1, 8], [0, 1]) } as any}>
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: G.yellow, marginBottom: 18 }}>{c.title}</div>
    {items.map((t, i) => {
      const at = mk(m, `i${i + 1}`, 6 + i * Math.max(10, (d - 20) / Math.max(1, items.length)));
      const k = clamp((f - at) / 8);
      return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 12, opacity: 0.25 + 0.75 * k }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, border: '3px solid #cfe0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 30, color: G.green, flex: 'none' }}>{k > 0.5 ? '✓' : ''}</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: '#fff' }}>{t}</div>
      </div>;
    })}
    {rows.map((r, i) => {
      const k = lerp(f, [6 + i * 12, 24 + i * 12], [0, r.v], easeOut);
      return <div key={i} style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 28, color: '#fff', marginBottom: 6 }}>{r.label}</div>
        <div style={{ height: 30, borderRadius: 15, border: '2px solid #4a5ca8', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 3, top: 3, bottom: 3, width: `calc(${k * 100}% - 6px)`, borderRadius: 12, background: r.c ?? G.yellow, boxShadow: `0 0 16px ${r.c ?? G.yellow}` }} />
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: r.c ?? G.yellow, marginTop: 6, opacity: clamp(k / Math.max(0.01, r.v)) }}>{r.text}</div>
      </div>;
    })}
    {c.foot && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 38, color: c.footColor ?? G.yellow, marginTop: 8, opacity: clamp((f - mk(m, 'foot', 14)) / 8) }}>{c.foot}</div>}
    {c.cite && <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 18, letterSpacing: 3, color: '#b9c4f0', marginTop: 14 }}>{c.cite}</div>}
  </div>;
};

/** Props placed per shot. k: sign | desk | laptop | monitor | crate | chest | burger | bench | phone. The floor point is (x, y); s scales with depth. */
const Prop: React.FC<{ f: number; q: any; m: Record<string, number> }> = ({ f, q, m }) => {
  const s = q.s ?? 1;
  const t = q.open ? mk(m, q.open, q.open === 'done' ? -99 : 9999) : 9999;
  const k = clamp((f - t) / 14);
  return <g transform={`translate(${q.x} ${q.y}) scale(${s})`}>
    {q.k === 'desk' && <g><rect x={-170} y={-185} width={340} height={22} rx={6} fill="#6b4a2b" stroke="#2a1a0e" strokeWidth={4} />
      <rect x={-155} y={-165} width={18} height={165} fill="#4a321c" /><rect x={137} y={-165} width={18} height={165} fill="#4a321c" /></g>}
    {q.k === 'laptop' && <g transform="translate(0 -185)"><path d="M -70 0 L 70 0 L 60 -10 L -60 -10 Z" fill="#9aa6cf" />
      <rect x={-56} y={-92} width={112} height={80} rx={6} fill="#1a2350" stroke="#cfe0ff" strokeWidth={4} /><rect x={-48} y={-84} width={96} height={64} fill="#5b8cff" opacity={0.55 + 0.2 * Math.sin(f / 5)} filter="url(#soft)" /></g>}
    {q.k === 'monitor' && <g transform="translate(0 -185)"><rect x={-14} y={-30} width={28} height={30} fill="#2a3360" />
      <rect x={-110} y={-150} width={220} height={124} rx={8} fill="#0b1028" stroke="#cfe0ff" strokeWidth={4} />
      <rect x={-100} y={-140} width={200} height={104} fill={q.c ?? '#ff7fb0'} opacity={0.45 + 0.2 * Math.sin(f / 4)} filter="url(#soft)" /></g>}
    {(q.k === 'crate' || q.k === 'chest') && (k < 0.5 ? <g>
      <rect x={-80} y={-150} width={160} height={150} rx={8} fill={q.k === 'chest' ? '#6a3fa0' : '#8a5a2b'} stroke={q.k === 'chest' ? '#ffcf4d' : '#3a2412'} strokeWidth={6} />
      {[0, 1, 2].map((i) => <line key={i} x1={-80} y1={-112 + i * 40} x2={80} y2={-112 + i * 40} stroke={q.k === 'chest' ? '#ffcf4d' : '#5e3b1a'} strokeWidth={4} opacity={0.7} />)}
      {q.k === 'chest' && <circle cx={0} cy={-150} r={70} fill={G.yellow} opacity={0.2 + 0.1 * Math.sin(f / 6)} filter="url(#blur30)" />}
    </g> : <g>{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-90 + i * 40} y={-30 + Math.sin(i * 2) * 10} width={50} height={18} rx={4} fill="#8a5a2b" stroke="#3a2412" strokeWidth={3} transform={`rotate(${(i - 2) * 25})`} />)}
      {q.loot && <path transform={`translate(0 ${-200 - 40 * k})`} d="M -50 -56 L -18 -70 Q 0 -54 18 -70 L 50 -56 L 66 -10 L 40 -2 L 40 60 L -40 60 L -40 -2 L -66 -10 Z" fill="#ffcf4d" stroke="#fff3c4" strokeWidth={5} filter="url(#bloom)" />}
      {!q.loot && <text y={-140 - 30 * k} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={44} fill="#9aa6cf" opacity={1 - clamp((f - t - 30) / 20)}>NOTHING</text>}
    </g>)}
    {q.k === 'burger' && <g transform="translate(0 -190)"><ellipse rx={40} ry={18} cy={-14} fill="#d9963c" /><rect x={-42} y={-8} width={84} height={12} rx={5} fill="#5a3216" /><ellipse rx={40} ry={10} cy={8} fill="#d9963c" /></g>}
    {q.k === 'bench' && <g><rect x={-160} y={-95} width={320} height={20} rx={6} fill="#6b4a2b" stroke="#2a1a0e" strokeWidth={4} /><rect x={-160} y={-150} width={320} height={16} rx={6} fill="#6b4a2b" />
      <rect x={-140} y={-80} width={14} height={80} fill="#2a2a3a" /><rect x={126} y={-80} width={14} height={80} fill="#2a2a3a" /></g>}
    {q.k === 'phone' && <g transform={`rotate(${q.r ?? 0})`}><rect x={-30} y={-56} width={60} height={112} rx={10} fill="#0b1028" stroke="#cfe0ff" strokeWidth={4} />
      <rect x={-24} y={-48} width={48} height={94} rx={6} fill={q.c ?? '#2d6b4a'} opacity={0.4 + 0.5 * Math.abs(Math.sin(f / 4))} filter="url(#soft)" /></g>}
  </g>;
};

/** The city map: streets, a river and a park drawn in code, with icons popping in until it is covered. */
export const MapView: React.FC<SP> = ({ f, d, p }) => {
  const n = p.n ?? 60;
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={p.v ?? [[960, 540, 1.0], [960, 540, 1.12]]}>
        <rect x={-300} y={-300} width={2520} height={1680} fill="#0d1436" />
        <path d="M -300 760 C 300 640 700 900 1200 760 S 1900 640 2300 720 L 2300 860 C 1900 780 1500 920 1200 900 S 300 800 -300 900 Z" fill="#1d3f8f" opacity={0.8} />
        <rect x={1240} y={220} width={360} height={260} rx={40} fill="#173d2e" />
        {Array.from({ length: 14 }).map((_, i) => <line key={`v${i}`} x1={-100 + i * 160} y1={-200} x2={-60 + i * 160} y2={1300} stroke="#2c3a78" strokeWidth={i % 4 === 0 ? 16 : 7} />)}
        {Array.from({ length: 9 }).map((_, i) => <line key={`h${i}`} x1={-300} y1={-40 + i * 150} x2={2300} y2={-10 + i * 150} stroke="#2c3a78" strokeWidth={i % 3 === 0 ? 16 : 7} />)}
        {Array.from({ length: n }).map((_, i) => {
          const k = lerp(f, [2 + i * (Math.max(20, d - 20) / n), 8 + i * (Math.max(20, d - 20) / n)], [0, 1], easeOut);
          return <Marker key={i} f={f} k={k} s={0.75} x={80 + random(`mpx${i}`) * 1760} y={80 + random(`mpy${i}`) * 800}
            c={[G.yellow, G.blue, G.pink, G.green][i % 4]} g={['!', '?', '$', '★'][i % 4]} />;
        })}
        <g transform={`translate(${p.pinX ?? 960} ${p.pinY ?? 560})`}>
          <circle r={34 + 6 * Math.sin(f / 6)} fill="#fff" opacity={0.25} filter="url(#blur30)" />
          <path d="M 0 -26 L 18 22 L 0 12 L -18 22 Z" fill="#fff" filter="url(#soft)" />
        </g>
        <Dust f={f} n={20} />
      </Cam>
      <div style={{ position: 'absolute', left: 70, top: 60, fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 8, color: '#dfe6ff' }}>GLOW CITY · MAP</div>
      {p.tag && <Tag f={f} text={p.tag} />}
    </AbsoluteFill>
  );
};

/** One wooden crate drawn in code (sits on its floor line at x). open 0..1 bursts it; loot shows what came out. */
const Crate: React.FC<{ x: number; y: number; f: number; open: number; loot?: boolean; s?: number }> = ({ x, y, f, open, loot, s = 1 }) => {
  const sh = open > 0 && open < 0.3 ? Math.sin(f * 3) * 6 : 0;
  return (
    <g transform={`translate(${x + sh} ${y}) scale(${s})`}>
      {open < 0.5 ? <g>
        <rect x={-80} y={-150} width={160} height={150} rx={8} fill="#8a5a2b" stroke="#3a2412" strokeWidth={6} />
        {[0, 1, 2].map((i) => <line key={i} x1={-80} y1={-112 + i * 40} x2={80} y2={-112 + i * 40} stroke="#5e3b1a" strokeWidth={4} />)}
        <path d="M -76 -146 L 76 -4 M 76 -146 L -76 -4" stroke="#6b431f" strokeWidth={10} />
        <rect x={-80} y={-150} width={160} height={150} rx={8} fill="none" stroke="#ffcf8a" strokeWidth={2} opacity={0.4} />
      </g> : <g>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = -Math.PI / 2 + (i - 2.5) * 0.5, r = 40 + 160 * clamp((open - 0.5) * 2);
          return <rect key={i} x={Math.cos(a) * r - 30} y={-80 + Math.sin(a) * r * 0.7 + 120 * clamp((open - 0.5) * 2) ** 2} width={60} height={22} rx={4} fill="#8a5a2b" stroke="#3a2412" strokeWidth={4} transform={`rotate(${i * 40 * open})`} opacity={1 - clamp((open - 0.8) * 5)} />;
        })}
        {loot && <g transform={`translate(0 ${-150 - 60 * clamp((open - 0.5) * 2)})`}>
          <circle r={120} fill={G.yellow} opacity={0.3} filter="url(#blur30)" />
          <path d="M -50 -56 L -18 -70 Q 0 -54 18 -70 L 50 -56 L 66 -10 L 40 -2 L 40 60 L -40 60 L -40 -2 L -66 -10 Z" fill="#ffcf4d" stroke="#fff3c4" strokeWidth={5} filter="url(#bloom)" />
        </g>}
      </g>}
    </g>
  );
};

/**
 * The crate alley. Crates open on marks c1, c2, c3; the third (p.lootAt, 1-based) drops the golden jacket.
 * p.many shows rows of crates down the street; p.jacket puts the golden jacket on Shamz.
 */
export const Crates: React.FC<SP> = ({ f, d, p, m }) => {
  const xs: number[] = p.xs ?? [760, 1120, 1480];
  const lootAt = p.lootAt ?? 3;
  const shown: number = p.crates ?? xs.length;
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 560, 1.06]]}>
        <Plate name="cratealley" floorY={860} blur={1} dim={0.15} />
        {p.many && Array.from({ length: 14 }).map((_, i) => <Crate key={i} f={f} open={0} x={120 + (i % 7) * 280} y={i < 7 ? 700 : 900} s={i < 7 ? 0.55 : 0.8} />)}
        {!p.many && xs.slice(0, shown).map((x, i) => {
          const t = mk(m, `c${i + 1}`, p.openAll ? -99 : 9999);
          const k = clamp((f - t) / 14);
          return <g key={i}>
            <Crate f={f} x={x} y={890} open={k} loot={i + 1 === lootAt} />
            {k > 0.5 && i + 1 !== lootAt && <text x={x} y={700 - 30 * k} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={44} fill="#9aa6cf" opacity={1 - clamp((f - t - 30) / 20)}>NOTHING</text>}
            {k > 0.5 && i + 1 === lootAt && <g opacity={clamp((f - t - 10) / 8)}>
              <text x={x} y={560} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={30} letterSpacing={6} fill={G.yellow} filter="url(#soft)">LEGENDARY</text>
              <text x={x} y={600} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={34} fill="#fff">GOLDEN JACKET</text>
            </g>}
          </g>;
        })}
        <Fig x={p.figX ?? 420} y={890} s={1.05} f={f} shamz eyes={p.eyes ?? 'open'} mouth={p.mouth ?? 'line'} pose={p.pose ?? 'point'} look={0.7}
          shirt={p.jacket ? '#ffcf4d' : undefined} insight={p.insight} />
        <Dust f={f} n={30} />
      </Cam>
      {p.tag && <Tag f={f} text={p.tag} />}
    </AbsoluteFill>
  );
};

/** Skinner's box on a 1950s lab bench (plate lab1950): a lever and a light; rewards drop at fixed or random moments. */
export const Skinner: React.FC<SP> = ({ f, d, p }) => {
  const random_ = p.mode === 'random';
  const drops = random_ ? [14, 22, 60, 66, 70, 118] : [10, 40, 70, 100];
  const stop = p.stop ?? 9999;
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 560, 1.06]]}>
        <Plate name="lab1950" floorY={860} blur={1.5} dim={0.2} />
        <g transform={`translate(${p.boxX ?? 1180} 860) scale(${p.boxS ?? 1})`}>
          <rect x={-260} y={-330} width={520} height={330} rx={12} fill="#1a2350" stroke="#cfe0ff" strokeWidth={6} opacity={0.95} />
          <rect x={-230} y={-300} width={460} height={270} rx={8} fill="#0b1028" />
          <circle cx={-120} cy={-240} r={22} fill={drops.some((t) => f >= t && f < t + 8 && t < stop) ? G.yellow : '#3a4170'} filter="url(#soft)" />
          <rect x={-150} y={-150} width={80} height={16} rx={6} fill="#cfe0ff" transform={`rotate(${Math.sin(f / 3) > 0.6 ? 12 : 0} -150 -142)`} />
          <rect x={100} y={-90} width={90} height={56} rx={8} fill="#2a3360" />
          {drops.filter((t) => f >= t && t < stop).map((t, i) => <circle key={i} cx={130 + (i % 3) * 14} cy={Math.min(-50, -200 + (f - t) * 14)} r={9} fill={G.yellow} filter="url(#soft)" />)}
        </g>
        {p.scientist && <Fig x={p.sciX ?? 520} y={p.sciY ?? 890} s={p.sciS ?? 1.05} f={f} hair="none" glasses flip={p.sciFlip} pose={p.sciPose ?? 'clip'} eyes={p.sciEyes ?? 'open'} mouth="line" look={p.sciFlip ? -0.8 : 0.8} />}
        <Dust f={f} n={30} warm />
      </Cam>
      {p.label && <BigStat f={f} text={p.label} sub={p.sub} at={4} y={170} size={92} color={random_ ? G.yellow : '#9fd8ff'} />}
      {p.tag && <Tag f={f} text={p.tag} />}
    </AbsoluteFill>
  );
};

/** Two lines over time: a reward every time (stops, then gives up) vs a reward at random (keeps going). */
export const Curve: React.FC<SP> = ({ f, d, p }) => {
  const k = lerp(f, [4, Math.max(20, d * 0.8)], [0, 1]);
  const X0 = 300, X1 = 1620, Y0 = 820, Y1 = 300;
  const fixed = (t: number) => (t < 0.5 ? 0.75 : Math.max(0.05, 0.75 - (t - 0.5) * 3.2));
  const rnd = (t: number) => 0.55 + 0.38 * t + 0.03 * Math.sin(t * 40);
  const path = (fn: (t: number) => number) => Array.from({ length: 61 }).map((_, i) => i / 60).filter((t) => t <= k)
    .map((t, i) => `${i ? 'L' : 'M'} ${X0 + (X1 - X0) * t} ${Y0 - (Y0 - Y1) * fn(t)}`).join(' ');
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, #1e2c7a 0%, #0b1030 75%)' }}>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', inset: 0, transformOrigin: `${p.zx ?? 960}px ${p.zy ?? 540}px`, transform: `scale(${lerp(f, [0, d], p.zoom ?? [1, 1])})` }}>
        <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="#4a5ca8" strokeWidth={4} />
        <line x1={X0} y1={Y0} x2={X0} y2={Y1 - 40} stroke="#4a5ca8" strokeWidth={4} />
        <line x1={(X0 + X1) / 2} y1={Y1 - 40} x2={(X0 + X1) / 2} y2={Y0} stroke="#9aa6cf" strokeWidth={3} strokeDasharray="10 12" opacity={k > 0.5 ? 1 : 0} />
        <text x={(X0 + X1) / 2 + 16} y={Y1 - 10} fontFamily={MONO} fontWeight={700} fontSize={22} letterSpacing={4} fill="#9aa6cf" opacity={k > 0.5 ? 1 : 0}>REWARDS STOP</text>
        <text x={X0} y={Y0 + 44} fontFamily={MONO} fontWeight={700} fontSize={22} letterSpacing={4} fill="#9aa6cf">TIME →</text>
        <text x={X0 - 20} y={Y1 - 60} fontFamily={MONO} fontWeight={700} fontSize={22} letterSpacing={4} fill="#9aa6cf">KEEPS TRYING</text>
        <path d={path(fixed)} fill="none" stroke="#9fd8ff" strokeWidth={10} strokeLinecap="round" filter="url(#soft)" />
        {p.both && <path d={path(rnd)} fill="none" stroke={G.yellow} strokeWidth={10} strokeLinecap="round" filter="url(#soft)" />}
        <text x={X1 - 10} y={Y0 - 30} textAnchor="end" fontFamily={SANS} fontWeight={900} fontSize={34} fill="#9fd8ff" opacity={k > 0.9 ? 1 : 0}>EVERY TIME: GIVES UP</text>
        {p.both && <text x={X1 - 10} y={Y1 - 50} textAnchor="end" fontFamily={SANS} fontWeight={900} fontSize={34} fill={G.yellow} opacity={k > 0.9 ? 1 : 0}>AT RANDOM: KEEPS GOING</text>}
      </svg>
      <Cite f={f} text="FERSTER & SKINNER (1957) · SCHEDULES OF REINFORCEMENT" at={6} y={860} />
    </AbsoluteFill>
  );
};

/** A checklist card: items tick in one by one; an optional footer in red or yellow. */
export const Check: React.FC<SP> = ({ f, d, p, m }) => {
  const items: string[] = p.items ?? [];
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, #1e2c7a 0%, #0b1030 75%)', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 1180, marginTop: -80 }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 8, color: G.yellow, marginBottom: 30 }}>{p.title}</div>
        {items.map((t, i) => {
          const at = mk(m, `i${i + 1}`, 6 + i * Math.max(10, (d - 20) / Math.max(1, items.length)));
          const k = clamp((f - at) / 8);
          return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 26, marginBottom: 22, opacity: 0.25 + 0.75 * k, transform: `translateX(${(1 - k) * 20}px)` }}>
            <div style={{ width: 54, height: 54, borderRadius: 14, border: '4px solid #cfe0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 40, color: G.green }}>{k > 0.5 ? '✓' : ''}</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46, color: '#fff' }}>{t}</div>
          </div>;
        })}
        {p.foot && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 50, color: p.footColor ?? G.yellow, marginTop: 24, opacity: clamp((f - mk(m, 'foot', 20)) / 8) }}>{p.foot}</div>}
      </div>
      {p.cite && <Cite f={f} text={p.cite} at={6} y={860} />}
    </AbsoluteFill>
  );
};

/**
 * The real-life quest log at dawn (plate dawnroom): Shamz on the left, a big notebook on the right; quests write in on
 * marks q1..q3, the first is ticked at mark 'tick' with a LEVEL UP popup.
 */
export const Quest: React.FC<SP> = ({ f, d, p, m }) => {
  const qs: string[] = p.quests ?? [];
  const tick = mk(m, 'tick', 9999);
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 560, 1.05]]}>
        <Plate name={p.plate ?? 'dawnroom'} floorY={860} blur={2} dim={0.08} />
        <Fig x={p.figX ?? 440} y={p.figY ?? 890} s={p.figS ?? 1.05} f={f} shamz flip={p.flip} pose={p.pose ?? 'clip'} eyes={f > tick ? 'happy' : 'open'} mouth={f > tick ? 'grin' : 'smile'} look={p.flip ? -0.8 : 0.8} insight={p.insight} />
        <g transform={`translate(${p.nbX ?? 1180} ${p.nbY ?? 520}) rotate(${p.nbRot ?? -3}) scale(${p.nbS ?? 1})`}>
          <rect x={-380} y={-300} width={760} height={600} rx={18} fill="#f4ecd8" stroke="#c9b48a" strokeWidth={6} />
          {Array.from({ length: 7 }).map((_, i) => <line key={i} x1={-340} y1={-170 + i * 72} x2={340} y2={-170 + i * 72} stroke="#bcd0f0" strokeWidth={3} />)}
          <text x={-330} y={-200} fontFamily={MONO} fontWeight={700} fontSize={36} letterSpacing={6} fill="#c0392b">QUEST LOG</text>
          {qs.map((q, i) => {
            const at = mk(m, `q${i + 1}`, 6 + i * 20);
            const n = Math.floor(clamp((f - at) / 18) * q.length);
            const done = i === 0 && f > tick;
            return <g key={i}>
              <rect x={-330} y={-130 + i * 144} width={48} height={48} rx={8} fill="none" stroke="#3a2a4a" strokeWidth={5} opacity={n > 0 ? 1 : 0} />
              {done && <path d={`M -322 ${-108 + i * 144} l 16 18 l 34 -40`} fill="none" stroke="#1f9a4a" strokeWidth={9} strokeLinecap="round" />}
              <text x={-260} y={-92 + i * 144} fontFamily={SANS} fontWeight={800} fontSize={46} fill="#2a2140" textDecoration={done ? 'line-through' : undefined}>{q.slice(0, n)}</text>
            </g>;
          })}
        </g>
        <Dust f={f} n={30} warm />
      </Cam>
      {f > tick && <BigStat f={f} text="LEVEL UP" sub="REAL LIFE · +1" at={tick + 2} x={p.nbX ?? 1180} y={p.lvlY ?? 140} size={100} color={G.yellow} />}
      {p.tag && <Tag f={f} text={p.tag} />}
    </AbsoluteFill>
  );
};

export const GSETS: Record<string, React.FC<SP>> = { hud: Hud, map: MapView, crates: Crates, skinner: Skinner, curve: Curve, check: Check, quest: Quest };
