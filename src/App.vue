<template>
  <div id="app">
    <!-- Main content -->
    <router-view />
    <!-- This is where the routed views (like HomeView) will be rendered -->
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useLanguageStore } from '@/stores/languageStore' // Import the language store

export default defineComponent({
  name: 'App',
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
/* No changes here, removed language toggle button styles */
</style>
