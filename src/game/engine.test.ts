import { describe, expect, it } from 'vitest'
import { createCreature, getElementMultiplier, MOVES } from './data'
import { getCaptureChance, grantXp, healParty, resolveAttack } from './engine'


describe('battle engine', () => {
  it('applies deterministic damage without dropping below zero', () => {
    const attacker = createCreature('cindlet', 5, 'attacker')
    const defender = createCreature('bramblet', 3, 'defender')
    const result = resolveAttack(attacker, defender, MOVES.flareSkip, 0)

    expect(result.hit).toBe(true)
    expect(result.multiplier).toBe(1.5)
    expect(result.damage).toBeGreaterThan(0)
    expect(result.remainingHp).toBeGreaterThanOrEqual(0)
  })

  it('misses when the accuracy roll is too high', () => {
    const attacker = createCreature('mistrill', 4, 'attacker')
    const defender = createCreature('shardillo', 4, 'defender')
    const result = resolveAttack(attacker, defender, MOVES.cloudCrash, 0.99)

    expect(result.hit).toBe(false)
    expect(result.damage).toBe(0)
    expect(result.remainingHp).toBe(defender.hp)
  })

  it('defines the intended elemental relationship', () => {
    expect(getElementMultiplier('bloom', 'tide')).toBe(1.5)
    expect(getElementMultiplier('tide', 'bloom')).toBe(0.72)
    expect(getElementMultiplier('glow', 'stone')).toBe(1)
  })

  it('levels a creature and restores health on level-up', () => {
    const creature = { ...createCreature('mossling', 2, 'friend'), hp: 1 }
    const result = grantXp(creature, 100)

    expect(result.levels).toBeGreaterThan(0)
    expect(result.creature.level).toBeGreaterThan(2)
    expect(result.creature.hp).toBe(result.creature.maxHp)
  })

  it('makes weakened wildlings easier to capture', () => {
    const healthy = createCreature('bramblet', 3, 'healthy')
    const weakened = { ...healthy, hp: 1 }

    expect(getCaptureChance(weakened)).toBeGreaterThan(getCaptureChance(healthy))
    expect(getCaptureChance(weakened)).toBeLessThanOrEqual(0.9)
  })

  it('heals every party member without mutating the input', () => {
    const first = { ...createCreature('rillip', 5, 'first'), hp: 2 }
    const second = { ...createCreature('mistrill', 4, 'second'), hp: 0 }
    const party = [first, second]
    const healed = healParty(party)

    expect(healed.every((creature) => creature.hp === creature.maxHp)).toBe(true)
    expect(party[0].hp).toBe(2)
  })
})
