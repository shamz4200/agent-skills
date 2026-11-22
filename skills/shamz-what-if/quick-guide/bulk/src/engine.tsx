// Shamz Quick Guide engine: a Short is a list of shots + overlays keyed to word indices of its voice take.
// Overlays are building blocks; every episode stages its own (positions, colours, text, timing).
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export type W = {w: string; s: number; e: number; p?: string};
export const C = {red: '#ff2e4d', mag: '#ff3fa4', cyan: '#19e3ff', teal: '#14d6a0', gold: '#ffc83d', ink: '#0b0d14', white: '#ffffff', purple: '#a66bff'};
const FPS = 30;
const FONT = `@font-face{font-family:Anton;src:url(${staticFile('anton.woff2')})}
@font-face{font-family:Barlow;font-weight:700;src:url(${staticFile('barlow700.woff2')})}
@font-face{font-family:Barlow;font-weight:800;src:url(${staticFile('barlow800.woff2')})}`;
const ease = Easing.bezier(0.2, 0.9, 0.25, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type Cam = [number, number, number]; // scale, x%, y%
export type Shot = {at: number; plate: string; from: Cam; to: Cam; dim?: number; blur?: number; flip?: boolean; bg?: string};
export type Ov = {type: string; from: number; to?: number; [k: string]: any};
export type Ep = {id: string; words: W[]; shots: Shot[]; overlays: Ov[]; capY: number[]; hl: Record<string, string>; chip?: string};

const Ctx = React.createContext<{T: (i: number) => number; TE: (i: number) => number; ep: Ep}>(null as any);
const useT = () => React.useContext(Ctx);
const pop = (f: number, at: number, d = 8) => interpolate(f, [at, at + d], [0, 1], {...clamp, easing: ease});
const useSpr = (at: number, damping = 13) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return spring({frame: f - at, fps, config: {damping, stiffness: 170, mass: 0.7}});
};
const src = (ep: Ep, name: string) => staticFile(`${ep.id}/${name}`);

// ---------- background shots ----------
const Bg: React.FC<{name: string; ep: Ep}> = ({name, ep}) => {
  const f = useCurrentFrame();
  if (name === 'map') return <MapBg />;
  if (name.startsWith('grad:')) {
    const [a, b] = name.slice(5).split(',');
    return <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, ${a} 0%, ${b} 75%)`}}>
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px)', backgroundSize: '72px 72px', transform: `translateY(${(f % 72)}px)`}} />
    </AbsoluteFill>;
  }
  return <Img src={src(ep, name.endsWith('.jpg') || name.endsWith('.png') ? name : `${name}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />;
};
const Plate: React.FC<{s: Shot; start: number; end: number; ep: Ep}> = ({s, start, end, ep}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [start, end], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const [sc, x, y] = s.from.map((v, i) => v + (s.to[i] - v) * k);
  const flash = interpolate(f, [start, start + 4], [0.5, 0], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${sc}) translate(${x}%, ${y}%) ${s.flip ? 'scaleX(-1)' : ''}`, filter: s.blur ? `blur(${s.blur}px)` : undefined}}>
        <Bg name={s.plate} ep={ep} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `rgba(5,6,12,${s.dim ?? 0.18})`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.72) 100%)'}} />
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};
const MapBg = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg,#071a2b 0%,#0a2c3f 55%,#0c3346 100%)'}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <defs><pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="rgba(25,227,255,0.08)" strokeWidth="2" /></pattern></defs>
      <rect width="1080" height="1920" fill="url(#g)" />
      <path d="M-20 300 C 180 260 260 420 380 520 C 520 640 470 820 610 930 C 760 1050 700 1260 820 1380 C 900 1460 1010 1430 1100 1500 L1100 -20 L-20 -20 Z" fill="#123f3a" stroke="#14d6a0" strokeWidth="4" opacity="0.9" />
      <path d="M200 1500 C 260 1440 360 1470 420 1520 C 470 1560 440 1640 380 1660 C 300 1690 190 1620 200 1500 Z" fill="#123f3a" stroke="#14d6a0" strokeWidth="4" />
      <path d="M560 1650 C 600 1620 660 1640 670 1690 C 680 1740 620 1760 590 1740 C 550 1720 540 1680 560 1650 Z" fill="#123f3a" stroke="#14d6a0" strokeWidth="4" />
    </svg>
  </AbsoluteFill>
);

// ---------- shared UI ----------
const Chip: React.FC<{img?: string}> = ({img}) => {
  const {ep} = useT();
  return (
    <div style={{position: 'absolute', left: 48, top: 72, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px 12px 12px', background: 'rgba(10,12,20,0.78)', borderRadius: 40, border: '2px solid rgba(255,255,255,0.18)'}}>
      {img ? <Img src={src(ep, img)} style={{width: 54, height: 54, borderRadius: 27, objectFit: 'cover', objectPosition: '50% 18%', border: `3px solid ${C.gold}`}} />
        : <div style={{width: 54, height: 54, borderRadius: 27, background: C.gold}} />}
      <span style={{fontFamily: 'Barlow', fontWeight: 800, fontSize: 34, color: '#fff', letterSpacing: 1}}>@shamz888</span>
    </div>
  );
};
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const Captions: React.FC<{y: number}> = ({y}) => {
  const f = useCurrentFrame(); const {T, ep} = useT();
  const groups = React.useMemo(() => {
    const g: number[][] = []; let cur: number[] = [];
    ep.words.forEach((w, i) => { cur.push(i); if (cur.length >= 3 || /[.,:?!]/.test(w.p ?? '')) { g.push(cur); cur = []; } });
    if (cur.length) g.push(cur);
    return g;
  }, [ep]);
  const gi = groups.findIndex((g, k) => f >= T(g[0]) - 2 && (k === groups.length - 1 || f < T(groups[k + 1][0]) - 2));
  if (gi < 0) return null;
  const g = groups[gi]; const s = pop(f, T(g[0]) - 2, 5);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: y, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 18px', transform: `scale(${0.85 + 0.15 * s})`, opacity: s}}>
      {g.map((i) => {
        const hl = ep.hl[norm(ep.words[i].w)]; const on = f >= T(i) - 1;
        return <span key={i} style={{fontFamily: 'Anton', fontSize: 104, lineHeight: 1.12, color: hl && on ? C.ink : '#fff', padding: hl ? '0 16px' : 0, background: hl && on ? hl : 'transparent', borderRadius: 10, opacity: on ? 1 : 0.55,
          textShadow: hl && on ? 'none' : '0 6px 0 rgba(0,0,0,0.85), 0 0 24px rgba(0,0,0,0.8)', WebkitTextStroke: hl && on ? undefined : '3px #000', paintOrder: 'stroke fill'}}>{ep.words[i].w.toUpperCase()}</span>;
      })}
    </div>
  );
};
const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background: 'rgba(14,16,26,0.92)', borderRadius: 34, border: '2px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)', ...style}}>{children}</div>
);
const label: React.CSSProperties = {fontFamily: 'Barlow', fontWeight: 800, letterSpacing: 6, color: 'rgba(255,255,255,0.7)', fontSize: 30};
const Stamp: React.FC<{text: string; color: string; s: number; rot?: number; size?: number}> = ({text, color, s, rot = -8, size = 44}) => (
  <div style={{transform: `scale(${s}) rotate(${rot}deg)`, opacity: Math.min(1, s), border: `5px solid ${color}`, color, borderRadius: 10, padding: '4px 14px', fontFamily: 'Anton', fontSize: size, letterSpacing: 2, whiteSpace: 'nowrap'}}>{text}</div>
);
// rich text: "{r:$0}" -> coloured span
const Rich: React.FC<{t: string}> = ({t}) => <>{t.split(/(\{[a-z]+:[^}]*\})/).map((p, i) => {
  const m = p.match(/^\{([a-z]+):(.*)\}$/); return m ? <span key={i} style={{color: (C as any)[m[1]] ?? m[1]}}>{m[2]}</span> : <React.Fragment key={i}>{p}</React.Fragment>;
})}</>;

// ---------- overlays ----------
const O: Record<string, React.FC<{o: Ov}>> = {
  // phone message: {top, icon, iconBg, app, body, reply, replyAt}
  alert: ({o}) => {
    const {T} = useT(); const s = useSpr(T(o.from) + 2); const r = useSpr(T(o.replyAt ?? o.from + 4));
    return (
      <div style={{position: 'absolute', left: 90, right: 90, top: o.top ?? 1000, transform: `translateY(${(1 - s) * 900}px)`}}>
        <Card style={{padding: 30}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <div style={{width: 72, height: 72, borderRadius: 18, background: o.iconBg ?? C.teal, display: 'grid', placeItems: 'center', fontFamily: 'Anton', fontSize: 44, color: C.ink}}>{o.icon ?? '$'}</div>
            <div><div style={{fontFamily: 'Barlow', fontWeight: 800, fontSize: 36, color: '#fff'}}>{o.app}</div>
              <div style={{fontFamily: 'Barlow', fontWeight: 700, fontSize: 28, color: 'rgba(255,255,255,0.6)'}}>now</div></div>
          </div>
          <div style={{marginTop: 22, background: 'rgba(255,255,255,0.1)', borderRadius: 26, padding: '20px 26px', fontFamily: 'Barlow', fontWeight: 700, fontSize: 40, color: '#fff'}}><Rich t={o.body} /></div>
          {o.reply && <div style={{marginTop: 16, marginLeft: 'auto', width: 'fit-content', background: '#2f7bff', borderRadius: 26, padding: '16px 28px', fontFamily: 'Barlow', fontWeight: 800, fontSize: 40, color: '#fff', transform: `scale(${r})`, transformOrigin: 'right center'}}>{o.reply}</div>}
        </Card>
      </div>
    );
  },
  // giant text with a plate inside it: {text, label, x, y, w, size, color, fill}
  big: ({o}) => {
    const {T, ep} = useT(); const f = useCurrentFrame(); const s = useSpr(T(o.from) - 3, 10); const lab = pop(f, T(o.from) + 6, 8);
    return (
      <div style={{position: 'absolute', left: o.x ?? 40, top: o.y ?? 700, width: o.w ?? 1000, textAlign: 'center', transform: `scale(${s}) rotate(${(1 - s) * -10}deg)`}}>
        <div style={{fontFamily: 'Anton', fontSize: o.size ?? 400, lineHeight: 0.95, whiteSpace: 'nowrap', backgroundImage: o.fill ? `url(${src(ep, o.fill)})` : undefined, backgroundSize: '160%', backgroundPosition: '40% 40%',
          WebkitBackgroundClip: o.fill ? 'text' : undefined, color: o.fill ? 'transparent' : (o.color ?? C.gold), WebkitTextStroke: `10px ${o.stroke ?? o.color ?? C.cyan}`, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.7))'}}>{o.text}</div>
        {o.label && <div style={{...label, fontSize: 38, color: '#fff', opacity: lab, marginTop: 6, background: 'rgba(0,0,0,0.6)', padding: '8px 0', borderRadius: 10}}>{o.label}</div>}
      </div>
    );
  },
  // tag pill: {text, color, x, y}
  tag: ({o}) => {
    const {T} = useT(); const s = useSpr(T(o.from) - 2);
    return <div style={{position: 'absolute', left: o.x ?? 48, top: o.y ?? 176, transform: `scale(${s})`, transformOrigin: 'left center', background: o.color ?? C.red, padding: '10px 24px', borderRadius: 12, fontFamily: 'Barlow', fontWeight: 800, fontSize: 40, color: o.ink ?? '#fff', letterSpacing: 3}}>{o.text}</div>;
  },
  // list card: {top, title, color, stamp, stampColor, rows:[{at, name, sub, stampAt}]}
  list: ({o}) => {
    const {T, TE} = useT(); const f = useCurrentFrame(); const s = useSpr(T(o.from) - 6); const col = o.color ?? C.mag;
    return (
      <div style={{position: 'absolute', left: 60, right: 60, top: o.top ?? 300, transform: `translateY(${(1 - s) * 200}px)`, opacity: s}}>
        <Card style={{padding: '34px 34px 20px'}}>
          <div style={{...label, marginBottom: 18}}>{o.title}</div>
          {o.rows.map((r: any, k: number) => {
            const on = pop(f, T(r.at) - 2, 6); const st = useSpr(r.stampAt != null ? TE(r.stampAt) : 1e6, 9);
            return (
              <div key={k} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '18px 18px', marginBottom: 12, borderRadius: 22, background: `${col}${Math.round((0.05 + 0.2 * on) * 255).toString(16).padStart(2, '0')}`, border: `3px solid ${on > 0.5 ? col : 'rgba(255,255,255,0.08)'}`, opacity: 0.35 + 0.65 * on}}>
                <div style={{width: 76, height: 76, borderRadius: 38, background: col, display: 'grid', placeItems: 'center', fontFamily: 'Anton', fontSize: r.icon ? 40 : 42, color: C.ink, flexShrink: 0}}>{r.icon ?? k + 1}</div>
                <div style={{flex: 1}}>
                  <div style={{fontFamily: 'Barlow', fontWeight: 800, fontSize: r.big ?? 48, color: '#fff', lineHeight: 1.05}}>{r.name}</div>
                  {r.sub && <div style={{fontFamily: 'Barlow', fontWeight: 700, fontSize: 30, color: 'rgba(255,255,255,0.6)'}}>{r.sub}</div>}
                </div>
                {o.stamp && <Stamp text={r.stamp ?? o.stamp} color={o.stampColor ?? C.red} s={st} />}
              </div>
            );
          })}
        </Card>
      </div>
    );
  },
  // strike value: {top, label, before, after, strikeAt, afterAt, color}
  value: ({o}) => {
    const {T} = useT(); const f = useCurrentFrame(); const s = useSpr(T(o.from) - 3); const strike = pop(f, T(o.strikeAt ?? o.from) + 4, 7); const z = useSpr(T(o.afterAt ?? o.from + 1));
    return (
      <div style={{position: 'absolute', left: 140, right: 140, top: o.top ?? 1020, transform: `scale(${s})`}}>
        <Card style={{padding: '28px 36px', textAlign: 'center'}}>
          <div style={label}>{o.label}</div>
          <div style={{position: 'relative', display: 'inline-block', fontFamily: 'Anton', fontSize: o.beforeSize ?? 110, color: 'rgba(255,255,255,0.85)'}}>{o.before}
            <div style={{position: 'absolute', left: -10, top: '52%', height: 14, width: `${strike * 105}%`, background: C.red, transform: 'rotate(-4deg)', borderRadius: 7}} /></div>
          <div style={{fontFamily: 'Anton', fontSize: o.afterSize ?? 150, lineHeight: 1, color: o.color ?? C.red, transform: `scale(${z})`}}>{o.after}</div>
        </Card>
      </div>
    );
  },
  // two values side by side: {top, title, left:{label,value,color,at}, right:{...}, vs}
  versus: ({o}) => {
    const {T} = useT(); const s = useSpr(T(o.from) - 4);
    const Side = ({d}: {d: any}) => { const v = useSpr(T(d.at ?? o.from)); return (
      <div style={{flex: 1, textAlign: 'center', padding: '26px 10px', borderRadius: 26, background: 'rgba(255,255,255,0.06)', border: `4px solid ${d.color}`, transform: `scale(${0.6 + 0.4 * v})`, opacity: v}}>
        <div style={{fontFamily: 'Barlow', fontWeight: 800, fontSize: 34, color: 'rgba(255,255,255,0.75)', letterSpacing: 2}}>{d.label}</div>
        <div style={{fontFamily: 'Anton', fontSize: d.size ?? 88, color: d.color, lineHeight: 1.1}}>{d.value}</div>
        {d.sub && <div style={{fontFamily: 'Barlow', fontWeight: 700, fontSize: 28, color: 'rgba(255,255,255,0.6)'}}>{d.sub}</div>}
      </div>); };
    return (
      <div style={{position: 'absolute', left: 50, right: 50, top: o.top ?? 280, transform: `translateY(${(1 - s) * -200}px)`, opacity: s}}>
        <Card style={{padding: 28}}>
          {o.title && <div style={{...label, textAlign: 'center', marginBottom: 18}}>{o.title}</div>}
          <div style={{display: 'flex', gap: 22, alignItems: 'center'}}><Side d={o.left} /><div style={{fontFamily: 'Anton', fontSize: 50, color: '#fff'}}>{o.vs ?? 'VS'}</div><Side d={o.right} /></div>
        </Card>
      </div>
    );
  },
  // counting number: {top, label, value, decimals, prefix, suffix, startAt, endAt, color, sub, subAt}
  count: ({o}) => {
    const {T} = useT(); const f = useCurrentFrame(); const s = useSpr(T(o.from) - 3);
    const k = interpolate(f, [T(o.startAt ?? o.from), T(o.endAt ?? o.from + 3)], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
    const v = (o.fromV ?? 0) + (o.value - (o.fromV ?? 0)) * k; const sub = pop(f, T(o.subAt ?? o.from + 2), 8);
    return (
      <div style={{position: 'absolute', left: 40, right: 40, top: o.top ?? 900, textAlign: 'center', transform: `scale(${s})`}}>
        <div style={{...label, fontSize: 36, color: '#fff', textShadow: '0 4px 12px #000'}}>{o.label}</div>
        <div style={{fontFamily: 'Anton', fontSize: o.size ?? 230, lineHeight: 1, color: o.color ?? C.gold, textShadow: '0 12px 40px rgba(0,0,0,0.8)', WebkitTextStroke: '4px rgba(0,0,0,0.5)'}}>{o.prefix ?? ''}{o.comma ? Math.round(v).toLocaleString('en-US') : v.toFixed(o.decimals ?? 0)}{o.suffix ?? ''}</div>
        {o.sub && <div style={{display: 'inline-block', marginTop: 8, opacity: sub, background: 'rgba(0,0,0,0.7)', borderRadius: 14, padding: '10px 22px', fontFamily: 'Barlow', fontWeight: 800, fontSize: 38, color: '#fff'}}><Rich t={o.sub} /></div>}
      </div>
    );
  },
  // stamp/badge card: {top, title, big, color, stamp, stampAt, bar:{from,to,segs,cap,capAt}}
  badge: ({o}) => {
    const {T} = useT(); const f = useCurrentFrame(); const s = useSpr(T(o.from) - 4); const st = useSpr(T(o.stampAt ?? o.from + 1), 9);
    const fill = o.bar ? interpolate(f, [T(o.bar.from), T(o.bar.to)], [0, 1], {...clamp, easing: ease}) : 0; const segs = o.bar?.segs ?? 10;
    return (
      <div style={{position: 'absolute', left: 60, right: 60, top: o.top ?? 230, transform: `translateY(${(1 - s) * -220}px)`, opacity: s}}>
        <Card style={{padding: 34}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16}}>
            <div><div style={label}>{o.title}</div><div style={{fontFamily: 'Anton', fontSize: o.bigSize ?? 88, color: o.color ?? C.teal, lineHeight: 1.1}}>{o.big}</div></div>
            {o.stamp && <Stamp text={o.stamp} color={o.color ?? C.teal} s={st} rot={8} size={40} />}
          </div>
          {o.bar && <>
            <div style={{display: 'flex', gap: 10, marginTop: 26}}>{Array.from({length: segs}).map((_, k) => <div key={k} style={{flex: 1, height: 46, borderRadius: 8, background: fill * segs > k ? (k === segs - 1 ? C.gold : (o.color ?? C.teal)) : 'rgba(255,255,255,0.12)'}} />)}</div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12, fontFamily: 'Barlow', fontWeight: 800, fontSize: 34, color: 'rgba(255,255,255,0.7)'}}><span>{o.bar.min ?? ''}</span><span style={{color: C.gold, opacity: pop(f, T(o.bar.capAt ?? o.bar.to), 6)}}>{o.bar.cap}</span></div>
          </>}
        </Card>
      </div>
    );
  },
  // blocked flow: {top, title, left, right, blockAt, blockText, rightColor}
  flow: ({o}) => {
    const {T} = useT(); const f = useCurrentFrame(); const a = T(o.from); const fly = interpolate((f - a) % 36, [0, 30], [0, 1], {extrapolateRight: 'clamp', easing: ease});
    const block = useSpr(T(o.blockAt ?? o.from + 4) - 2, 9); const s = useSpr(a - 3); const rc = o.rightColor ?? C.teal;
    return (
      <div style={{position: 'absolute', left: 60, right: 60, top: o.top ?? 600, transform: `scale(${s})`}}>
        <Card style={{padding: '40px 34px'}}>
          <div style={{...label, textAlign: 'center', marginBottom: 30}}>{o.title}</div>
          <div style={{position: 'relative', height: 300}}>
            <div style={{position: 'absolute', left: 20, top: 60, width: 220, height: 180, borderRadius: 26, background: 'rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', fontFamily: 'Barlow', fontWeight: 800, fontSize: 38, color: '#fff', textAlign: 'center', whiteSpace: 'pre-line'}}>{o.left}</div>
            <div style={{position: 'absolute', right: 20, top: 60, width: 260, height: 180, borderRadius: 26, background: 'rgba(255,255,255,0.06)', border: `4px solid ${rc}`, display: 'grid', placeItems: 'center', fontFamily: 'Barlow', fontWeight: 800, fontSize: 38, color: rc, textAlign: 'center', whiteSpace: 'pre-line'}}>{o.right}</div>
            <div style={{position: 'absolute', left: 250 + fly * 300, top: 90, fontFamily: 'Anton', fontSize: 70, color: C.gold, opacity: 1 - fly * 0.6}}>{o.token ?? '$'}</div>
            <div style={{position: 'absolute', left: 250, right: 290, top: 60, height: 8, background: rc, borderRadius: 4}} />
            <div style={{position: 'absolute', left: 250, right: 290, top: 250, height: 8, background: C.red, borderRadius: 4, opacity: 0.4 + 0.6 * block}} />
            <div style={{position: 'absolute', left: '50%', top: 196, transform: `translateX(-50%) scale(${block})`, width: 110, height: 110, borderRadius: 55, background: C.red, display: 'grid', placeItems: 'center', fontFamily: 'Anton', fontSize: 80, color: '#fff'}}>✕</div>
          </div>
          <div style={{textAlign: 'center', fontFamily: 'Barlow', fontWeight: 800, fontSize: 40, color: C.red, opacity: block}}>{o.blockText}</div>
        </Card>
      </div>
    );
  },
  // checklist: {top, title, items:[{at, t}], color}
  check: ({o}) => {
    const {T} = useT(); const f = useCurrentFrame(); const col = o.color ?? C.teal;
    return (
      <div style={{position: 'absolute', left: 60, right: 60, top: o.top ?? 230}}>
        <Card style={{padding: 34, opacity: pop(f, T(o.from) - 2, 8)}}>
          <div style={label}>{o.title}</div>
          {o.items.map((it: any, k: number) => { const on = pop(f, T(it.at), 6); const tick = useSpr(T(it.at) + 8, 10); return (
            <div key={k} style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 20, opacity: 0.4 + 0.6 * on}}>
              <div style={{width: 66, height: 66, borderRadius: 14, border: `5px solid ${col}`, display: 'grid', placeItems: 'center', fontFamily: 'Anton', fontSize: 48, color: col, flexShrink: 0}}><span style={{transform: `scale(${tick})`}}>✓</span></div>
              <div style={{fontFamily: 'Barlow', fontWeight: 800, fontSize: it.size ?? 46, color: '#fff', lineHeight: 1.05}}>{it.t}</div>
            </div>); })}
        </Card>
      </div>
    );
  },
  // map pin + tooltip: {x, y, title, sub, color}
  pin: ({o}) => {
    const {T} = useT(); const f = useCurrentFrame(); const pin = useSpr(T(o.from), 9); const tip = pop(f, T(o.from) + 6, 8); const col = o.color ?? C.cyan;
    return (<>
      <div style={{position: 'absolute', left: o.x, top: o.y, transform: `translateY(${(1 - pin) * -300}px)`}}>
        <svg width="90" height="120" viewBox="0 0 90 120"><path d="M45 118 C 20 80 4 62 4 42 A41 41 0 0 1 86 42 C 86 62 70 80 45 118 Z" fill={C.red} stroke="#fff" strokeWidth="5" /><circle cx="45" cy="42" r="15" fill="#fff" /></svg>
      </div>
      <div style={{position: 'absolute', left: Math.max(40, Math.min(o.x - 360, 1080 - 560)), top: o.y - 140, opacity: tip, transform: `translateY(${(1 - tip) * 20}px)`}}>
        <Card style={{padding: '16px 26px', border: `3px solid ${col}`}}>
          <div style={{fontFamily: 'Barlow', fontWeight: 700, fontSize: 26, color: 'rgba(255,255,255,0.65)', letterSpacing: 3}}>{o.sub}</div>
          <div style={{fontFamily: 'Anton', fontSize: 54, color: col}}>{o.title}</div>
        </Card>
      </div>
    </>);
  },
  // wanted stars: {top, n, flashAt, clearAt}
  stars: ({o}) => {
    const {T} = useT(); const f = useCurrentFrame(); const s = useSpr(T(o.from) - 2);
    const flashing = o.flashAt != null && f >= T(o.flashAt); const cleared = o.clearAt != null ? pop(f, T(o.clearAt), 10) : 0;
    return (
      <div style={{position: 'absolute', right: o.center ? undefined : 50, left: o.center ? 0 : undefined, width: o.center ? 1080 : undefined, justifyContent: 'center', top: o.top ?? 80, display: 'flex', gap: 10, transform: `scale(${s * (o.scale ?? 1)})`, transformOrigin: o.center ? 'center top' : 'right top'}}>
        {Array.from({length: o.n ?? 5}).map((_, k) => <svg key={k} width="74" height="74" viewBox="0 0 24 24" style={{opacity: (1 - cleared) * (flashing ? (Math.floor(f / 6) % 2 ? 0.25 : 1) : 1)}}>
          <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z" fill={C.gold} stroke="#000" strokeWidth="1.2" /></svg>)}
      </div>
    );
  },
  // search zone on the map: {x, y, r, exitAt, label}
  zone: ({o}) => {
    const {T} = useT(); const f = useCurrentFrame(); const s = useSpr(T(o.from) - 2);
    const k = interpolate(f, [T(o.exitAt ?? o.from + 4), T((o.exitAt ?? o.from + 4) + 4)], [0, 1], {...clamp, easing: ease});
    const pulse = 1 + 0.03 * Math.sin(f / 5);
    return (
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920}}>
        <div style={{position: 'absolute', left: o.x - o.r, top: o.y - o.r, width: o.r * 2, height: o.r * 2, borderRadius: '50%', background: 'rgba(255,46,77,0.18)', border: `6px dashed ${C.red}`, transform: `scale(${s * pulse})`}} />
        <div style={{position: 'absolute', left: o.x - 22 + k * o.r * 1.5, top: o.y - 22 - k * o.r * 0.4, width: 44, height: 44, borderRadius: 22, background: C.cyan, border: '5px solid #fff', boxShadow: `0 0 30px ${C.cyan}`}} />
        <div style={{position: 'absolute', left: o.x - 200, top: o.y - o.r - 70, width: 400, textAlign: 'center', fontFamily: 'Barlow', fontWeight: 800, fontSize: 34, letterSpacing: 4, color: C.red, opacity: s}}>{o.label ?? 'SEARCH ZONE'}</div>
      </div>
    );
  },
  // what-they-know icons: {top, title, items:[{icon, label, at, swapAt, swap}]}
  icons: ({o}) => {
    const {T} = useT(); const f = useCurrentFrame(); const s = useSpr(T(o.from) - 4);
    return (
      <div style={{position: 'absolute', left: 60, right: 60, top: o.top ?? 300, transform: `translateY(${(1 - s) * 200}px)`, opacity: s}}>
        <Card style={{padding: 30}}>
          <div style={{...label, textAlign: 'center', marginBottom: 20}}>{o.title}</div>
          <div style={{display: 'flex', gap: 18}}>
            {o.items.map((it: any, k: number) => { const on = useSpr(T(it.at)); const sw = it.swapAt != null ? useSpr(T(it.swapAt), 10) : 0; return (
              <div key={k} style={{flex: 1, textAlign: 'center', padding: '20px 8px', borderRadius: 24, background: sw > 0.5 ? 'rgba(20,214,160,0.18)' : 'rgba(255,46,77,0.16)', border: `4px solid ${sw > 0.5 ? C.teal : C.red}`, transform: `scale(${0.5 + 0.5 * on})`, opacity: on}}>
                <div style={{fontSize: 84, lineHeight: 1.1}}>{sw > 0.5 ? it.swapIcon ?? '✅' : it.icon}</div>
                <div style={{fontFamily: 'Barlow', fontWeight: 800, fontSize: 36, color: '#fff'}}>{sw > 0.5 ? it.swap : it.label}</div>
              </div>); })}
          </div>
        </Card>
      </div>
    );
  },
  // controller prompt: {x, y, glyph, alt, action, hold}
  button: ({o}) => {
    const {T} = useT(); const f = useCurrentFrame(); const s = useSpr(T(o.from) - 2, 10);
    const press = o.hold ? 0.92 + 0.08 * Math.cos((f - T(o.from)) / 3) : (Math.floor((f - T(o.from)) / 8) % 2 ? 0.9 : 1);
    return (
      <div style={{position: 'absolute', left: o.x ?? 300, top: o.y ?? 900, display: 'flex', alignItems: 'center', gap: 22, transform: `scale(${s})`}}>
        <div style={{width: 150, height: 150, borderRadius: 75, background: '#151826', border: '6px solid rgba(255,255,255,0.85)', display: 'grid', placeItems: 'center', transform: `scale(${press})`, boxShadow: `0 0 50px ${o.color ?? C.cyan}`}}>
          <span style={{fontFamily: 'Barlow', fontWeight: 800, fontSize: 70, color: o.color ?? C.cyan}}>{o.glyph}</span></div>
        <Card style={{padding: '18px 26px'}}>
          <div style={{fontFamily: 'Barlow', fontWeight: 800, fontSize: 30, color: 'rgba(255,255,255,0.65)', letterSpacing: 3}}>{o.hold ? 'HOLD' : 'TAP'} {o.alt ? `· XBOX ${o.alt}` : ''}</div>
          <div style={{fontFamily: 'Anton', fontSize: 58, color: '#fff'}}>{o.action}</div>
        </Card>
      </div>
    );
  },
  // CTA: {note, question, follow, noteTop}
  cta: ({o}) => {
    const {T} = useT(); const f = useCurrentFrame(); const n = useSpr(T(o.from) - 3); const q = useSpr(T(o.qAt ?? o.from + 4) - 2); const fo = useSpr(T(o.followAt ?? o.from + 8));
    const pulse = 1 + 0.04 * Math.sin((f - T(o.followAt ?? o.from + 8)) / 4);
    return (<>
      {o.note && <div style={{position: 'absolute', left: 70, right: 70, top: o.noteTop ?? 1040, transform: `translateX(${(1 - n) * 1100}px)`}}>
        <Card style={{padding: 26, display: 'flex', alignItems: 'center', gap: 22}}>
          <div style={{width: 76, height: 76, borderRadius: 20, background: C.mag, display: 'grid', placeItems: 'center', fontSize: 42, flexShrink: 0}}>{o.noteIcon ?? '🔖'}</div>
          <div><div style={{fontFamily: 'Barlow', fontWeight: 800, fontSize: 28, color: 'rgba(255,255,255,0.6)', letterSpacing: 3}}>{o.noteLabel ?? 'REMINDER'}</div>
            <div style={{fontFamily: 'Barlow', fontWeight: 800, fontSize: 42, color: '#fff'}}>{o.note}</div></div>
        </Card></div>}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1500, display: 'flex', justifyContent: 'center'}}>
        <div style={{transform: `scale(${q})`, background: '#fff', color: C.ink, borderRadius: 40, padding: '16px 30px', fontFamily: 'Barlow', fontWeight: 800, fontSize: 40}}>💬 {o.question}</div></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1600, display: 'flex', justifyContent: 'center'}}>
        <div style={{transform: `scale(${fo * pulse})`, background: C.cyan, color: C.ink, borderRadius: 40, padding: '14px 34px', fontFamily: 'Barlow', fontWeight: 800, fontSize: 40}}>{o.follow ?? 'FOLLOW · A GTA 6 TIP EVERY DAY'}</div></div>
    </>);
  },
};

export const total = (ep: Ep) => Math.round(ep.words[ep.words.length - 1].e * FPS) + 45;

export const Short: React.FC<{ep: Ep}> = ({ep}) => {
  const f = useCurrentFrame();
  const T = (i: number) => Math.round(ep.words[Math.max(0, Math.min(i, ep.words.length - 1))].s * FPS);
  const TE = (i: number) => Math.round(ep.words[Math.max(0, Math.min(i, ep.words.length - 1))].e * FPS);
  const end = total(ep);
  const idx = ep.shots.reduce((k, s, i) => (f >= T(s.at) - 2 ? i : k), 0);
  const start = T(ep.shots[idx].at) - 2; const stop = idx + 1 < ep.shots.length ? T(ep.shots[idx + 1].at) - 2 : end;
  return (
    <Ctx.Provider value={{T, TE, ep}}>
      <AbsoluteFill style={{background: '#000'}}>
        <style>{FONT}</style>
        <Plate s={ep.shots[idx]} start={start} end={stop} ep={ep} />
        {ep.overlays.map((o, k) => {
          const a = T(o.from) - 6; const b = o.to != null ? T(o.to) - 2 : end;
          if (f < a || f >= b) return null;
          const Comp = O[o.type]; return <Comp key={k} o={o} />;
        })}
        <Captions y={ep.capY[idx] ?? 1400} />
        <Chip img={ep.chip} />
        <Audio src={staticFile(`${ep.id}/voice.wav`)} />
      </AbsoluteFill>
    </Ctx.Provider>
  );
};

export const CoverFrame: React.FC<{ep: Ep; plate: string; lines: [string, string?][]; top?: number; pos?: string}> = ({ep, plate, lines, top = 1000, pos}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <style>{FONT}</style>
    <Img src={src(ep, `${plate}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: 'scale(1.06)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 42%, rgba(0,0,0,0.85) 80%)'}} />
    <div style={{position: 'absolute', left: 40, right: 40, top, textAlign: 'center', fontFamily: 'Anton', fontSize: 140, lineHeight: 1.0, color: '#fff', textShadow: '0 8px 0 #000'}}>
      {lines.map(([t, col], i) => <div key={i}>{col ? <span style={{background: col, color: col === C.red ? '#fff' : C.ink, padding: '0 22px', borderRadius: 14, display: 'inline-block', lineHeight: 1.05, margin: '12px 0'}}>{t}</span> : t}</div>)}
    </div>
  </AbsoluteFill>
);
