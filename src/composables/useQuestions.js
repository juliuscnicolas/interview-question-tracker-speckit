import { computed, ref } from 'vue'
import { useLocalStorage } from './useLocalStorage'
import { CATEGORIES } from '../constants/categories'

const STORAGE_KEY = 'interview-questions'

function normalizeQuestion(q) {
  if (Array.isArray(q.categories)) return q
  if (typeof q.category === 'string') {
    const { category, ...rest } = q
    return { ...rest, categories: [category] }
  }
  return { ...q, categories: [] }
}

export function useQuestions() {
  const questions = useLocalStorage(STORAGE_KEY, [])
  const activeFilter = ref(null)
  const storageError = ref(null)

  // Normalize legacy single-category data on read
  const raw = questions.value
  if (raw.length > 0 && raw.some((q) => !Array.isArray(q.categories))) {
    questions.value = raw.map(normalizeQuestion)
  }

  const filteredQuestions = computed(() => {
    const sorted = [...questions.value].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
    if (!activeFilter.value) return sorted
    return sorted.filter((q) => q.categories.includes(activeFilter.value))
  })

  function addQuestion({ text, categories, notes }) {
    const trimmedText = stripHtml(text).trim()
    const trimmedNotes = notes ? stripHtml(notes).trim() : ''

    if (!trimmedText) throw new Error('Question text is required.')
    if (!Array.isArray(categories) || categories.length === 0) {
      throw new Error('At least one category must be selected.')
    }
    if (!categories.every((cat) => CATEGORIES.some((c) => c.value === cat))) {
      throw new Error('All categories must be valid.')
    }

    const question = {
      id: crypto.randomUUID(),
      text: trimmedText,
      categories: [...categories],
      notes: trimmedNotes,
      createdAt: new Date().toISOString(),
    }

    try {
      questions.value = [...questions.value, question]
      storageError.value = null
    } catch (e) {
      storageError.value = e.message
      throw e
    }
  }

  function updateQuestion(id, { text, categories, notes }) {
    const trimmedText = stripHtml(text).trim()
    const trimmedNotes = notes ? stripHtml(notes).trim() : ''

    if (!trimmedText) throw new Error('Question text is required.')
    if (!Array.isArray(categories) || categories.length === 0) {
      throw new Error('At least one category must be selected.')
    }
    if (!categories.every((cat) => CATEGORIES.some((c) => c.value === cat))) {
      throw new Error('All categories must be valid.')
    }

    try {
      questions.value = questions.value.map((q) =>
        q.id === id
          ? { ...q, text: trimmedText, categories: [...categories], notes: trimmedNotes }
          : q
      )
      storageError.value = null
    } catch (e) {
      storageError.value = e.message
      throw e
    }
  }

  function deleteQuestion(id) {
    try {
      questions.value = questions.value.filter((q) => q.id !== id)
      storageError.value = null
    } catch (e) {
      storageError.value = e.message
      throw e
    }
  }

  function setFilter(category) {
    activeFilter.value = category || null
  }

  return {
    questions,
    filteredQuestions,
    activeFilter,
    storageError,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    setFilter,
  }
}

function stripHtml(str) {
  const div = document.createElement('div')
  div.innerHTML = str
  return div.textContent || div.innerText || ''
}
