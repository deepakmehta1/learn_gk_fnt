import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Question } from '@/types/quizTypes' // Import Question type
import type { Book, Unit, Subunit } from '@/types/unitTypes' // Import the Book, Unit, and Subunit types
import { getSubunitQuestions, getQuestionById } from '@/api' // Import API methods

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    currentBook: ref<Book | null>(null),
    currentQuestions: ref<Question[]>([]),
    currentQuestion: ref<Question | null>(null),
    currentQuestionIndex: ref(0),
    currentSubunitIndex: ref(0),
    currentUnitIndex: ref(0),
    showQuestion: ref(true),
  }),

  actions: {
    setCurrentBook(book: Book) {
      this.currentBook = book
    },

    setQuestions(questions: Question[]) {
      this.currentQuestions = questions
    },

    setCurrentQuestion(question: Question) {
      this.currentQuestion = question
    },

    setCurrentQuestionIndex(index: number) {
      this.currentQuestionIndex = index
    },

    setCurrentSubunitIndex(index: number) {
      this.currentSubunitIndex = index
    },

    setCurrentUnitIndex(index: number) {
      this.currentUnitIndex = index
    },

    getSortedUnits(): Unit[] {
      return this.currentBook?.units.sort((a, b) => a.id - b.id) || []
    },

    getSortedSubunits(unit: Unit): Subunit[] {
      return unit.subunits.sort((a, b) => a.id - b.id)
    },

    async fetchQuestionsForCurrentSubunit() {
      const currentUnit = this.getSortedUnits()[this.currentUnitIndex]
      const currentSubunit = this.getSortedSubunits(currentUnit)[this.currentSubunitIndex]

      if (!currentSubunit) return

      try {
        const questions = await getSubunitQuestions(currentSubunit.id)

        if (questions.error_code === 101) {
          this.handleSubscription(false)
          return
        }

        this.handleSubscription(true)
        this.setQuestions(questions)

        const questionDetails = await this.fetchAndSetFirstQuestion(questions)
        this.setCurrentQuestion(questionDetails)
      } catch (error) {
        console.error('Error fetching subunit questions:', error)
      }
    },

    async fetchAndSetFirstQuestion(questions: Question[]) {
      const questionDetails = await getQuestionById(questions[0].id)
      if (questionDetails.error_code === 101) {
        this.handleSubscription(false)
        return
      }
      this.handleSubscription(true)
      return questionDetails
    },

    handleSubscription(showQuestion: boolean) {
      this.showQuestion = showQuestion
      console.log(`You need to subscribe to view all the questions for this subunit.`)
    },

    async moveToNextQuestion() {
      const currentUnit = this.getSortedUnits()[this.currentUnitIndex]
      const currentSubunit = this.getSortedSubunits(currentUnit)[this.currentSubunitIndex]
      const nextQuestionIndex = this.currentQuestionIndex + 1

      if (nextQuestionIndex < this.currentQuestions.length) {
        await this.moveToNextValidQuestion(nextQuestionIndex)
      } else {
        await this.moveToNextSubunit(currentUnit, currentSubunit)
      }
    },

    async moveToNextValidQuestion(nextQuestionIndex: number) {
      const questionDetails = await getQuestionById(this.currentQuestions[nextQuestionIndex].id)
      this.setCurrentQuestion(questionDetails)
      this.setCurrentQuestionIndex(nextQuestionIndex)
    },

    async moveToNextSubunit(currentUnit: Unit, currentSubunit: Subunit) {
      const nextSubunitIndex = this.currentSubunitIndex + 1
      if (nextSubunitIndex < currentUnit?.subunits.length) {
        await this.handleNextSubunit(currentUnit, nextSubunitIndex)
      } else {
        await this.moveToNextUnit(currentUnit)
      }
    },

    async handleNextSubunit(currentUnit: Unit, nextSubunitIndex: number) {
      const nextSubunit = currentUnit?.subunits[nextSubunitIndex]

      if (nextSubunit && !nextSubunit.is_preview) {
        this.setCurrentSubunitIndex(nextSubunitIndex)
        this.setCurrentQuestionIndex(0)
        this.handleSubscription(false)
      } else {
        this.setCurrentSubunitIndex(nextSubunitIndex)
        this.setCurrentQuestionIndex(0)
        await this.fetchQuestionsForCurrentSubunit()
      }
    },

    async moveToNextUnit(currentUnit: Unit) {
      const nextUnitIndex = this.currentUnitIndex + 1
      if (nextUnitIndex < this.currentBook?.units.length) {
        this.setCurrentUnitIndex(nextUnitIndex)
        this.setCurrentSubunitIndex(0)
        this.setCurrentQuestionIndex(0)
        await this.fetchQuestionsForCurrentSubunit()
      } else {
        this.finishQuiz()
      }
    },

    finishQuiz() {
      console.log('Quiz Finished')
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'quiz',
        storage: localStorage,
        paths: [
          'currentBook',
          'currentQuestions',
          'currentQuestion',
          'currentQuestionIndex',
          'currentSubunitIndex',
          'currentUnitIndex',
          'showQuestion',
        ],
      },
    ],
  },
})
