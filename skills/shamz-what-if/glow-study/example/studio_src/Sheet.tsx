import React from 'react';
import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import { Cam, Dust, Fig, G, W, H, walk } from './glow';
import { Wall, Window, Lamp } from './sets';
import { SETS } from './sets';

export const ShamzSheet: React.FC = () => {
  const f = useCurrentFrame() + 20;
  return (
    <AbsoluteFill>
      <Cam f={f} d={1} v={[[960, 540, 1], [960, 540, 1]]}>
        <Wall />
        <Window x={1400} y={120} f={f} w={360} h={280} />
        <Lamp x={200} y={160} />
        <Fig x={260} y={900} s={1.25} f={f} shamz pose="stand" />
        <Fig x={620} y={900} s={1.25} f={f} shamz pose={walk(1.2)} eyes="happy" mouth="grin" />
        <Fig x={980} y={900} s={1.25} f={f} shamz pose="phone" phone eyes="open" mouth="line" />
        <Fig x={1320} y={900} s={1.25} f={f} shamz pose="facepalm" eyes="worried" mouth="wobble" />
        <Fig x={1680} y={900} s={1.25} f={f} pose="shrug" hair="cap" eyes="open" mouth="smile" />
        <Dust f={f} />
      </Cam>
      <Cam f={f} d={1} v={[[300, 300, 1], [300, 300, 1]]}>
        <rect x={20} y={20} width={0} height={0} />
      </Cam>
    </AbsoluteFill>
  );
};
export const ShamzHead: React.FC = () => {
  const f = 20;
  return (
    <AbsoluteFill>
      <Cam f={f} d={1} v={[[960, 300, 2.6], [960, 300, 2.6]]}>
        <rect x={0} y={0} width={W} height={H} fill="#16204a" />
        <Fig x={760} y={700} s={1.4} f={f} shamz pose="stand" eyes="open" />
        <Fig x={1160} y={700} s={1.4} f={f} shamz pose="stand" eyes="wide" mouth="o" flip />
      </Cam>
    </AbsoluteFill>
  );
};
// one frame of every set, for style frames: [set, params, frame]
const STYLE: [string, any, number][] = [
  ['hall', { mode: 'trip', tag: 'MONDAY · SCHOOL' }, 24],
  ['hall', { mode: 'crowd' }, 20],
  ['bedroom', { bubble: true, replays: 3, tag: 'TONIGHT' }, 60],
  ['lab', { mode: 'enter', tag: 'CORNELL UNIVERSITY · 2000' }, 30],
  ['lab', { mode: 'ask' }, 30],
  ['crowd', { n: 20, lit: 10, stat: 'HALF', sub: 'WHAT THEY GUESSED' }, 30],
  ['bars', { at2: 10 }, 40],
  ['spot', { mode: 'many', title: 'THE SPOTLIGHT EFFECT' }, 60],
  ['close', { eyes: 'worried', mouth: 'wobble', big: '?' }, 20],
  ['time', { t: '2:00 AM', tag: 'TONIGHT' }, 20],
  ['end', {}, 40],
];
export const Style: React.FC = () => {
  const n = useCurrentFrame();
  const [k, p, f] = STYLE[Math.min(n, STYLE.length - 1)];
  const C = SETS[k];
  return <AbsoluteFill style={{ background: '#000' }}><C f={f} d={90} p={p} m={{}} /></AbsoluteFill>;
};
export const SheetComps: React.FC = () => (<>
  <Composition id="ShamzSheet" component={ShamzSheet} durationInFrames={1} fps={30} width={W} height={H} />
  <Composition id="ShamzHead" component={ShamzHead} durationInFrames={1} fps={30} width={W} height={H} />
  <Composition id="Style" component={Style} durationInFrames={STYLE.length} fps={30} width={W} height={H} />
</>);
