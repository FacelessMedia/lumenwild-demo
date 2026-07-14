import { SPECIES } from '../game/data'
import type { SpeciesId } from '../game/types'

interface CreatureArtProps {
  speciesId: SpeciesId
  size?: number
  facing?: 'left' | 'right'
  fainted?: boolean
  className?: string
}

function Eyes({ color }: { color: string }) {
  return <><rect x="38" y="27" width="5" height="7" fill={color} /><rect x="40" y="27" width="2" height="3" fill="#fff" /></>
}

export function CreatureArt({ speciesId, size = 180, facing = 'left', fainted = false, className = '' }: CreatureArtProps) {
  const [dark, main, accent, ink] = SPECIES[speciesId].colors
  const flip = facing === 'right' ? 'translate(64 0) scale(-1 1)' : undefined
  return (
    <svg
      aria-label={SPECIES[speciesId].name}
      className={`creature-art ${fainted ? 'is-fainted' : ''} ${className}`}
      height={size}
      role="img"
      shapeRendering="crispEdges"
      viewBox="0 0 64 64"
      width={size}
    >
      <g transform={flip}>
        {speciesId === 'mossling' && <>
          <rect x="14" y="30" width="38" height="20" fill={dark} /><rect x="18" y="26" width="30" height="20" fill={main} />
          <rect x="37" y="22" width="13" height="18" fill={main} /><rect x="45" y="28" width="9" height="12" fill={main} />
          <rect x="18" y="47" width="8" height="8" fill={ink} /><rect x="41" y="46" width="8" height="9" fill={ink} />
          <rect x="22" y="19" width="8" height="12" fill={accent} /><rect x="16" y="15" width="10" height="8" fill={main} /><rect x="29" y="12" width="9" height="12" fill={main} />
          <Eyes color={ink} /><rect x="51" y="36" width="4" height="3" fill={ink} />
        </>}
        {speciesId === 'cindlet' && <>
          <rect x="17" y="27" width="30" height="25" fill={main} /><rect x="34" y="20" width="17" height="24" fill={main} />
          <rect x="41" y="16" width="7" height="8" fill={dark} /><rect x="17" y="44" width="8" height="11" fill={ink} /><rect x="37" y="46" width="9" height="9" fill={ink} />
          <rect x="10" y="35" width="12" height="8" fill={dark} /><rect x="7" y="28" width="9" height="10" fill={accent} /><rect x="9" y="23" width="7" height="7" fill="#fff0a1" />
          <rect x="29" y="35" width="10" height="10" fill={accent} /><Eyes color={ink} /><rect x="50" y="35" width="5" height="3" fill={ink} />
        </>}
        {speciesId === 'rillip' && <>
          <rect x="13" y="31" width="39" height="18" fill={main} /><rect x="35" y="24" width="18" height="21" fill={main} />
          <rect x="14" y="45" width="9" height="8" fill={dark} /><rect x="39" y="45" width="9" height="8" fill={dark} />
          <rect x="30" y="20" width="8" height="18" fill={accent} /><rect x="48" y="18" width="6" height="17" fill={accent} />
          <rect x="9" y="28" width="9" height="8" fill={dark} /><rect x="6" y="24" width="7" height="7" fill={main} />
          <Eyes color={ink} /><rect x="50" y="38" width="5" height="3" fill={ink} /><rect x="25" y="34" width="8" height="5" fill="#dff4e5" />
        </>}
        {speciesId === 'bramblet' && <>
          <rect x="15" y="25" width="37" height="28" fill={dark} /><rect x="19" y="22" width="30" height="27" fill={main} />
          <rect x="13" y="34" width="10" height="9" fill={main} /><rect x="46" y="31" width="10" height="11" fill={main} />
          <rect x="21" y="49" width="8" height="7" fill={ink} /><rect x="40" y="48" width="8" height="8" fill={ink} />
          <rect x="22" y="15" width="8" height="12" fill={accent} /><rect x="31" y="11" width="8" height="14" fill={main} /><rect x="38" y="16" width="9" height="11" fill={accent} />
          <Eyes color={ink} /><rect x="49" y="38" width="5" height="3" fill={ink} />
        </>}
        {speciesId === 'mistrill' && <>
          <rect x="21" y="22" width="29" height="30" fill={main} /><rect x="37" y="17" width="15" height="21" fill={main} />
          <rect x="12" y="26" width="18" height="8" fill={accent} /><rect x="8" y="20" width="18" height="7" fill={main} /><rect x="13" y="35" width="18" height="7" fill={dark} />
          <rect x="25" y="49" width="5" height="7" fill={ink} /><rect x="39" y="49" width="5" height="7" fill={ink} />
          <rect x="50" y="28" width="8" height="5" fill={accent} /><rect x="38" y="13" width="6" height="8" fill={dark} />
          <Eyes color={ink} />
        </>}
        {speciesId === 'shardillo' && <>
          <rect x="10" y="25" width="44" height="29" fill={dark} /><rect x="16" y="22" width="34" height="28" fill={main} />
          <rect x="35" y="30" width="20" height="17" fill={accent} /><rect x="49" y="36" width="8" height="10" fill={accent} />
          <rect x="14" y="19" width="8" height="11" fill={accent} /><rect x="24" y="14" width="8" height="14" fill={accent} /><rect x="34" y="18" width="8" height="12" fill={accent} />
          <rect x="17" y="50" width="9" height="6" fill={ink} /><rect x="40" y="49" width="9" height="7" fill={ink} /><Eyes color={ink} />
        </>}
        {speciesId === 'noctuff' && <>
          <rect x="16" y="28" width="37" height="25" fill={dark} /><rect x="21" y="25" width="29" height="25" fill={main} />
          <rect x="35" y="22" width="18" height="22" fill={main} /><rect x="34" y="7" width="8" height="21" fill={dark} /><rect x="45" y="5" width="8" height="23" fill={dark} />
          <rect x="37" y="10" width="3" height="14" fill={accent} /><rect x="48" y="8" width="3" height="16" fill={accent} />
          <rect x="19" y="48" width="9" height="8" fill={ink} /><rect x="41" y="48" width="9" height="8" fill={ink} />
          <rect x="11" y="33" width="10" height="11" fill={accent} /><Eyes color={ink} /><rect x="51" y="36" width="5" height="3" fill={ink} />
        </>}
      </g>
    </svg>
  )
}
