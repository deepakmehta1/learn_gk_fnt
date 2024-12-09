// src/stores/quizStore.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Question } from '@/types/quizTypes' // Import Question type

export const useQuizStore = defineStore('quiz', () => {
  const currentBook = ref(null)
  const currentQuestions = ref<Question[]>([]) // Array of questions
  const currentQuestion = ref<Question | null>(null) // Current question, either null or a Question object
  const currentQuestionIndex = ref(0)

  // Set current book
  const setCurrentBook = (book: any) => {
    currentBook.value = book
  }

  // Set the list of questions for a subunit
  const setQuestions = (questions: Question[]) => {
    currentQuestions.value = questions
  }

  // Set the current question
  const setCurrentQuestion = (question: Question) => {
    currentQuestion.value = question
  }

  // Set the current question index
  const setCurrentQuestionIndex = (index: number) => {
    currentQuestionIndex.value = index
  }

  return {
    currentBook,
    setCurrentBook,
    currentQuestions,
    setQuestions,
    currentQuestion,
    setCurrentQuestion,
    currentQuestionIndex,
    setCurrentQuestionIndex,
  }
})
