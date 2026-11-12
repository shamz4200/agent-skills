import React from 'react';
import { AbsoluteFill, Composition, Sequence, useCurrentFrame, interpolate, Easing } from 'remotion';
import { Finish, W, H } from './dossier';
import { FPS, SHOTS, TOTAL, Shot } from './timeline';

const One: React.FC<{ s: Shot; gf: number }> = ({ s, gf }) => {
  const f = gf - s.start;
  // cards fade through black; a whip shot flies in from the right with motion blur
  const fade = s.card ? Math.min(1, f / 4, (s.d - f) / 4) : 1;
  const wk = s.whip ? interpolate(f, [0, 7], [1, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }) : 0;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ opacity: fade, transform: wk ? `translateX(${wk * 900}px)` : undefined, filter: wk > 0.02 ? `blur(${wk * 26}px)` : undefined }}>
        <s.C f={f} d={s.d} m={s.m} gf={gf} words={s.words} />
        {!s.card && <Finish />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Main: React.FC = () => {
  const gf = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {SHOTS.map((s, i) => (
        <Sequence key={i} from={s.start} durationInFrames={s.d} layout="none"><One s={s} gf={gf} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** Storyboard: frame n shows shot n at 62% of its length (after its marks have fired, usually). */
const Board: React.FC = () => {
  const n = useCurrentFrame();
  const s = SHOTS[Math.min(n, SHOTS.length - 1)];
  return <One s={s} gf={s.start + Math.round(s.d * 0.62)} />;
};

export const Root: React.FC = () => (
  <>
    <Composition id="Dossier" component={Main} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="DossierBoard" component={Board} durationInFrames={SHOTS.length} fps={FPS} width={W} height={H} />
  </>
);
