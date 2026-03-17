import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useLocalStorage } from './useLocalStorage'

beforeEach(() => {
  localStorage.clear()
})

describe('useLocalStorage', () => {
  it('returns default value when key does not exist', () => {
    const data = useLocalStorage('test-key', [])
    expect(data.value).toEqual([])
  })

  it('loads existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify([1, 2, 3]))
    const data = useLocalStorage('test-key', [])
    expect(data.value).toEqual([1, 2, 3])
  })

  it('persists changes to localStorage on mutation', async () => {
    const data = useLocalStorage('test-key', [])
    data.value = ['hello']
    await nextTick()
    expect(JSON.parse(localStorage.getItem('test-key'))).toEqual(['hello'])
  })

  it('handles corrupted JSON gracefully', () => {
    localStorage.setItem('test-key', 'not-json{{{')
    const data = useLocalStorage('test-key', 'fallback')
    expect(data.value).toBe('fallback')
  })

  it('works with object values', async () => {
    const data = useLocalStorage('test-obj', { count: 0 })
    data.value = { count: 5 }
    await nextTick()
    expect(JSON.parse(localStorage.getItem('test-obj'))).toEqual({ count: 5 })
  })
})
