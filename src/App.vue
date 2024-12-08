<template>
  <div id="app">
    <!-- Language Toggle Button at the top right -->
    <div class="language-toggle">
      <button @click="toggleLanguage">
        Switch to {{ currentLanguage === 'en' ? 'Hindi' : 'English' }}
      </button>
    </div>

    <!-- Main content -->
    <HomeView />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useLanguageStore } from '@/stores/languageStore' // Import the language store
import HomeView from './views/HomeView.vue' // Import HomeView component

export default defineComponent({
  name: 'App',
  components: {
    HomeView,
  },
  setup() {
    const languageStore = useLanguageStore() // Access the language store

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
