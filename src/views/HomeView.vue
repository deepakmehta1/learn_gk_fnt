<template>
  <div class="home">
    <!-- Language Toggle Button at the top right -->
    <div class="row">
      <div class="col-12 text-end language-toggle">
        <button @click="toggleLanguage">
          Switch to {{ currentLanguage === 'en' ? 'Hindi' : 'English' }}
        </button>
      </div>
    </div>

    <!-- Books Title -->
    <div class="row">
      <div class="col-12">
        <h1 class="text-center my-4">Available Books</h1>
      </div>
    </div>

    <!-- Book List Component -->
    <BookList />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useLanguageStore } from '@/stores/languageStore' // Import the language store
import BookList from '@/components/BookList.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    BookList,
  },
  setup() {
    const languageStore = useLanguageStore() // Access language store

    // Use computed to reactively access the current language
    const currentLanguage = computed(() => languageStore.language)

    // Toggle language between 'en' and 'hi'
    const toggleLanguage = () => {
      languageStore.toggleLanguage()
    }

    return {
      toggleLanguage,
      currentLanguage,
    }
  },
})
</script>

<style scoped>
.home {
  padding: 20px;
}

/* Language toggle button style */
.language-toggle {
  top: 20px;
  right: 20px;
  background-color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
}

.language-toggle button {
  font-size: 16px;
}

@media (max-width: 768px) {
  .text-end {
    margin-bottom: 20px; /* Add space between the button and title on mobile */
  }
}
</style>
