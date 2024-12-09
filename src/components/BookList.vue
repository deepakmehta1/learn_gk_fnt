<template>
  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
    <!-- Render BookCard for each book -->
    <BookCard v-for="book in books" :key="book.id" :book="book" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getBooks } from '@/api' // Fetch books from the API
import BookCard from './BookCard.vue' // Import BookCard component
import type { Book } from '@/types/unitTypes' // Import Book type

export default defineComponent({
  name: 'BookList',
  components: {
    BookCard, // Register BookCard component
  },
  setup() {
    const books = ref<Book[]>([]) // Books data of type Book[]

    // Fetch books when the component is mounted
    onMounted(async () => {
      books.value = await getBooks() // Set books data
    })

    return { books } // Return books for use in the template
  },
})
</script>

<style scoped>
/* Custom styles for the BookList component */
</style>
