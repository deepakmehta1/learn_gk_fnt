<!-- src/views/HomeView.vue -->
<template>
  <div class="home">
    <h1 class="text-center my-4">Books</h1>
    <BookList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BookList from '@/components/BookList.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    BookList,
  },
})
</script>

<style scoped>
.home {
  padding: 20px;
}
</style>
