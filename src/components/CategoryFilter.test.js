import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoryFilter from './CategoryFilter.vue'

describe('CategoryFilter', () => {
  it('renders "All" button plus 6 category buttons', () => {
    const wrapper = mount(CategoryFilter)
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(7) // All + 6 categories
  })

  it('highlights "All" button when no filter active', () => {
    const wrapper = mount(CategoryFilter, { props: { activeFilter: null } })
    const allBtn = wrapper.findAll('button')[0]
    expect(allBtn.classes()).toContain('bg-blue-600')
  })

  it('highlights active category button', () => {
    const wrapper = mount(CategoryFilter, { props: { activeFilter: 'Vue' } })
    const vueBtn = wrapper.findAll('button').find((b) => b.text() === 'Vue')
    expect(vueBtn.classes()).toContain('bg-blue-600')
  })

  it('"All" button is not highlighted when a filter is active', () => {
    const wrapper = mount(CategoryFilter, { props: { activeFilter: 'Vue' } })
    const allBtn = wrapper.findAll('button')[0]
    expect(allBtn.classes()).not.toContain('bg-blue-600')
  })

  it('emits update:activeFilter with null when "All" clicked', async () => {
    const wrapper = mount(CategoryFilter, { props: { activeFilter: 'Vue' } })
    await wrapper.findAll('button')[0].trigger('click')
    expect(wrapper.emitted('update:activeFilter')[0][0]).toBeNull()
  })

  it('emits update:activeFilter with category value when clicked', async () => {
    const wrapper = mount(CategoryFilter)
    const reactBtn = wrapper.findAll('button').find((b) => b.text() === 'React')
    await reactBtn.trigger('click')
    expect(wrapper.emitted('update:activeFilter')[0][0]).toBe('React')
  })
})
