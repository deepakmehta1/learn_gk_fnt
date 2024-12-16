<template>
  <div class="question-container">
    <div v-if="!showQuestion">
      <!-- Show subscribe button if showQuestion is false -->
      <button class="subscribe-button" @click="subscribeToViewAll">
        Subscribe to view all questions 🚀
      </button>
    </div>
    <div v-else>
      <!-- Show question if showQuestion is true -->
      <h2>Question {{ currentQuestion?.id }}: {{ currentQuestion?.[`text_${language}`] }}</h2>

      <!-- Options list -->
      <ol class="options-list">
        <ol v-for="(option, index) in currentQuestion?.choices" :key="option.id">
          <button
            class="btn btn-option"
            :class="{
              selected: selectedOption === option.id,
              incorrect:
                isAnswered && selectedOption === option.id && option.id !== correctOptionId,
              correct: isAnswered && option.id === correctOptionId,
            }"
            :disabled="isAnswered"
            @click="selectAnswer(option.id)"
          >
            {{ String.fromCharCode(65 + index) }}. {{ option[`text_${language}`] }}
          </button>
        </ol>
      </ol>

      <!-- Submit button -->
      <div class="d-flex justify-content-center">
        <button
          class="btn btn-primary mt-3 submit-button"
          @click="submitAnswer"
          :disabled="isAnswered || isSubmitting"
        >
          Submit Answer
        </button>
      </div>

      <!-- Submitting loader -->
      <div v-if="isSubmitting" class="loader-container">
        <span class="loader">Submitting<span class="dots"></span></span>
      </div>

      <!-- Next Question Button -->
      <div class="d-flex justify-content-center">
        <button
          class="btn btn-secondary mt-3 next-question-button"
          @click="nextQuestion"
          :disabled="!isAnswered"
          :class="{ 'highlight-button': isAnswered }"
        >
          Next Question
        </button>
      </div>

      <!-- Modal for showing correct/incorrect answer -->
      <div v-if="showResultModal" class="modal">
        <div class="modal-content">
          <span class="close-btn" @click="showResultModal = false">&times;</span>
          <div v-if="isCorrect">
            <img src="/correct_answer.gif" alt="Correct Answer" />
            <h3>Correct Answer!</h3>
          </div>
          <div v-else>
            <img src="/incorrect_answer.gif" alt="Incorrect Answer" />
            <h3>Incorrect Answer. Try Again!</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue'
import { useQuizStore } from '@/stores/quizStore' // Access quiz store
import { getSubunitQuestions, getQuestionById, submitQuestionAnswer, getUserProgress } from '@/api' // Import API methods
import type { Question } from '@/types/quizTypes' // Import the Question type

export default defineComponent({
  name: 'Question',
  props: {
    language: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const quizStore = useQuizStore() // Access quiz store
    const selectedOption = ref<number | null>(null) // Track selected option
    const correctOptionId = ref<number | null>(null) // Track the correct option id
    const showResultModal = ref(false) // Control visibility of result modal
    const isCorrect = ref(false) // Track if the answer is correct
    const isSubmitting = ref(false) // Track if the submit button is clicked
    const isAnswered = ref(false) // Track if the answer is submitted

    // Computed to get the current question from the store
    const currentQuestion = computed<Question | null>(() => quizStore.currentQuestion)
    const showQuestion = computed(() => quizStore.showQuestion) // Access showQuestion from the store

    // Fetch user progress on reload
    onMounted(async () => {
      if (quizStore.currentBook) {
        try {
          const progressResponse = await getUserProgress(quizStore.currentBook.id)

          // Get the last answered question from the API response
          const lastQuestion = progressResponse.recent_question_details[0]
          const currentUnit = quizStore.currentBook?.units.find(
            (unit) => unit.id === lastQuestion.unit_id,
          )
          const currentSubunit = currentUnit?.subunits.find(
            (subunit) => subunit.id === lastQuestion.sub_unit_id,
          )

          if (currentSubunit) {
            const questions = await getSubunitQuestions(currentSubunit.id)
            console.log('questions ', questions)
            // Check for error_code 101 in the questions response and return early if present
            if (questions.error_code === 101) {
              quizStore.sendSubscribeAction() // Call sendSubscribeAction if subscription is not found
              return // Exit the function early to prevent further code execution
            } else {
              quizStore.setQuestions(questions)
              const lastAnsweredQuestionIndex = questions.findIndex(
                (question: Question) => question.id === lastQuestion.question_id,
              )

              const questionDetails = await getQuestionById(lastQuestion.question_id)

              // Check for error_code 101 in the question details and return early if present
              if (questionDetails.error_code === 101) {
                quizStore.sendSubscribeAction() // Call sendSubscribeAction if subscription is not found
                return // Exit the function early to prevent further code execution
              } else {
                quizStore.setCurrentQuestion(questionDetails) // Set question details
                quizStore.setCurrentQuestionIndex(lastAnsweredQuestionIndex) // Update the question index

                // Set the current unit and subunit indexes
                const unitIndex = quizStore.currentBook?.units.indexOf(currentUnit)
                const subunitIndex = currentUnit?.subunits.indexOf(currentSubunit)
                if (unitIndex !== undefined && subunitIndex !== undefined) {
                  quizStore.setCurrentUnitIndex(unitIndex)
                  quizStore.setCurrentSubunitIndex(subunitIndex)
                }
              }
            }
          }
        } catch (error) {
          console.error('Error fetching user progress:', error)
        }
      }
    })

    const subscribeToViewAll = () => {
      console.log('Subscription initiated...')
      // Handle subscription action here
    }

    // Handle selecting an answer
    const selectAnswer = (optionId: number) => {
      if (!isAnswered.value) {
        selectedOption.value = optionId
      }
    }

    // Handle submitting the answer
    const submitAnswer = async () => {
      if (selectedOption.value !== null && currentQuestion.value) {
        isSubmitting.value = true
        try {
          const response = await submitQuestionAnswer(
            currentQuestion.value.id,
            selectedOption.value,
          )
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

    return {
      currentQuestion,
      selectedOption,
      selectAnswer,
      submitAnswer,
      showResultModal,
      isCorrect,
      isSubmitting,
      isAnswered,
      nextQuestion,
      showQuestion, // Return showQuestion to bind to template
      correctOptionId,
      subscribeToViewAll,
    }
  },
})
</script>

<style scoped>
.question-container {
  width: 100%; /* By default, take full width */
  padding: 20px;
  background-color: #fbfbfb;
}

h2 {
  font-size: 20px;
  margin-bottom: 20px;
}

ol {
  padding-left: 20px;
}

ol li {
  margin: 10px 0;
}

button {
  width: 100%; /* Make buttons full width on small screens */
  padding: 10px;
  font-size: 16px;
  margin-top: 10px;
  background-color: #e3e8ba;
  border: none;
  color: white;
  border-radius: 5px;
}

button:hover {
  background-color: #218838;
}

button:focus {
  outline: none;
}

.options-list button {
  text-align: left;
  color: black;
}

.submit-button {
  width: 30%;
  background-color: black;
}

.selected {
  background-color: #8d89ab !important; /* Highlight the selected option */
}

.correct {
  background-color: #28a745 !important; /* Correct answer in green */
}

.incorrect {
  background-color: #dc3545 !important; /* Incorrect answer in red */
}

.next-question-button {
  width: 30%;
  background-color: #215fa0;
  margin-top: 10px;
  color: white;
  border-radius: 5px;
  border: none;
}

.next-question-button:disabled {
  background-color: #a5a5a5;
  cursor: not-allowed;
}

.highlight-button {
  animation: highlight 1s infinite alternate; /* Apply animation when the button is enabled */
}

/* Highlight animation */
@keyframes highlight {
  0% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(0, 123, 255, 0.7);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
  }
}

/* Submitting loader */
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  font-size: 18px;
  color: white;
  background-color: rgba(0, 0, 0, 0.7); /* Slight transparency */
  margin-top: 20px;
}

.loader .dots::after {
  content: '.';
  animation: dot-blink 1s steps(5, end) infinite;
}

.loader .dots::before {
  content: '.';
  animation: dot-blink 1s steps(5, end) infinite 0.2s;
}

.loader {
  font-size: 18px;
  font-weight: bold;
}

/* Animation for the dots */
@keyframes dot-blink {
  0% {
    content: '.';
  }
  50% {
    content: '..';
  }
  100% {
    content: '...';
  }
}

/* Modal for showing result */
.modal {
  position: fixed;
  top: 0;
  left: 10%;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 30px;
  cursor: pointer;
}

.subscribe-button {
  width: 100%;
  background-color: black;
}

h3 {
  margin-bottom: 20px;
}

/* Bootstrap grid adjustment for responsiveness */
@media (min-width: 992px) {
  .question-container {
    max-width: 800px; /* Limit the width to 800px for larger screens */
    margin: 0 auto; /* Center the question container */
  }

  .submit-button {
    width: 30%; /* Adjust submit button width for larger screens */
  }
}

@media (max-width: 768px) {
  .question-container {
    width: 100%;
  }

  h2 {
    font-size: 16px;
    margin-bottom: 20px;
    margin-top: 30px;
  }

  .submit-button {
    width: 50%; /* Button width is 50% for small screens */
  }
}
</style>
