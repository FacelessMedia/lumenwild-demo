import { getElementMultiplier, getXpToLevel, MOVES, SPECIES } from './data'
import type { Creature, MoveData } from './types'

export interface AttackResult {
  damage: number
  hit: boolean
  multiplier: number
  remainingHp: number
}

export function resolveAttack(attacker: Creature, defender: Creature, move: MoveData, roll = Math.random()): AttackResult {
  const hitRoll = roll * 100
  if (hitRoll > move.accuracy) {
    return { damage: 0, hit: false, multiplier: 1, remainingHp: defender.hp }
  }
  const defenderSpecies = SPECIES[defender.speciesId]
  const multiplier = getElementMultiplier(move.element, defenderSpecies.element)
  const levelFactor = 1 + attacker.level * 0.08
  const raw = move.power * levelFactor + attacker.attack * 0.34 - defender.defense * 0.2
  const damage = Math.max(1, Math.round(raw * multiplier))
  return { damage, hit: true, multiplier, remainingHp: Math.max(0, defender.hp - damage) }
}

export function getEffectText(multiplier: number) {
  if (multiplier > 1) return 'A brilliant hit!'
  if (multiplier < 1) return 'It barely left a mark.'
  return ''
}

export function grantXp(creature: Creature, amount: number) {
  let next = { ...creature, xp: creature.xp + amount }
  let levels = 0
  while (next.xp >= getXpToLevel(next.level)) {
    next.xp -= getXpToLevel(next.level)
    next.level += 1
    next.maxHp += 3
    next.hp = next.maxHp
    next.attack += 2
    next.defense += 2
    next.speed += 1
    levels += 1
  }
  return { creature: next, levels }
}

export function getCaptureChance(target: Creature) {
  const healthFactor = 1 - target.hp / target.maxHp
  return Math.min(0.9, 0.22 + healthFactor * 0.68)
}

export function chooseEnemyMove(creature: Creature, roll = Math.random()) {
  const moveId = creature.moves[Math.floor(roll * creature.moves.length)] ?? creature.moves[0]
  return MOVES[moveId]
}

export function healParty(party: Creature[]) {
  return party.map((creature) => ({ ...creature, hp: creature.maxHp }))
}

export function firstHealthyIndex(party: Creature[]) {
  return party.findIndex((creature) => creature.hp > 0)
}
