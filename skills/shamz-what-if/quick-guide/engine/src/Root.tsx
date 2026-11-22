import {Composition} from 'remotion';
import {Main, totalFrames} from './Main';
import {Cover} from './Cover';
export const Root = () => (
  <><Composition id="Guide" component={Main} durationInFrames={totalFrames} fps={30} width={1080} height={1920} /><Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} /></>
);
