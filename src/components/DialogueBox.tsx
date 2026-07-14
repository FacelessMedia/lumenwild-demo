import { ChevronDown } from 'lucide-react'
import type { DialogueState } from '../game/types'

interface DialogueBoxProps {
  dialogue: DialogueState
  onAdvance: () => void
}

export function DialogueBox({ dialogue, onAdvance }: DialogueBoxProps) {
  return (
    <button className="dialogue-box" onClick={onAdvance} aria-label="Continue dialogue">
      <span className="dialogue-speaker">{dialogue.speaker}</span>
      <span className="dialogue-line">{dialogue.lines[dialogue.index]}</span>
      <span className="dialogue-prompt"><span>Continue</span><ChevronDown size={18} /></span>
    </button>
  )
}
