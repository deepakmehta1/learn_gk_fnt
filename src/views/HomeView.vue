<template>
  <div class="home">
    <!-- Language Toggle Button at the top right -->
    <div class="language-toggle">
      <button @click="toggleLanguage">
        Switch to {{ currentLanguage === 'en' ? 'Hindi' : 'English' }}
      </button>
    </div>

    <h1 class="text-center my-4">Books</h1>
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
  position: absolute;
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
</style>
