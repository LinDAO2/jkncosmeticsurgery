const STATS = [
  { stat: '7,000+', label: 'Skin Cancer Reconstructions' },
  { stat: 'NYC', label: 'Fellowship-Trained' },
]

export default function CredentialsStrip() {
  return (
    <div className="cred-strip">
      {STATS.map((item, i) => (
        <div key={i} className="cred-item">
          <span className="cred-stat">{item.stat}</span>
          <span className="cred-label">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
