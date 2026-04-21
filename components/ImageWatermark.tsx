export default function ImageWatermark() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        bottom: 12,
        left: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        pointerEvents: 'none',
        zIndex: 3,
      }}
    >
      <span
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.85)',
          letterSpacing: '0.04em',
          lineHeight: 1.2,
          userSelect: 'none',
          textShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}
      >
        NIA, MD
      </span>
    </div>
  )
}
