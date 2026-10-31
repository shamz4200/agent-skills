import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, basePose, Pose, KitDefs, CROWD, FONT } from './engine';

// The wide cast on one sheet: 72 characters from engine/crowd.ts, 12 to a row, each at its own scale, so a new look
// can be checked against everyone else. Render: npx remotion still src/index.ts Crowd out/crowd.png
export const CROWD_COLS = 12;
const CELL_W = 200;
const CELL_H = 340;
export const CROWD_SIZE = { width: CROWD_COLS * CELL_W, height: Math.ceil(CROWD.length / CROWD_COLS) * CELL_H + 40 };

const P = (o: Partial<Pose>): Pose => ({ ...basePose, ...o });

export const CrowdSheet: React.FC = () => (
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, #2A2140 0%, #14101C 70%)' }}>
    <svg width={CROWD_SIZE.width} height={CROWD_SIZE.height} viewBox={`0 0 ${CROWD_SIZE.width} ${CROWD_SIZE.height}`}>
      <KitDefs />
      {CROWD.map((c, i) => {
        const x = (i % CROWD_COLS) * CELL_W + CELL_W / 2;
        const row = Math.floor(i / CROWD_COLS);
        const feet = row * CELL_H + 290;
        const s = c.scale * 0.72;
        return (
          <g key={c.id}>
            <Hero look={c.look} pose={P({ x, y: feet - 140 * s, scale: s, yaw: i % 2 ? -0.25 : 0.25, look: i % 2 ? -0.4 : 0.4, expr: i % 3 === 0 ? 'happy' : 'neutral' })} shadow={0.6} />
            <text x={x} y={feet + 34} textAnchor="middle" fontFamily={FONT.ui} fontSize={17} fill="#F6EFE3" letterSpacing={1.5}>
              {c.label}
            </text>
          </g>
        );
      })}
    </svg>
  </AbsoluteFill>
);
