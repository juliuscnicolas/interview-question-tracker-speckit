import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const data = ref(load(key, defaultValue))

  watch(
    data,
    (newValue) => {
      save(key, newValue)
    },
    { deep: true }
  )

  return data
}

function load(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? JSON.parse(raw) : defaultValue
  } catch {
    return defaultValue
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      throw new Error('Storage is full. Unable to save data.')
    }
    throw e
  }
}
