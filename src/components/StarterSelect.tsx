import { ArrowLeft, Check, Sparkles } from 'lucide-react'
import { ELEMENT_LABELS, SPECIES, STARTER_IDS } from '../game/data'
import type { SpeciesId } from '../game/types'
import { CreatureArt } from './CreatureArt'

interface StarterSelectProps {
  onChoose: (speciesId: SpeciesId) => void
  onClose: () => void
}

export function StarterSelect({ onChoose, onClose }: StarterSelectProps) {
  return (
    <div className="modal-backdrop starter-backdrop">
      <section className="starter-panel" aria-labelledby="starter-title">
        <button className="icon-button starter-back" onClick={onClose} aria-label="Go back"><ArrowLeft size={20} /></button>
        <div className="section-kicker"><Sparkles size={15} /> A first friend</div>
        <h2 id="starter-title">Who answers your call?</h2>
        <p>Every great ranger begins with trust. Choose the wildling whose spark feels like yours.</p>
        <div className="starter-grid">
          {STARTER_IDS.map((id) => {
            const species = SPECIES[id]
            return (
              <button className={`starter-card element-${species.element}`} key={id} onClick={() => onChoose(id)}>
                <span className="element-pill">{ELEMENT_LABELS[species.element]}</span>
                <CreatureArt speciesId={id} size={150} />
                <span className="starter-name">{species.name}</span>
                <span className="starter-epithet">The {species.epithet}</span>
                <span className="starter-description">{species.description}</span>
                <span className="choose-label">Choose {species.name} <Check size={16} /></span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
