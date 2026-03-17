<script setup>
import { CATEGORIES } from '../constants/categories'

defineProps({
  activeFilter: { type: String, default: null },
})

const emit = defineEmits(['update:activeFilter'])
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      @click="emit('update:activeFilter', null)"
      :class="[
        'px-3 py-1 text-sm font-medium rounded-full transition-colors',
        !activeFilter
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      ]"
    >
      All
    </button>
    <button
      v-for="cat in CATEGORIES"
      :key="cat.value"
      @click="emit('update:activeFilter', cat.value)"
      :class="[
        'px-3 py-1 text-sm font-medium rounded-full transition-colors',
        activeFilter === cat.value
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      ]"
    >
      {{ cat.label }}
    </button>
  </div>
</template>
