import type { PhilosophyCard } from '@/lib/types'

export default function Philosophy({ cards }: { cards: PhilosophyCard[] }) {
  return (
    <section className="philosophy" id="philosophy">
      <div className="philosophy__inner">
        <p className="section-label">Our Philosophy</p>
        <h2 className="philosophy__heading">Principles That Guide Every Decision</h2>
        <div className="philosophy__grid">
          {cards.map((card) => (
            <div key={card._id} className="philosophy-card">
              <span className="philosophy-card__number">{card.number}</span>
              <h3 className="philosophy-card__title">{card.title}</h3>
              <p className="philosophy-card__body">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
