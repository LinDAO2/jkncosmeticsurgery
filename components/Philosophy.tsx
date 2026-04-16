import type { PhilosophyCard } from '@/lib/types'

const DEFAULTS: PhilosophyCard[] = [
  { _id: '1', number: '01', title: 'Structural Refinement', body: "Dr. Nia's philosophy moves beyond temporary fixes, focusing on the deep structural architecture of the face. Each procedure addresses the underlying anatomy — restoring volume, position, and proportion where time has displaced them." },
  { _id: '2', number: '02', title: 'Natural Identity', body: "Results are intentionally understated. Dr. Nia's patients look rested, refreshed, and authentically themselves — never altered. The goal is always to enhance what is uniquely yours, not to impose a standard of beauty onto it." },
  { _id: '3', number: '03', title: 'Longevity of Result', body: 'Dr. Nia has studied alongside leading plastic and oculoplastic surgeons worldwide, committing to continual refinement. Every technique is chosen for its long-term integrity — results designed to age beautifully, not to be revisited.' },
]

export default function Philosophy({ cards }: { cards: PhilosophyCard[] }) {
  const items = cards?.length ? cards : DEFAULTS
  return (
    <section className="philosophy">
      {items.map((card) => (
        <div key={card._id} className="phil-card">
          <span className="phil-num">{card.number}</span>
          <span className="phil-title">{card.title}</span>
          <p className="phil-body">{card.body}</p>
        </div>
      ))}
    </section>
  )
}
