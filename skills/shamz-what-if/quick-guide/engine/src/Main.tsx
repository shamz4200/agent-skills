// Shamz Quick Guide #1: "GTA 6 is about to DELETE your money" (1080x1920, 30 fps).
// Every shot and overlay is keyed to a word index in words.json, so a new voice take re-times the whole Short.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import words from './words.json';

type W = {w: string; s: number; e: number; p?: string};
const WD = words as W[];
const FPS = 30;
const T = (i: number) => Math.round(WD[Math.min(i, WD.length - 1)].s * FPS);
const TE = (i: number) => Math.round(WD[Math.min(i, WD.length - 1)].e * FPS);
export const totalFrames = TE(WD.length - 1) + 45;

const C = {
  red: '#ff2e4d', mag: '#ff3fa4', cyan: '#19e3ff', teal: '#14d6a0', gold: '#ffc83d', ink: '#0b0d14', card: 'rgba(14,16,26,0.92)',
};
const FONT = `@font-face{font-family:Anton;src:url(${staticFile('anton.woff2')})}
@font-face{font-family:Barlow;font-weight:700;src:url(${staticFile('barlow700.woff2')})}
@font-face{font-family:Barlow;font-weight:800;src:url(${staticFile('barlow800.woff2')})}`;

const ease = Easing.bezier(0.2, 0.9, 0.25, 1);
const pop = (f: number, at: number, d = 8) => interpolate(f, [at, at + d], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
const useSpring = (at: number, damping = 13) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return spring({frame: f - at, fps, config: {damping, stiffness: 170, mass: 0.7}});
};

// ---------- shots: [first word, plate, camera] ----------
type Cam = {from: [number, number, number]; to: [number, number, number]}; // [scale, x%, y%]
type Shot = {at: number; plate: string; cam: Cam; dim?: number; blur?: number};
const SHOTS: Shot[] = [
  {at: 0, plate: 's1_point', cam: {from: [1.32, 0, 6], to: [1.12, 0, 2]}},            // hook: fast pull-back from his face
  {at: 10, plate: 's1_point', cam: {from: [1.55, -6, 14], to: [1.62, -6, 15]}},       // "No, seriously": punch-in on his eyes
  {at: 12, plate: 's3_count', cam: {from: [1.05, 4, 0], to: [1.14, 0, 2]}},           // three things: slow push right-to-centre
  {at: 21, plate: 'b_atm', cam: {from: [1.1, 0, -3], to: [1.2, 3, 0]}, dim: 0.5},      // the wipe list over the ATM
  {at: 28, plate: 'b_stash', cam: {from: [1.25, 5, 4], to: [1.08, 0, 0]}, dim: 0.42},  // Jason's floor stash: pull-back
  {at: 32, plate: 's2_shock', cam: {from: [1.0, 0, 0], to: [1.16, 0, 6]}},             // gone: push into the shock
  {at: 35, plate: 'b_jar', cam: {from: [1.3, -4, 6], to: [1.12, 0, 2]}, dim: 0.3},     // Family Savings: reveal the safe
  {at: 48, plate: 'b_jar', cam: {from: [1.7, 10, 10], to: [1.85, 12, 12]}, dim: 0.62, blur: 10}, // one-way: tight, blurred
  {at: 60, plate: 'map', cam: {from: [1.0, 0, 0], to: [1.06, 0, -2]}},                 // Tourist Trap: our own map
  {at: 80, plate: 's4_smirk', cam: {from: [1.18, 0, 4], to: [1.05, 0, 0]}},            // CTA: settle on the smirk
];

const Plate: React.FC<{s: Shot; end: number}> = ({s, end}) => {
  const f = useCurrentFrame();
  const a = T(s.at);
  const k = interpolate(f, [a, end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const [sc, x, y] = s.cam.from.map((v, i) => v + (s.cam.to[i] - v) * k);
  const flash = interpolate(f, [a, a + 4], [0.55, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      {s.plate === 'map' ? <MapPlate /> : (
        <Img src={staticFile(`${s.plate}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${sc}) translate(${x}%, ${y}%)`, filter: s.blur ? `blur(${s.blur}px)` : undefined}} />
      )}
      <AbsoluteFill style={{background: `rgba(5,6,12,${s.dim ?? 0.18})`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.72) 100%)'}} />
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};

// ---------- our own stylised map (no game map art) ----------
const MapPlate = () => {
  const f = useCurrentFrame();
  const a = T(60);
  const draw = interpolate(f, [a, a + 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#071a2b 0%,#0a2c3f 55%,#0c3346 100%)'}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="rgba(25,227,255,0.08)" strokeWidth="2" /></pattern>
        </defs>
        <rect width="1080" height="1920" fill="url(#g)" />
        <path d="M-20 300 C 180 260 260 420 380 520 C 520 640 470 820 610 930 C 760 1050 700 1260 820 1380 C 900 1460 1010 1430 1100 1500 L1100 -20 L-20 -20 Z"
          fill="#123f3a" stroke="#14d6a0" strokeWidth="4" opacity="0.9" />
        <path d="M200 1500 C 260 1440 360 1470 420 1520 C 470 1560 440 1640 380 1660 C 300 1690 190 1620 200 1500 Z" fill="#123f3a" stroke="#14d6a0" strokeWidth="4" />
        <path d="M560 1650 C 600 1620 660 1640 670 1690 C 680 1740 620 1760 590 1740 C 550 1720 540 1680 560 1650 Z" fill="#123f3a" stroke="#14d6a0" strokeWidth="4" />
        <path d="M120 600 Q 400 760 520 980 T 760 1330" fill="none" stroke="#ffc83d" strokeWidth="8" strokeDasharray="22 16"
          pathLength={1} strokeDashoffset={0} style={{clipPath: `inset(0 0 ${100 - draw * 100}% 0)`}} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- persistent UI ----------
const Chip = () => (
  <div style={{position: 'absolute', left: 48, top: 72, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px 12px 12px',
    background: 'rgba(10,12,20,0.78)', borderRadius: 40, border: '2px solid rgba(255,255,255,0.18)'}}>
    <Img src={staticFile('s4_smirk.png')} style={{width: 54, height: 54, borderRadius: 27, objectFit: 'cover', objectPosition: '50% 18%', border: `3px solid ${C.gold}`}} />
    <span style={{fontFamily: 'Barlow', fontWeight: 800, fontSize: 34, color: '#fff', letterSpacing: 1}}>@shamz888</span>
  </div>
);

// ---------- captions: 1-4 words, all caps, key word in a colour box ----------
const HL: Record<string, string> = {
  delete: C.red, seriously: C.mag, three: C.cyan, pocket: C.mag, cash: C.mag, checking: C.mag, stash: C.mag,
  gone: C.red, zero: C.red, one: C.cyan, survives: C.teal, family: C.teal, savings: C.teal, thousand: C.gold, five: C.gold,
  way: C.red, back: C.red, tourist: C.cyan, trap: C.cyan, k: C.gold, spend: C.teal, everything: C.teal, save: C.mag, lose: C.red, follow: C.cyan,
};
const groups: number[][] = (() => {
  const g: number[][] = []; let cur: number[] = [];
  WD.forEach((w, i) => {
    cur.push(i);
    const p = w.p ?? '';
    if (cur.length >= 3 || /[.,:?!]/.test(p)) { g.push(cur); cur = []; }
  });
  if (cur.length) g.push(cur);
  return g;
})();
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const Captions: React.FC<{y: number}> = ({y}) => {
  const f = useCurrentFrame();
  const gi = groups.findIndex((g, k) => f >= T(g[0]) - 2 && (k === groups.length - 1 || f < T(groups[k + 1][0]) - 2));
  if (gi < 0) return null;
  const g = groups[gi];
  const s = pop(f, T(g[0]) - 2, 5);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: y, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 18px',
      transform: `scale(${0.85 + 0.15 * s})`, opacity: s}}>
      {g.map((i) => {
        const word = WD[i].w.replace(/^buck$/i, 'BUCK').toUpperCase();
        const hl = HL[norm(WD[i].w)];
        const on = f >= T(i) - 1;
        return (
          <span key={i} style={{fontFamily: 'Anton', fontSize: 104, lineHeight: 1.12, color: hl && on ? C.ink : '#fff', padding: hl ? '0 16px' : 0,
            background: hl && on ? hl : 'transparent', borderRadius: 10, opacity: on ? 1 : 0.55,
            textShadow: hl && on ? 'none' : '0 6px 0 rgba(0,0,0,0.85), 0 0 24px rgba(0,0,0,0.8)', WebkitTextStroke: hl && on ? undefined : '3px #000',
            paintOrder: 'stroke fill'}}>{word}</span>
        );
      })}
    </div>
  );
};

// ---------- overlays ----------
const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background: C.card, borderRadius: 34, border: '2px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)', ...style}}>{children}</div>
);
const label: React.CSSProperties = {fontFamily: 'Barlow', fontWeight: 800, letterSpacing: 6, color: 'rgba(255,255,255,0.7)', fontSize: 30};

// Hook: an in-game-style phone alert slides down
const PhoneAlert = () => {
  const f = useCurrentFrame(); const s = useSpring(T(0) + 3); const r = useSpring(T(6));
  const out = pop(f, T(10) - 4, 6);
  return (
    <div style={{position: 'absolute', left: 90, right: 90, top: 1000, transform: `translateY(${(1 - s) * 900 + out * 900}px)`}}>
      <Card style={{padding: 30}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <div style={{width: 72, height: 72, borderRadius: 18, background: C.teal, display: 'grid', placeItems: 'center', fontFamily: 'Anton', fontSize: 46, color: C.ink}}>$</div>
          <div>
            <div style={{fontFamily: 'Barlow', fontWeight: 800, fontSize: 36, color: '#fff'}}>BANK ALERT</div>
            <div style={{fontFamily: 'Barlow', fontWeight: 700, fontSize: 28, color: 'rgba(255,255,255,0.6)'}}>now</div>
          </div>
        </div>
        <div style={{marginTop: 22, background: 'rgba(255,255,255,0.1)', borderRadius: 26, padding: '20px 26px', fontFamily: 'Barlow', fontWeight: 700, fontSize: 40, color: '#fff'}}>
          Your balance is about to hit <span style={{color: C.red}}>$0</span>
        </div>
        <div style={{marginTop: 16, marginLeft: 'auto', width: 'fit-content', background: '#2f7bff', borderRadius: 26, padding: '16px 28px', fontFamily: 'Barlow', fontWeight: 800, fontSize: 40, color: '#fff',
          transform: `scale(${r})`, transformOrigin: 'right center'}}>bro WHAT 💀</div>
      </Card>
    </div>
  );
};

// Giant "3" with the scene inside it
const BigThree = () => {
  const f = useCurrentFrame(); const s = useSpring(T(19) - 3, 10);
  const lab = pop(f, T(19) + 4, 8);
  const tag = useSpring(T(13) - 2);
  return (
    <>
      <div style={{position: 'absolute', left: 48, top: 176, transform: `scale(${tag})`, transformOrigin: 'left center', background: C.red, padding: '10px 24px', borderRadius: 12,
        fontFamily: 'Barlow', fontWeight: 800, fontSize: 40, color: '#fff', letterSpacing: 3}}>END OF CHAPTER 1</div>
      <div style={{position: 'absolute', left: 40, top: 700, width: 520, textAlign: 'center', transform: `scale(${s}) rotate(${(1 - s) * -12}deg)`}}>
        <div style={{fontFamily: 'Anton', fontSize: 640, lineHeight: 0.9, backgroundImage: `url(${staticFile('b_atm.png')})`, backgroundSize: '160%', backgroundPosition: '40% 40%',
          WebkitBackgroundClip: 'text', color: 'transparent', WebkitTextStroke: `10px ${C.cyan}`, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.7))'}}>3</div>
        <div style={{...label, fontSize: 38, color: '#fff', opacity: lab, marginTop: -10, background: 'rgba(0,0,0,0.6)', padding: '8px 0', borderRadius: 10}}>T H I N G S &nbsp; W I P E D</div>
      </div>
    </>
  );
};

// The wipe list: rows light up then get stamped
const ROWS = [
  {at: 21, wipe: 23, name: 'Pocket cash', sub: 'What you carry'},
  {at: 24, wipe: 27, name: 'BuckMe checking', sub: 'Your bank balance'},
  {at: 28, wipe: 31, name: "Jason's floor stash", sub: 'Under the bedroom floor'},
];
const WipeCard = () => {
  const f = useCurrentFrame(); const s = useSpring(T(21) - 6);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 300, transform: `translateY(${(1 - s) * 200}px)`, opacity: s}}>
      <Card style={{padding: '34px 34px 20px'}}>
        <div style={{...label, marginBottom: 18}}>WIPED WHEN CHAPTER 1 ENDS</div>
        {ROWS.map((r, k) => {
          const on = pop(f, T(r.at) - 2, 6); const st = useSpring(TE(r.wipe), 9);
          return (
            <div key={k} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '20px 18px', marginBottom: 12, borderRadius: 22,
              background: `rgba(255,63,164,${0.05 + 0.2 * on})`, border: `3px solid rgba(255,63,164,${on})`, opacity: 0.35 + 0.65 * on}}>
              <div style={{width: 76, height: 76, borderRadius: 38, background: C.mag, display: 'grid', placeItems: 'center', fontFamily: 'Anton', fontSize: 42, color: C.ink}}>{k + 1}</div>
              <div style={{flex: 1}}>
                <div style={{fontFamily: 'Barlow', fontWeight: 800, fontSize: 50, color: '#fff'}}>{r.name}</div>
                <div style={{fontFamily: 'Barlow', fontWeight: 700, fontSize: 30, color: 'rgba(255,255,255,0.6)'}}>{r.sub}</div>
              </div>
              <div style={{transform: `scale(${st}) rotate(-8deg)`, opacity: st, border: `5px solid ${C.red}`, color: C.red, borderRadius: 10, padding: '4px 14px',
                fontFamily: 'Anton', fontSize: 44, letterSpacing: 2}}>WIPED</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
};

// Gone: value card with a red strike
const ValueCard = () => {
  const f = useCurrentFrame(); const s = useSpring(T(32) - 3); const strike = pop(f, T(32) + 4, 7); const z = useSpring(T(33));
  return (
    <div style={{position: 'absolute', left: 140, right: 140, top: 1020, transform: `scale(${s})`}}>
      <Card style={{padding: '28px 36px', textAlign: 'center'}}>
        <div style={label}>YOUR CHAPTER 1 MONEY</div>
        <div style={{position: 'relative', display: 'inline-block', fontFamily: 'Anton', fontSize: 120, color: 'rgba(255,255,255,0.85)'}}>
          $$$$$
          <div style={{position: 'absolute', left: -10, top: '52%', height: 14, width: `${strike * 105}%`, background: C.red, transform: 'rotate(-4deg)', borderRadius: 7}} />
        </div>
        <div style={{fontFamily: 'Anton', fontSize: 170, lineHeight: 1, color: C.red, transform: `scale(${z})`}}>$0</div>
      </Card>
    </div>
  );
};

// Family Savings: survives, then the cap bar fills to $5,000
const SavingsCard = () => {
  const f = useCurrentFrame(); const s = useSpring(T(39) - 4); const stamp = useSpring(T(38), 9);
  const fill = interpolate(f, [T(43), T(47)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const capOn = pop(f, T(45), 6);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 230, transform: `translateY(${(1 - s) * -220}px)`, opacity: s}}>
      <Card style={{padding: 34}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <div style={label}>THE ONLY POT THAT SURVIVES</div>
            <div style={{fontFamily: 'Anton', fontSize: 92, color: C.teal, lineHeight: 1.1}}>FAMILY SAVINGS</div>
          </div>
          <div style={{transform: `scale(${stamp}) rotate(8deg)`, opacity: stamp, border: `5px solid ${C.teal}`, color: C.teal, borderRadius: 12, padding: '6px 14px', fontFamily: 'Anton', fontSize: 40}}>KEPT</div>
        </div>
        <div style={{display: 'flex', gap: 10, marginTop: 26}}>
          {Array.from({length: 10}).map((_, k) => (
            <div key={k} style={{flex: 1, height: 46, borderRadius: 8, background: fill * 10 > k ? (k === 9 ? C.gold : C.teal) : 'rgba(255,255,255,0.12)'}} />
          ))}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12, fontFamily: 'Barlow', fontWeight: 800, fontSize: 34, color: 'rgba(255,255,255,0.7)'}}>
          <span>$0</span><span style={{color: C.gold, opacity: capOn}}>CAP: $5,000</span>
        </div>
      </Card>
    </div>
  );
};

// One way: cash flies into the safe, the return arrow is blocked
const OneWay = () => {
  const f = useCurrentFrame(); const a = T(48);
  const fly = interpolate((f - a) % 36, [0, 30], [0, 1], {extrapolateRight: 'clamp', easing: ease});
  const block = useSpring(T(55) - 2, 9);
  const s = useSpring(a - 3);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 600, transform: `scale(${s})`}}>
      <Card style={{padding: '40px 34px'}}>
        <div style={{...label, textAlign: 'center', marginBottom: 30}}>DEPOSITS ARE ONE WAY</div>
        <div style={{position: 'relative', height: 300}}>
          <div style={{position: 'absolute', left: 20, top: 60, width: 220, height: 180, borderRadius: 26, background: 'rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', fontFamily: 'Barlow', fontWeight: 800, fontSize: 40, color: '#fff', textAlign: 'center'}}>YOUR<br />CASH</div>
          <div style={{position: 'absolute', right: 20, top: 60, width: 260, height: 180, borderRadius: 26, background: 'rgba(20,214,160,0.22)', border: `4px solid ${C.teal}`, display: 'grid', placeItems: 'center', fontFamily: 'Barlow', fontWeight: 800, fontSize: 40, color: C.teal, textAlign: 'center'}}>FAMILY<br />SAVINGS</div>
          <div style={{position: 'absolute', left: 250 + fly * 300, top: 90, fontFamily: 'Anton', fontSize: 70, color: C.gold, opacity: 1 - fly * 0.6}}>$</div>
          <div style={{position: 'absolute', left: 250, right: 290, top: 60, height: 8, background: C.teal, borderRadius: 4}} />
          <div style={{position: 'absolute', left: 250, right: 290, top: 250, height: 8, background: C.red, borderRadius: 4, opacity: 0.4 + 0.6 * block}} />
          <div style={{position: 'absolute', left: '50%', top: 196, transform: `translateX(-50%) scale(${block})`, width: 110, height: 110, borderRadius: 55, background: C.red,
            display: 'grid', placeItems: 'center', fontFamily: 'Anton', fontSize: 80, color: '#fff'}}>✕</div>
        </div>
        <div style={{textAlign: 'center', fontFamily: 'Barlow', fontWeight: 800, fontSize: 40, color: C.red, opacity: block}}>NO WITHDRAWALS</div>
      </Card>
    </div>
  );
};

// Tourist Trap: map pin + checklist
const Checklist = () => {
  const f = useCurrentFrame(); const pin = useSpring(T(61), 9); const tip = pop(f, T(62), 8);
  const items = [{at: 70, t: 'Fill Family Savings to $5K'}, {at: 76, t: 'Spend everything else'}];
  return (
    <>
      <div style={{position: 'absolute', left: 700, top: 1270, transform: `translateY(${(1 - pin) * -300}px)`}}>
        <svg width="90" height="120" viewBox="0 0 90 120"><path d="M45 118 C 20 80 4 62 4 42 A41 41 0 0 1 86 42 C 86 62 70 80 45 118 Z" fill={C.red} stroke="#fff" strokeWidth="5" /><circle cx="45" cy="42" r="15" fill="#fff" /></svg>
      </div>
      <div style={{position: 'absolute', left: 330, top: 1140, opacity: tip, transform: `translateY(${(1 - tip) * 20}px)`}}>
        <Card style={{padding: '16px 26px', border: `3px solid ${C.cyan}`}}>
          <div style={{fontFamily: 'Barlow', fontWeight: 700, fontSize: 26, color: 'rgba(255,255,255,0.65)', letterSpacing: 3}}>LAST MISSION · CHAPTER 1</div>
          <div style={{fontFamily: 'Anton', fontSize: 56, color: C.cyan}}>TOURIST TRAP</div>
        </Card>
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 230}}>
        <Card style={{padding: 34, opacity: pop(f, T(60), 8)}}>
          <div style={label}>BEFORE TOURIST TRAP</div>
          {items.map((it, k) => {
            const on = pop(f, T(it.at), 6); const tick = useSpring(T(it.at) + 8, 10);
            return (
              <div key={k} style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 22, opacity: 0.4 + 0.6 * on}}>
                <div style={{width: 70, height: 70, borderRadius: 14, border: `5px solid ${C.teal}`, display: 'grid', placeItems: 'center', fontFamily: 'Anton', fontSize: 52, color: C.teal}}>
                  <span style={{transform: `scale(${tick})`}}>✓</span>
                </div>
                <div style={{fontFamily: 'Barlow', fontWeight: 800, fontSize: 50, color: '#fff'}}>{it.t}</div>
              </div>
            );
          })}
        </Card>
      </div>
    </>
  );
};

// CTA: notification + question + follow pill
const CTA = () => {
  const f = useCurrentFrame(); const n = useSpring(T(80) - 3); const q = useSpring(T(85) - 2); const fo = useSpring(T(93));
  const pulse = 1 + 0.04 * Math.sin((f - T(93)) / 4);
  return (
    <>
      <div style={{position: 'absolute', left: 70, right: 70, top: 1040, transform: `translateX(${(1 - n) * 1100}px)`}}>
        <Card style={{padding: 28, display: 'flex', alignItems: 'center', gap: 22}}>
          <div style={{width: 80, height: 80, borderRadius: 20, background: C.mag, display: 'grid', placeItems: 'center', fontSize: 44}}>🔖</div>
          <div>
            <div style={{fontFamily: 'Barlow', fontWeight: 800, fontSize: 30, color: 'rgba(255,255,255,0.6)', letterSpacing: 3}}>REMINDER</div>
            <div style={{fontFamily: 'Barlow', fontWeight: 800, fontSize: 44, color: '#fff'}}>Save this before Tourist Trap</div>
          </div>
        </Card>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1500, display: 'flex', justifyContent: 'center', gap: 20}}>
        <div style={{transform: `scale(${q})`, background: '#fff', color: C.ink, borderRadius: 40, padding: '16px 30px', fontFamily: 'Barlow', fontWeight: 800, fontSize: 40}}>💬 How much did you lose?</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1600, display: 'flex', justifyContent: 'center'}}>
        <div style={{transform: `scale(${fo * pulse})`, background: C.cyan, color: C.ink, borderRadius: 40, padding: '14px 34px', fontFamily: 'Barlow', fontWeight: 800, fontSize: 40}}>FOLLOW · A GTA 6 TIP EVERY DAY</div>
      </div>
    </>
  );
};

const Between: React.FC<{a: number; b: number; children: React.ReactNode}> = ({a, b, children}) => {
  const f = useCurrentFrame();
  return f >= a && f < b ? <>{children}</> : null;
};

export const Main = () => {
  const f = useCurrentFrame();
  const idx = SHOTS.reduce((k, s, i) => (f >= T(s.at) - 2 ? i : k), 0);
  const end = idx + 1 < SHOTS.length ? T(SHOTS[idx + 1].at) - 2 : totalFrames;
  const shake = f >= T(10) - 2 && f < T(12) - 2 ? Math.sin(f * 2.3) * 8 : 0;
  // caption height per shot: keep it off faces and clear of the cards
  const capY = [1480, 1480, 1500, 1380, 1380, 1520, 1360, 1300, 1500, 1230][idx];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <style>{FONT}</style>
      <AbsoluteFill style={{transform: `translateX(${shake}px)`}}><Plate s={SHOTS[idx]} end={end} /></AbsoluteFill>
      <Between a={0} b={T(10)}><PhoneAlert /></Between>
      <Between a={T(12) - 2} b={T(21) - 2}><BigThree /></Between>
      <Between a={T(21) - 8} b={T(32) - 2}><WipeCard /></Between>
      <Between a={T(32) - 4} b={T(35) - 2}><ValueCard /></Between>
      <Between a={T(35) - 6} b={T(48) - 2}><SavingsCard /></Between>
      <Between a={T(48) - 4} b={T(60) - 2}><OneWay /></Between>
      <Between a={T(60) - 2} b={T(80) - 2}><Checklist /></Between>
      <Between a={T(80) - 4} b={totalFrames}><CTA /></Between>
      <Captions y={capY} />
      <Chip />
      <Audio src={staticFile('voice.wav')} />
    </AbsoluteFill>
  );
};
