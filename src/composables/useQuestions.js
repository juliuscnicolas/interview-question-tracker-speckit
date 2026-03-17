import { computed, ref } from 'vue'
import { useLocalStorage } from './useLocalStorage'
import { CATEGORIES } from '../constants/categories'

const STORAGE_KEY = 'interview-questions'

export function useQuestions() {
  const questions = useLocalStorage(STORAGE_KEY, [])
  const activeFilter = ref(null)
  const storageError = ref(null)

  const filteredQuestions = computed(() => {
    const sorted = [...questions.value].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
    if (!activeFilter.value) return sorted
    return sorted.filter((q) => q.category === activeFilter.value)
  })

  function addQuestion({ text, category, notes }) {
    const trimmedText = stripHtml(text).trim()
    const trimmedNotes = notes ? stripHtml(notes).trim() : ''

    if (!trimmedText) throw new Error('Question text is required.')
    if (!CATEGORIES.some((c) => c.value === category)) {
      throw new Error('A valid category must be selected.')
    }

    const question = {
      id: crypto.randomUUID(),
      text: trimmedText,
      category,
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

  function updateQuestion(id, { text, category, notes }) {
    const trimmedText = stripHtml(text).trim()
    const trimmedNotes = notes ? stripHtml(notes).trim() : ''

    if (!trimmedText) throw new Error('Question text is required.')
    if (!CATEGORIES.some((c) => c.value === category)) {
      throw new Error('A valid category must be selected.')
    }

    try {
      questions.value = questions.value.map((q) =>
        q.id === id
          ? { ...q, text: trimmedText, category, notes: trimmedNotes }
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
