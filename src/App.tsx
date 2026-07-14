import { BattleScreen } from './components/BattleScreen'
import { BuildReceipt } from './components/BuildReceipt'
import { DialogueBox } from './components/DialogueBox'
import { EndingScreen } from './components/EndingScreen'
import { GameMenu } from './components/GameMenu'
import { Hud } from './components/Hud'
import { StarterSelect } from './components/StarterSelect'
import { TitleScreen } from './components/TitleScreen'
import { TouchControls } from './components/TouchControls'
import { WorldCanvas } from './components/WorldCanvas'
import { useGame } from './game/useGame'

export function App() {
  const game = useGame()

  if (game.receiptOpen) {
    return <BuildReceipt onClose={() => game.setReceiptOpen(false)} />
  }

  if (game.mode === 'title') {
    return (
      <TitleScreen
        hasSave={game.saveAvailable}
        onContinue={game.continueGame}
        onNewGame={game.beginNewGame}
        onShowReceipt={() => game.setReceiptOpen(true)}
      />
    )
  }

  if (game.mode === 'ending') {
    return (
      <EndingScreen
        player={game.player}
        playSeconds={game.playSeconds}
        onContinue={() => game.setMode('world')}
        onReceipt={() => game.setReceiptOpen(true)}
        onTitle={game.returnToTitle}
      />
    )
  }

  if (game.mode === 'battle' && game.battle && game.activeCreature) {
    return (
      <BattleScreen
        activeCreature={game.activeCreature}
        battle={game.battle}
        prisms={game.player.inventory.prisms}
        tonics={game.player.inventory.tonics}
        onAttack={game.attack}
        onCapture={game.capture}
        onRun={game.runFromBattle}
        onTonic={game.useBattleTonic}
      />
    )
  }

  return (
    <main className="world-screen">
      <div className="game-shell">
        <WorldCanvas player={game.player} />
        <div className="screen-shade" aria-hidden="true" />
        <Hud
          player={game.player}
          onInteract={game.interact}
          onMenu={() => game.setMenuOpen(true)}
        />
        {game.dialogue && <DialogueBox dialogue={game.dialogue} onAdvance={game.advanceDialogue} />}
        {game.toast && <div className="game-toast" role="status">{game.toast}</div>}
      </div>
      <TouchControls
        onInteract={game.interact}
        onMenu={() => game.setMenuOpen(true)}
        onMove={game.move}
      />
      <div className="desktop-controls" aria-hidden="true">
        <span><kbd>WASD</kbd> or <kbd>ARROWS</kbd> Move</span>
        <span><kbd>Z</kbd> Interact</span>
        <span><kbd>X</kbd> Menu</span>
      </div>
      {game.starterOpen && <StarterSelect onChoose={game.chooseStarter} onClose={() => game.setStarterOpen(false)} />}
      {game.menuOpen && (
        <GameMenu
          player={game.player}
          playSeconds={game.playSeconds}
          onClose={() => game.setMenuOpen(false)}
          onSave={game.persist}
          onTitle={game.returnToTitle}
          onUseTea={game.useTea}
          onUseTonic={game.useFieldTonic}
        />
      )}
    </main>
  )
}
