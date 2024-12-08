<!-- src/components/BookCard.vue -->
<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title">{{ book.title_en }}</h5>
      <h6 class="card-subtitle mb-2 text-muted">{{ book.title_hi }}</h6>
      <button class="btn btn-primary mt-3" @click="viewMore(book.id)">View More</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'BookCard',
  props: {
    book: {
      type: Object as PropType<{ id: number; title_en: string; title_hi: string }>,
      required: true,
    },
  },
  methods: {
    viewMore(bookId: number) {
      console.log(`View more details for book ID: ${bookId}`)
      // Add logic for navigating or opening detailed view
    },
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
