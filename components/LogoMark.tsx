type LogoMarkProps = {
  circleSize?: number   // diameter in px
  color?: string
  showName?: boolean
  className?: string
}

export default function LogoMark({
  circleSize = 160,
  color = '#0a0a0a',
  showName = true,
  className = '',
}: LogoMarkProps) {
  const jknSize   = circleSize * 0.36
  const nameSize  = Math.max(7, circleSize * 0.065)
  const gap       = circleSize * 0.12

  return (
    <div className={`logo-mark ${className}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap }}>
      <div style={{ overflow: 'hidden' }}>
        <div style={{
          width:        circleSize,
          height:       circleSize,
          borderRadius: '50%',
          border:       `0.75px solid ${color}`,
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          flexShrink:   0,
          animation:    'slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both',
        }}>
          <span style={{ display: 'flex', alignItems: 'flex-start', userSelect: 'none' }}>
            <span style={{
              fontFamily:    "'Playfair Display', serif",
              fontWeight:    500,
              fontSize:      jknSize,
              color,
              letterSpacing: '0.02em',
              lineHeight:    1,
            }}>
              JKN
            </span>
            <span style={{
              fontFamily:    "'Montserrat', sans-serif",
              fontWeight:    400,
              fontSize:      jknSize * 0.32,
              color,
              letterSpacing: '0.04em',
              lineHeight:    1,
              marginTop:     jknSize * 0.08,
            }}>
              MD
            </span>
          </span>
        </div>
      </div>

      {showName && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: nameSize * 0.55 }}>
          <div style={{ overflow: 'hidden' }}>
            <span style={{
              fontFamily:    "'Montserrat', sans-serif",
              fontWeight:    400,
              fontSize:      nameSize,
              letterSpacing: '0.34em',
              textTransform: 'uppercase',
              color,
              whiteSpace:    'nowrap',
              display:       'block',
              animation:     'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.0s both',
            }}>
              Dr. John K. Nia, MD
            </span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <span style={{
              fontFamily:    "'Montserrat', sans-serif",
              fontWeight:    300,
              fontSize:      nameSize * 0.78,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color,
              opacity:       0.55,
              whiteSpace:    'nowrap',
              display:       'block',
              animation:     'slideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both',
            }}>
              Cosmetic Surgery
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
