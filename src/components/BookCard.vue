<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <!-- Display title based on current language (en/hi) -->
      <h5 class="card-title">{{ book[`title_${languageStore.language}` as keyof typeof book] }}</h5>

      <!-- Display subtitle in the selected language -->
      <h6 class="card-subtitle mb-2 text-muted">
        {{ book[`title_${languageStore.language}` as keyof typeof book] }}
      </h6>

      <!-- Button to toggle the visibility of topics -->
      <button class="btn btn-primary mt-3" @click="toggleUnitsVisibility">
        {{ isExpanded ? 'Collapse Topics' : 'Expand Topics' }}
      </button>

      <!-- Conditionally render UnitsList if units data exists and topics are expanded -->
      <UnitsList v-if="isExpanded && units.length" :units="units" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import type { PropType } from 'vue' // Correct import for PropType
import { useLanguageStore } from '@/stores/languageStore' // Access language store
import { getBookDetails } from '@/api' // Fetch book details
import UnitsList from './UnitsList.vue' // UnitsList component
import type { Unit } from '@/types/unitTypes' // Import Unit type

export default defineComponent({
  name: 'BookCard',
  props: {
    book: {
      type: Object as PropType<{ id: number; title_en: string; title_hi: string }>,
      required: true,
    },
  },
  components: {
    UnitsList, // Register UnitsList component
  },
  setup(props) {
    const languageStore = useLanguageStore() // Access language store
    const units = ref<Unit[]>([]) // Units data
    const isExpanded = ref(false) // Track the visibility of units

    // Reactive computed property for current language
    const currentLanguage = computed(() => languageStore.language)

    // Fetch book details when expanding the topics
    const toggleUnitsVisibility = async () => {
      if (!isExpanded.value) {
        // Fetch book details when expanding
        try {
          const bookDetails = await getBookDetails(props.book.id)
          units.value = bookDetails.units // Set units data
        } catch (error) {
          console.error('Error fetching book details:', error)
        }
      }
      isExpanded.value = !isExpanded.value // Toggle the expanded state
    }

    return {
      units,
      toggleUnitsVisibility,
      isExpanded,
      languageStore,
      currentLanguage,
      book: props.book,
    } // Pass `book` from props
  },
})
</script>

<style scoped>
.card-title {
  font-weight: bold;
}

.card-subtitle {
  font-style: italic;
}

.card-body {
  display: flex;
  flex-direction: column;
}

h5,
h6 {
  margin-bottom: 0.5rem;
}

.btn {
  width: 100%; /* Make button full width */
}
</style>
