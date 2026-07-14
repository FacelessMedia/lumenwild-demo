export type Direction = 'up' | 'down' | 'left' | 'right'
export type ElementKind = 'bloom' | 'ember' | 'tide' | 'gale' | 'glow' | 'stone'
export type SpeciesId = 'mossling' | 'cindlet' | 'rillip' | 'bramblet' | 'mistrill' | 'shardillo' | 'noctuff'
export type GameMode = 'title' | 'world' | 'battle' | 'ending'
export type QuestStage = 'meet-warden' | 'cross-run' | 'reach-beacon' | 'complete'
export type TileKind = 'grass' | 'tall' | 'path' | 'water' | 'tree' | 'roof' | 'floor' | 'bridge' | 'flowers' | 'stone'

export interface Position {
  x: number
  y: number
}

export interface MoveData {
  id: string
  name: string
  element: ElementKind
  power: number
  accuracy: number
  description: string
}

export interface SpeciesData {
  id: SpeciesId
  name: string
  epithet: string
  element: ElementKind
  description: string
  baseHp: number
  attack: number
  defense: number
  speed: number
  moves: string[]
  colors: [string, string, string, string]
}

export interface Creature {
  uid: string
  speciesId: SpeciesId
  nickname: string
  level: number
  xp: number
  hp: number
  maxHp: number
  attack: number
  defense: number
  speed: number
  moves: string[]
}

export interface Inventory {
  prisms: number
  tonics: number
  bloomTea: number
}

export interface Progress {
  starterChosen: boolean
  wardenMet: boolean
  bridgeOpened: boolean
  nikoDefeated: boolean
  demoComplete: boolean
  encounters: number
  captures: number
  wins: number
}

export interface PlayerState extends Position {
  direction: Direction
  party: Creature[]
  archive: Creature[]
  inventory: Inventory
  progress: Progress
  quest: QuestStage
  steps: number
}

export interface NpcData extends Position {
  id: string
  name: string
  role: string
  colors: [string, string]
  direction: Direction
}

export interface WorldObject extends Position {
  id: string
  kind: 'sign' | 'spring' | 'beacon' | 'gate'
}

export interface DialogueState {
  speaker: string
  lines: string[]
  index: number
  action?: 'choose-starter' | 'open-gate' | 'start-niko-battle' | 'finish-demo'
}

export interface BattleState {
  kind: 'wild' | 'duel'
  opponent: Creature
  opponentName?: string
  log: string
  busy: boolean
  turn: number
}

export interface SaveData {
  version: number
  player: PlayerState
  savedAt: string
  playSeconds: number
}
