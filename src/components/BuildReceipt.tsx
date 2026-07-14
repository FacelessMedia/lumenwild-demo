import { ArrowLeft, CheckCircle2, Clock3, Coins, ExternalLink, Gauge, ShieldCheck } from 'lucide-react'
import { BUILD_INFO } from '../buildInfo'

interface BuildReceiptProps {
  onClose: () => void
}

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m ${seconds % 60}s`
}

export function BuildReceipt({ onClose }: BuildReceiptProps) {
  return (
    <div className="receipt-screen">
      <div className="receipt-orb receipt-orb-one" /><div className="receipt-orb receipt-orb-two" />
      <section className="receipt-sheet">
        <button className="receipt-back" onClick={onClose}><ArrowLeft size={18} /> Back to game</button>
        <span className="receipt-overline">Build receipt / 001</span>
        <h2>Alex, I built this using <em>{BUILD_INFO.platform}</em>.</h2>
        <p className="receipt-lead">A from-scratch, original-IP browser adventure designed, implemented, tested, and prepared for deployment in one measured run.</p>
        <div className="receipt-metrics">
          <article><Clock3 /><span>Elapsed build time</span><strong>{formatTime(BUILD_INFO.elapsedSeconds)}</strong></article>
          <article><Coins /><span>Verified usage cost</span><strong>{BUILD_INFO.measuredCostUsd === null ? 'Awaiting telemetry' : `$${BUILD_INFO.measuredCostUsd.toFixed(2)}`}</strong></article>
          <article><Gauge /><span>Weekly plan ceiling</span><strong>${BUILD_INFO.weeklyBudgetUsd.toFixed(2)}</strong></article>
        </div>
        <div className="receipt-detail-grid">
          <div>
            <h3>What shipped</h3>
            <ul>
              <li><CheckCircle2 /> Tile-based explorable world</li>
              <li><CheckCircle2 /> Seven original creatures</li>
              <li><CheckCircle2 /> Turn-based battles and capture</li>
              <li><CheckCircle2 /> Quest, inventory, dialogue, and saves</li>
              <li><CheckCircle2 /> Keyboard and touch controls</li>
            </ul>
          </div>
          <div className="integrity-card">
            <ShieldCheck size={25} />
            <h3>Cost integrity</h3>
            <p>{BUILD_INFO.costMethod}</p>
            <span>No guessed token count. No fabricated dollar figure.</span>
          </div>
        </div>
        <footer>
          <span>Project: {BUILD_INFO.project}</span>
          <span>Scope: {BUILD_INFO.scope}</span>
          <a href="https://devin.ai" target="_blank" rel="noreferrer">Built with Devin <ExternalLink size={13} /></a>
        </footer>
      </section>
    </div>
  )
}
