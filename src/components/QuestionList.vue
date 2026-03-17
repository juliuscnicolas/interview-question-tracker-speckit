<script setup>
import QuestionCard from './QuestionCard.vue'
import EmptyState from './EmptyState.vue'

defineProps({
  questions: { type: Array, required: true },
  emptyMessage: { type: String, default: undefined },
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div>
    <EmptyState v-if="questions.length === 0" :message="emptyMessage" />
    <div v-else class="space-y-4">
      <QuestionCard
        v-for="question in questions"
        :key="question.id"
        :question="question"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </div>
  </div>
</template>
