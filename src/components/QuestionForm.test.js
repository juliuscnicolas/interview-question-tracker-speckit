import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuestionForm from './QuestionForm.vue'

describe('QuestionForm', () => {
  describe('add mode', () => {
    it('renders with "Add New Question" heading', () => {
      const wrapper = mount(QuestionForm)
      expect(wrapper.find('h2').text()).toBe('Add New Question')
    })

    it('renders all 6 category options plus placeholder', () => {
      const wrapper = mount(QuestionForm)
      const options = wrapper.findAll('option')
      expect(options).toHaveLength(7) // 1 placeholder + 6 categories
    })

    it('shows validation error when submitting empty text', async () => {
      const wrapper = mount(QuestionForm)
      await wrapper.find('form').trigger('submit')
      expect(wrapper.text()).toContain('Question text is required.')
    })

    it('shows validation error when no category selected', async () => {
      const wrapper = mount(QuestionForm)
      await wrapper.find('#question-text').setValue('Some question')
      await wrapper.find('form').trigger('submit')
      expect(wrapper.text()).toContain('A category must be selected.')
    })

    it('emits save with form data on valid submit', async () => {
      const wrapper = mount(QuestionForm)
      await wrapper.find('#question-text').setValue('What is Vue?')
      await wrapper.find('#question-category').setValue('Vue')
      await wrapper.find('#question-notes').setValue('A framework')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.emitted('save')).toHaveLength(1)
      expect(wrapper.emitted('save')[0][0]).toEqual({
        text: 'What is Vue?',
        category: 'Vue',
        notes: 'A framework',
      })
    })

    it('clears form after successful add', async () => {
      const wrapper = mount(QuestionForm)
      await wrapper.find('#question-text').setValue('Question')
      await wrapper.find('#question-category').setValue('Frontend')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.find('#question-text').element.value).toBe('')
      expect(wrapper.find('#question-category').element.value).toBe('')
    })

    it('does not show cancel button in add mode', () => {
      const wrapper = mount(QuestionForm)
      const buttons = wrapper.findAll('button')
      const cancelBtn = buttons.find((b) => b.text() === 'Cancel')
      expect(cancelBtn).toBeUndefined()
    })
  })

  describe('edit mode', () => {
    const question = {
      id: '1',
      text: 'Existing question',
      category: 'Backend',
      notes: 'Some notes',
      createdAt: '2026-01-01T00:00:00.000Z',
    }

    it('renders with "Edit Question" heading', () => {
      const wrapper = mount(QuestionForm, { props: { mode: 'edit', question } })
      expect(wrapper.find('h2').text()).toBe('Edit Question')
    })

    it('pre-fills fields with question data', () => {
      const wrapper = mount(QuestionForm, { props: { mode: 'edit', question } })
      expect(wrapper.find('#question-text').element.value).toBe('Existing question')
      expect(wrapper.find('#question-category').element.value).toBe('Backend')
      expect(wrapper.find('#question-notes').element.value).toBe('Some notes')
    })

    it('shows cancel button in edit mode', () => {
      const wrapper = mount(QuestionForm, { props: { mode: 'edit', question } })
      const buttons = wrapper.findAll('button')
      const cancelBtn = buttons.find((b) => b.text() === 'Cancel')
      expect(cancelBtn).toBeTruthy()
    })

    it('emits cancel when cancel button clicked', async () => {
      const wrapper = mount(QuestionForm, { props: { mode: 'edit', question } })
      const cancelBtn = wrapper.findAll('button').find((b) => b.text() === 'Cancel')
      await cancelBtn.trigger('click')
      expect(wrapper.emitted('cancel')).toHaveLength(1)
    })

    it('emits save with updated data', async () => {
      const wrapper = mount(QuestionForm, { props: { mode: 'edit', question } })
      await wrapper.find('#question-text').setValue('Updated question')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.emitted('save')[0][0].text).toBe('Updated question')
    })
  })
})
