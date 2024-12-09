// src/stores/quizStore.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Question } from '@/types/quizTypes' // Import Question type
import type { Book } from '@/types/unitTypes' // Import the Book, Unit, and Subunit types

export const useQuizStore = defineStore('quiz', {
  state: () => {
    return {
      currentBook: ref<Book | null>(null), // currentBook is now of type Book or null
      currentQuestions: ref<Question[]>([]), // Array of questions
      currentQuestion: ref<Question | null>(null), // Current question, either null or a Question object
      currentQuestionIndex: ref(0),
    }
  },
  actions: {
    // Set current book
    setCurrentBook(book: Book) {
      this.currentBook = book
    },

    // Set the list of questions for a subunit
    setQuestions(questions: Question[]) {
      this.currentQuestions = questions
    },

    // Set the current question
    setCurrentQuestion(question: Question) {
      this.currentQuestion = question
    },

    // Set the current question index
    setCurrentQuestionIndex(index: number) {
      this.currentQuestionIndex = index
    },
  },
  persist: {
    enabled: true, // Enable the persistence
    strategies: [
      {
        key: 'quiz', // Key used in localStorage or sessionStorage
        storage: localStorage, // Use localStorage for persistence
        paths: ['currentBook', 'currentQuestions', 'currentQuestion', 'currentQuestionIndex'], // Only persist these parts of the state
      },
    ],
  },
})
