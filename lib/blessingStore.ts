import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const blessingsData = require('../blessings.json')
import type { Relationship, Style, Length } from './types.js'

export type MatchLevel = 'exact' | 'relaxed' | 'cross-rel'

interface BlessingEntry {
  text: string
  char_count: number
  source: string
}

interface GetBlessingsResult {
  entries: BlessingEntry[]
  matchLevel: MatchLevel
}

// Static import ensures blessings.json is bundled by Vercel's esbuild
const blessings: Record<string, Record<string, Record<string, BlessingEntry[]>>> =
  blessingsData && typeof blessingsData === 'object' && 'blessings' in blessingsData
    ? (blessingsData as { blessings: Record<string, Record<string, Record<string, BlessingEntry[]>>> }).blessings
    : {}

function getEntries(rel: string, style: string, length: string): BlessingEntry[] {
  return blessings[rel]?.[style]?.[length] ?? []
}

// Map new style IDs to JSON data keys
const STYLE_TO_JSON: Record<Style, string[]> = {
  normal: ['casual', 'brief'],
  literary: ['literary', 'formal'],
  abstract: ['funny'],
}

const ALL_JSON_STYLES = ['formal', 'casual', 'funny', 'literary', 'brief']

/**
 * 4-level fallback search for matching blessings
 */
export function getBlessings(
  rel: Relationship,
  style: Style,
  length: Length,
): GetBlessingsResult {
  const jsonStyles = STYLE_TO_JSON[style]

  // Level 1: exact match
  const exact: BlessingEntry[] = []
  for (const s of jsonStyles) {
    exact.push(...getEntries(rel, s, length))
  }
  if (exact.length > 0) {
    return { entries: exact, matchLevel: 'exact' }
  }

  // Level 2: relax length
  const lengths: Length[] = ['short', 'medium', 'long']
  const relaxedLength: BlessingEntry[] = []
  for (const s of jsonStyles) {
    for (const l of lengths) {
      relaxedLength.push(...getEntries(rel, s, l))
    }
  }
  if (relaxedLength.length > 0) {
    return { entries: relaxedLength, matchLevel: 'relaxed' }
  }

  // Level 3: relax style
  const relaxedStyle: BlessingEntry[] = []
  for (const s of ALL_JSON_STYLES) {
    for (const l of lengths) {
      relaxedStyle.push(...getEntries(rel, s, l))
    }
  }
  if (relaxedStyle.length > 0) {
    return { entries: relaxedStyle, matchLevel: 'relaxed' }
  }

  // Level 4: cross-relationship
  const rels: Relationship[] = ['elder', 'colleague', 'leader', 'friend', 'partner', 'customer']
  const crossRel: BlessingEntry[] = []
  for (const r of rels) {
    if (r === rel) continue
    for (const s of jsonStyles) {
      for (const l of lengths) {
        crossRel.push(...getEntries(r, s, l))
      }
    }
  }
  if (crossRel.length > 0) {
    return { entries: crossRel, matchLevel: 'cross-rel' }
  }

  return { entries: [], matchLevel: 'cross-rel' }
}

/**
 * Fisher-Yates partial shuffle to pick `count` random items
 */
export function pickRandom(
  entries: BlessingEntry[],
  count: number,
  excludeSet?: Set<string>,
): BlessingEntry[] {
  let pool = excludeSet
    ? entries.filter((e) => !excludeSet.has(e.text))
    : [...entries]

  if (pool.length === 0) {
    pool = [...entries]
  }

  const result: BlessingEntry[] = []
  const n = Math.min(count, pool.length)

  for (let i = pool.length - 1; i >= pool.length - n; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
    result.push(pool[i])
  }

  return result
}
