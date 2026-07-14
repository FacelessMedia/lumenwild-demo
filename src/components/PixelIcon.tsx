interface PixelIconProps {
  kind: 'prism' | 'tonic' | 'leaf' | 'spark'
  size?: number
}

export function PixelIcon({ kind, size = 24 }: PixelIconProps) {
  return (
    <svg aria-hidden="true" height={size} shapeRendering="crispEdges" viewBox="0 0 24 24" width={size}>
      {kind === 'prism' && <><path d="M8 2h8v3h3v5h3v4h-3v5h-3v3H8v-3H5v-5H2v-4h3V5h3z" fill="#f5cf64" /><path d="M8 6h8v4h4v4h-4v4H8v-4H4v-4h4z" fill="#f7f1d0" /><path d="M10 9h4v6h-4z" fill="#5c7896" /></>}
      {kind === 'tonic' && <><path d="M8 2h8v5h3v14H5V7h3z" fill="#e9e1c4" /><path d="M8 10h8v8H8z" fill="#d95b66" /><path d="M10 3h4v5h-4z" fill="#5c7896" /></>}
      {kind === 'leaf' && <><path d="M4 13C4 5 11 2 20 3c1 9-3 16-11 16H5v-4z" fill="#78b84f" /><path d="M5 19L18 6" stroke="#33563a" strokeWidth="2" /></>}
      {kind === 'spark' && <><path d="M10 1h5l-2 7h6l-10 15 2-10H5z" fill="#f5cf64" /></>}
    </svg>
  )
}
