import { useEffect, useRef } from 'react'
import type { PlayerState, TileKind } from '../game/types'
import { getAreaName, getTile, MAP_HEIGHT, MAP_WIDTH, NPCS, TILE_SIZE, WORLD_OBJECTS } from '../game/world'

interface WorldCanvasProps {
  player: PlayerState
}

const VIEW_COLS = 20
const VIEW_ROWS = 15
const WIDTH = VIEW_COLS * TILE_SIZE
const HEIGHT = VIEW_ROWS * TILE_SIZE

const tileColors: Record<TileKind, string> = {
  grass: '#75ad55', tall: '#4f8c45', path: '#d7c687', water: '#4d91ad', tree: '#315d42',
  roof: '#a94c48', floor: '#c99c68', bridge: '#a97048', flowers: '#77a951', stone: '#696f70',
}

function hash(x: number, y: number) {
  return Math.abs(((x * 928371 + y * 364479) ^ (x * y * 73)) % 997)
}

function drawTile(ctx: CanvasRenderingContext2D, tile: TileKind, sx: number, sy: number, x: number, y: number, tick: number) {
  ctx.fillStyle = tileColors[tile]
  ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE)
  const noise = hash(x, y)
  if (tile === 'grass') {
    ctx.fillStyle = noise % 3 ? '#699f4d' : '#82b95c'
    ctx.fillRect(sx + 5 + noise % 18, sy + 7 + noise % 14, 3, 5)
    ctx.fillRect(sx + 20 - noise % 8, sy + 22, 2, 4)
  }
  if (tile === 'tall') {
    ctx.fillStyle = '#376f3d'
    for (let i = 0; i < 4; i += 1) {
      const sway = Math.sin(tick / 260 + i + x) > 0 ? 1 : 0
      ctx.fillRect(sx + 4 + i * 7 + sway, sy + 11 + (i % 2) * 4, 3, 17)
      ctx.fillRect(sx + 1 + i * 7 + sway, sy + 9 + (i % 2) * 4, 5, 3)
    }
  }
  if (tile === 'path') {
    ctx.fillStyle = '#c3ad70'
    ctx.fillRect(sx + noise % 20, sy + 7 + noise % 16, 5, 3)
    ctx.fillStyle = '#ead99f'
    ctx.fillRect(sx + 22, sy + 3 + noise % 11, 3, 3)
  }
  if (tile === 'water') {
    ctx.fillStyle = '#76b7c5'
    const wave = Math.floor(tick / 350 + x + y) % 2
    ctx.fillRect(sx + (wave ? 3 : 10), sy + 7, 14, 3)
    ctx.fillRect(sx + (wave ? 15 : 5), sy + 22, 12, 3)
  }
  if (tile === 'tree') {
    ctx.fillStyle = '#244a38'
    ctx.fillRect(sx + 4, sy + 20, 24, 12)
    ctx.fillStyle = '#477b49'
    ctx.fillRect(sx + 3, sy + 5, 26, 21)
    ctx.fillStyle = '#5f9853'
    ctx.fillRect(sx + 8, sy + 2, 17, 13)
    ctx.fillStyle = '#82b95c'
    ctx.fillRect(sx + 10, sy + 5, 6, 5)
  }
  if (tile === 'roof') {
    ctx.fillStyle = '#733d42'
    ctx.fillRect(sx, sy + 24, 32, 8)
    ctx.fillStyle = '#c65b50'
    ctx.fillRect(sx + 2, sy + 4, 28, 20)
    ctx.fillStyle = '#df7961'
    ctx.fillRect(sx + 5, sy + 6, 22, 5)
  }
  if (tile === 'floor') {
    ctx.fillStyle = '#75484b'
    ctx.fillRect(sx + 5, sy, 22, 32)
    ctx.fillStyle = '#dbbb79'
    ctx.fillRect(sx + 10, sy + 7, 12, 25)
  }
  if (tile === 'bridge') {
    ctx.fillStyle = '#795139'
    ctx.fillRect(sx, sy, 32, 32)
    ctx.fillStyle = '#bd8653'
    for (let i = 1; i < 31; i += 8) ctx.fillRect(sx, sy + i, 32, 5)
    ctx.fillStyle = '#e0aa69'
    ctx.fillRect(sx, sy + 3, 32, 2)
  }
  if (tile === 'flowers') {
    ctx.fillStyle = '#6ca24d'
    ctx.fillRect(sx, sy, 32, 32)
    ctx.fillStyle = noise % 2 ? '#f2d16f' : '#e87978'
    ctx.fillRect(sx + 7 + noise % 12, sy + 9, 4, 4)
    ctx.fillRect(sx + 20, sy + 20, 4, 4)
  }
  if (tile === 'stone') {
    ctx.fillStyle = '#4f5658'
    ctx.fillRect(sx + 2, sy + 11, 28, 21)
    ctx.fillStyle = '#858b82'
    ctx.fillRect(sx + 6, sy + 6, 21, 18)
    ctx.fillStyle = '#a3a591'
    ctx.fillRect(sx + 9, sy + 8, 9, 4)
  }
}

function drawPerson(ctx: CanvasRenderingContext2D, sx: number, sy: number, colors: [string, string], direction: string, isPlayer = false) {
  const [coat, skin] = colors
  ctx.fillStyle = '#292d3b'
  ctx.fillRect(sx + 9, sy + 25, 6, 6)
  ctx.fillRect(sx + 18, sy + 25, 6, 6)
  ctx.fillStyle = coat
  ctx.fillRect(sx + 7, sy + 12, 19, 15)
  ctx.fillRect(sx + 4, sy + 15, 5, 10)
  ctx.fillRect(sx + 24, sy + 15, 5, 10)
  ctx.fillStyle = skin
  ctx.fillRect(sx + 10, sy + 5, 13, 11)
  ctx.fillStyle = isPlayer ? '#e6c55f' : coat
  ctx.fillRect(sx + 7, sy + 2, 19, 7)
  ctx.fillRect(sx + 5, sy + 6, 7, 5)
  if (direction !== 'up') {
    ctx.fillStyle = '#2b2a37'
    if (direction === 'left') ctx.fillRect(sx + 10, sy + 9, 3, 3)
    else if (direction === 'right') ctx.fillRect(sx + 20, sy + 9, 3, 3)
    else {
      ctx.fillRect(sx + 12, sy + 9, 3, 3)
      ctx.fillRect(sx + 19, sy + 9, 3, 3)
    }
  }
}

function drawObject(ctx: CanvasRenderingContext2D, kind: string, sx: number, sy: number, open: boolean, tick: number) {
  if (kind === 'sign') {
    ctx.fillStyle = '#6e4c34'; ctx.fillRect(sx + 13, sy + 12, 6, 20)
    ctx.fillStyle = '#d4a45e'; ctx.fillRect(sx + 3, sy + 5, 26, 14)
    ctx.fillStyle = '#7d5a39'; ctx.fillRect(sx + 7, sy + 9, 18, 3)
  }
  if (kind === 'spring') {
    ctx.fillStyle = '#839590'; ctx.fillRect(sx + 2, sy + 12, 28, 18)
    ctx.fillStyle = '#78c9c1'; ctx.fillRect(sx + 7, sy + 15, 18, 10)
    ctx.fillStyle = '#d4f0cf'; ctx.fillRect(sx + 12 + Math.floor(tick / 300) % 5, sy + 18, 5, 3)
  }
  if (kind === 'gate' && !open) {
    ctx.fillStyle = '#58402f'; ctx.fillRect(sx + 2, sy, 6, 32); ctx.fillRect(sx + 24, sy, 6, 32)
    ctx.fillStyle = '#cf9a55'; ctx.fillRect(sx + 5, sy + 8, 22, 5); ctx.fillRect(sx + 5, sy + 20, 22, 5)
  }
  if (kind === 'beacon') {
    const glow = Math.sin(tick / 300) * 2
    ctx.fillStyle = '#5d6375'; ctx.fillRect(sx + 8, sy + 15, 17, 17)
    ctx.fillStyle = '#c3a45d'; ctx.fillRect(sx + 11, sy + 4, 11, 15)
    ctx.fillStyle = '#f7e28d'; ctx.fillRect(sx + 13 - glow / 2, sy + 6 - glow / 2, 7 + glow, 8 + glow)
  }
}

export function WorldCanvas({ player }: WorldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let frame = 0
    const render = (tick: number) => {
      const cameraX = Math.max(0, Math.min(MAP_WIDTH - VIEW_COLS, player.x - Math.floor(VIEW_COLS / 2)))
      const cameraY = Math.max(0, Math.min(MAP_HEIGHT - VIEW_ROWS, player.y - Math.floor(VIEW_ROWS / 2)))
      for (let row = 0; row < VIEW_ROWS; row += 1) {
        for (let col = 0; col < VIEW_COLS; col += 1) {
          const worldX = cameraX + col
          const worldY = cameraY + row
          drawTile(ctx, getTile(worldX, worldY), col * TILE_SIZE, row * TILE_SIZE, worldX, worldY, tick)
        }
      }
      const visibleObjects = WORLD_OBJECTS.filter((object) => object.x >= cameraX && object.x < cameraX + VIEW_COLS && object.y >= cameraY && object.y < cameraY + VIEW_ROWS)
      visibleObjects.forEach((object) => drawObject(ctx, object.kind, (object.x - cameraX) * TILE_SIZE, (object.y - cameraY) * TILE_SIZE, player.progress.bridgeOpened, tick))
      const visibleNpcs = NPCS.filter((npc) => !(npc.id === 'niko' && player.progress.nikoDefeated) && npc.x >= cameraX && npc.x < cameraX + VIEW_COLS && npc.y >= cameraY && npc.y < cameraY + VIEW_ROWS)
      visibleNpcs.forEach((npc) => drawPerson(ctx, (npc.x - cameraX) * TILE_SIZE, (npc.y - cameraY) * TILE_SIZE, npc.colors, npc.direction))
      drawPerson(ctx, (player.x - cameraX) * TILE_SIZE, (player.y - cameraY) * TILE_SIZE - 2, ['#315f72', '#dca875'], player.direction, true)
      ctx.fillStyle = 'rgba(16, 21, 31, .78)'
      ctx.fillRect(12, 12, 142, 26)
      ctx.fillStyle = '#f4ebc5'
      ctx.font = '12px monospace'
      ctx.fillText(getAreaName(player.x).toUpperCase(), 23, 30)
      frame = requestAnimationFrame(render)
    }
    frame = requestAnimationFrame(render)
    return () => cancelAnimationFrame(frame)
  }, [player])

  return <canvas ref={canvasRef} aria-label="Lumenwild overworld" className="world-canvas" height={HEIGHT} width={WIDTH} />
}
