import { Backpack, BookOpen, Clock3, Compass, HeartPulse, Home, Save, Sparkles, Users, X } from 'lucide-react'
import { useState } from 'react'
import { ELEMENT_LABELS, getXpToLevel, SPECIES } from '../game/data'
import type { PlayerState } from '../game/types'
import { CreatureArt } from './CreatureArt'
import { PixelIcon } from './PixelIcon'

interface GameMenuProps {
  player: PlayerState
  playSeconds: number
  onClose: () => void
  onSave: () => void
  onUseTonic: (index: number) => void
  onUseTea: () => void
  onTitle: () => void
}

type MenuTab = 'trail' | 'party' | 'pack' | 'journal'

const trailCopy = {
  'meet-warden': { title: 'A First Friend', body: 'Find Warden Sol near Fernhollow’s eastern path. He knows why the river beacon has gone dark.' },
  'cross-run': { title: 'Across Sunwash Run', body: 'The old gate will yield to a ranger’s glowmark. Open it and cross the bridge into the wild grass.' },
  'reach-beacon': { title: 'Light on the Rise', body: 'Scout Niko has tested your bond. Now climb north and touch the beacon at Skyglass Rise.' },
  complete: { title: 'A Brighter Valley', body: 'The beacon shines again. Fernhollow’s next chapter is waiting beyond this demo.' },
}

function formatPlayTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  return `${Math.floor(minutes / 60).toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}`
}

export function GameMenu({ player, playSeconds, onClose, onSave, onUseTonic, onUseTea, onTitle }: GameMenuProps) {
  const [tab, setTab] = useState<MenuTab>('trail')
  const discovered = [...player.party, ...player.archive]
  return (
    <div className="menu-backdrop">
      <section className="game-menu" aria-label="Ranger satchel menu">
        <header className="menu-header">
          <div><span className="section-kicker"><Compass size={14} /> Ranger folio</span><h2>Field satchel</h2></div>
          <div className="menu-time"><Clock3 size={16} /><span>Play time</span><strong>{formatPlayTime(playSeconds)}</strong></div>
          <button className="menu-close" onClick={onClose} aria-label="Close menu"><X /></button>
        </header>
        <nav className="menu-tabs" aria-label="Menu sections">
          <button className={tab === 'trail' ? 'active' : ''} onClick={() => setTab('trail')}><Compass />Trail</button>
          <button className={tab === 'party' ? 'active' : ''} onClick={() => setTab('party')}><Users />Friends <span>{player.party.length}</span></button>
          <button className={tab === 'pack' ? 'active' : ''} onClick={() => setTab('pack')}><Backpack />Pack</button>
          <button className={tab === 'journal' ? 'active' : ''} onClick={() => setTab('journal')}><BookOpen />Notes <span>{discovered.length}/7</span></button>
        </nav>
        <div className="menu-content">
          {tab === 'trail' && <div className="trail-pane">
            <div className="trail-map" aria-hidden="true">
              <span className="map-village">Fernhollow</span><i className="map-path path-one" /><span className="map-river">Sunwash Run</span><i className="map-path path-two" /><span className="map-beacon"><Sparkles /> Skyglass<br />Beacon</span>
              <span className={`map-marker quest-${player.quest}`}><i />YOU</span>
            </div>
            <article className="quest-detail"><span>Current trail</span><h3>{trailCopy[player.quest].title}</h3><p>{trailCopy[player.quest].body}</p><div className="quest-stats"><span><strong>{player.progress.captures}</strong> Befriended</span><span><strong>{player.progress.wins}</strong> Victories</span><span><strong>{player.steps}</strong> Steps</span></div></article>
          </div>}
          {tab === 'party' && <div className="party-pane">
            {player.party.length === 0 ? <div className="menu-empty"><Users /><h3>Your trail is quiet</h3><p>Warden Sol is waiting with a first wildling friend.</p></div> : <div className="party-list">{player.party.map((creature, index) => {
              const species = SPECIES[creature.speciesId]
              const hp = creature.hp / creature.maxHp * 100
              return <article className="party-card" key={creature.uid}>
                <CreatureArt speciesId={creature.speciesId} size={94} facing="left" />
                <div className="party-info"><span className={`element-tag element-${species.element}`}>{ELEMENT_LABELS[species.element]}</span><h3>{creature.nickname}</h3><p>Lv. {creature.level} · {species.epithet}</p><div className="party-health"><span>HP</span><i><b style={{ width: `${hp}%` }} /></i><strong>{creature.hp}/{creature.maxHp}</strong></div><div className="party-xp"><span>Next level</span><i><b style={{ width: `${creature.xp / getXpToLevel(creature.level) * 100}%` }} /></i></div></div>
                <button disabled={player.inventory.tonics <= 0 || creature.hp >= creature.maxHp} onClick={() => onUseTonic(index)}><HeartPulse size={17} /> Heal</button>
              </article>
            })}</div>}
          </div>}
          {tab === 'pack' && <div className="pack-pane">
            <article className="item-row"><PixelIcon kind="prism" size={42} /><div><h3>Kinship Prism <span>×{player.inventory.prisms}</span></h3><p>A warm glass charm that welcomes weakened wildlings.</p></div><span className="item-use-note">Battle item</span></article>
            <article className="item-row"><PixelIcon kind="tonic" size={42} /><div><h3>Bright Tonic <span>×{player.inventory.tonics}</span></h3><p>Restores one friend to full health. Choose them from Friends.</p></div><span className="item-use-note">Field item</span></article>
            <article className="item-row"><PixelIcon kind="leaf" size={42} /><div><h3>Bloom Tea <span>×{player.inventory.bloomTea}</span></h3><p>A fragrant village blend that restores the whole party.</p></div><button disabled={player.inventory.bloomTea <= 0 || player.party.every((creature) => creature.hp >= creature.maxHp)} onClick={onUseTea}>Use</button></article>
          </div>}
          {tab === 'journal' && <div className="journal-pane">
            <div className="journal-grid">{(Object.keys(SPECIES) as Array<keyof typeof SPECIES>).map((id) => {
              const known = discovered.some((creature) => creature.speciesId === id)
              const species = SPECIES[id]
              return <article className={known ? 'known' : 'unknown'} key={id}>{known ? <CreatureArt speciesId={id} size={80} /> : <span className="unknown-mark">?</span>}<div><span>{known ? ELEMENT_LABELS[species.element] : 'Undiscovered'}</span><h3>{known ? species.name : '??????'}</h3><p>{known ? species.description : 'A wildling you have yet to befriend.'}</p></div></article>
            })}</div>
          </div>}
        </div>
        <footer className="menu-footer"><button onClick={onSave}><Save size={17} /> Save journey</button><button onClick={onTitle}><Home size={17} /> Title screen</button><span>Progress is stored on this device</span></footer>
      </section>
    </div>
  )
}
