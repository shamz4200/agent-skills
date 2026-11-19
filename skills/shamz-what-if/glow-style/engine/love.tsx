// Scenes for "What If You Fell in Love With an AI?" (Glow style, painted plates, Story Formula).
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BigStat, Cam, Cite, clamp, Dust, Fig, G, lerp, MONO, Plate, SANS, Tag } from './glow';

type SP = { f: number; d: number; p: any; m: Record<string, number> };

/** A phone chat: messages appear one by one ({from: 'ai'|'me'|'friend', text, at}). 'typing' shows three dots. */
export const Chat: React.FC<SP> = ({ f, d, p, m }) => {
  const msgs: any[] = p.msgs ?? [];
  const cold = p.cold;
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={[[960, 560, 1.0], [960, 560, 1.04]]}>
        <Plate name={p.plate ?? 'apartment'} blur={10} dim={0.5} />
        <g transform={`translate(960 560) rotate(${Math.sin(f / 30) * 1})`}>
          <rect x={-260} y={-450} width={520} height={900} rx={60} fill="#0b0f22" stroke="#cfe0ff" strokeWidth={6} filter="url(#soft)" />
          <circle cx={-170} cy={-370} r={34} fill={cold ? '#5a6488' : (p.friend ? '#5fe08a' : '#ff7fb0')} filter={cold ? undefined : 'url(#soft)'} />
          <text x={-120} y={-360} fontFamily={SANS} fontWeight={800} fontSize={34} fill="#fff">{p.name ?? 'Nova'}</text>
          <text x={-120} y={-326} fontFamily={SANS} fontWeight={700} fontSize={22} fill={cold ? '#9aa6cf' : '#5fe08a'}>{cold ? 'updated · v2.0' : 'online'}</text>
          <line x1={-230} y1={-300} x2={230} y2={-300} stroke="#2a3360" strokeWidth={3} />
          {msgs.map((g, i) => {
            const at = typeof g.at === 'string' ? (m?.[g.at] ?? 0) : (g.at ?? 4 + i * 18);
            const k = clamp((f - at) / 6);
            const mine = g.from === 'me';
            const y = -260 + i * 120;
            const fs = Math.min(30, 330 / (g.text.length * 0.56));
            const w = Math.min(400, 52 + g.text.length * fs * 0.56);
            return <g key={i} opacity={k} transform={`translate(0 ${(1 - k) * 16})`}>
              <rect x={mine ? 220 - w : -220} y={y} width={w} height={88} rx={30} fill={mine ? '#3a6cff' : g.from === 'friend' ? '#2d6b4a' : cold ? '#3a3f55' : '#5a2a6a'} />
              <text x={mine ? 220 - w + 26 : -194} y={y + 44 + fs * 0.4} fontFamily={SANS} fontWeight={700} fontSize={fs} fill="#fff">{g.text}</text>
            </g>;
          })}
          {p.typing && f > (m?.typing ?? 0) && <g transform={`translate(-150 ${-260 + msgs.length * 120 + 44})`}>
            <rect x={-70} y={-40} width={170} height={80} rx={30} fill="#2d6b4a" />
            {[0, 1, 2].map((i) => <circle key={i} cx={-30 + i * 44} cy={0} r={12} fill="#dfffe8" opacity={0.4 + 0.6 * Math.abs(Math.sin(f / 6 + i))} />)}
          </g>}
        </g>
        <Dust f={f} n={40} />
      </Cam>
      {p.tag && <Tag f={f} text={p.tag} />}
    </AbsoluteFill>
  );
};

/** A room at night, Shamz on the phone or the sofa, the phone's glow on his face; the AI as a soft pink orb. */
export const Room2: React.FC<SP> = ({ f, d, p }) => {
  const figs: any[] = p.figs ?? [{ shamz: true }];
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 560, 1.07]]}>
        <Plate name={p.plate ?? 'apartment'} floorY={860} blur={p.blur ?? 1} dim={p.dim ?? 0.18} />
        {figs.map((g, i) => <Fig key={i} x={g.x ?? 860 + i * 260} y={g.y ?? 890} s={g.s ?? 1.05} f={f} seed={i * 5} {...g} pose={g.pose ?? 'stand'} />)}
        {p.orb && <g transform={`translate(${p.orbX ?? 1300} ${p.orbY ?? 420})`} opacity={p.cold ? 0.4 : 1}>
          <circle r={70 + 6 * Math.sin(f / 10)} fill={p.cold ? '#6a7090' : '#ff7fb0'} opacity={0.25} filter="url(#blur30)" />
          <circle r={40} fill={p.cold ? '#9aa6cf' : '#ffb0d0'} filter="url(#bloom)" />
          {!p.cold && <path d="M 0 14 C -26 -4 -14 -26 0 -12 C 14 -26 26 -4 0 14 Z" fill="#fff" />}
        </g>}
        <Dust f={f} warm={p.warm} />
      </Cam>
      {p.tag && <Tag f={f} text={p.tag} />}
    </AbsoluteFill>
  );
};

/** A server hall: the place where the companion really lives; an update sweeps through and changes it. */
export const Server: React.FC<SP> = ({ f, d, p, m }) => {
  const sweep = p.update ? lerp(f, [m?.go ?? 10, (m?.go ?? 10) + 40], [-200, 2200]) : -999;
  return (
    <AbsoluteFill>
      <Cam f={f} d={d} v={p.v ?? [[960, 560, 1.0], [960, 560, 1.08]]}>
        <Plate name="servers" dim={0.2} blur={1} />
        {p.update && <rect x={sweep - 120} y={-400} width={240} height={1900} fill="#9fd8ff" opacity={0.18} filter="url(#blur30)" />}
        <Dust f={f} n={40} />
      </Cam>
      {p.update && f > (m?.go ?? 10) && <BigStat f={f} text="UPDATE v2.0" sub="NEW RULES, OVERNIGHT" at={(m?.go ?? 10)} y={180} size={96} color="#9fd8ff" />}
      {p.tag && <Tag f={f} text={p.tag} />}
    </AbsoluteFill>
  );
};

export const LSETS: Record<string, React.FC<SP>> = { chat: Chat, room2: Room2, server: Server };
