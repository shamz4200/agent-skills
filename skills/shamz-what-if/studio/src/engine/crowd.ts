import type { Look } from './rig';

// The wide cast: 72 more characters on the same rig, built from the wardrobe (engine/wardrobe.tsx). The core cast
// in rig.tsx (Shamz, Pip, Mo, Sister, Mum, The Suit) is unchanged. Use any of these as friends, family, crowds,
// experts and passers-by: <Actor look={CROWD_LOOKS.chef} pose={...} />. `scale` is how big to draw them next to
// Shamz (kids are smaller), so a crowd reads by age at a glance.

const SKIN = ['#F7E1CC', '#EECBA8', '#DDAE84', '#C79067', '#AE734B', '#8E5A38', '#714429', '#55321E'];
const HAIR = {
  black: '#1E1A1C',
  dark: '#3A2620',
  brown: '#6B4428',
  auburn: '#8A3B24',
  blonde: '#E5C36B',
  ginger: '#D9692B',
  grey: '#A7A4A8',
  white: '#E8E6E3',
  blue: '#3A7BD5',
  pink: '#E46BA6',
  purple: '#7A4FB5',
  green: '#3FA36B',
};

const shade = (hex: string, f: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * f))));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
};

type Spec = Partial<Look> & { s: number; j: string; h?: string; label: string; scale?: number };

const make = ({ s, j, h = HAIR.dark, label: _label, scale: _scale, ...rest }: Spec): Look => {
  const skin = SKIN[s];
  return {
    skin,
    skinShade: shade(skin, 0.86),
    hand: skin,
    jacket: j,
    jacketShade: shade(j, 0.82),
    accent: '#F2E8D5',
    limb: '#2A2733',
    line: '#14121C',
    shoe: '#2FB7A6',
    face: s >= 5 ? '#120C10' : '#1D2033',
    hair: h,
    ...rest,
  };
};

const SPECS: Record<string, Spec> = {
  // work and expertise
  doctor: { label: 'DOCTOR', s: 2, j: '#5B8DB8', h: HAIR.black, hairStyle: 'bun', top: 'labcoat', specs: '#2B2B2B' },
  surgeon: { label: 'SURGEON', s: 6, j: '#3E9C8F', h: HAIR.black, hairStyle: 'buzz', headwear: 'headband', headwearCol: '#3E9C8F' },
  nurse: { label: 'NURSE', s: 4, j: '#4FA3A0', h: HAIR.dark, hairStyle: 'ponytail', accent: '#E9F2F1' },
  scientist: { label: 'SCIENTIST', s: 0, j: '#6C6A8E', h: HAIR.ginger, hairStyle: 'wavy', top: 'labcoat', specs: '#3A3A3A' },
  chemist: { label: 'CHEMIST', s: 7, j: '#2E4E7A', h: HAIR.black, hairStyle: 'afro', top: 'labcoat', specs: '#1A1A1A' },
  chef: { label: 'CHEF', s: 3, j: '#E9E4DA', h: HAIR.black, headwear: 'chef', top: 'apron', topCol: '#2B2F3A', facial: 'mustache' },
  baker: { label: 'BAKER', s: 1, j: '#D98C5F', h: HAIR.blonde, hairStyle: 'bun', top: 'apron', topCol: '#F4EEE2' },
  barista: { label: 'BARISTA', s: 5, j: '#3A3446', h: HAIR.dark, hairStyle: 'puffs', top: 'apron', topCol: '#7A5233' },
  builder: { label: 'BUILDER', s: 2, j: '#5A6B7A', h: HAIR.brown, headwear: 'hardhat', headwearCol: '#F2B33D', top: 'hivis', facial: 'stubble' },
  engineer: { label: 'ENGINEER', s: 5, j: '#3B4E6B', h: HAIR.black, headwear: 'hardhat', headwearCol: '#F4F4F0', top: 'hivis', specs: '#1A1A1A' },
  mechanic: { label: 'MECHANIC', s: 4, j: '#3E5C8A', h: HAIR.dark, headwear: 'cap', headwearCol: '#C8382E', top: 'overalls', topCol: '#2F4E7A' },
  farmer: { label: 'FARMER', s: 3, j: '#B5523B', h: HAIR.grey, headwear: 'sunhat', headwearCol: '#D9B56A', top: 'overalls', topCol: '#3E5F8A', facial: 'beard', facialCol: HAIR.grey },
  gardener: { label: 'GARDENER', s: 6, j: '#4F7A3A', h: HAIR.black, hairStyle: 'braids', top: 'apron', topCol: '#6B8F4E' },
  pilot: { label: 'PILOT', s: 1, j: '#1F2A44', h: HAIR.brown, headwear: 'cap', headwearCol: '#1F2A44', top: 'tie', topCol: '#C9A646', accent: '#C9A646' },
  astronaut: { label: 'ASTRONAUT', s: 4, j: '#EEF1F4', h: HAIR.dark, hairStyle: 'buzz', headwear: 'helmet', top: 'spacesuit', limb: '#DDE3EA', shoe: '#9AA6B4' },
  teacher: { label: 'TEACHER', s: 0, j: '#7A5A8C', h: HAIR.auburn, hairStyle: 'bun', top: 'cardigan', topCol: '#B98A5E', specs: '#5A3A2A' },
  professor: { label: 'PROFESSOR', s: 2, j: '#5B4A3A', h: HAIR.white, hairStyle: 'bald', facial: 'beard', facialCol: HAIR.white, specs: '#2B2B2B', top: 'tie', topCol: '#8A2E3A' },
  librarian: { label: 'LIBRARIAN', s: 5, j: '#6B4E7A', h: HAIR.grey, hairStyle: 'bun', top: 'cardigan', topCol: '#8C6A9E', specs: '#3A2A1A' },
  coach: { label: 'COACH', s: 6, j: '#C8382E', h: HAIR.black, headwear: 'cap', headwearCol: '#1F2A44', facial: 'goatee' },
  newsreader: { label: 'NEWSREADER', s: 3, j: '#2B2F3A', h: HAIR.black, hairStyle: 'sidepart', top: 'tie', topCol: '#3A6EA5' },
  reporter: { label: 'REPORTER', s: 1, j: '#3A6EA5', h: HAIR.blonde, hairStyle: 'long', top: 'scarf', topCol: '#E9C46A' },
  artist: { label: 'ARTIST', s: 2, j: '#2B2F3A', h: HAIR.dark, headwear: 'beret', headwearCol: '#C8382E', top: 'stripes', topCol: '#F4F1EA', facial: 'mustache' },
  musician: { label: 'MUSICIAN', s: 7, j: '#4A2E5A', h: HAIR.black, hairStyle: 'afro', top: 'scarf', topCol: '#E46BA6' },
  dj: { label: 'DJ', s: 4, j: '#1E1E28', h: HAIR.pink, hairStyle: 'spiky', headwear: 'headband', headwearCol: '#3AE0C8' },
  gamer: { label: 'GAMER', s: 0, j: '#3A2E6B', h: HAIR.blue, hairStyle: 'spiky', specs: '#1A1A1A' },
  streamer: { label: 'STREAMER', s: 5, j: '#7A4FB5', h: HAIR.purple, hairStyle: 'puffs', headwear: 'headband', headwearCol: '#1E1E28' },
  coder: { label: 'CODER', s: 3, j: '#2F3B4A', h: HAIR.black, hairStyle: 'buzz', specs: '#1A1A1A', facial: 'beard' },
  lawyer: { label: 'LAWYER', s: 6, j: '#2B2F3A', h: HAIR.black, hairStyle: 'bun', top: 'tie', topCol: '#7A2E3A' },
  mayor: { label: 'MAYOR', s: 1, j: '#20232C', h: HAIR.grey, hairStyle: 'sidepart', top: 'tie', topCol: '#A8323E', facial: 'mustache', facialCol: HAIR.grey },
  athlete: { label: 'ATHLETE', s: 7, j: '#E5484D', h: HAIR.black, hairStyle: 'braids', headwear: 'headband', headwearCol: '#F4F4F0' },
  runner: { label: 'RUNNER', s: 2, j: '#3AA0D8', h: HAIR.ginger, hairStyle: 'ponytail', headwear: 'headband', headwearCol: '#E5484D' },
  skater: { label: 'SKATER', s: 4, j: '#3F7F5A', h: HAIR.dark, headwear: 'beanie', headwearCol: '#2B2F3A', accent: '#E9C46A', top: 'stripes', topCol: '#F4F1EA' },
  surfer: { label: 'SURFER', s: 1, j: '#2FB7A6', h: HAIR.blonde, hairStyle: 'long' },
  explorer: { label: 'EXPLORER', s: 5, j: '#8A7A4E', h: HAIR.dark, headwear: 'sunhat', headwearCol: '#C9A87A', facial: 'beard' },
  detective: { label: 'DETECTIVE', s: 0, j: '#7A6A52', h: HAIR.dark, hairStyle: 'sidepart', top: 'scarf', topCol: '#5A3A2A', facial: 'mustache' },
  photographer: { label: 'PHOTOGRAPHER', s: 3, j: '#4E4E58', h: HAIR.auburn, hairStyle: 'wavy', headwear: 'beret', headwearCol: '#2B2B2B' },
  // friends and neighbours
  amara: { label: 'AMARA', s: 6, j: '#E9C46A', h: HAIR.black, hairStyle: 'afro', accent: '#C8382E' },
  kofi: { label: 'KOFI', s: 7, j: '#3A6EA5', h: HAIR.black, hairStyle: 'buzz', facial: 'goatee' },
  zara: { label: 'ZARA', s: 3, j: '#8C4A6A', h: HAIR.black, headwear: 'hijab', headwearCol: '#3E7A6E' },
  aisha: { label: 'AISHA', s: 5, j: '#2E4E7A', h: HAIR.black, headwear: 'hijab', headwearCol: '#C8382E' },
  noor: { label: 'NOOR', s: 2, j: '#E9E4DA', h: HAIR.black, headwear: 'hijab', headwearCol: '#2B2F3A', specs: '#C9A646' },
  harjit: { label: 'HARJIT', s: 4, j: '#3A5A8C', h: HAIR.black, headwear: 'turban', headwearCol: '#E07A2B', facial: 'beard', facialCol: HAIR.black },
  gurpreet: { label: 'GURPREET', s: 3, j: '#5A3A6B', h: HAIR.black, headwear: 'turban', headwearCol: '#2E4E8C', facial: 'beard' },
  mei: { label: 'MEI', s: 1, j: '#E46BA6', h: HAIR.black, hairStyle: 'bun', accent: '#2B2F3A' },
  kenji: { label: 'KENJI', s: 1, j: '#2B2F3A', h: HAIR.black, hairStyle: 'spiky', specs: '#C8382E' },
  priya: { label: 'PRIYA', s: 4, j: '#C8382E', h: HAIR.black, hairStyle: 'braids', accent: '#E9C46A' },
  diego: { label: 'DIEGO', s: 3, j: '#E07A2B', h: HAIR.dark, hairStyle: 'wavy', facial: 'stubble' },
  lucia: { label: 'LUCIA', s: 2, j: '#3FA36B', h: HAIR.brown, hairStyle: 'long', top: 'dress', topCol: '#3FA36B' },
  olu: { label: 'OLU', s: 7, j: '#E9E4DA', h: HAIR.black, hairStyle: 'mohawk', accent: '#3FA36B' },
  tasha: { label: 'TASHA', s: 6, j: '#7A4FB5', h: HAIR.pink, hairStyle: 'puffs' },
  liam: { label: 'LIAM', s: 0, j: '#3E5C8A', h: HAIR.ginger, hairStyle: 'sidepart', facial: 'beard', facialCol: HAIR.ginger },
  freya: { label: 'FREYA', s: 0, j: '#8FB8DE', h: HAIR.blonde, hairStyle: 'braids', accent: '#E46BA6' },
  omar: { label: 'OMAR', s: 4, j: '#4E4E58', h: HAIR.black, hairStyle: 'sidepart', facial: 'beard' },
  rosa: { label: 'ROSA', s: 3, j: '#E5484D', h: HAIR.dark, hairStyle: 'ponytail', top: 'dress', topCol: '#E5484D' },
  jay: { label: 'JAY', s: 5, j: '#1E1E28', h: HAIR.green, hairStyle: 'mohawk' },
  // family and ages
  grandma: { label: 'GRANDMA', s: 1, j: '#8C6A9E', h: HAIR.white, hairStyle: 'bun', top: 'cardigan', topCol: '#B98AA8', specs: '#5A3A2A', scale: 0.92 },
  grandpa: { label: 'GRANDPA', s: 6, j: '#5B4A3A', h: HAIR.white, hairStyle: 'bald', facial: 'mustache', facialCol: HAIR.white, top: 'cardigan', topCol: '#7A6A52', scale: 0.92 },
  nana: { label: 'NANA', s: 7, j: '#C8382E', h: HAIR.grey, headwear: 'headband', headwearCol: '#E9C46A', hairStyle: 'afro', specs: '#C9A646', scale: 0.92 },
  grandad: { label: 'GRANDAD', s: 3, j: '#3E5F8A', h: HAIR.grey, headwear: 'cap', headwearCol: '#5A6B7A', facial: 'beard', facialCol: HAIR.grey, scale: 0.92 },
  uncle: { label: 'UNCLE', s: 5, j: '#3F7F5A', h: HAIR.black, hairStyle: 'buzz', facial: 'beard' },
  auntie: { label: 'AUNTIE', s: 6, j: '#E07A2B', h: HAIR.black, headwear: 'turban', headwearCol: '#3FA36B', top: 'dress', topCol: '#E07A2B' },
  dad: { label: 'DAD', s: 2, j: '#3A6EA5', h: HAIR.brown, hairStyle: 'sidepart', facial: 'stubble' },
  teen: { label: 'TEEN', s: 4, j: '#2B2F3A', h: HAIR.dark, headwear: 'beanie', headwearCol: '#E5484D', accent: '#F4F4F0', scale: 0.9 },
  teenGirl: { label: 'TEEN GIRL', s: 1, j: '#E46BA6', h: HAIR.blonde, hairStyle: 'ponytail', scale: 0.9 },
  kemi: { label: 'KEMI', s: 6, j: '#E9C46A', h: HAIR.black, hairStyle: 'afro', scale: 0.7 },
  layla: { label: 'LAYLA', s: 3, j: '#3FA36B', h: HAIR.dark, hairStyle: 'puffs', top: 'dress', topCol: '#3FA36B', scale: 0.7 },
  tom: { label: 'TOM', s: 0, j: '#3AA0D8', h: HAIR.ginger, headwear: 'cap', headwearCol: '#E5484D', scale: 0.7 },
  ravi: { label: 'RAVI', s: 4, j: '#7A4FB5', h: HAIR.black, hairStyle: 'buzz', specs: '#3A6EA5', scale: 0.7 },
  toddler: { label: 'TODDLER', s: 2, j: '#F2B33D', h: HAIR.blonde, hairStyle: 'wavy', scale: 0.55 },
  baby: { label: 'BABY', s: 5, j: '#8FD3FF', h: HAIR.dark, hairStyle: 'bald', scale: 0.48 },
  twinA: { label: 'TWIN', s: 7, j: '#C8382E', h: HAIR.black, hairStyle: 'braids', scale: 0.72 },
  twinB: { label: 'TWIN', s: 7, j: '#3A6EA5', h: HAIR.black, hairStyle: 'braids', scale: 0.72 },
};

export type CrowdName = keyof typeof SPECS;
export const CROWD_LOOKS = Object.fromEntries(Object.entries(SPECS).map(([k, v]) => [k, make(v)])) as Record<CrowdName, Look>;
export const CROWD = Object.entries(SPECS).map(([id, v]) => ({ id: id as CrowdName, label: v.label, scale: v.scale ?? 0.82, look: CROWD_LOOKS[id as CrowdName] }));
