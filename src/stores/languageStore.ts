// src/stores/languageStore.ts
import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    language: 'en', // Default language is English
  }),
  actions: {
    toggleLanguage() {
      this.language = this.language === 'en' ? 'hi' : 'en' // Toggle between 'en' and 'hi'
    },
  },
  getters: {
    isEnglish: (state) => state.language === 'en',
    isHindi: (state) => state.language === 'hi',
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'language', // The key used in localStorage to store the state
        storage: localStorage, // Use localStorage for persistence
        paths: ['language'], // Persist only the 'language' state
      },
    ],
  },
})
