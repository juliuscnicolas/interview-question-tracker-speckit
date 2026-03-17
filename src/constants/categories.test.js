import { describe, it, expect } from 'vitest'
import { CATEGORIES, getCategoryBadgeClass } from './categories'

describe('CATEGORIES', () => {
  it('contains exactly 6 categories', () => {
    expect(CATEGORIES).toHaveLength(6)
  })

  it('has the correct category values', () => {
    const values = CATEGORIES.map((c) => c.value)
    expect(values).toEqual(['Frontend', 'Backend', 'Vue', 'React', '.NET', 'Others'])
  })

  it('each category has value, label, and badgeClass', () => {
    for (const cat of CATEGORIES) {
      expect(cat).toHaveProperty('value')
      expect(cat).toHaveProperty('label')
      expect(cat).toHaveProperty('badgeClass')
      expect(typeof cat.badgeClass).toBe('string')
    }
  })
})

describe('getCategoryBadgeClass', () => {
  it('returns correct badge class for known category', () => {
    expect(getCategoryBadgeClass('Frontend')).toBe('bg-blue-100 text-blue-800')
    expect(getCategoryBadgeClass('Vue')).toBe('bg-emerald-100 text-emerald-800')
  })

  it('returns fallback for unknown category', () => {
    expect(getCategoryBadgeClass('Unknown')).toBe('bg-gray-100 text-gray-800')
  })
})
