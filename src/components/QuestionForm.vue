<script setup>
import { ref, watch } from 'vue'
import { CATEGORIES } from '../constants/categories'

const props = defineProps({
  question: { type: Object, default: null },
  mode: { type: String, default: 'add' },
})

const emit = defineEmits(['save', 'cancel'])

const text = ref('')
const category = ref('')
const notes = ref('')
const errors = ref({})

watch(
  () => props.question,
  (q) => {
    if (q) {
      text.value = q.text
      category.value = q.category
      notes.value = q.notes || ''
    }
  },
  { immediate: true }
)

function validate() {
  const errs = {}
  if (!text.value.trim()) errs.text = 'Question text is required.'
  if (!category.value) errs.category = 'A category must be selected.'
  errors.value = errs
  return Object.keys(errs).length === 0
}

function handleSubmit() {
  if (!validate()) return
  emit('save', {
    text: text.value,
    category: category.value,
    notes: notes.value,
  })
  if (props.mode === 'add') {
    text.value = ''
    category.value = ''
    notes.value = ''
    errors.value = {}
  }
}

function handleCancel() {
  emit('cancel')
  if (props.mode === 'add') {
    text.value = ''
    category.value = ''
    notes.value = ''
    errors.value = {}
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4">
    <h2 class="text-lg font-semibold text-gray-900">
      {{ mode === 'edit' ? 'Edit Question' : 'Add New Question' }}
    </h2>

    <div>
      <label for="question-text" class="block text-sm font-medium text-gray-700 mb-1">
        Question <span class="text-red-500">*</span>
      </label>
      <textarea
        id="question-text"
        v-model="text"
        rows="3"
        placeholder="Enter your interview question..."
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'border-red-500': errors.text }"
      ></textarea>
      <p v-if="errors.text" class="text-red-500 text-xs mt-1">{{ errors.text }}</p>
    </div>

    <div>
      <label for="question-category" class="block text-sm font-medium text-gray-700 mb-1">
        Category <span class="text-red-500">*</span>
      </label>
      <select
        id="question-category"
        v-model="category"
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'border-red-500': errors.category }"
      >
        <option value="" disabled>Select a category</option>
        <option v-for="cat in CATEGORIES" :key="cat.value" :value="cat.value">
          {{ cat.label }}
        </option>
      </select>
      <p v-if="errors.category" class="text-red-500 text-xs mt-1">{{ errors.category }}</p>
    </div>

    <div>
      <label for="question-notes" class="block text-sm font-medium text-gray-700 mb-1">
        Notes / Answer <span class="text-gray-400">(optional)</span>
      </label>
      <textarea
        id="question-notes"
        v-model="notes"
        rows="2"
        placeholder="Add notes or a model answer..."
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
    </div>

    <div class="flex gap-2 justify-end">
      <button
        v-if="mode === 'edit'"
        type="button"
        @click="handleCancel"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
      >
        {{ mode === 'edit' ? 'Save Changes' : 'Add Question' }}
      </button>
    </div>
  </form>
</template>
