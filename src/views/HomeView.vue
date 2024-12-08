<template>
  <div class="home">
    <h1 class="text-center my-4">Books</h1>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div
        v-for="book in books"
        :key="book.id"
        class="col"
      >
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ book.title_en }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">{{ book.title_hi }}</h6>
            <!-- View More Button -->
            <button class="btn btn-primary mt-3" @click="viewMore(book.id)">View More</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { getBooks } from '@/api';

export default defineComponent({
  name: 'HomeView',
  setup() {
    const books = ref<any[]>([]);

    onMounted(async () => {
      books.value = await getBooks();
    });

    const viewMore = (bookId: number) => {
      // Logic for the "View More" button (for example, navigate to a detailed page)
      console.log(`View more details for book ID: ${bookId}`);
      // You can use Vue Router to navigate to a detailed view of the book:
      // this.$router.push({ name: 'book-detail', params: { id: bookId } });
    };

    return { books, viewMore };
  }
});
</script>

<style scoped>
.home {
  padding: 20px;
}

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

h5, h6 {
  margin-bottom: 0.5rem;
}

.btn {
  width: 100%;  /* Optional: To make the button stretch across the card */
}
</style>
