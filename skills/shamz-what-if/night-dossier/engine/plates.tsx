// Night Dossier painted backgrounds: a generated plate (public/bg/<name>.png, made with tools/backgrounds.py) behind
// the code-drawn cast, with a slow parallax drift, the ND night lighting and an optional sign and location tag.
import React from 'react';
import { staticFile } from 'remotion';
import { C, Cam, HAND, INK, Layer, LocTag, NameTag, Night, Stamp, View } from './dossier';
import { SP } from './kit2';
import { Cast } from './sets';

/** p: { bg, cast?: CastP[], gy? (floor line for the cast, default 1000), v?: [View, View], dark? (0..1),
 *        lights?: Light[], loc?, sign?, signX?, signY?, tag?: [name, sub], tagX?, tagY?, stamp? } */
export const Plate: React.FC<SP> = ({ f, d, m, p }) => {
  const v: [View, View] = p.v ?? [[960, 540, 1.02], [940, 530, 1.1]];
  return (
    <Cam f={f} d={d} v={v} bg="#070b1f">
      <Layer depth={0.55}><image href={staticFile(`bg/${p.bg}.png`)} x={-60} y={-34} width={2040} height={1148} preserveAspectRatio="xMidYMid slice" /></Layer>
      <Layer>
        {p.cast && <Cast list={p.cast} f={f} d={d} m={m} gy={p.gy ?? 1000} />}
        {p.sign && <g transform={`translate(${p.signX ?? 960} ${p.signY ?? 640}) rotate(${Math.sin(f / 14) * 2})`}>
          <rect x={-200} y={-30} width={400} height={130} rx={8} fill={C.paper} stroke={INK} strokeWidth={8} />
          <text x={0} y={60} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={p.sign.length > 9 ? 64 : 84} fill={C.red}>{p.sign}</text></g>}
        <Night id={`pl${p.bg}`} amt={p.dark ?? 0.28} tint="#070b18" lights={p.lights ?? [{ x: 960, y: 620, r: 900, ry: 560, color: '#ffc76b', power: 0.8 }]} glow={0.12} />
      </Layer>
      <Layer depth={1.1}>
        {p.loc && <LocTag f={f} at={8} text={p.loc} />}
        {p.tag && <NameTag f={f} at={typeof p.tagAt === 'number' ? p.tagAt : m[p.tagAt ?? 'tag'] ?? 10} x={p.tagX ?? 1150} y={p.tagY ?? 600} name={p.tag[0]} sub={p.tag[1]} />}
        {p.stamp && <Stamp f={f} at={m.stamp ?? Math.round(d * 0.5)} x={960} y={520} text={p.stamp} size={120} rot={-10} color={p.stampColor} />}
      </Layer>
    </Cam>
  );
};
