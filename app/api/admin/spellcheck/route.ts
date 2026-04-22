import { NextResponse } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const nspell = require('nspell')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const dictionary = require('dictionary-en')

let spell: { correct: (w: string) => boolean; suggest: (w: string) => string[] } | null = null

function loadDictionary(): Promise<typeof spell> {
  return new Promise((resolve, reject) => {
    if (spell) return resolve(spell)
    dictionary((err: Error | null, dict: { aff: Buffer; dic: Buffer }) => {
      if (err) return reject(err)
      spell = nspell(dict)
      resolve(spell)
    })
  })
}

export async function POST(req: Request) {
  const { text } = await req.json()
  if (!text?.trim()) return NextResponse.json({ misspelled: [] })

  const checker = await loadDictionary()
  if (!checker) return NextResponse.json({ misspelled: [] })

  const words = text.match(/[a-zA-Z']+/g) ?? []
  const seen = new Set<string>()
  const misspelled: { word: string; suggestions: string[] }[] = []

  for (const word of words) {
    const clean = word.replace(/^'+|'+$/g, '')
    if (!clean || seen.has(clean.toLowerCase())) continue
    seen.add(clean.toLowerCase())
    if (!checker.correct(clean)) {
      misspelled.push({ word: clean, suggestions: checker.suggest(clean).slice(0, 3) })
    }
  }

  return NextResponse.json({ misspelled })
}
