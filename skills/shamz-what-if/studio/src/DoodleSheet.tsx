import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Doodle, DoodleDefs, DLOOKS, Thought, HearRing, doodleHeadY, DExpr } from './engine';

// Every doodle cast member, plus Shamz in each expression, a thought bubble and the hearing ring.
export const DoodleSheet: React.FC = () => {
  const cast = Object.entries(DLOOKS);
  const exprs: DExpr[] = ['neutral', 'happy', 'smug', 'shock', 'worried', 'angry', 'sad', 'think', 'blank'];
  return (
    <AbsoluteFill style={{ background: '#8FD3F5' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <DoodleDefs />
        <rect x={0} y={700} width={1920} height={380} fill="#D9D2C2" />
        {cast.map(([k, l], i) => <g key={k}><Doodle look={l} pose={{ x: 90 + i * 100, ground: 500, scale: 0.42, expr: 'neutral', armR: i % 2 ? [60, 40] : undefined }} /><text x={90 + i * 100} y={530} textAnchor="middle" fontSize={14} fontFamily="sans-serif">{k}</text></g>)}
        {exprs.map((e, i) => <Doodle key={e} look={DLOOKS.shamz} pose={{ x: 140 + i * 150, ground: 960, scale: 0.62, expr: e, facing: i % 2 ? -1 : 1, walk: i === 8 ? 1 : 0, armL: i === 3 ? [150, 20] : undefined, armR: i === 3 ? [150, 20] : undefined }} />)}
        <HearRing x={1650} ground={960} r={220} t={20} />
        <Doodle look={DLOOKS.date} pose={{ x: 1650, ground: 960, scale: 0.62, expr: 'smug' }} />
        <Thought x={1650} y={600} hx={1650} hy={doodleHeadY(960, 0.62)} text={'yes.'} t={10} w={220} />
      </svg>
    </AbsoluteFill>
  );
};
