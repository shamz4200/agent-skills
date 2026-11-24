import React from 'react';
import {Composition} from 'remotion';
import {C, CoverFrame, Short, total} from './engine';
// Register every Short of the batch here: its spec (eps/<slug>.ts) and its cover lines.
import {ep as hunt} from './eps/hunting-money';
import {ep as heal} from './eps/heal-fast';
import {ep as eggs} from './eps/easter-eggs';
const EPS = [hunt, heal, eggs];
const COVERS: Record<string, {plate: string; lines: [string, string?][]}> = {
  'hunting-money': {plate: 's1_rifle', lines: [['HUNTING PAYS'], ['THOUSANDS', C.gold]]},
  'heal-fast': {plate: 's1_hurt', lines: [["YOU'RE HEALING"], ['WRONG', C.red]]},
  'easter-eggs': {plate: 's1_whisper', lines: [['3 SECRETS'], ['IN GTA 6', C.mag]]},
};
export const Root = () => (
  <>
    {EPS.map((ep) => <Composition key={ep.id} id={ep.id} component={() => <Short ep={ep} />} durationInFrames={total(ep)} fps={30} width={1080} height={1920} />)}
    {EPS.map((ep) => <Composition key={'c' + ep.id} id={`cover-${ep.id}`} component={() => <CoverFrame ep={ep} {...COVERS[ep.id]} />} durationInFrames={1} fps={30} width={1080} height={1920} />)}
  </>
);
