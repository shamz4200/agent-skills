import React from 'react';

// The wardrobe: hair, headwear, facial hair, glasses and outfit pieces that any Look can combine, so the cast can
// grow without new rig code. Every piece is drawn on the rig's head (centre 0,-176, radius 62) and torso
// (-46..46 wide, -112..2 tall) in the same flat, outlined style as the core cast.

export type HairStyle = 'afro' | 'buzz' | 'bald' | 'ponytail' | 'bun' | 'long' | 'braids' | 'mohawk' | 'spiky' | 'sidepart' | 'wavy' | 'puffs';
export type Headwear = 'cap' | 'beanie' | 'hijab' | 'turban' | 'hardhat' | 'chef' | 'beret' | 'headband' | 'sunhat' | 'helmet';
export type Facial = 'beard' | 'mustache' | 'stubble' | 'goatee';
export type Top = 'labcoat' | 'apron' | 'hivis' | 'stripes' | 'scarf' | 'tie' | 'overalls' | 'dress' | 'cardigan' | 'spacesuit';

export type WardrobeLook = {
  hair: string;
  line: string;
  accent: string;
  jacket: string;
  hairStyle?: HairStyle;
  headwear?: Headwear;
  headwearCol?: string;
  facial?: Facial;
  facialCol?: string;
  specs?: string; // frame colour of round glasses
  top?: Top;
  topCol?: string;
};

const HY = -176;
const R = 62;

/** Does this look draw its own hair or headwear (so the rig's little hair tuft is left off)? */
export const coversTop = (L: WardrobeLook) => Boolean(L.hairStyle || L.headwear);

/** Behind the head: long hair, braids, ponytails, an afro, a hijab's drape. */
export const HairBack: React.FC<{ L: WardrobeLook; yaw: number; sway: number }> = ({ L, yaw, sway }) => {
  const o = { fill: L.hair, stroke: L.line, strokeWidth: 4, strokeLinejoin: 'round' as const };
  const sx = -yaw * 10;
  const parts: React.ReactNode[] = [];
  if (L.headwear === 'hijab') {
    const c = L.headwearCol || '#5B4E8C';
    parts.push(<path key="hj" d={`M ${-78 + sx} ${HY + 10} Q ${-86 + sx} ${HY - 82} ${sx} ${HY - 86} Q ${86 + sx} ${HY - 82} ${78 + sx} ${HY + 10} Q 70 -96 52 -104 L -52 -104 Q -70 -96 ${-78 + sx} ${HY + 10} Z`} fill={c} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />);
    return <g>{parts}</g>;
  }
  switch (L.hairStyle) {
    case 'afro':
      parts.push(<circle key="af" cx={sx} cy={HY - 14} r={86} {...o} />);
      break;
    case 'long':
      parts.push(<path key="lg" d={`M ${-70 + sx} ${HY - 10} Q ${-80 + sx} ${HY - 76} ${sx} ${HY - 78} Q ${80 + sx} ${HY - 76} ${70 + sx} ${HY - 10} L ${66 + sx} -96 Q ${sx} -84 ${-66 + sx} -96 Z`} {...o} />);
      break;
    case 'braids':
      [-1, 1].forEach((sd) =>
        parts.push(
          <g key={`br${sd}`} transform={`rotate(${sway * 0.4} ${sd * 56} ${HY})`}>
            {[0, 1, 2, 3, 4].map((k) => (
              <ellipse key={k} cx={sd * 58 + sx} cy={HY + 4 + k * 20} rx={12} ry={12} {...o} />
            ))}
            <rect x={sd * 58 - 7 + sx} y={HY + 98} width={14} height={8} rx={3} fill={L.accent} />
          </g>,
        ),
      );
      break;
    case 'ponytail':
      parts.push(<path key="pt" transform={`rotate(${sway * 0.6} ${-40 * Math.sign(yaw || 1)} ${HY - 40})`} d={`M ${-52 - yaw * 30} ${HY - 40} Q ${-96 - yaw * 30} ${HY - 10} ${-80 - yaw * 30} ${HY + 60} Q ${-66 - yaw * 30} ${HY + 10} ${-40 - yaw * 30} ${HY - 30} Z`} {...o} />);
      break;
    case 'bun':
      parts.push(<circle key="bn" cx={sx} cy={HY - 72} r={26} {...o} />);
      break;
    case 'puffs':
      [-1, 1].forEach((sd) => parts.push(<circle key={`pf${sd}`} cx={sd * 60 + sx} cy={HY - 56} r={30} {...o} />));
      break;
    default:
      break;
  }
  return <g>{parts}</g>;
};

/** On the head, under any hat: the hairline, a fringe, a mohawk, spikes. */
export const HairFront: React.FC<{ L: WardrobeLook; yaw: number }> = ({ L, yaw }) => {
  if (L.headwear === 'hijab' || L.headwear === 'turban' || L.headwear === 'helmet') return null;
  const sx = -yaw * 14;
  const f = { fill: L.hair };
  const cap = (top: number, edge: number) => `M ${-60 + sx} ${HY - edge} Q ${-62 + sx} ${HY - top} ${sx} ${HY - top - 2} Q ${62 + sx} ${HY - top} ${60 + sx} ${HY - edge}`;
  switch (L.hairStyle) {
    case 'afro':
      return <path d={`${cap(66, 20)} Q ${30 + sx} ${HY - 40} ${sx} ${HY - 36} Q ${-30 + sx} ${HY - 40} ${-60 + sx} ${HY - 20} Z`} {...f} />;
    case 'buzz':
      return <path d={`${cap(64, 26)} Q ${sx} ${HY - 48} ${-60 + sx} ${HY - 26} Z`} {...f} opacity={0.9} />;
    case 'bald':
      return <path d={`M ${-58 + sx} ${HY - 8} Q ${-64 + sx} ${HY - 30} ${-52 + sx} ${HY - 34} M ${58 + sx} ${HY - 8} Q ${64 + sx} ${HY - 30} ${52 + sx} ${HY - 34}`} stroke={L.hair} strokeWidth={9} fill="none" strokeLinecap="round" />;
    case 'mohawk':
      return <path d={`M ${-12 + sx} ${HY - 58} L ${-8 + sx} ${HY - 96} L ${2 + sx} ${HY - 74} L ${8 + sx} ${HY - 100} L ${14 + sx} ${HY - 72} L ${22 + sx} ${HY - 90} L ${16 + sx} ${HY - 56} Z`} {...f} stroke={L.line} strokeWidth={3.5} strokeLinejoin="round" />;
    case 'spiky':
      return <path d={`M ${-60 + sx} ${HY - 22} L ${-58 + sx} ${HY - 74} L ${-36 + sx} ${HY - 60} L ${-26 + sx} ${HY - 92} L ${-6 + sx} ${HY - 66} L ${8 + sx} ${HY - 98} L ${22 + sx} ${HY - 66} L ${40 + sx} ${HY - 88} L ${46 + sx} ${HY - 58} L ${64 + sx} ${HY - 68} L ${60 + sx} ${HY - 22} Q ${sx} ${HY - 46} ${-60 + sx} ${HY - 22} Z`} {...f} stroke={L.line} strokeWidth={3.5} strokeLinejoin="round" />;
    case 'sidepart':
      return <path d={`M ${-60 + sx} ${HY - 18} Q ${-64 + sx} ${HY - 70} ${4 + sx} ${HY - 70} Q ${64 + sx} ${HY - 66} ${60 + sx} ${HY - 18} Q ${50 + sx} ${HY - 46} ${-20 + sx} ${HY - 50} Q ${-46 + sx} ${HY - 46} ${-60 + sx} ${HY - 18} Z`} {...f} />;
    case 'wavy':
      return <path d={`${cap(68, 14)} Q ${44 + sx} ${HY - 34} ${28 + sx} ${HY - 44} Q ${14 + sx} ${HY - 30} ${sx} ${HY - 44} Q ${-14 + sx} ${HY - 30} ${-28 + sx} ${HY - 44} Q ${-44 + sx} ${HY - 34} ${-60 + sx} ${HY - 14} Z`} {...f} />;
    case 'long':
    case 'ponytail':
    case 'bun':
    case 'braids':
    case 'puffs':
      return <path d={`${cap(66, 14)} Q ${36 + sx} ${HY - 50} ${4 + sx} ${HY - 44} Q ${-36 + sx} ${HY - 52} ${-60 + sx} ${HY - 14} Z`} {...f} />;
    default:
      return null;
  }
};

/** Hats, wraps and helmets, over the hair. */
export const HeadwearFront: React.FC<{ L: WardrobeLook; yaw: number }> = ({ L, yaw }) => {
  const sx = -yaw * 14;
  const c = L.headwearCol || '#3A5A8C';
  const st = { stroke: L.line, strokeWidth: 4, strokeLinejoin: 'round' as const };
  switch (L.headwear) {
    case 'cap':
      return (
        <g>
          <path d={`M ${-62 + sx} ${HY - 26} Q ${-64 + sx} ${HY - 92} ${sx} ${HY - 92} Q ${64 + sx} ${HY - 92} ${62 + sx} ${HY - 26} Z`} fill={c} {...st} />
          <path d={`M ${-10 + sx + yaw * 40} ${HY - 30} Q ${40 + sx + yaw * 60} ${HY - 40} ${88 * (yaw >= 0 ? 1 : -1) + sx} ${HY - 22} L ${40 + sx} ${HY - 18} Z`} fill={c} {...st} />
          <circle cx={sx} cy={HY - 92} r={6} fill={L.accent} />
        </g>
      );
    case 'beanie':
      return (
        <g>
          <path d={`M ${-64 + sx} ${HY - 40} Q ${-66 + sx} ${HY - 104} ${sx} ${HY - 106} Q ${66 + sx} ${HY - 104} ${64 + sx} ${HY - 40} Z`} fill={c} {...st} />
          <rect x={-70 + sx} y={HY - 58} width={140} height={22} rx={8} fill={L.accent} {...st} />
          <circle cx={sx} cy={HY - 112} r={12} fill={L.accent} {...st} />
        </g>
      );
    case 'hijab':
      return <path d={`M ${-62 + sx} ${HY + 6} Q ${-66 + sx} ${HY - 74} ${sx} ${HY - 76} Q ${66 + sx} ${HY - 74} ${62 + sx} ${HY + 6} Q ${54 + sx} ${HY - 50} ${sx} ${HY - 54} Q ${-54 + sx} ${HY - 50} ${-62 + sx} ${HY + 6} Z`} fill={c} {...st} />;
    case 'turban':
      return (
        <g>
          <path d={`M ${-66 + sx} ${HY - 30} Q ${-72 + sx} ${HY - 110} ${sx} ${HY - 112} Q ${72 + sx} ${HY - 110} ${66 + sx} ${HY - 30} Q ${sx} ${HY - 52} ${-66 + sx} ${HY - 30} Z`} fill={c} {...st} />
          <path d={`M ${-60 + sx} ${HY - 52} Q ${sx} ${HY - 92} ${58 + sx} ${HY - 78} M ${-56 + sx} ${HY - 76} Q ${sx} ${HY - 108} ${50 + sx} ${HY - 96}`} stroke={L.line} strokeWidth={3} fill="none" opacity={0.5} />
        </g>
      );
    case 'hardhat':
      return (
        <g>
          <path d={`M ${-58 + sx} ${HY - 34} Q ${-60 + sx} ${HY - 100} ${sx} ${HY - 100} Q ${60 + sx} ${HY - 100} ${58 + sx} ${HY - 34} Z`} fill={c} {...st} />
          <rect x={-76 + sx} y={HY - 40} width={152} height={12} rx={6} fill={c} {...st} />
          <path d={`M ${sx} ${HY - 100} L ${sx} ${HY - 40}`} stroke={L.line} strokeWidth={3} opacity={0.4} />
        </g>
      );
    case 'chef':
      return (
        <g>
          <rect x={-46 + sx} y={HY - 82} width={92} height={36} rx={4} fill="#FAFAF7" {...st} />
          {[-32, 0, 32].map((dx) => (
            <circle key={dx} cx={dx + sx} cy={HY - 104} r={28} fill="#FAFAF7" {...st} />
          ))}
          <rect x={-44 + sx} y={HY - 92} width={88} height={14} fill="#FAFAF7" />
        </g>
      );
    case 'beret':
      return <ellipse cx={14 + sx} cy={HY - 64} rx={66} ry={20} transform={`rotate(-10 ${14 + sx} ${HY - 64})`} fill={c} {...st} />;
    case 'headband':
      return <path d={`M ${-60 + sx} ${HY - 36} Q ${sx} ${HY - 64} ${60 + sx} ${HY - 36}`} stroke={c} strokeWidth={12} fill="none" strokeLinecap="round" />;
    case 'sunhat':
      return (
        <g>
          <ellipse cx={sx} cy={HY - 48} rx={100} ry={22} fill={c} {...st} />
          <path d={`M ${-50 + sx} ${HY - 50} Q ${-52 + sx} ${HY - 104} ${sx} ${HY - 104} Q ${52 + sx} ${HY - 104} ${50 + sx} ${HY - 50} Z`} fill={c} {...st} />
          <path d={`M ${-50 + sx} ${HY - 60} Q ${sx} ${HY - 66} ${50 + sx} ${HY - 60}`} stroke={L.accent} strokeWidth={9} fill="none" />
        </g>
      );
    case 'helmet':
      return (
        <g>
          <circle cx={0} cy={HY} r={R + 18} fill="#DDE6F0" opacity={0.35} stroke="#EEF3F8" strokeWidth={6} />
          <path d={`M -50 ${HY - 56} Q -20 ${HY - 74} 10 ${HY - 70}`} stroke="#FFFFFF" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.8} />
        </g>
      );
    default:
      return null;
  }
};

/** Facial hair: beards go under the mouth (drawn before the face), moustaches over it (after). */
export const FacialHair: React.FC<{ L: WardrobeLook; yaw: number; layer: 'under' | 'over' }> = ({ L, yaw, layer }) => {
  const sx = yaw * 26;
  const c = L.facialCol || L.hair;
  if (layer === 'under') {
    if (L.facial === 'beard')
      return <path d={`M ${-56 + sx} ${HY + 4} Q ${-50 + sx} ${HY + 74} ${sx} ${HY + 80} Q ${50 + sx} ${HY + 74} ${56 + sx} ${HY + 4} Q ${30 + sx} ${HY + 40} ${sx} ${HY + 42} Q ${-30 + sx} ${HY + 40} ${-56 + sx} ${HY + 4} Z`} fill={c} stroke={L.line} strokeWidth={3.5} strokeLinejoin="round" />;
    if (L.facial === 'stubble')
      return <path d={`M ${-50 + sx} ${HY + 14} Q ${-40 + sx} ${HY + 60} ${sx} ${HY + 62} Q ${40 + sx} ${HY + 60} ${50 + sx} ${HY + 14} Q ${sx} ${HY + 44} ${-50 + sx} ${HY + 14} Z`} fill={c} opacity={0.35} />;
    if (L.facial === 'goatee') return <path d={`M ${-14 + sx} ${HY + 44} Q ${sx} ${HY + 74} ${14 + sx} ${HY + 44} Z`} fill={c} stroke={L.line} strokeWidth={3} />;
    return null;
  }
  if (L.facial === 'mustache' || L.facial === 'beard' || L.facial === 'goatee')
    return <path d={`M ${-24 + sx} ${HY + 24} Q ${-12 + sx} ${HY + 14} ${sx} ${HY + 20} Q ${12 + sx} ${HY + 14} ${24 + sx} ${HY + 24} Q ${12 + sx} ${HY + 22} ${sx} ${HY + 26} Q ${-12 + sx} ${HY + 22} ${-24 + sx} ${HY + 24} Z`} fill={c} stroke={L.line} strokeWidth={3} strokeLinejoin="round" />;
  return null;
};

/** Round glasses, over the eyes. */
export const Specs: React.FC<{ L: WardrobeLook; yaw: number }> = ({ L, yaw }) => {
  if (!L.specs) return null;
  const sx = yaw * 30;
  return (
    <g stroke={L.specs} strokeWidth={4.5} fill="none">
      <circle cx={-21 + sx} cy={HY - 4} r={16} />
      <circle cx={21 + sx} cy={HY - 4} r={16} />
      <path d={`M ${-5 + sx} ${HY - 6} Q ${sx} ${HY - 10} ${5 + sx} ${HY - 6} M ${-37 + sx} ${HY - 8} L ${-56 + sx} ${HY - 14} M ${37 + sx} ${HY - 8} L ${56 + sx} ${HY - 14}`} />
    </g>
  );
};

/** Outfit pieces over the jacket (drawn inside the torso's own transform). */
export const TopFront: React.FC<{ L: WardrobeLook }> = ({ L }) => {
  const c = L.topCol || '#FFFFFF';
  const st = { stroke: L.line, strokeWidth: 4, strokeLinejoin: 'round' as const };
  switch (L.top) {
    case 'labcoat':
      return (
        <g>
          <path d="M -48 -112 L -20 -112 L -16 30 L -52 30 Z" fill="#F4F6F8" {...st} />
          <path d="M 48 -112 L 20 -112 L 16 30 L 52 30 Z" fill="#F4F6F8" {...st} />
          <rect x={22} y={-80} width={18} height={14} rx={2} fill="none" stroke={L.line} strokeWidth={2.5} />
        </g>
      );
    case 'apron':
      return (
        <g>
          <path d="M -30 -90 L 30 -90 L 36 8 L -36 8 Z" fill={c} {...st} />
          <path d="M -30 -90 Q 0 -118 30 -90" stroke={L.line} strokeWidth={3} fill="none" />
          <rect x={-16} y={-50} width={32} height={20} rx={3} fill="none" stroke={L.line} strokeWidth={2.5} />
        </g>
      );
    case 'hivis':
      return (
        <g>
          <path d="M -46 -112 L -12 -112 L -10 2 L -40 2 Z M 46 -112 L 12 -112 L 10 2 L 40 2 Z" fill="#F7E21B" {...st} />
          <path d="M -44 -40 L -11 -40 M 11 -40 L 44 -40 M -42 -20 L -11 -20 M 11 -20 L 42 -20" stroke="#D9DDE2" strokeWidth={7} />
        </g>
      );
    case 'stripes':
      return <path d="M -45 -96 L 45 -96 M -44 -76 L 44 -76 M -43 -56 L 43 -56 M -42 -36 L 42 -36 M -41 -16 L 41 -16" stroke={c} strokeWidth={8} />;
    case 'scarf':
      return (
        <g>
          <path d="M -34 -116 Q 0 -96 34 -116 L 30 -100 Q 0 -84 -30 -100 Z" fill={c} {...st} />
          <rect x={12} y={-100} width={18} height={52} rx={4} fill={c} {...st} />
        </g>
      );
    case 'tie':
      return <path d="M -7 -112 L 7 -112 L 9 -100 L 5 -54 L 0 -46 L -5 -54 L -9 -100 Z" fill={c} {...st} strokeWidth={3} />;
    case 'overalls':
      return (
        <g>
          <path d="M -32 -70 L 32 -70 L 40 2 L -40 2 Z" fill={c} {...st} />
          <path d="M -30 -70 L -36 -114 M 30 -70 L 36 -114" stroke={c} strokeWidth={9} />
          <circle cx={-26} cy={-64} r={4} fill={L.accent} />
          <circle cx={26} cy={-64} r={4} fill={L.accent} />
        </g>
      );
    case 'dress':
      return <path d="M -40 -20 L 40 -20 L 66 44 Q 0 56 -66 44 Z" fill={c} {...st} />;
    case 'cardigan':
      return (
        <g>
          <path d="M -46 -112 L -8 -112 L -6 2 L -40 2 Z M 46 -112 L 8 -112 L 6 2 L 40 2 Z" fill={c} {...st} />
          {[-80, -56, -32].map((y) => (
            <circle key={y} cx={-12} cy={y} r={3.5} fill={L.line} />
          ))}
        </g>
      );
    case 'spacesuit':
      return (
        <g>
          <rect x={-26} y={-96} width={52} height={36} rx={6} fill="#C9D3DE" {...st} />
          <circle cx={-12} cy={-78} r={5} fill="#E5484D" />
          <circle cx={4} cy={-78} r={5} fill="#3FB27F" />
          <circle cx={18} cy={-78} r={5} fill="#3A86FF" />
        </g>
      );
    default:
      return null;
  }
};
