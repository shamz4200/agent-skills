// Scenes for "What If You Stayed Awake for 11 Days?" (Glow style, painted plates).
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { BigStat, Cam, Cite, clamp, Dust, easeOut, Fig, G, Head, lerp, MONO, Plate, SANS, Tag, W, H, walk } from './glow';

type SP = { f: number; d: number; p: any; m: Record<string, number> };

/** A painted room with any figures in it, plus optional hallucination effects (the room warps, faces in the dark). */
export const Room: React.FC<SP> = ({ f, d, p }) => {
  const figs: any[] = p.figs ?? [{ shamz: true }];
  const warp = p.fx === 'warp' || p.fx === 'faces';
  const sc = warp ? 6 + 5 * Math.sin(f / 9) : 0;
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 560, 1.07]]}>
        <defs>
          <filter id="warp" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.009" numOctaves={2} seed={Math.floor(f / 3)} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={sc * 4} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g filter={warp ? 'url(#warp)' : undefined}>
          <Plate name={p.plate ?? 'bedroom'} floorY={860} blur={p.blur ?? 1} dim={p.dim ?? 0.15} />
        </g>
        {p.fx === 'faces' && [[300, 300], [1500, 260], [1250, 520], [520, 560]].map(([x, y], i) => {
          const k = clamp((f - 8 - i * 12) / 14) * (0.6 + 0.4 * Math.sin(f / 10 + i));
          return <g key={i} opacity={k * 0.8}><ellipse cx={x} cy={y} rx={90} ry={110} fill="#05060f" opacity={0.55} filter="url(#blur30)" /><circle cx={x - 26} cy={y - 10} r={7} fill="#ff6a5a" /><circle cx={x + 26} cy={y - 10} r={7} fill="#ff6a5a" /></g>;
        })}
        {figs.map((g, i) => {
          const x = g.x ?? 820 + i * 260;
          const walking = g.walk;
          const wx = walking ? x + lerp(f, [0, d], [0, walking]) : x;
          return <g key={i}>
            {g.chair && <g transform={`translate(${wx} 890) scale(${g.s ?? 1})`}><rect x={-70} y={-96} width={130} height={18} rx={8} fill={G.fill} stroke={G.line} strokeWidth={3} /><rect x={-84} y={-250} width={20} height={170} rx={9} fill={G.fill} stroke={G.line} strokeWidth={3} /><line x1={-6} y1={-78} x2={-6} y2={-6} stroke={G.line} strokeWidth={6} /></g>}
            <Fig x={wx} y={g.y ?? 890} s={g.s ?? 1.05} f={f} seed={i * 5} {...g} pose={walking ? walk(f / 2.6) : g.pose ?? 'stand'} />
            {g.book && <rect x={wx + 40} y={(g.y ?? 890) - 330} width={70} height={52} rx={4} fill="#f1f4ff" stroke={G.ink} strokeWidth={3} transform={`rotate(-14 ${wx + 75} ${(g.y ?? 890) - 304})`} />}
            {g.note && <rect x={wx + 34} y={(g.y ?? 890) - 300} width={48} height={64} rx={3} fill="#f3e9c8" stroke={G.ink} strokeWidth={3} />}
          </g>;
        })}
        <Dust f={f} warm={p.warm} />
      </Cam>
      {p.tag && <Tag f={f} text={p.tag} />}
    </AbsoluteFill>
  );
};

/** Randy and Dement at a 1960s pinball machine. */
export const Pinball: React.FC<SP> = ({ f, d, p }) => {
  const score = Math.floor(lerp(f, [0, d], [12400, 48900]) / 100) * 100;
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 560, 1.07]]}>
        <Plate name="stage" dim={0.5} blur={3} />
        <g transform="translate(960 0)">
          <polygon points="-260,880 260,880 230,560 -230,560" fill="#1b1430" stroke={G.line} strokeWidth={4} />
          <polygon points="-230,560 230,560 200,470 -200,470" fill="#2a1f55" stroke="#ff7fd0" strokeWidth={4} filter="url(#soft)" />
          {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={-160 + i * 40} cy={515} r={10} fill={['#ffd166', '#ff7fd0', '#6fe0ff'][i % 3]} opacity={0.4 + 0.6 * (Math.floor(f / 4 + i) % 2)} />)}
          <rect x={-180} y={160} width={360} height={300} rx={14} fill="#241a46" stroke="#ff7fd0" strokeWidth={5} filter="url(#soft)" />
          <text y={290} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={62} fill="#ffd166" filter="url(#soft)">{score.toLocaleString('en-US')}</text>
          {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={-120 + i * 60} cy={380} r={16} fill={['#ffd166', '#ff7fd0', '#6fe0ff'][i % 3]} opacity={0.5 + 0.5 * (Math.floor(f / 6 + i) % 2)} />)}
          <rect x={-210} y={880} width={22} height={0} />
          <line x1={-230} y1={880} x2={-230} y2={900} stroke={G.line} strokeWidth={8} /><line x1={230} y1={880} x2={230} y2={900} stroke={G.line} strokeWidth={8} />
        </g>
        <Fig x={560} y={900} s={1.05} f={f} hair="quiff" tired pose={{ lean: 18, la: [80, 20], ra: [70, 25], ll: [4, 0], rl: [-4, 0], head: 10 }} eyes={p.win ? 'happy' : 'open'} mouth={p.win ? 'grin' : 'line'} look={0.6} />
        <Fig x={1360} y={900} s={1.1} f={f} hair="none" glasses flip pose={p.win ? 'shrug' : 'stand'} eyes="wide" mouth="o" look={-0.4} />
        <Dust f={f} />
      </Cam>
      {p.tag && <Tag f={f} text={p.tag} />}
    </AbsoluteFill>
  );
};

/** Horizontal bars, each with a label and a value (0..1 of the width), filling one after another. */
export const Bars2: React.FC<SP> = ({ f, d, p }) => {
  const rows: any[] = p.rows ?? [];
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, #1d2a6a 0%, #0b1030 75%)' }}>
      <Cam f={f} d={d} v={[[960, 540, 1.0], [960, 540, 1.04]]}>
        <text x={300} y={260} fontFamily={SANS} fontWeight={800} fontSize={36} fill="#9fb0e8" letterSpacing={3}>{p.title}</text>
        {rows.map((r, i) => {
          const at = r.at ?? 4 + i * 16, v = lerp(f, [at, at + 16], [0, r.v], easeOut), y = 400 + i * 190;
          return <g key={i} opacity={f >= at - 4 ? 1 : 0.25}>
            <text x={300} y={y - 26} fontFamily={SANS} fontWeight={800} fontSize={40} fill="#dfe6ff">{r.label}</text>
            <rect x={300} y={y} width={1320} height={58} rx={29} fill="#1a2350" stroke={G.lineDim} strokeWidth={3} />
            <rect x={300} y={y} width={v > 0 ? Math.max(58, 1320 * v) : 0} height={58} rx={29} fill={r.c ?? G.yellow} filter="url(#soft)" />
            <text x={300 + Math.max(58, 1320 * v) + 24} y={y + 44} fontFamily={MONO} fontWeight={700} fontSize={44} fill={r.c ?? G.yellow} opacity={clamp((f - at - 8) / 6)}>{r.text}</text>
          </g>;
        })}
        <Dust f={f} n={40} />
      </Cam>
      {p.cite && <Cite f={f} text={p.cite} at={8} y={970} />}
    </AbsoluteFill>
  );
};

/** A microsleep: a huge close-up whose eyes drop shut for a few seconds, with a timer. */
export const Micro: React.FC<SP> = ({ f, d, p }) => {
  const shut = (f % 75) > 30 && (f % 75) < 66;
  const secs = shut ? (((f % 75) - 30) / 30).toFixed(1) : '0.0';
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={[[960, 470, 1.0], [960, 470, 1.06]]}>
        <Plate name={p.plate ?? 'desk'} blur={8} dim={0.35} />
        <Fig x={900} y={1330} s={2.4} f={f} shamz tired pose="stand" blink={shut ? 1 : 0} eyes="open" mouth="line" look={0} />
        {shut && <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#000" opacity={0.35} />}
      </Cam>
      <BigStat f={f} text={shut ? `ASLEEP · ${secs}s` : 'AWAKE'} at={0} x={1450} y={300} size={86} color={shut ? G.red : G.green} />
      {p.title && <BigStat f={f} text={p.title} at={2} x={1450} y={170} size={60} />}
    </AbsoluteFill>
  );
};

/** Brain cells as glowing dots; patches go dark ("offline") while the animal is awake. */
export const Neurons: React.FC<SP> = ({ f, d, p }) => {
  const pts = Array.from({ length: 220 }).map((_, i) => {
    const a = random(`na${i}`) * Math.PI * 2, r = Math.sqrt(random(`nr${i}`));
    return [960 + Math.cos(a) * r * 560, 520 + Math.sin(a) * r * 300] as const;
  });
  const patches = [[700, 450], [1180, 600], [1000, 380]];
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, #1d2a6a 0%, #0a0e28 75%)' }}>
      <Cam f={f} d={d} v={[[960, 540, 1.0], [960, 540, 1.06]]}>
        <ellipse cx={960} cy={520} rx={600} ry={340} fill="#141b3d" stroke={G.line} strokeWidth={4} opacity={0.8} />
        {pts.map(([x, y], i) => {
          const off = patches.some(([px, py], k) => Math.hypot(x - px, y - py) < 120 && Math.sin(f / 12 + k * 2) > (p.calm ? 2 : 0.1));
          const fire = 0.4 + 0.6 * Math.abs(Math.sin(f / (5 + (i % 7)) + i));
          return <circle key={i} cx={x} cy={y} r={7} fill={off ? '#2a3360' : '#bfe8ff'} opacity={off ? 0.6 : fire} filter={off ? undefined : 'url(#soft)'} />;
        })}
      </Cam>
      <BigStat f={f} text={p.title ?? 'PARTS OF THE BRAIN, ASLEEP'} sub={p.sub} at={2} y={110} size={64} />
      <Cite f={f} text="VYAZOVSKIY ET AL. (2011) · NATURE · SLEEP-DEPRIVED RATS" at={8} y={980} />
    </AbsoluteFill>
  );
};

/** The brain's cleaning: cells drift apart in sleep and fluid washes waste out. */
export const Wash: React.FC<SP> = ({ f, d, p, m }) => {
  const go = m?.go ?? 30;
  const sleep = p.sleep ? clamp((f - go) / 30) : 0;
  const gap = 18 + sleep * 34;
  const cells: [number, number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) cells.push([420 + c * (150 + gap) + (r % 2) * 60, 330 + r * (120 + gap * 0.6)]);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, #1d2a6a 0%, #0a0e28 75%)' }}>
      <Cam f={f} d={d} v={[[960, 540, 1.0], [960, 540, 1.04]]}>
        {cells.map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={70} ry={52} fill="#2a3a7a" stroke="#8fb0ff" strokeWidth={3} opacity={0.95} />)}
        {Array.from({ length: 40 }).map((_, i) => {
          const sp = 0.6 + sleep * 2.4;
          const t = ((f * sp + i * 37) % 600) / 600;
          const y = 300 + (i % 4) * (120 + gap * 0.6) + 60;
          return <g key={i}><circle cx={300 + t * 1400} cy={y} r={6} fill="#6fd0ff" opacity={0.3 + sleep * 0.6} />{i % 3 === 0 && <circle cx={300 + t * 1400 + 14} cy={y - 8} r={6} fill={G.yellow} opacity={0.4 + sleep * 0.5} />}</g>;
        })}
      </Cam>
      <BigStat f={f} text={sleep > 0.5 ? 'ASLEEP: +60% SPACE' : 'AWAKE'} sub={sleep > 0.5 ? 'WASTE WASHED OUT FASTER' : 'CELLS PACKED TIGHT'} at={2} y={130} size={72} color={sleep > 0.5 ? G.green : G.yellow} />
      <Cite f={f} text="XIE ET AL. (2013) · SCIENCE · SLEEPING MICE" at={8} y={980} />
    </AbsoluteFill>
  );
};

/** Counting back in sevens, number by number, then stopping. */
export const Count: React.FC<SP> = ({ f, d, p, m }) => {
  const nums = [100, 93, 86, 79, 72, 65];
  const step = p.step ?? 14, i = Math.min(nums.length - 1, Math.max(0, Math.floor(f / step)));
  const stuck = f > step * nums.length + 6;
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={[[960, 480, 1.0], [960, 480, 1.05]]}>
        <Plate name={p.plate ?? 'lab'} blur={8} dim={0.35} floorY={1200} />
        <Fig x={620} y={1330} s={2.2} f={f} hair="quiff" tired pose="stand" eyes={stuck ? 'worried' : 'down'} mouth={stuck ? 'wobble' : 'talk'} look={0.4} />
      </Cam>
      <BigStat f={f} text={String(nums[i])} at={0} x={1380} y={480} size={220} color={i === nums.length - 1 ? G.red : G.yellow} />
      {stuck && <BigStat f={f} text="…?" at={step * nums.length + 6} x={1380} y={760} size={120} color={G.red} />}
      {p.tag && <Tag f={f} text={p.tag} />}
    </AbsoluteFill>
  );
};

/** A stat card with small glowing rat shapes. */
export const RatStat: React.FC<SP> = ({ f, d, p }) => (
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, #1d2a6a 0%, #0a0e28 75%)' }}>
    <Cam f={f} d={d} v={[[960, 560, 1.0], [960, 560, 1.04]]}>
      {Array.from({ length: 8 }).map((_, i) => {
        const x = 330 + i * 180, k = clamp((f - 6 - i * 3) / 8), fade = p.fade ? 1 - clamp((f - 30 - i * 6) / 20) * 0.75 : 1;
        return <g key={i} opacity={k * fade} transform={`translate(${x} 700)`} filter="url(#soft)">
          <ellipse cx={0} cy={0} rx={60} ry={34} fill="#e6ecff" /><circle cx={58} cy={-12} r={24} fill="#e6ecff" /><circle cx={70} cy={-34} r={10} fill="#e6ecff" />
          <path d="M -58 6 q -50 10 -70 -20" stroke="#e6ecff" strokeWidth={6} fill="none" strokeLinecap="round" /><circle cx={66} cy={-14} r={4} fill={G.ink} />
        </g>;
      })}
    </Cam>
    <BigStat f={f} text={p.big ?? '11–32 DAYS'} sub={p.sub} at={2} y={260} size={130} color={p.c ?? G.red} />
    <Cite f={f} text="RECHTSCHAFFEN, BERGMANN ET AL. (1989) · SLEEP · RATS KEPT TOTALLY AWAKE" at={8} y={980} />
  </AbsoluteFill>
);

/** A day card: the day number over a blurred room, with the hours awake underneath. */
export const Day: React.FC<SP> = ({ f, d, p }) => (
  <AbsoluteFill>
    <Cam f={f} d={d} v={[[960, 540, 1.0], [960, 540, 1.08]]}>
      <Plate name={p.plate ?? 'bedroom'} blur={6} dim={0.4} floorY={860} />
      <Fig x={520} y={890} s={1.15} f={f} shamz tired={p.tired} pose={p.pose ?? 'stand'} eyes={p.eyes ?? 'open'} mouth={p.mouth ?? 'line'} look={0.4} />
      <Dust f={f} />
    </Cam>
    <BigStat f={f} text={p.t} sub={p.sub} at={2} x={1300} y={470} size={170} />
  </AbsoluteFill>
);

/** Fast-spinning clock over the sleeper: a very long night. */
export const LongSleep: React.FC<SP> = ({ f, d, p }) => {
  const a = f * 18;
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={[[960, 560, 1.0], [960, 560, 1.06]]}>
        <Plate name={p.plate ?? 'bedroom_warm'} floorY={860} blur={2} dim={0.25} />
        <g transform="translate(450 0)">
          <rect x={0} y={560} width={860} height={150} rx={14} fill="#3a2c34" stroke={G.line} strokeWidth={3} />
          <rect x={0} y={460} width={30} height={400} rx={8} fill={G.fill} stroke={G.line} strokeWidth={3} />
          <ellipse cx={150} cy={590} rx={120} ry={36} fill="#cfd8f5" opacity={0.9} />
          <path d="M 190 610 Q 310 500 570 530 Q 800 540 840 610 L 840 650 L 190 650 Z" fill="#5a4a66" stroke={G.line} strokeWidth={3} />
          <Head x={150} y={530} s={1.05} rot={-12} f={f} shamz eyes="closed" mouth="smile" />
        </g>
        <g transform="translate(1640 470)">
          <circle r={110} fill="#f1f4ff" filter="url(#bloom)" />
          <line x1={0} y1={0} x2={Math.cos((a - 90) * Math.PI / 180) * 100} y2={Math.sin((a - 90) * Math.PI / 180) * 100} stroke={G.ink} strokeWidth={8} strokeLinecap="round" />
          <line x1={0} y1={0} x2={Math.cos((a / 12 - 90) * Math.PI / 180) * 64} y2={Math.sin((a / 12 - 90) * Math.PI / 180) * 64} stroke={G.red} strokeWidth={11} strokeLinecap="round" />
        </g>
        <Dust f={f} warm />
      </Cam>
      {p.big && <BigStat f={f} text={p.big} sub={p.sub} at={p.at ?? 4} x={960} y={160} size={96} />}
    </AbsoluteFill>
  );
};

export const ASETS: Record<string, React.FC<SP>> = { room: Room, pinball: Pinball, bars2: Bars2, micro: Micro, neurons: Neurons, wash: Wash, count: Count, rats: RatStat, day: Day, sleep: LongSleep };
