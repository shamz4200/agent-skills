import React from 'react';
import {Composition} from 'remotion';
import {C, CoverFrame, Short, total} from './engine';
import {ep as vaults} from './eps/bank-vaults';
import {ep as cops} from './eps/lose-cops';
import {ep as sales} from './eps/record-sales';
import {ep as tricks} from './eps/hidden-tricks';
import {ep as missables} from './eps/chapter1-missables';
import {ep as guns} from './eps/keep-guns';
import {ep as codes} from './eps/safe-codes';
import {ep as rumor} from './eps/patch-rumor';
import {ep as trunk} from './eps/trunk-outfits';
import {ep as dives} from './eps/treasure-dives';
import {ep as wallet} from './eps/wallet-cap';
import {ep as moses} from './eps/moses-cars';
import {ep as settings} from './eps/best-settings';
import {ep as eggs} from './eps/easter-eggs';
import {ep as jewels} from './eps/jewelry-stores';
import {ep as heal} from './eps/heal-fast';
import {ep as hunt} from './eps/hunting-money';
const EPS = [vaults, cops, sales, tricks, missables, guns, codes, rumor, trunk, dives, wallet, moses, settings, eggs, jewels, heal, hunt];
const COVERS: Record<string, {plate: string; lines: [string, string?][]}> = {
  'bank-vaults': {plate: 's1_stop', lines: [['STOP ROBBING'], ['SMALL BANKS', C.red]]},
  'lose-cops': {plate: 's1_wrong', lines: [["YOU'RE LOSING"], ['THE COPS', C.red], ['WRONG']]},
  'record-sales': {plate: 's1_shock', lines: [['GTA 6 BEAT'], ['AVENGERS', C.gold], ['ENDGAME']]},
  'hidden-tricks': {plate: 's1_secret', lines: [['4 TRICKS'], ['GTA 6', C.cyan], ['NEVER TELLS YOU']]},
  'chapter1-missables': {plate: 's1_stop', lines: [["DON'T START"], ['TOURIST TRAP', C.red], ['YET']]},
  'keep-guns': {plate: 's1_warn', lines: [['STOP USING'], ['ENEMY GUNS', C.red]]},
  'safe-codes': {plate: 's1_nope', lines: [['STOP GOOGLING'], ['SAFE CODES', C.red]]},
  'patch-rumor': {plate: 's1_doubt', lines: [['NOV 25 PATCH?'], ['NOT CONFIRMED', C.red]]},
  'trunk-outfits': {plate: 's1_point', lines: [['YOUR TRUNK'], ['BEATS THE COPS', C.cyan]]},
  'treasure-dives': {plate: 's1_ask', lines: [['MONEY WITH'], ['NO CRIME', C.teal]]},
  'wallet-cap': {plate: 's1_shock', lines: [['YOUR WALLET'], ['HAS A LIMIT', C.red]]},
  'moses-cars': {plate: 's1_stop', lines: [["DON'T DITCH"], ['STOLEN CARS', C.gold]]},
  'best-settings': {plate: 's1_squint', lines: [['CHANGE THESE'], ['SETTINGS', C.cyan], ['FIRST']]},
  'easter-eggs': {plate: 's1_whisper', lines: [['3 SECRETS'], ['IN GTA 6', C.mag]]},
  'jewelry-stores': {plate: 's1_nope', lines: [['STOP ROBBING'], ['GAS STATIONS', C.red]]},
  'heal-fast': {plate: 's1_hurt', lines: [["YOU'RE HEALING"], ['WRONG', C.red]]},
  'hunting-money': {plate: 's1_rifle', lines: [['HUNTING PAYS'], ['THOUSANDS', C.gold]]},
};
export const Root = () => (
  <>
    {EPS.map((ep) => <Composition key={ep.id} id={ep.id} component={() => <Short ep={ep} />} durationInFrames={total(ep)} fps={30} width={1080} height={1920} />)}
    {EPS.map((ep) => <Composition key={'c' + ep.id} id={`cover-${ep.id}`} component={() => <CoverFrame ep={ep} {...COVERS[ep.id]} />} durationInFrames={1} fps={30} width={1080} height={1920} />)}
  </>
);
