import { ref, computed, onMounted } from 'vue'
import { useQuizStore } from '@/stores/quizStore'
import { getSubunitQuestions, getQuestionById, getUserProgress, submitQuestionAnswer } from '@/api'
import type { Question } from '@/types/quizTypes'

export function useQuestion() {
  const quizStore = useQuizStore()
  const selectedOption = ref<number | null>(null)
  const correctOptionId = ref<number | null>(null)
  const showResultModal = ref(false)
  const isCorrect = ref(false)
  const isSubmitting = ref(false)
  const isAnswered = ref(false)

  // Computed properties
  const currentQuestion = computed<Question | null>(() => quizStore.currentQuestion)
  const showQuestion = computed(() => quizStore.showQuestion)

  // Function to fetch the user's progress
  const fetchUserProgress = async () => {
    if (quizStore.currentBook) {
      try {
        const progressResponse = await getUserProgress(quizStore.currentBook.id)

        if (progressResponse.error_code === 101) {
          quizStore.handleSubscription(false) // Subscription required
          return
        }
        quizStore.handleSubscription(true)
        const lastQuestion = progressResponse.recent_question_details[0]
        const currentUnit = quizStore.currentBook?.units.find(
          (unit) => unit.id === lastQuestion.unit_id,
        )
        const currentSubunit = currentUnit?.subunits.find(
          (subunit) => subunit.id === lastQuestion.sub_unit_id,
        )

        if (currentSubunit) {
          const questions = await getSubunitQuestions(currentSubunit.id)

          if (questions.error_code === 101) {
            quizStore.handleSubscription(false)
            return
          }
          quizStore.handleSubscription(true)
          quizStore.setQuestions(questions)
          const lastAnsweredQuestionIndex = questions.findIndex(
            (question: Question) => question.id === lastQuestion.question_id,
          )

          const questionDetails = await getQuestionById(lastQuestion.question_id)

          if (questionDetails.error_code === 101) {
            quizStore.sendSubscribeAction()
            return
          }

          quizStore.setCurrentQuestion(questionDetails)
          quizStore.setCurrentQuestionIndex(lastAnsweredQuestionIndex)

          const unitIndex = quizStore.currentBook?.units.indexOf(currentUnit)
          const subunitIndex = currentUnit?.subunits.indexOf(currentSubunit)
          if (unitIndex !== undefined && subunitIndex !== undefined) {
            quizStore.setCurrentUnitIndex(unitIndex)
            quizStore.setCurrentSubunitIndex(subunitIndex)
          }
        }
      } catch (error) {
        console.error('Error fetching user progress:', error)
      }
    }
  }

  // Call the function on mounted
  onMounted(fetchUserProgress)

  // Function to select an answer
  const selectAnswer = (optionId: number) => {
    if (!isAnswered.value) {
      selectedOption.value = optionId
    }
  }

  // Function to submit the answer
  const submitAnswer = async () => {
    if (selectedOption.value !== null && currentQuestion.value) {
      isSubmitting.value = true
      try {
        const response = await submitQuestionAnswer(currentQuestion.value.id, selectedOption.value)
        setTimeout(() => {
          showResultModal.value = true
          isCorrect.value = response.correct
          correctOptionId.value = response.correct_option_id
          isAnswered.value = true
          isSubmitting.value = false
        }, 3000)
      } catch (error) {
        console.error('Error submitting answer:', error)
        isSubmitting.value = false
      }
    }
  }

  const nextQuestion = () => {
    quizStore.moveToNextQuestion()
    selectedOption.value = null
    isAnswered.value = false
    showResultModal.value = false
    isSubmitting.value = false
  }

  const subscribeToViewAll = () => {
    console.log('Subscription initiated...')
  }

  return {
    currentQuestion,
    selectedOption,
    correctOptionId,
    showResultModal,
    isCorrect,
    isSubmitting,
    isAnswered,
    selectAnswer,
    submitAnswer,
    nextQuestion,
    showQuestion,
    subscribeToViewAll,
  }
}
