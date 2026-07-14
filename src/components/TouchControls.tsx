import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, MessageCircle, Menu } from 'lucide-react'
import type { Direction } from '../game/types'

interface TouchControlsProps {
  onMove: (direction: Direction) => void
  onInteract: () => void
  onMenu: () => void
}

export function TouchControls({ onMove, onInteract, onMenu }: TouchControlsProps) {
  return (
    <div className="touch-controls" aria-label="Touch controls">
      <div className="dpad">
        <button className="dpad-up" onClick={() => onMove('up')} aria-label="Move up"><ChevronUp /></button>
        <button className="dpad-left" onClick={() => onMove('left')} aria-label="Move left"><ChevronLeft /></button>
        <span className="dpad-center" />
        <button className="dpad-right" onClick={() => onMove('right')} aria-label="Move right"><ChevronRight /></button>
        <button className="dpad-down" onClick={() => onMove('down')} aria-label="Move down"><ChevronDown /></button>
      </div>
      <div className="touch-actions">
        <button className="touch-menu" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
        <button className="touch-a" onClick={onInteract} aria-label="Interact"><MessageCircle size={22} /><span>A</span></button>
      </div>
    </div>
  )
}
