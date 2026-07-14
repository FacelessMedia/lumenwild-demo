import { ArrowRight, Clock3, Gamepad2, Leaf, ShieldCheck, Sparkles } from 'lucide-react'
import { CreatureArt } from './CreatureArt'

interface TitleScreenProps {
  hasSave: boolean
  onContinue: () => void
  onNewGame: () => void
  onShowReceipt: () => void
}

export function TitleScreen({ hasSave, onContinue, onNewGame, onShowReceipt }: TitleScreenProps) {
  return (
    <main className="title-screen">
      <div className="title-sky" aria-hidden="true">
        <span className="cloud cloud-one" /><span className="cloud cloud-two" />
        <span className="sun-disc" /><span className="distant-hill hill-one" /><span className="distant-hill hill-two" />
      </div>
      <section className="title-copy">
        <div className="eyebrow"><Leaf size={15} /> An original pocket-sized adventure</div>
        <h1 className="game-logo"><span>Lumen</span>wild</h1>
        <p className="title-tagline">Small wonders. Wide world.</p>
        <p className="title-intro">Alex, I built this using Devin. Step into Fernhollow, befriend a wildling, and relight the beacon beyond the river.</p>
        <div className="title-actions">
          {hasSave && <button className="primary-button" onClick={onContinue}>Continue adventure <ArrowRight size={18} /></button>}
          <button className={hasSave ? 'secondary-button' : 'primary-button'} onClick={onNewGame}>{hasSave ? 'New journey' : 'Begin journey'} <Gamepad2 size={18} /></button>
        </div>
        <button className="receipt-link" onClick={onShowReceipt}><Clock3 size={15} /> View build receipt & cost</button>
        <div className="title-features" aria-label="Game features">
          <span><Sparkles size={15} /> 7 original wildlings</span>
          <span><ShieldCheck size={15} /> No borrowed assets</span>
        </div>
      </section>
      <div className="title-creatures" aria-hidden="true">
        <CreatureArt className="hero-creature creature-left" speciesId="mossling" size={214} facing="right" />
        <CreatureArt className="hero-creature creature-center" speciesId="noctuff" size={276} facing="left" />
        <CreatureArt className="hero-creature creature-right" speciesId="cindlet" size={190} facing="left" />
      </div>
      <div className="title-grass" aria-hidden="true" />
      <footer className="title-footer">Keyboard + touch controls <span>•</span> Saves locally in your browser</footer>
    </main>
  )
}
