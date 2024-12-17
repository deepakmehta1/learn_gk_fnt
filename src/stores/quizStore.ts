import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Question } from '@/types/quizTypes' // Import Question type
import type { Book, Unit, Subunit } from '@/types/unitTypes' // Import the Book, Unit, and Subunit types
import { getSubunitQuestions, getQuestionById } from '@/api' // Import API methods

export const useQuizStore = defineStore('quiz', {
  state: () => {
    return {
      currentBook: ref<Book | null>(null), // currentBook is now of type Book or null
      currentQuestions: ref<Question[]>([]), // Array of questions
      currentQuestion: ref<Question | null>(null), // Current question, either null or a Question object
      currentQuestionIndex: ref(0),
      currentSubunitIndex: ref(0), // Track the current subunit index
      currentUnitIndex: ref(0), // Track the current unit index
      showQuestion: ref(true), // Default is true, question is visible
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

    // Set the current subunit index
    setCurrentSubunitIndex(index: number) {
      this.currentSubunitIndex = index
    },

    // Set the current unit index
    setCurrentUnitIndex(index: number) {
      this.currentUnitIndex = index
    },

    // Get sorted list of units by ID in increasing order
    getSortedUnits(): Unit[] {
      return this.currentBook?.units.sort((a, b) => a.id - b.id) || []
    },

    // Get sorted list of subunits by ID in increasing order for a specific unit
    getSortedSubunits(unit: Unit): Subunit[] {
      return unit.subunits.sort((a, b) => a.id - b.id)
    },

    // Fetch questions for the current subunit and update state
    async fetchQuestionsForCurrentSubunit() {
      // Get the sorted units and subunits
      const currentUnit = this.getSortedUnits()[this.currentUnitIndex]
      const currentSubunit = this.getSortedSubunits(currentUnit)[this.currentSubunitIndex]

      if (currentSubunit) {
        try {
          // Fetch the questions for the current subunit
          const questions = await getSubunitQuestions(currentSubunit.id)
          if (questions.error_code === 101) {
            this.sendSubscribeAction(false) // Call sendSubscribeAction if subscription is not found
            return // Exit the function early to prevent further code execution
          }
          this.sendSubscribeAction(true)
          this.setQuestions(questions)

          // Set the first question from the fetched questions
          this.setCurrentQuestion(questions[0])
          this.setCurrentQuestionIndex(0) // Reset the index to 0 for the first question in the subunit

          // Ensure that the question is fetched by its ID to update the backend (like marking the question as attempted)
          const questionDetails = await getQuestionById(questions[0].id) // Get full question details from API
          if (questionDetails.error_code === 101) {
            this.sendSubscribeAction(false) // Call sendSubscribeAction if subscription is not found
            return // Exit the function early to prevent further code execution
          }
          this.sendSubscribeAction(true)
          this.setCurrentQuestion(questionDetails) // Set the full question details in the store
        } catch (error) {
          console.error('Error fetching subunit questions:', error)
        }
      }
    },

    // Send identifier to indicate the user needs to subscribe to view all questions
    sendSubscribeAction(show_question: boolean) {
      this.showQuestion = show_question // Hide the question and show the subscribe button
      console.log('You need to subscribe to view all the questions for this subunit.')
    },

    async moveToNextQuestion() {
      const currentUnit = this.getSortedUnits()[this.currentUnitIndex]
      const currentSubunit = this.getSortedSubunits(currentUnit)[this.currentSubunitIndex]
      const nextQuestionIndex = this.currentQuestionIndex + 1

      // Check if there are more questions in the current subunit
      if (nextQuestionIndex < this.currentQuestions.length) {
        const questionDetails = await getQuestionById(this.currentQuestions[nextQuestionIndex].id) // Get full question details from API
        this.setCurrentQuestion(questionDetails)
        this.setCurrentQuestionIndex(nextQuestionIndex)
      } else {
        // Move to the next subunit if the current subunit is completed
        const nextSubunitIndex = this.currentSubunitIndex + 1
        if (nextSubunitIndex < currentUnit?.subunits.length) {
          const nextSubunit = currentUnit?.subunits[nextSubunitIndex]

          // Check if next subunit is preview false
          if (nextSubunit && !nextSubunit.is_preview) {
            // Send identifier to indicate a "subscribe" action
            this.setCurrentSubunitIndex(nextSubunitIndex)
            this.setCurrentQuestionIndex(0) // Reset to first question in the next subunit
            this.sendSubscribeAction(false) // Send an identifier to the front end
          } else {
            this.setCurrentSubunitIndex(nextSubunitIndex)
            this.setCurrentQuestionIndex(0) // Reset to first question in the next subunit
            // Fetch questions for the next subunit
            await this.fetchQuestionsForCurrentSubunit() // Ensure questions are fetched first
          }
        } else {
          // Move to the next unit if the current unit is completed
          const nextUnitIndex = this.currentUnitIndex + 1
          if (nextUnitIndex < this.currentBook?.units.length) {
            this.setCurrentUnitIndex(nextUnitIndex)
            this.setCurrentSubunitIndex(0) // Reset to the first subunit in the next unit
            this.setCurrentQuestionIndex(0)
            // Fetch questions for the first subunit of the next unit
            await this.fetchQuestionsForCurrentSubunit() // Ensure questions are fetched first
          } else {
            // End of the quiz, handle quiz completion
            this.finishQuiz()
          }
        }
      }
    },

    // Finish the quiz (end of quiz scenario)
    finishQuiz() {
      console.log('Quiz Finished')
      // Optionally, you can trigger any action on quiz completion, such as saving results
    },
  },
  persist: {
    enabled: true, // Enable the persistence
    strategies: [
      {
        key: 'quiz', // Key used in localStorage or sessionStorage
        storage: localStorage, // Use localStorage for persistence
        paths: [
          'currentBook',
          'currentQuestions',
          'currentQuestion',
          'currentQuestionIndex',
          'currentSubunitIndex',
          'currentUnitIndex',
          'showQuestion',
        ], // Persist these parts of the state
      },
    ],
  },
})
