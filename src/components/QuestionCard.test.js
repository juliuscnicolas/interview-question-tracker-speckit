import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuestionCard from './QuestionCard.vue'

const question = {
  id: '1',
  text: 'What is reactivity?',
  category: 'Vue',
  notes: 'Core concept in Vue',
  createdAt: '2026-03-15T10:00:00.000Z',
}

describe('QuestionCard', () => {
  it('displays question text', () => {
    const wrapper = mount(QuestionCard, { props: { question } })
    expect(wrapper.text()).toContain('What is reactivity?')
  })

  it('displays category badge', () => {
    const wrapper = mount(QuestionCard, { props: { question } })
    expect(wrapper.find('.rounded-full').text()).toBe('Vue')
  })

  it('displays notes when present', () => {
    const wrapper = mount(QuestionCard, { props: { question } })
    expect(wrapper.text()).toContain('Core concept in Vue')
  })

  it('hides notes when not present', () => {
    const noNotes = { ...question, notes: '' }
    const wrapper = mount(QuestionCard, { props: { question: noNotes } })
    const paragraphs = wrapper.findAll('p')
    const notesParagraph = paragraphs.find((p) => p.classes().includes('text-gray-600'))
    expect(notesParagraph).toBeUndefined()
  })

  it('displays formatted date', () => {
    const wrapper = mount(QuestionCard, { props: { question } })
    // The date should be formatted — just check it contains "2026"
    expect(wrapper.text()).toContain('2026')
  })

  it('emits edit with question when edit clicked', async () => {
    const wrapper = mount(QuestionCard, { props: { question } })
    const editBtn = wrapper.findAll('button').find((b) => b.text() === 'Edit')
    await editBtn.trigger('click')
    expect(wrapper.emitted('edit')[0][0]).toEqual(question)
  })

  it('emits delete with question when delete clicked', async () => {
    const wrapper = mount(QuestionCard, { props: { question } })
    const deleteBtn = wrapper.findAll('button').find((b) => b.text() === 'Delete')
    await deleteBtn.trigger('click')
    expect(wrapper.emitted('delete')[0][0]).toEqual(question)
  })
})
