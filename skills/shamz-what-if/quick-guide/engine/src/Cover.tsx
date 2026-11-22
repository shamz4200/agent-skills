import {AbsoluteFill, Img, staticFile} from 'remotion';
const FONT = `@font-face{font-family:Anton;src:url(${staticFile('anton.woff2')})}`;
const box = (bg: string, c = '#0b0d14') => ({background: bg, color: c, padding: '0 22px', borderRadius: 14, display: 'inline-block', lineHeight: 1.05, margin: '14px 0'});
export const Cover = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <style>{FONT}</style>
    <Img src={staticFile('s2_shock.png')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.08) translateY(3%)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.85) 80%)'}} />
    <div style={{position: 'absolute', left: 50, right: 50, top: 1000, textAlign: 'center', fontFamily: 'Anton', fontSize: 150, lineHeight: 1.0, color: '#fff',
      textShadow: '0 8px 0 #000'}}>
      GTA 6 WILL<br /><span style={box('#ff2e4d', '#fff')}>DELETE</span><br />YOUR <span style={box('#ffc83d')}>MONEY</span>
    </div>
  </AbsoluteFill>
);
