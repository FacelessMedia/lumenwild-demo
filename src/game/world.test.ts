import { describe, expect, it } from 'vitest'
import type { PlayerState } from './types'
import { getTile, INITIAL_POSITION, isBlocked, MAP_HEIGHT, MAP_WIDTH, positionAhead } from './world'

const player: PlayerState = {
  ...INITIAL_POSITION,
  direction: 'up',
  party: [],
  archive: [],
  inventory: { prisms: 0, tonics: 0, bloomTea: 0 },
  progress: { starterChosen: false, wardenMet: false, bridgeOpened: false, nikoDefeated: false, demoComplete: false, encounters: 0, captures: 0, wins: 0 },
  quest: 'meet-warden',
  steps: 0,
}

describe('world geometry', () => {
  it('blocks every out-of-bounds coordinate', () => {
    expect(getTile(-1, 0)).toBe('tree')
    expect(getTile(MAP_WIDTH, 0)).toBe('tree')
    expect(getTile(0, MAP_HEIGHT)).toBe('tree')
  })

  it('opens the quest gate only after progression', () => {
    expect(isBlocked(18, 11, player)).toBe(true)
    expect(isBlocked(18, 11, { ...player, progress: { ...player.progress, bridgeOpened: true } })).toBe(false)
  })

  it('calculates all four adjacent positions', () => {
    const origin = { x: 10, y: 10 }
    expect(positionAhead(origin, 'up')).toEqual({ x: 10, y: 9 })
    expect(positionAhead(origin, 'down')).toEqual({ x: 10, y: 11 })
    expect(positionAhead(origin, 'left')).toEqual({ x: 9, y: 10 })
    expect(positionAhead(origin, 'right')).toEqual({ x: 11, y: 10 })
  })
})
