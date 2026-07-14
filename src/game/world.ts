import type { NpcData, PlayerState, Position, TileKind, WorldObject } from './types'

export const MAP_WIDTH = 32
export const MAP_HEIGHT = 24
export const TILE_SIZE = 32

const key = (x: number, y: number) => `${x},${y}`
const tileOverrides = new Map<string, TileKind>()

function fill(x1: number, y1: number, x2: number, y2: number, tile: TileKind) {
  for (let y = y1; y <= y2; y += 1) {
    for (let x = x1; x <= x2; x += 1) tileOverrides.set(key(x, y), tile)
  }
}

fill(0, 0, MAP_WIDTH - 1, 0, 'tree')
fill(0, MAP_HEIGHT - 1, MAP_WIDTH - 1, MAP_HEIGHT - 1, 'tree')
fill(0, 0, 0, MAP_HEIGHT - 1, 'tree')
fill(MAP_WIDTH - 1, 0, MAP_WIDTH - 1, MAP_HEIGHT - 1, 'tree')
fill(15, 1, 17, MAP_HEIGHT - 2, 'water')
fill(15, 11, 17, 12, 'bridge')
fill(1, 11, 30, 12, 'path')
fill(5, 7, 6, 18, 'path')
fill(6, 7, 11, 8, 'path')
fill(24, 4, 29, 5, 'path')
fill(28, 5, 29, 12, 'path')
fill(2, 3, 7, 6, 'roof')
fill(3, 6, 4, 6, 'floor')
fill(9, 3, 13, 6, 'roof')
fill(10, 6, 11, 6, 'floor')
fill(2, 19, 11, 21, 'flowers')
fill(19, 14, 23, 18, 'tall')
fill(25, 14, 29, 19, 'tall')
fill(20, 8, 23, 10, 'tall')
fill(18, 2, 22, 4, 'tree')
fill(18, 19, 22, 22, 'tree')
fill(24, 1, 30, 3, 'tree')
fill(26, 6, 27, 7, 'stone')
fill(29, 4, 29, 4, 'floor')

for (const [x, y] of [[2, 9], [3, 9], [10, 15], [11, 15], [12, 16], [12, 17], [19, 6], [20, 6], [22, 21], [24, 21], [29, 21]]) {
  tileOverrides.set(key(x, y), 'tree')
}

export function getTile(x: number, y: number): TileKind {
  if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) return 'tree'
  return tileOverrides.get(key(x, y)) ?? 'grass'
}

export const NPCS: NpcData[] = [
  { id: 'warden', name: 'Warden Sol', role: 'Grove warden', x: 10, y: 9, direction: 'down', colors: ['#5b7663', '#e2b87a'] },
  { id: 'mara', name: 'Mara', role: 'Village gardener', x: 3, y: 14, direction: 'right', colors: ['#b9574f', '#f2bf82'] },
  { id: 'pip', name: 'Pip', role: 'Junior ranger', x: 9, y: 12, direction: 'left', colors: ['#4d79a3', '#d9a06f'] },
  { id: 'niko', name: 'Scout Niko', role: 'Beacon keeper', x: 27, y: 8, direction: 'down', colors: ['#705b96', '#e0aa75'] },
]

export const WORLD_OBJECTS: WorldObject[] = [
  { id: 'village-sign', kind: 'sign', x: 6, y: 10 },
  { id: 'spring', kind: 'spring', x: 12, y: 14 },
  { id: 'east-gate', kind: 'gate', x: 18, y: 11 },
  { id: 'beacon', kind: 'beacon', x: 29, y: 4 },
]

export const INITIAL_POSITION: Position = { x: 6, y: 16 }

export function isBlocked(x: number, y: number, player: PlayerState) {
  const tile = getTile(x, y)
  if (['tree', 'water', 'roof', 'stone'].includes(tile)) return true
  if (NPCS.some((npc) => npc.x === x && npc.y === y && !(npc.id === 'niko' && player.progress.nikoDefeated))) return true
  if (WORLD_OBJECTS.some((object) => object.x === x && object.y === y && object.kind !== 'spring' && !(object.kind === 'gate' && player.progress.bridgeOpened))) return true
  return false
}

export function positionAhead(position: Position, direction: PlayerState['direction']): Position {
  if (direction === 'up') return { x: position.x, y: position.y - 1 }
  if (direction === 'down') return { x: position.x, y: position.y + 1 }
  if (direction === 'left') return { x: position.x - 1, y: position.y }
  return { x: position.x + 1, y: position.y }
}

export function npcAt(position: Position) {
  return NPCS.find((npc) => npc.x === position.x && npc.y === position.y)
}

export function objectAt(position: Position) {
  return WORLD_OBJECTS.find((object) => object.x === position.x && object.y === position.y)
}

export function getAreaName(x: number) {
  if (x < 15) return 'Fernhollow'
  if (x < 24) return 'Sunwash Run'
  return 'Skyglass Rise'
}
