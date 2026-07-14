import { ArrowLeft, Backpack, Footprints, Heart, Sparkles, Swords } from 'lucide-react'
import { ELEMENT_LABELS, MOVES, SPECIES } from '../game/data'
import type { BattleState, Creature } from '../game/types'
import { CreatureArt } from './CreatureArt'
import { PixelIcon } from './PixelIcon'

interface BattleScreenProps {
  battle: BattleState
  activeCreature: Creature
  prisms: number
  tonics: number
  onAttack: (moveId: string) => void
  onCapture: () => void
  onTonic: () => void
  onRun: () => void
}

interface StatusCardProps {
  creature: Creature
  enemy?: boolean
}

function StatusCard({ creature, enemy = false }: StatusCardProps) {
  const species = SPECIES[creature.speciesId]
  const hpPercent = Math.max(0, creature.hp / creature.maxHp * 100)
  return (
    <div className={`battle-status ${enemy ? 'enemy-status' : 'player-status'}`}>
      <div className="status-name-row">
        <strong>{creature.nickname}</strong>
        <span>LV {creature.level}</span>
      </div>
      <span className={`status-element element-${species.element}`}>{ELEMENT_LABELS[species.element]}</span>
      <div className="hp-row"><span>HP</span><div className="hp-track"><i className={hpPercent < 25 ? 'critical' : ''} style={{ width: `${hpPercent}%` }} /></div></div>
      {!enemy && <div className="hp-numbers">{creature.hp} / {creature.maxHp}</div>}
    </div>
  )
}

export function BattleScreen({ battle, activeCreature, prisms, tonics, onAttack, onCapture, onTonic, onRun }: BattleScreenProps) {
  const opponentSpecies = SPECIES[battle.opponent.speciesId]
  const activeSpecies = SPECIES[activeCreature.speciesId]
  return (
    <main className={`battle-screen battle-${opponentSpecies.element}`}>
      <div className="battle-atmosphere" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="battle-topline">
        <span>{battle.kind === 'wild' ? 'Wild encounter' : `Ranger duel · ${battle.opponentName}`}</span>
        <span>Turn {battle.turn}</span>
      </div>
      <section className="battle-stage">
        <div className="enemy-zone">
          <StatusCard creature={battle.opponent} enemy />
          <div className="enemy-platform" />
          <CreatureArt className="battle-creature enemy-creature" speciesId={battle.opponent.speciesId} size={220} facing="left" fainted={battle.opponent.hp <= 0} />
        </div>
        <div className="player-zone">
          <CreatureArt className="battle-creature player-creature" speciesId={activeCreature.speciesId} size={250} facing="right" fainted={activeCreature.hp <= 0} />
          <div className="player-platform" />
          <StatusCard creature={activeCreature} />
        </div>
      </section>
      <section className="battle-console" aria-live="polite">
        <div className="battle-log">
          <span className="battle-log-icon"><Swords size={20} /></span>
          <p>{battle.log}</p>
          {battle.busy && <span className="thinking-dots"><i /><i /><i /></span>}
        </div>
        <div className="battle-commands">
          <div className="move-grid">
            {activeCreature.moves.map((moveId) => {
              const move = MOVES[moveId]
              return <button disabled={battle.busy} key={move.id} onClick={() => onAttack(move.id)}>
                <span className={`move-gem element-${move.element}`}><Sparkles size={16} /></span>
                <span><strong>{move.name}</strong><small>{ELEMENT_LABELS[move.element]} · PWR {move.power}</small></span>
              </button>
            })}
          </div>
          <div className="utility-grid">
            <button disabled={battle.busy || battle.kind === 'duel' || prisms <= 0} onClick={onCapture}><PixelIcon kind="prism" size={22} /><span>Prism<small>{battle.kind === 'duel' ? 'Duel locked' : `${prisms} left`}</small></span></button>
            <button disabled={battle.busy || tonics <= 0 || activeCreature.hp >= activeCreature.maxHp} onClick={onTonic}><PixelIcon kind="tonic" size={22} /><span>Tonic<small>{tonics} left</small></span></button>
            <button disabled={battle.busy || battle.kind === 'duel'} onClick={onRun}><Footprints size={21} /><span>Retreat<small>Return to trail</small></span></button>
          </div>
        </div>
      </section>
      <div className="battle-nameplate enemy-nameplate"><span>{opponentSpecies.epithet}</span></div>
      <div className="battle-nameplate player-nameplate"><Heart size={13} /><span>{activeSpecies.epithet}</span></div>
      <span className="sr-only"><Backpack /><ArrowLeft /></span>
    </main>
  )
}
