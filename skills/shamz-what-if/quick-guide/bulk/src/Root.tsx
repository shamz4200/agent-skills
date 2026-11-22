import React from 'react';
import {Composition} from 'remotion';
import {C, CoverFrame, Short, total} from './engine';
import {ep as vaults} from './eps/bank-vaults';
import {ep as cops} from './eps/lose-cops';
import {ep as sales} from './eps/record-sales';
import {ep as tricks} from './eps/hidden-tricks';
import {ep as missables} from './eps/chapter1-missables';
const EPS = [vaults, cops, sales, tricks, missables];
const COVERS: Record<string, {plate: string; lines: [string, string?][]}> = {
  'bank-vaults': {plate: 's1_stop', lines: [['STOP ROBBING'], ['SMALL BANKS', C.red]]},
  'lose-cops': {plate: 's1_wrong', lines: [["YOU'RE LOSING"], ['THE COPS', C.red], ['WRONG']]},
  'record-sales': {plate: 's1_shock', lines: [['GTA 6 BEAT'], ['THE BIGGEST', C.gold], ['MOVIE EVER']]},
  'hidden-tricks': {plate: 's1_secret', lines: [['4 TRICKS'], ['GTA 6', C.cyan], ['NEVER TELLS YOU']]},
  'chapter1-missables': {plate: 's1_stop', lines: [["DON'T START"], ['TOURIST TRAP', C.red], ['YET']]},
};
export const Root = () => (
  <>
    {EPS.map((ep) => <Composition key={ep.id} id={ep.id} component={() => <Short ep={ep} />} durationInFrames={total(ep)} fps={30} width={1080} height={1920} />)}
    {EPS.map((ep) => <Composition key={'c' + ep.id} id={`cover-${ep.id}`} component={() => <CoverFrame ep={ep} {...COVERS[ep.id]} />} durationInFrames={1} fps={30} width={1080} height={1920} />)}
  </>
);
