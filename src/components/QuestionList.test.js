import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from './EmptyState.vue'
import QuestionList from './QuestionList.vue'

describe('EmptyState', () => {
  it('renders default message', () => {
    const wrapper = mount(EmptyState)
    expect(wrapper.text()).toContain('No questions yet')
  })

  it('renders custom message', () => {
    const wrapper = mount(EmptyState, { props: { message: 'Nothing here!' } })
    expect(wrapper.text()).toContain('Nothing here!')
  })
})

describe('QuestionList', () => {
  it('shows EmptyState when questions array is empty', () => {
    const wrapper = mount(QuestionList, { props: { questions: [] } })
    expect(wrapper.text()).toContain('No questions yet')
  })

  it('shows custom empty message when provided', () => {
    const wrapper = mount(QuestionList, {
      props: { questions: [], emptyMessage: 'No Vue questions' },
    })
    expect(wrapper.text()).toContain('No Vue questions')
  })

  it('renders question cards when questions exist', () => {
    const questions = [
      { id: '1', text: 'Q1', category: 'Frontend', notes: '', createdAt: '2026-01-01T00:00:00Z' },
      { id: '2', text: 'Q2', category: 'Backend', notes: '', createdAt: '2026-01-02T00:00:00Z' },
    ]
    const wrapper = mount(QuestionList, { props: { questions } })
    expect(wrapper.text()).toContain('Q1')
    expect(wrapper.text()).toContain('Q2')
  })

  it('emits edit event from child card', async () => {
    const questions = [
      { id: '1', text: 'Q1', category: 'Frontend', notes: '', createdAt: '2026-01-01T00:00:00Z' },
    ]
    const wrapper = mount(QuestionList, { props: { questions } })
    const editBtn = wrapper.findAll('button').find((b) => b.text() === 'Edit')
    await editBtn.trigger('click')
    expect(wrapper.emitted('edit')).toHaveLength(1)
  })

  it('emits delete event from child card', async () => {
    const questions = [
      { id: '1', text: 'Q1', category: 'Frontend', notes: '', createdAt: '2026-01-01T00:00:00Z' },
    ]
    const wrapper = mount(QuestionList, { props: { questions } })
    const deleteBtn = wrapper.findAll('button').find((b) => b.text() === 'Delete')
    await deleteBtn.trigger('click')
    expect(wrapper.emitted('delete')).toHaveLength(1)
  })
})
