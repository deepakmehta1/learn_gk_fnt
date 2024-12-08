<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title">{{ book[`title_${languageStore.language}` as keyof typeof book] }}</h5>
      <button class="btn btn-primary mt-3" @click="viewMore(book.id)">Practice Questions</button>

      <!-- Pass units data to UnitsList component -->
      <UnitsList v-if="units.length" :units="units" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useLanguageStore } from '@/stores/languageStore' // Import the language store
import { getBookDetails } from '@/api' // Import the API function
import UnitsList from './UnitsList.vue' // Import the UnitsList component

import type { PropType } from 'vue'

export default defineComponent({
  name: 'BookCard',
  props: {
    book: {
      type: Object as PropType<{ id: number; title_en: string; title_hi: string }>,
      required: true,
    },
  },
  components: {
    UnitsList, // Register the UnitsList component
  },
  setup() {
    const languageStore = useLanguageStore() // Access the language store
    const units = ref<any[]>([]) // Reactive variable to hold units data

    // Use computed to access the language reactively
    const currentLanguage = computed(() => languageStore.language)

    // Method to handle the "Practice Questions" button click
    const viewMore = async (bookId: number) => {
      try {
        const bookDetails = await getBookDetails(bookId)
        units.value = bookDetails.units // Set the units data
        console.log(`Units for book ID: ${bookId}`, units.value)
      } catch (error) {
        console.error('Error fetching book details:', error)
      }
    }

    return { units, viewMore, languageStore }
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
  width: 100%; /* Optional: To make the button stretch across the card */
}
</style>
