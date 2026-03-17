export const CATEGORIES = [
  { value: 'Frontend', label: 'Frontend', badgeClass: 'bg-blue-100 text-blue-800' },
  { value: 'Backend', label: 'Backend', badgeClass: 'bg-green-100 text-green-800' },
  { value: 'Vue', label: 'Vue', badgeClass: 'bg-emerald-100 text-emerald-800' },
  { value: 'React', label: 'React', badgeClass: 'bg-cyan-100 text-cyan-800' },
  { value: '.NET', label: '.NET', badgeClass: 'bg-purple-100 text-purple-800' },
  { value: 'Others', label: 'Others', badgeClass: 'bg-gray-100 text-gray-800' },
]

export function getCategoryBadgeClass(categoryValue) {
  const cat = CATEGORIES.find((c) => c.value === categoryValue)
  return cat ? cat.badgeClass : 'bg-gray-100 text-gray-800'
}
