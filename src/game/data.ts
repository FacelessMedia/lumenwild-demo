import type { Creature, ElementKind, MoveData, SpeciesData, SpeciesId } from './types'

export const MOVES: Record<string, MoveData> = {
  sproutSnap: { id: 'sproutSnap', name: 'Sprout Snap', element: 'bloom', power: 9, accuracy: 96, description: 'A quick leafy lash.' },
  pollenPop: { id: 'pollenPop', name: 'Pollen Pop', element: 'bloom', power: 12, accuracy: 88, description: 'A bright, dusty burst.' },
  coalKick: { id: 'coalKick', name: 'Coal Kick', element: 'ember', power: 10, accuracy: 94, description: 'A spark-flecked kick.' },
  flareSkip: { id: 'flareSkip', name: 'Flare Skip', element: 'ember', power: 13, accuracy: 87, description: 'A daring arc of flame.' },
  rippleRam: { id: 'rippleRam', name: 'Ripple Ram', element: 'tide', power: 9, accuracy: 97, description: 'A wave-backed bump.' },
  bubbleBeat: { id: 'bubbleBeat', name: 'Bubble Beat', element: 'tide', power: 12, accuracy: 90, description: 'A rhythmic bubble volley.' },
  breezeBop: { id: 'breezeBop', name: 'Breeze Bop', element: 'gale', power: 9, accuracy: 98, description: 'A swift gusty strike.' },
  cloudCrash: { id: 'cloudCrash', name: 'Cloud Crash', element: 'gale', power: 13, accuracy: 86, description: 'A plunge from overhead.' },
  pebblePunt: { id: 'pebblePunt', name: 'Pebble Punt', element: 'stone', power: 11, accuracy: 92, description: 'A well-aimed stone shot.' },
  glimmer: { id: 'glimmer', name: 'Glimmer', element: 'glow', power: 11, accuracy: 95, description: 'A focused flash of light.' },
  tumble: { id: 'tumble', name: 'Tumble', element: 'stone', power: 8, accuracy: 100, description: 'A wholehearted roll.' },
  nightBlink: { id: 'nightBlink', name: 'Night Blink', element: 'glow', power: 14, accuracy: 84, description: 'A strange twilight pulse.' },
}

export const SPECIES: Record<SpeciesId, SpeciesData> = {
  mossling: {
    id: 'mossling', name: 'Mossling', epithet: 'Budback', element: 'bloom',
    description: 'It naps in sunbeams so the tiny garden on its back can grow.',
    baseHp: 22, attack: 10, defense: 11, speed: 8,
    moves: ['sproutSnap', 'pollenPop'], colors: ['#517c3a', '#90c95c', '#f6d56b', '#243a2a'],
  },
  cindlet: {
    id: 'cindlet', name: 'Cindlet', epithet: 'Kindlekit', element: 'ember',
    description: 'Its tail sparks whenever curiosity gets the better of it.',
    baseHp: 20, attack: 12, defense: 8, speed: 11,
    moves: ['coalKick', 'flareSkip'], colors: ['#b8483d', '#f0784a', '#ffd166', '#432a35'],
  },
  rillip: {
    id: 'rillip', name: 'Rillip', epithet: 'Brookfin', element: 'tide',
    description: 'It hears distant rain through the broad fins beside its cheeks.',
    baseHp: 24, attack: 9, defense: 12, speed: 7,
    moves: ['rippleRam', 'bubbleBeat'], colors: ['#3979a8', '#70b7d6', '#dff4e5', '#24334d'],
  },
  bramblet: {
    id: 'bramblet', name: 'Bramblet', epithet: 'Thicketimp', element: 'bloom',
    description: 'A bold berry thief that leaves fresh flowers in its footprints.',
    baseHp: 18, attack: 9, defense: 8, speed: 13,
    moves: ['sproutSnap', 'tumble'], colors: ['#466b37', '#7ead4f', '#d95b66', '#29352c'],
  },
  mistrill: {
    id: 'mistrill', name: 'Mistrill', epithet: 'Whistlewing', element: 'gale',
    description: 'The tune beneath its wings changes with tomorrow’s weather.',
    baseHp: 19, attack: 10, defense: 8, speed: 14,
    moves: ['breezeBop', 'cloudCrash'], colors: ['#6575a8', '#aab8df', '#f5d99b', '#29314b'],
  },
  shardillo: {
    id: 'shardillo', name: 'Shardillo', epithet: 'Flintroll', element: 'stone',
    description: 'It polishes its crystal scales by rolling down smooth hills.',
    baseHp: 27, attack: 11, defense: 14, speed: 5,
    moves: ['pebblePunt', 'tumble'], colors: ['#6c6684', '#a99fc7', '#d7c685', '#343042'],
  },
  noctuff: {
    id: 'noctuff', name: 'Noctuff', epithet: 'Lanternhare', element: 'glow',
    description: 'Its long ears gather lost moonlight and release it before dawn.',
    baseHp: 23, attack: 13, defense: 9, speed: 12,
    moves: ['glimmer', 'nightBlink'], colors: ['#4b426d', '#8e75b8', '#bde4c3', '#25233b'],
  },
}

export const STARTER_IDS: SpeciesId[] = ['mossling', 'cindlet', 'rillip']
export const WILD_IDS: SpeciesId[] = ['bramblet', 'mistrill', 'shardillo']

export const ELEMENT_LABELS: Record<ElementKind, string> = {
  bloom: 'Bloom', ember: 'Ember', tide: 'Tide', gale: 'Gale', glow: 'Glow', stone: 'Stone',
}

export function createCreature(speciesId: SpeciesId, level: number, uid = `${speciesId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`): Creature {
  const species = SPECIES[speciesId]
  const maxHp = species.baseHp + level * 3
  return {
    uid,
    speciesId,
    nickname: species.name,
    level,
    xp: 0,
    hp: maxHp,
    maxHp,
    attack: species.attack + level * 2,
    defense: species.defense + level * 2,
    speed: species.speed + level,
    moves: species.moves,
  }
}

export function getXpToLevel(level: number) {
  return 18 + level * 7
}

export function getElementMultiplier(attack: ElementKind, defense: ElementKind) {
  const strengths: Partial<Record<ElementKind, ElementKind[]>> = {
    bloom: ['tide', 'stone'],
    ember: ['bloom'],
    tide: ['ember', 'stone'],
    gale: ['bloom'],
    stone: ['gale', 'ember'],
    glow: ['glow'],
  }
  if (strengths[attack]?.includes(defense)) return 1.5
  if (strengths[defense]?.includes(attack)) return 0.72
  return 1
}
