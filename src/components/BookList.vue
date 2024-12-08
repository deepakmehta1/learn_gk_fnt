<!-- src/components/BookList.vue -->
<template>
  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
    <BookCard v-for="book in books" :key="book.id" :book="book" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getBooks } from '@/api'
import BookCard from './BookCard.vue'

export default defineComponent({
  name: 'BookList',
  components: {
    BookCard,
  },
  setup() {
    const books = ref<any[]>([])

    onMounted(async () => {
      books.value = await getBooks()
    })

    return { books }
  },
})
</script>

<style scoped>
/* You can add custom styles here for the BookList component */
</style>
