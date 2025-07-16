const VerbsLogo = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-terminal-success"
    >
      {/* ASCII art V pattern using rectangular blocks */}
      <g fill="currentColor">
        {/* Top row - two separate blocks */}
        <rect x="8" y="8" width="12" height="6" />
        <rect x="60" y="8" width="12" height="6" />

        {/* Second row - slightly closer */}
        <rect x="12" y="18" width="12" height="6" />
        <rect x="56" y="18" width="12" height="6" />

        {/* Third row - getting closer */}
        <rect x="16" y="28" width="12" height="6" />
        <rect x="52" y="28" width="12" height="6" />

        {/* Fourth row - closer still */}
        <rect x="20" y="38" width="12" height="6" />
        <rect x="48" y="38" width="12" height="6" />

        {/* Fifth row - almost touching */}
        <rect x="24" y="48" width="12" height="6" />
        <rect x="44" y="48" width="12" height="6" />

        {/* Sixth row - connected at bottom */}
        <rect x="28" y="58" width="24" height="6" />

        {/* Bottom point */}
        <rect x="36" y="68" width="8" height="6" />
      </g>
    </svg>
  )
}

export default VerbsLogo
