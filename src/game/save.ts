import type { PlayerState, SaveData } from './types'

const SAVE_KEY = 'lumenwild-save-v1'

export function saveGame(player: PlayerState, playSeconds: number) {
  const data: SaveData = {
    version: 1,
    player,
    savedAt: new Date().toISOString(),
    playSeconds,
  }
  localStorage.setItem(SAVE_KEY, JSON.stringify(data))
  return data
}

export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SaveData
    if (parsed.version !== 1 || !parsed.player?.progress || !Array.isArray(parsed.player.party)) return null
    return parsed
  } catch {
    return null
  }
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY)
}

export function hasSave() {
  return Boolean(loadGame())
}
