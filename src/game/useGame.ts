import { useCallback, useEffect, useMemo, useState } from 'react'
import { createCreature, MOVES, SPECIES, WILD_IDS } from './data'
import { chooseEnemyMove, firstHealthyIndex, getCaptureChance, getEffectText, grantXp, healParty, resolveAttack } from './engine'
import { clearSave, hasSave, loadGame, saveGame } from './save'
import type { BattleState, Creature, DialogueState, Direction, GameMode, PlayerState, SpeciesId } from './types'
import { getTile, INITIAL_POSITION, isBlocked, npcAt, objectAt, positionAhead } from './world'

function createInitialPlayer(): PlayerState {
  return {
    ...INITIAL_POSITION,
    direction: 'up',
    party: [],
    archive: [],
    inventory: { prisms: 6, tonics: 3, bloomTea: 1 },
    progress: {
      starterChosen: false,
      wardenMet: false,
      bridgeOpened: false,
      nikoDefeated: false,
      demoComplete: false,
      encounters: 0,
      captures: 0,
      wins: 0,
    },
    quest: 'meet-warden',
    steps: 0,
  }
}

const pause = (milliseconds: number) => new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds))

export function useGame() {
  const [mode, setMode] = useState<GameMode>('title')
  const [player, setPlayer] = useState<PlayerState>(createInitialPlayer)
  const [battle, setBattle] = useState<BattleState | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [dialogue, setDialogue] = useState<DialogueState | null>(null)
  const [starterOpen, setStarterOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [playSeconds, setPlaySeconds] = useState(0)
  const [saveAvailable, setSaveAvailable] = useState(() => hasSave())
  const [toast, setToast] = useState<string | null>(null)

  const activeCreature = player.party[activeIndex] ?? player.party[0] ?? null
  const inputLocked = mode !== 'world' || Boolean(dialogue || starterOpen || menuOpen || receiptOpen)

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast((current) => current === message ? null : current), 1800)
  }, [])

  useEffect(() => {
    if (mode !== 'world' && mode !== 'battle') return
    const timer = window.setInterval(() => setPlaySeconds((seconds) => seconds + 1), 1000)
    return () => window.clearInterval(timer)
  }, [mode])

  const persist = useCallback((nextPlayer = player) => {
    saveGame(nextPlayer, playSeconds)
    setSaveAvailable(true)
  }, [playSeconds, player])

  const beginNewGame = useCallback(() => {
    clearSave()
    const nextPlayer = createInitialPlayer()
    setPlayer(nextPlayer)
    setPlaySeconds(0)
    setBattle(null)
    setActiveIndex(0)
    setSaveAvailable(false)
    setMode('world')
    setDialogue({
      speaker: 'Fernhollow',
      lines: ['Morning settles softly over the valley.', 'Warden Sol is waiting near the eastern path. Today, your ranger’s trail begins.'],
      index: 0,
    })
  }, [])

  const continueGame = useCallback(() => {
    const saved = loadGame()
    if (!saved) {
      beginNewGame()
      return
    }
    setPlayer(saved.player)
    setPlaySeconds(saved.playSeconds)
    setActiveIndex(Math.max(0, firstHealthyIndex(saved.player.party)))
    setMode(saved.player.progress.demoComplete ? 'ending' : 'world')
  }, [beginNewGame])

  const startEncounter = useCallback((speciesId?: SpeciesId) => {
    if (player.party.length === 0) return
    const healthyIndex = firstHealthyIndex(player.party)
    if (healthyIndex < 0) return
    const id = speciesId ?? WILD_IDS[Math.floor(Math.random() * WILD_IDS.length)]
    const opponent = createCreature(id, 3 + Math.floor(Math.random() * 3))
    setActiveIndex(healthyIndex)
    setBattle({ kind: 'wild', opponent, log: `A curious ${opponent.nickname} rustles into view!`, busy: false, turn: 1 })
    setPlayer((current) => ({ ...current, progress: { ...current.progress, encounters: current.progress.encounters + 1 } }))
    setMode('battle')
  }, [player.party])

  const startNikoBattle = useCallback(() => {
    const healthyIndex = firstHealthyIndex(player.party)
    if (healthyIndex < 0) {
      setDialogue({ speaker: 'Scout Niko', lines: ['Your friends need rest first. The village spring will put the color back in their cheeks.'], index: 0 })
      return
    }
    const opponent = createCreature('noctuff', 5, 'niko-noctuff')
    setActiveIndex(healthyIndex)
    setBattle({ kind: 'duel', opponent, opponentName: 'Scout Niko', log: 'Niko sends out Noctuff. “Show me how your light answers theirs!”', busy: false, turn: 1 })
    setMode('battle')
  }, [player.party])

  const move = useCallback((direction: Direction) => {
    if (inputLocked) return
    const target = positionAhead(player, direction)
    if (isBlocked(target.x, target.y, player)) {
      setPlayer((current) => ({ ...current, direction }))
      return
    }
    const nextPlayer = { ...player, ...target, direction, steps: player.steps + 1 }
    setPlayer(nextPlayer)
    if (getTile(target.x, target.y) === 'tall' && nextPlayer.progress.starterChosen && Math.random() < 0.16) {
      window.setTimeout(() => startEncounter(), 90)
    }
  }, [inputLocked, player, startEncounter])

  const interact = useCallback(() => {
    if (inputLocked) return
    const ahead = positionAhead(player, player.direction)
    const npc = npcAt(ahead)
    const object = objectAt(ahead)

    if (npc?.id === 'warden') {
      if (!player.progress.starterChosen) {
        setDialogue({
          speaker: 'Warden Sol',
          lines: ['There you are. The valley has been listening for your footsteps.', 'Three young wildlings answered the beacon’s last glow. One of them is waiting to walk beside you.'],
          index: 0,
          action: 'choose-starter',
        })
        return
      }
      setDialogue({ speaker: 'Warden Sol', lines: [player.progress.bridgeOpened ? 'The river is behind you now. Trust the friend at your side, and keep climbing.' : 'Your glowmark will open the old river gate. Beyond it, Scout Niko guards the path to the beacon.'], index: 0 })
      return
    }
    if (npc?.id === 'mara') {
      setDialogue({ speaker: 'Mara', lines: ['Wildlings aren’t tools, little ranger. Listen before you lead, and they’ll surprise you.', 'The blue spring east of here restores every tired friend.'], index: 0 })
      return
    }
    if (npc?.id === 'pip') {
      setDialogue({ speaker: 'Pip', lines: ['Tall grass means company! Weaken a wildling before offering a Kinship Prism.', 'Bloom bests Tide, Tide cools Ember, and Stone grounds Gale. Usually.'], index: 0 })
      return
    }
    if (npc?.id === 'niko') {
      if (!player.progress.nikoDefeated && player.quest === 'reach-beacon') {
        setDialogue({ speaker: 'Scout Niko', lines: ['The beacon needs more than a hand on a switch. It needs a bond bright enough to wake it.', 'Let me see the light you and your friend make together.'], index: 0, action: 'start-niko-battle' })
        return
      }
      setDialogue({ speaker: 'Scout Niko', lines: ['The way is open. Follow the path north and let the beacon hear your answer.'], index: 0 })
      return
    }
    if (object?.kind === 'sign') {
      setDialogue({ speaker: 'Trail sign', lines: ['FERNHOLLOW  ←   ·   SUNWASH RUN  →', '“Take only memories. Leave every burrow warmer than you found it.”'], index: 0 })
      return
    }
    if (object?.kind === 'spring') {
      const healed = { ...player, party: healParty(player.party) }
      setPlayer(healed)
      setDialogue({ speaker: 'Brightspring', lines: ['Clear water rings like tiny bells. Your wildling friends are fully restored.'], index: 0 })
      persist(healed)
      return
    }
    if (object?.kind === 'gate') {
      if (!player.progress.starterChosen) {
        setDialogue({ speaker: 'Old river gate', lines: ['A leaf-shaped hollow waits in the lock. You need a ranger’s glowmark.'], index: 0 })
        return
      }
      if (!player.progress.bridgeOpened) {
        setDialogue({ speaker: 'Old river gate', lines: ['Your glowmark warms against the weathered wood.', 'The gate shivers, then folds into the river mist.'], index: 0, action: 'open-gate' })
        return
      }
      setDialogue({ speaker: 'Old river gate', lines: ['The crossing to Sunwash Run is open.'], index: 0 })
      return
    }
    if (object?.kind === 'beacon') {
      if (player.progress.nikoDefeated) {
        setDialogue({ speaker: 'Skyglass Beacon', lines: ['Your glowmark meets the cold glass.', 'One light becomes two, then a hundred. The whole valley answers.'], index: 0, action: 'finish-demo' })
      } else {
        setDialogue({ speaker: 'Skyglass Beacon', lines: ['The dark glass holds a sleeping glimmer. Scout Niko watches the path below.'], index: 0 })
      }
      return
    }
    showToast('Only wind and wildflowers here')
  }, [inputLocked, persist, player, showToast])

  const chooseStarter = useCallback((speciesId: SpeciesId) => {
    const starter = createCreature(speciesId, 5, `starter-${speciesId}`)
    const nextPlayer: PlayerState = {
      ...player,
      party: [starter],
      quest: 'cross-run',
      progress: { ...player.progress, starterChosen: true, wardenMet: true },
    }
    setPlayer(nextPlayer)
    setActiveIndex(0)
    setStarterOpen(false)
    setDialogue({ speaker: 'Warden Sol', lines: [`${SPECIES[speciesId].name} leans close. A tiny glow passes between your matching marks.`, 'Take these Kinship Prisms and cross the river. The valley’s beacon is waiting.'], index: 0 })
    persist(nextPlayer)
  }, [persist, player])

  const advanceDialogue = useCallback(() => {
    if (!dialogue) return
    if (dialogue.index < dialogue.lines.length - 1) {
      setDialogue({ ...dialogue, index: dialogue.index + 1 })
      return
    }
    const action = dialogue.action
    setDialogue(null)
    if (action === 'choose-starter') setStarterOpen(true)
    if (action === 'open-gate') {
      const nextPlayer: PlayerState = { ...player, quest: 'reach-beacon', progress: { ...player.progress, bridgeOpened: true } }
      setPlayer(nextPlayer)
      persist(nextPlayer)
    }
    if (action === 'start-niko-battle') startNikoBattle()
    if (action === 'finish-demo') {
      const nextPlayer: PlayerState = { ...player, quest: 'complete', progress: { ...player.progress, demoComplete: true } }
      setPlayer(nextPlayer)
      persist(nextPlayer)
      setMode('ending')
    }
  }, [dialogue, persist, player, startNikoBattle])

  const recoverFromDefeat = useCallback(async () => {
    setBattle((current) => current ? { ...current, log: 'Your glow dims—but the valley catches you.', busy: true } : current)
    await pause(1100)
    const recovered: PlayerState = { ...player, ...INITIAL_POSITION, direction: 'up', party: healParty(player.party) }
    setPlayer(recovered)
    setBattle(null)
    setMode('world')
    setDialogue({ speaker: 'Warden Sol', lines: ['Easy now. A lost battle is just the trail teaching you where to place your next step.', 'Your friends are rested. Try the spring, explore the grass, and return when you’re ready.'], index: 0 })
    persist(recovered)
  }, [persist, player])

  const finishVictory = useCallback(async (currentBattle: BattleState) => {
    const active = player.party[activeIndex]
    if (!active) return
    const earnedXp = currentBattle.kind === 'duel' ? 34 : 16 + currentBattle.opponent.level * 3
    const reward = grantXp(active, earnedXp)
    const party = player.party.map((creature, index) => index === activeIndex ? reward.creature : creature)
    const nextPlayer: PlayerState = {
      ...player,
      party,
      progress: {
        ...player.progress,
        wins: player.progress.wins + 1,
        nikoDefeated: currentBattle.kind === 'duel' ? true : player.progress.nikoDefeated,
      },
    }
    const levelText = reward.levels > 0 ? ` ${active.nickname} grew to level ${reward.creature.level}!` : ''
    setBattle({ ...currentBattle, opponent: { ...currentBattle.opponent, hp: 0 }, log: `${currentBattle.opponent.nickname} yields. You earned ${earnedXp} glow!${levelText}`, busy: true })
    await pause(1200)
    setPlayer(nextPlayer)
    setBattle(null)
    setMode('world')
    if (currentBattle.kind === 'duel') {
      setDialogue({ speaker: 'Scout Niko', lines: ['That light is yours—steady, kind, and brighter for being shared.', 'Go on. Skyglass Beacon is waiting just north of here.'], index: 0 })
    } else {
      showToast(`${active.nickname} gained ${earnedXp} glow`)
    }
    persist(nextPlayer)
  }, [activeIndex, persist, player, showToast])

  const enemyTurn = useCallback(async (opponent: Creature, partyOverride?: Creature[]) => {
    const party = partyOverride ?? player.party
    const defender = party[activeIndex]
    if (!defender) return
    const moveData = chooseEnemyMove(opponent)
    setBattle((current) => current ? { ...current, opponent, log: `${opponent.nickname} gathers itself...`, busy: true } : current)
    await pause(520)
    const result = resolveAttack(opponent, defender, moveData)
    if (!result.hit) {
      setBattle((current) => current ? { ...current, log: `${opponent.nickname} used ${moveData.name}, but missed!`, busy: false, turn: current.turn + 1 } : current)
      return
    }
    const nextParty = party.map((creature, index) => index === activeIndex ? { ...creature, hp: result.remainingHp } : creature)
    setPlayer((current) => ({ ...current, party: nextParty }))
    const effect = getEffectText(result.multiplier)
    setBattle((current) => current ? { ...current, log: `${opponent.nickname} used ${moveData.name}! ${defender.nickname} took ${result.damage} damage. ${effect}`, busy: result.remainingHp <= 0, turn: current.turn + 1 } : current)
    if (result.remainingHp > 0) return
    await pause(850)
    const nextIndex = firstHealthyIndex(nextParty)
    if (nextIndex < 0) {
      await recoverFromDefeat()
      return
    }
    setActiveIndex(nextIndex)
    setBattle((current) => current ? { ...current, log: `${defender.nickname} needs a rest. ${nextParty[nextIndex].nickname} steps forward!`, busy: false } : current)
  }, [activeIndex, player.party, recoverFromDefeat])

  const attack = useCallback(async (moveId: string) => {
    if (!battle || battle.busy || !activeCreature) return
    const moveData = MOVES[moveId]
    if (!moveData) return
    const currentBattle = battle
    setBattle({ ...battle, log: `${activeCreature.nickname} used ${moveData.name}!`, busy: true })
    await pause(500)
    const result = resolveAttack(activeCreature, battle.opponent, moveData)
    if (!result.hit) {
      setBattle({ ...battle, log: `${activeCreature.nickname} used ${moveData.name}, but it swept past!`, busy: true })
      await pause(550)
      await enemyTurn(battle.opponent)
      return
    }
    const opponent = { ...battle.opponent, hp: result.remainingHp }
    setBattle({ ...battle, opponent, log: `${battle.opponent.nickname} took ${result.damage} damage. ${getEffectText(result.multiplier)}`, busy: true })
    await pause(650)
    if (opponent.hp <= 0) {
      await finishVictory({ ...currentBattle, opponent })
      return
    }
    await enemyTurn(opponent)
  }, [activeCreature, battle, enemyTurn, finishVictory])

  const capture = useCallback(async () => {
    if (!battle || battle.busy || battle.kind !== 'wild' || player.inventory.prisms <= 0) return
    const currentBattle = battle
    const inventory = { ...player.inventory, prisms: player.inventory.prisms - 1 }
    setPlayer({ ...player, inventory })
    setBattle({ ...battle, log: 'The Kinship Prism opens in a ring of warm light...', busy: true })
    await pause(850)
    if (Math.random() <= getCaptureChance(battle.opponent)) {
      const friend = { ...battle.opponent, hp: battle.opponent.maxHp }
      const inParty = player.party.length < 4
      const nextPlayer: PlayerState = {
        ...player,
        inventory,
        party: inParty ? [...player.party, friend] : player.party,
        archive: inParty ? player.archive : [...player.archive, friend],
        progress: { ...player.progress, captures: player.progress.captures + 1 },
      }
      setBattle({ ...battle, log: `${friend.nickname} accepts your invitation! ${inParty ? 'It joins your trail.' : 'It waits safely in the village grove.'}`, busy: true })
      await pause(1200)
      setPlayer(nextPlayer)
      setBattle(null)
      setMode('world')
      showToast(`${friend.nickname} joined your wildling notes`)
      persist(nextPlayer)
      return
    }
    setBattle({ ...currentBattle, opponent: battle.opponent, log: `${battle.opponent.nickname} is curious, but not ready yet.`, busy: true })
    await pause(600)
    await enemyTurn(battle.opponent)
  }, [battle, enemyTurn, persist, player, showToast])

  const useBattleTonic = useCallback(async () => {
    if (!battle || battle.busy || !activeCreature || player.inventory.tonics <= 0 || activeCreature.hp >= activeCreature.maxHp) return
    const party = player.party.map((creature, index) => index === activeIndex ? { ...creature, hp: creature.maxHp } : creature)
    const inventory = { ...player.inventory, tonics: player.inventory.tonics - 1 }
    setPlayer({ ...player, party, inventory })
    setBattle({ ...battle, log: `${activeCreature.nickname} drinks the Bright Tonic and springs back to full health!`, busy: true })
    await pause(700)
    await enemyTurn(battle.opponent, party)
  }, [activeCreature, activeIndex, battle, enemyTurn, player])

  const useFieldTonic = useCallback((index: number) => {
    const creature = player.party[index]
    if (!creature || creature.hp >= creature.maxHp || player.inventory.tonics <= 0) return
    const nextPlayer = {
      ...player,
      party: player.party.map((entry, partyIndex) => partyIndex === index ? { ...entry, hp: entry.maxHp } : entry),
      inventory: { ...player.inventory, tonics: player.inventory.tonics - 1 },
    }
    setPlayer(nextPlayer)
    showToast(`${creature.nickname} is fully restored`)
  }, [player, showToast])

  const useTea = useCallback(() => {
    if (player.inventory.bloomTea <= 0) return
    const nextPlayer = { ...player, party: healParty(player.party), inventory: { ...player.inventory, bloomTea: player.inventory.bloomTea - 1 } }
    setPlayer(nextPlayer)
    showToast('The whole party shares the Bloom Tea')
  }, [player, showToast])

  const runFromBattle = useCallback(() => {
    if (!battle || battle.busy || battle.kind !== 'wild') return
    setBattle(null)
    setMode('world')
    showToast('You slip quietly back to the trail')
  }, [battle, showToast])

  const returnToTitle = useCallback(() => {
    if (mode !== 'title') persist()
    setMenuOpen(false)
    setReceiptOpen(false)
    setDialogue(null)
    setBattle(null)
    setMode('title')
  }, [mode, persist])

  const controls = useMemo(() => ({ move, interact }), [interact, move])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat && !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(event.key)) return
      const key = event.key.toLowerCase()
      if (dialogue && ['z', 'enter', ' '].includes(key)) {
        event.preventDefault()
        advanceDialogue()
        return
      }
      if (starterOpen || receiptOpen) return
      if (menuOpen) {
        if (key === 'x' || key === 'escape') setMenuOpen(false)
        return
      }
      if (mode !== 'world') return
      if (key === 'arrowup' || key === 'w') controls.move('up')
      if (key === 'arrowdown' || key === 's') controls.move('down')
      if (key === 'arrowleft' || key === 'a') controls.move('left')
      if (key === 'arrowright' || key === 'd') controls.move('right')
      if (key === 'z' || key === 'enter' || key === ' ') controls.interact()
      if (key === 'x' || key === 'escape') setMenuOpen(true)
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'z', 'x', 'enter', ' '].includes(key)) event.preventDefault()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [advanceDialogue, controls, dialogue, menuOpen, mode, receiptOpen, starterOpen])

  return {
    mode,
    player,
    battle,
    activeCreature,
    dialogue,
    starterOpen,
    menuOpen,
    receiptOpen,
    playSeconds,
    saveAvailable,
    toast,
    beginNewGame,
    continueGame,
    move,
    interact,
    advanceDialogue,
    chooseStarter,
    attack,
    capture,
    useBattleTonic,
    useFieldTonic,
    useTea,
    runFromBattle,
    persist: () => { persist(); showToast('Journey saved') },
    setMenuOpen,
    setReceiptOpen,
    setStarterOpen,
    setMode,
    returnToTitle,
  }
}
