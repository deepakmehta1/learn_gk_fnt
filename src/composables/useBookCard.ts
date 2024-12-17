// src/composables/useBookCard.ts
import { ref, computed } from 'vue'
import { useQuizStore } from '@/stores/quizStore'
import { useLanguageStore } from '@/stores/languageStore'
import { getBookDetails } from '@/api'
import type { Book, Unit } from '@/types/unitTypes'

export function useBookCard(book: Book) {
  const quizStore = useQuizStore()
  const languageStore = useLanguageStore()
  const units = ref<Unit[]>([])
  const isExpanded = ref(false)
  const isLoading = ref(false)

  // Compute showQuestion from store
  const showQuestion = computed(() => quizStore.showQuestion)

  // Start practicing
  const startPracticing = () => {
    isLoading.value = true
    quizStore.setCurrentBook(book)
    setTimeout(() => {
      // Navigate to quiz playground after a delay
      window.location.href = '/quiz-playground'
    }, 5000)
  }

  // Toggle the visibility of units
  const toggleUnitsVisibility = async () => {
    if (!isExpanded.value) {
      try {
        const bookDetails = await getBookDetails(book.id)
        units.value = bookDetails.units
      } catch (error) {
        console.error('Error fetching book details:', error)
      }
    }
    isExpanded.value = !isExpanded.value
  }

  // Get subunit titles for all units
  const subunitTitles = computed(() => {
    const titles: string[] = []
    if (quizStore.currentBook) {
      quizStore.currentBook.units.forEach((unit) => {
        unit.subunits.forEach((subunit) => {
          titles.push(subunit[`title_${languageStore.language}`])
        })
      })
    }
    return titles
  })

  // Handle subscribe action
  const subscribeToViewAll = () => {
    console.log('Subscription initiated...')
  }

  return {
    units,
    isExpanded,
    isLoading,
    showQuestion,
    startPracticing,
    toggleUnitsVisibility,
    subunitTitles,
    subscribeToViewAll,
  }
}
