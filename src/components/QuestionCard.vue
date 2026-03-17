<script setup>
import { getCategoryBadgeClass } from '../constants/categories'

defineProps({
  question: { type: Object, required: true },
})

const emit = defineEmits(['edit', 'delete'])

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4 sm:p-6 space-y-3">
    <div class="flex items-start justify-between gap-3">
      <p class="text-gray-900 font-medium break-words min-w-0 flex-1">{{ question.text }}</p>
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0"
        :class="getCategoryBadgeClass(question.category)"
      >
        {{ question.category }}
      </span>
    </div>

    <p v-if="question.notes" class="text-gray-600 text-sm break-words">{{ question.notes }}</p>

    <div class="flex items-center justify-between pt-2 border-t border-gray-100">
      <span class="text-xs text-gray-400">{{ formatDate(question.createdAt) }}</span>
      <div class="flex gap-2">
        <button
          @click="emit('edit', question)"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Edit
        </button>
        <button
          @click="emit('delete', question)"
          class="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
