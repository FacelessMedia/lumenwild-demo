import { ArrowRight, Clock3, RotateCcw, Sparkles, Trophy } from 'lucide-react'
import type { PlayerState } from '../game/types'
import { CreatureArt } from './CreatureArt'

interface EndingScreenProps {
  player: PlayerState
  playSeconds: number
  onContinue: () => void
  onReceipt: () => void
  onTitle: () => void
}

function getTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

export function EndingScreen({ player, playSeconds, onContinue, onReceipt, onTitle }: EndingScreenProps) {
  const lead = player.party[0]
  return (
    <main className="ending-screen">
      <div className="ending-rays" aria-hidden="true" />
      <section className="ending-card">
        <span className="ending-icon"><Trophy /></span>
        <span className="section-kicker"><Sparkles size={14} /> Demo complete</span>
        <h1>The valley remembers<br />your light.</h1>
        <p>Skyglass Beacon shines again. Wherever the trail bends next, you won’t walk it alone.</p>
        {lead && <div className="ending-friend"><CreatureArt speciesId={lead.speciesId} size={150} facing="left" /><span>You and <strong>{lead.nickname}</strong><br />made a fine beginning.</span></div>}
        <div className="ending-stats">
          <span><strong>{player.steps}</strong>Steps walked</span><span><strong>{player.progress.captures}</strong>Wildlings found</span><span><strong>{player.progress.wins}</strong>Battles won</span><span><strong>{getTime(playSeconds)}</strong>Play time</span>
        </div>
        <div className="ending-actions"><button className="primary-button" onClick={onReceipt}>See how it was built <Clock3 size={18} /></button><button className="secondary-button" onClick={onContinue}>Keep exploring <ArrowRight size={18} /></button></div>
        <button className="ending-title-link" onClick={onTitle}><RotateCcw size={14} /> Return to title</button>
      </section>
    </main>
  )
}
