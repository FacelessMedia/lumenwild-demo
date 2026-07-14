import { Backpack, BookOpen, Heart, Menu, Sparkles } from 'lucide-react'
import { SPECIES } from '../game/data'
import type { PlayerState } from '../game/types'
import { PixelIcon } from './PixelIcon'

interface HudProps {
  player: PlayerState
  onInteract: () => void
  onMenu: () => void
}

const questText = {
  'meet-warden': 'Find Warden Sol near the eastern path',
  'cross-run': 'Open the old gate and cross Sunwash Run',
  'reach-beacon': 'Climb Skyglass Rise and relight the beacon',
  complete: 'The beacon shines over Lumenwild',
}

export function Hud({ player, onInteract, onMenu }: HudProps) {
  const lead = player.party.find((creature) => creature.hp > 0) ?? player.party[0]
  return (
    <>
      <div className="world-hud top-hud">
        <div className="quest-card">
          <span className="hud-label"><Sparkles size={13} /> Current trail</span>
          <strong>{questText[player.quest]}</strong>
        </div>
        {lead && <div className="lead-card">
          <span className="lead-dot"><Heart size={13} /></span>
          <div><strong>{SPECIES[lead.speciesId].name}</strong><span>Lv. {lead.level}</span></div>
          <div className="mini-hp"><i style={{ width: `${Math.max(0, lead.hp / lead.maxHp * 100)}%` }} /></div>
        </div>}
      </div>
      <div className="world-hud bottom-hud">
        <div className="quick-inventory">
          <span><PixelIcon kind="prism" size={19} /> {player.inventory.prisms}</span>
          <span><PixelIcon kind="tonic" size={19} /> {player.inventory.tonics}</span>
        </div>
        <div className="hud-actions">
          <button onClick={onMenu}><Menu size={18} /><span>Menu</span><kbd>X</kbd></button>
          <button className="interact-button" onClick={onInteract}><BookOpen size={18} /><span>Interact</span><kbd>Z</kbd></button>
        </div>
      </div>
      <span className="sr-only"><Backpack /> Inventory available from menu</span>
    </>
  )
}
