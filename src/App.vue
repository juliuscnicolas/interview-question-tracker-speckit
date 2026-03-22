<script setup>
import { ref } from 'vue'
import { useQuestions } from './composables/useQuestions'
import QuestionForm from './components/QuestionForm.vue'
import QuestionList from './components/QuestionList.vue'
import CategoryFilter from './components/CategoryFilter.vue'

const { filteredQuestions, activeFilter, storageError, addQuestion, updateQuestion, deleteQuestion, setFilter } = useQuestions()

const showAddForm = ref(false)
const editingQuestion = ref(null)
const showDeleteConfirm = ref(null)

function handleAdd(data) {
  try {
    addQuestion(data)
    showAddForm.value = false
  } catch (e) {
    // storageError reactive ref is set by composable
  }
}

function handleEdit(question) {
  editingQuestion.value = question
}

function handleUpdate(data) {
  try {
    updateQuestion(editingQuestion.value.id, data)
    editingQuestion.value = null
  } catch (e) {
    // storageError reactive ref is set by composable
  }
}

function handleDeleteRequest(question) {
  showDeleteConfirm.value = question
}

function handleDeleteConfirm() {
  if (showDeleteConfirm.value) {
    try {
      deleteQuestion(showDeleteConfirm.value.id)
    } catch (e) {
      // storageError reactive ref is set by composable
    }
    showDeleteConfirm.value = null
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-3xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Interview Question Tracker</h1>
        <button
          v-if="!showAddForm"
          @click="showAddForm = true"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Question
        </button>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 py-6 sm:px-6 space-y-6">
      <p v-if="storageError" class="bg-red-50 text-red-700 text-sm p-3 rounded-md">
        {{ storageError }}
      </p>

      <QuestionForm
        v-if="showAddForm"
        mode="add"
        @save="handleAdd"
        @cancel="showAddForm = false"
      />

      <CategoryFilter
        :activeFilter="activeFilter"
        @update:activeFilter="setFilter"
      />

      <QuestionList
        :questions="filteredQuestions"
        :emptyMessage="activeFilter ? `No questions in the \&quot;${activeFilter}\&quot; category.` : undefined"
        @edit="handleEdit"
        @delete="handleDeleteRequest"
      />
    </main>

    <!-- Edit Modal -->
    <Teleport to="body">
      <div v-if="editingQuestion" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/50" @click="editingQuestion = null"></div>
        <div class="relative w-full max-w-lg">
          <QuestionForm
            mode="edit"
            :question="editingQuestion"
            @save="handleUpdate"
            @cancel="editingQuestion = null"
          />
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Dialog -->
    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/50" @click="showDeleteConfirm = null"></div>
        <div class="relative bg-white rounded-lg shadow-lg p-6 max-w-sm w-full space-y-4">
          <h3 class="text-lg font-semibold text-gray-900">Delete Question</h3>
          <p class="text-sm text-gray-600">Are you sure you want to delete this question? This action cannot be undone.</p>
          <div class="flex gap-2 justify-end">
            <button
              @click="showDeleteConfirm = null"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleDeleteConfirm"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
