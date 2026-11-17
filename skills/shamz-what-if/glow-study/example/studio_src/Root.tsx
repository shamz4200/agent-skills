import React from 'react';
import { AbsoluteFill, Audio, Composition, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { BigStat, Captions, Finish, G, W, H } from './glow';
import { FPS, SHOTS, TOTAL, Shot, WORDS } from './timeline';
import { SheetComps } from './Sheet';

const HL: Record<string, string> = {
  trip: G.red, stairs: G.yellow, everywhere: G.yellow, fifty: G.yellow, think: G.red, two: G.yellow, morning: G.yellow,
  replay: G.red, again: G.red, thing: G.yellow, thousand: G.yellow, cornell: G.yellow, embarrassing: G.red,
  noticed: G.yellow, half: G.yellow, answer: G.yellow, four: G.yellow, spotlight: G.yellow, effect: G.yellow, bright: G.yellow,
  everyone: G.yellow, own: G.yellow, shirt: G.yellow, never: G.red, forgot: G.yellow, comments: G.yellow, subscribe: G.red,
};

const One: React.FC<{ s: Shot; gf: number; caps?: boolean }> = ({ s, gf, caps = true }) => {
  const f = gf - s.start;
  const ov = s.p.ov;
  return (
    <AbsoluteFill style={{ background: '#05060f' }}>
      <s.C f={f} d={s.d} p={s.p} m={s.m} />
      {ov && <BigStat f={f} text={ov.big} sub={ov.sub} at={ov.at ?? 3} x={ov.x ?? 960} y={ov.y ?? 200} size={ov.size ?? 140} color={ov.c ?? G.yellow} />}
      <Finish />
      {caps && s.kind !== 'end' && <Captions t={gf / FPS} words={WORDS} hl={HL} />}
    </AbsoluteFill>
  );
};
const Main: React.FC = () => {
  const gf = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {SHOTS.map((s, i) => <Sequence key={i} from={s.start} durationInFrames={Math.max(1, s.d)} layout="none"><One s={s} gf={gf} /></Sequence>)}
    </AbsoluteFill>
  );
};
const Board: React.FC = () => {
  const n = useCurrentFrame();
  const s = SHOTS[Math.min(n, SHOTS.length - 1)];
  return <One s={s} gf={s.start + Math.round(s.d * 0.62)} />;
};
export const Root: React.FC = () => (<>
  <Composition id="Glow" component={Main} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
  <Composition id="GlowBoard" component={Board} durationInFrames={SHOTS.length} fps={FPS} width={W} height={H} />
  <SheetComps />
</>);
