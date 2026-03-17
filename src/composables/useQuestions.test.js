import { describe, it, expect, beforeEach } from 'vitest'
import { useQuestions } from './useQuestions'

beforeEach(() => {
  localStorage.clear()
})

describe('useQuestions', () => {
  describe('addQuestion', () => {
    it('adds a question with text, category, and notes', () => {
      const { questions, addQuestion } = useQuestions()
      addQuestion({ text: 'What is Vue?', category: 'Vue', notes: 'A framework' })
      expect(questions.value).toHaveLength(1)
      expect(questions.value[0].text).toBe('What is Vue?')
      expect(questions.value[0].category).toBe('Vue')
      expect(questions.value[0].notes).toBe('A framework')
      expect(questions.value[0].id).toBeTruthy()
      expect(questions.value[0].createdAt).toBeTruthy()
    })

    it('trims whitespace from text and notes', () => {
      const { questions, addQuestion } = useQuestions()
      addQuestion({ text: '  spaced  ', category: 'Frontend', notes: '  note  ' })
      expect(questions.value[0].text).toBe('spaced')
      expect(questions.value[0].notes).toBe('note')
    })

    it('throws when text is empty', () => {
      const { addQuestion } = useQuestions()
      expect(() => addQuestion({ text: '', category: 'Frontend', notes: '' }))
        .toThrow('Question text is required.')
    })

    it('throws when text is only whitespace', () => {
      const { addQuestion } = useQuestions()
      expect(() => addQuestion({ text: '   ', category: 'Frontend', notes: '' }))
        .toThrow('Question text is required.')
    })

    it('throws for invalid category', () => {
      const { addQuestion } = useQuestions()
      expect(() => addQuestion({ text: 'Test', category: 'Invalid', notes: '' }))
        .toThrow('A valid category must be selected.')
    })

    it('handles empty notes as empty string', () => {
      const { questions, addQuestion } = useQuestions()
      addQuestion({ text: 'Q1', category: 'Backend', notes: '' })
      expect(questions.value[0].notes).toBe('')
    })

    it('handles null notes', () => {
      const { questions, addQuestion } = useQuestions()
      addQuestion({ text: 'Q1', category: 'Backend', notes: null })
      expect(questions.value[0].notes).toBe('')
    })
  })

  describe('updateQuestion', () => {
    it('updates text, category, and notes', () => {
      const { questions, addQuestion, updateQuestion } = useQuestions()
      addQuestion({ text: 'Original', category: 'Frontend', notes: '' })
      const id = questions.value[0].id

      updateQuestion(id, { text: 'Updated', category: 'Backend', notes: 'New note' })
      expect(questions.value[0].text).toBe('Updated')
      expect(questions.value[0].category).toBe('Backend')
      expect(questions.value[0].notes).toBe('New note')
    })

    it('preserves id and createdAt on update', () => {
      const { questions, addQuestion, updateQuestion } = useQuestions()
      addQuestion({ text: 'Original', category: 'Frontend', notes: '' })
      const { id, createdAt } = questions.value[0]

      updateQuestion(id, { text: 'Updated', category: 'Backend', notes: '' })
      expect(questions.value[0].id).toBe(id)
      expect(questions.value[0].createdAt).toBe(createdAt)
    })

    it('throws when updated text is empty', () => {
      const { questions, addQuestion, updateQuestion } = useQuestions()
      addQuestion({ text: 'Original', category: 'Frontend', notes: '' })
      const id = questions.value[0].id

      expect(() => updateQuestion(id, { text: '', category: 'Frontend', notes: '' }))
        .toThrow('Question text is required.')
    })

    it('throws for invalid category on update', () => {
      const { questions, addQuestion, updateQuestion } = useQuestions()
      addQuestion({ text: 'Original', category: 'Frontend', notes: '' })
      const id = questions.value[0].id

      expect(() => updateQuestion(id, { text: 'Updated', category: 'BadCat', notes: '' }))
        .toThrow('A valid category must be selected.')
    })
  })

  describe('deleteQuestion', () => {
    it('removes the question by id', () => {
      const { questions, addQuestion, deleteQuestion } = useQuestions()
      addQuestion({ text: 'Q1', category: 'Frontend', notes: '' })
      addQuestion({ text: 'Q2', category: 'Backend', notes: '' })
      const id = questions.value[0].id

      deleteQuestion(id)
      expect(questions.value).toHaveLength(1)
      expect(questions.value[0].text).toBe('Q2')
    })

    it('does nothing for non-existent id', () => {
      const { questions, addQuestion, deleteQuestion } = useQuestions()
      addQuestion({ text: 'Q1', category: 'Frontend', notes: '' })
      deleteQuestion('non-existent-id')
      expect(questions.value).toHaveLength(1)
    })
  })

  describe('filteredQuestions', () => {
    it('returns all questions sorted newest-first when no filter', () => {
      const { filteredQuestions, addQuestion } = useQuestions()
      addQuestion({ text: 'First', category: 'Frontend', notes: '' })
      addQuestion({ text: 'Second', category: 'Backend', notes: '' })

      expect(filteredQuestions.value).toHaveLength(2)
      expect(filteredQuestions.value[0].text).toBe('Second')
      expect(filteredQuestions.value[1].text).toBe('First')
    })

    it('filters by category when setFilter is called', () => {
      const { filteredQuestions, addQuestion, setFilter } = useQuestions()
      addQuestion({ text: 'Vue Q', category: 'Vue', notes: '' })
      addQuestion({ text: 'React Q', category: 'React', notes: '' })

      setFilter('Vue')
      expect(filteredQuestions.value).toHaveLength(1)
      expect(filteredQuestions.value[0].text).toBe('Vue Q')
    })

    it('shows all questions when filter is cleared', () => {
      const { filteredQuestions, addQuestion, setFilter } = useQuestions()
      addQuestion({ text: 'Q1', category: 'Vue', notes: '' })
      addQuestion({ text: 'Q2', category: 'React', notes: '' })

      setFilter('Vue')
      expect(filteredQuestions.value).toHaveLength(1)

      setFilter(null)
      expect(filteredQuestions.value).toHaveLength(2)
    })

    it('returns empty array when filter matches nothing', () => {
      const { filteredQuestions, addQuestion, setFilter } = useQuestions()
      addQuestion({ text: 'Q1', category: 'Frontend', notes: '' })

      setFilter('.NET')
      expect(filteredQuestions.value).toHaveLength(0)
    })
  })

  describe('stripHtml', () => {
    it('strips HTML tags from question text', () => {
      const { questions, addQuestion } = useQuestions()
      addQuestion({ text: '<b>Bold</b> question', category: 'Frontend', notes: '' })
      expect(questions.value[0].text).toBe('Bold question')
    })

    it('strips HTML from notes', () => {
      const { questions, addQuestion } = useQuestions()
      addQuestion({ text: 'Question', category: 'Frontend', notes: '<script>alert("x")</script>Note' })
      expect(questions.value[0].notes).toBe('alert("x")Note')
    })
  })
})
