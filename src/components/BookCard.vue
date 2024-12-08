<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title">{{ book.title_en }}</h5>
      <h6 class="card-subtitle mb-2 text-muted">{{ book.title_hi }}</h6>
      <button class="btn btn-primary mt-3" @click="viewMore(book.id)">Practice Questions</button>

      <!-- Pass units data to UnitsList component -->
      <UnitsList v-if="units.length" :units="units" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getBookDetails } from '@/api' // Import the API function
import UnitsList from './UnitsList.vue' // Import the UnitsList component

// Properly import PropType as a type from Vue
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
    const units = ref<any[]>([]) // Reactive variable to hold units data

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

    return { units, viewMore }
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
