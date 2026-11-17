// The Shamz cast sheet for Night Dossier. From night-dossier/, with node_modules linked and <skill>/studio/package.json
// copied in (without a package.json the render tries to reach remotion.media and fails):
//   npx remotion still cast/ShamzSheet.tsx Sheet cast/shamz-nd-sheet.png --public-dir example/public
//   npx remotion still cast/ShamzSheet.tsx Desk cast/shamz-nd-desk.png --frame 40 --public-dir example/public
import React from 'react';
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from 'remotion';
import { Bean, C, Finish, HAND, INK, LABEL, NameTag, Night, W, H } from '../engine/dossier';
import { LOOKS } from '../engine/kit2';
import { ShamzDesk } from '../engine/sets';

const S = LOOKS.shamz;
const Sheet: React.FC = () => {
  const f = 20; // a frame with eyes open (no blink)
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <rect width={W} height={H} fill="#141a33" />
        {/* left: full body, under a lamp */}
        <rect x={40} y={40} width={560} height={1000} rx={18} fill="#1d2b3f" />
        <Bean {...S} x={320} y={930} s={2.1} f={f} seed={0} bob={0} lit={-0.8} mouth="smile" />
        <Night id="n1" amt={0.5} tint="#070b18" lights={[{ x: 200, y: 260, r: 700, ry: 700 }]} />
        <text x={320} y={1010} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={30} fill={C.cream} letterSpacing={3}>FULL BODY</text>
        {/* middle: head close-up */}
        <rect x={640} y={40} width={640} height={1000} rx={18} fill="#1d2b3f" />
        <svg x={640} y={40} width={640} height={1000} viewBox="640 40 640 1000"><Bean {...S} x={960} y={1420} s={4.2} f={f} seed={0} bob={0} legs={false} lit={-0.6} mouth="line" /></svg>
        <text x={960} y={1010} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={30} fill={C.cream} letterSpacing={3}>CLOSE-UP</text>
        {/* right: expressions */}
        <rect x={1320} y={40} width={560} height={1000} rx={18} fill="#1d2b3f" />
        {([['open', 'talk', 'TALKING'], ['worried', 'line', 'THINKING'], ['wide', 'o', 'SHOCKED'], ['happy', 'smile', 'HAPPY']] as const).map(([e, m, l], i) => {
          const x = 1460 + (i % 2) * 280, y = 120 + Math.floor(i / 2) * 460;
          return <g key={l}>
            <svg x={x - 130} y={y} width={260} height={360} viewBox={`${x - 130} ${y} 260 360`}><Bean {...S} x={x} y={y + 560} s={1.65} f={i === 0 ? 25 : f} seed={0} bob={0} legs={false} eyes={e} mouth={m} lit={-0.5} /></svg>
            <text x={x} y={y + 400} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={26} fill={C.cream} letterSpacing={3}>{l}</text>
          </g>;
        })}
      </svg>
      <Finish v={0.45} />
    </AbsoluteFill>
  );
};
const Desk: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill><ShamzDesk f={f} d={120} m={{}} gf={f} words={[]} p={{ mode: 'intro', pins: ['spy', 'worker', 'saver', 'detective', 'trader'], note: '£?', note2: 'who knew?', caseName: 'CASE FILE', caseNo: 'CASE 06' }} /><Finish /></AbsoluteFill>;
};
const Root: React.FC = () => (<>
  <Composition id="Sheet" component={Sheet} durationInFrames={1} fps={30} width={W} height={H} />
  <Composition id="Desk" component={Desk} durationInFrames={120} fps={30} width={W} height={H} />
</>);
registerRoot(Root);
