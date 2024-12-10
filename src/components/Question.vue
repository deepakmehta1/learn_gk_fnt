<template>
  <div class="question-container">
    <!-- Display current question based on language -->
    <h2>Question {{ currentQuestion?.id }}: {{ currentQuestion?.[`text_${language}`] }}</h2>

    <!-- Ordered list for the options -->
    <ol class="options-list">
      <li v-for="(option, index) in currentQuestion?.choices" :key="option.id">
        <button
          class="btn btn-option"
          :class="{ selected: selectedOption === option.id }"
          @click="selectAnswer(option.id)"
        >
          {{ String.fromCharCode(65 + index) }}. {{ option[`text_${language}`] }}
        </button>
      </li>
    </ol>

    <!-- Submit Answer Button -->
    <div class="d-flex justify-content-center">
      <button class="btn btn-primary mt-3 submit-button" @click="submitAnswer">
        Submit Answer
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
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue'
import { useQuizStore } from '@/stores/quizStore' // Access quiz store
import { getSubunitQuestions, getQuestionById, submitQuestionAnswer } from '@/api' // Import API methods
import type { Question } from '@/types/quizTypes' // Import the Question type

export default defineComponent({
  name: 'Question',
  props: {
    language: {
      type: String,
      required: true,
    },
  },
  setup() {
    const quizStore = useQuizStore() // Access quiz store
    const selectedOption = ref<number | null>(null) // Track selected option
    const showResultModal = ref(false) // Control visibility of result modal
    const isCorrect = ref(false) // Track if the answer is correct

    // Computed to get the current question from the store
    const currentQuestion = computed<Question | null>(() => quizStore.currentQuestion)

    // Fetch questions for the first subunit of the current book if no question is set
    onMounted(async () => {
      if (!quizStore.currentQuestion && quizStore.currentBook) {
        try {
          const firstUnit = quizStore.currentBook?.units[0] // Access the first unit
          const firstSubunit = firstUnit?.subunits[0] // Access the first subunit

          if (firstSubunit) {
            const questions = await getSubunitQuestions(firstSubunit.id)
            quizStore.setQuestions(questions)
            if (questions.length > 0) {
              quizStore.setCurrentQuestion(questions[0]) // Set the first question
              await getQuestionById(questions[0].id) // Track question view
            }
          }
        } catch (error) {
          console.error('Error fetching subunit questions:', error)
        }
      }
    })

    // Handle selecting an answer
    const selectAnswer = (optionId: number) => {
      selectedOption.value = optionId // Mark the selected option
    }

    // Handle submitting the answer
    const submitAnswer = async () => {
      if (selectedOption.value !== null && currentQuestion.value) {
        try {
          // Submit the answer
          const response = await submitQuestionAnswer(
            currentQuestion.value.id,
            selectedOption.value,
          )

          // Show the result modal based on the response
          showResultModal.value = true
          isCorrect.value = response.correct // If correct is true, show correct answer, otherwise show incorrect
        } catch (error) {
          console.error('Error submitting answer:', error)
        }
      } else {
        console.log('No option selected')
      }
    }

    return {
      currentQuestion,
      selectedOption,
      selectAnswer,
      submitAnswer, // Make sure to return submitAnswer so it can be used in the template
      showResultModal,
      isCorrect,
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
  background-color: #218838 !important; /* Highlight the selected option */
}

/* Modal for showing result */
.modal {
  position: fixed;
  top: 0;
  left: 0;
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

.progress-bar-container {
  width: 100%;
  background-color: #f1f1f1;
  border-radius: 5px;
  margin: 10px 0;
}

.progress-bar {
  height: 20px;
  background-color: #28a745;
  border-radius: 5px;
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
  .submit-button {
    width: 50%; /* Button width is 50% for small screens */
  }
}
</style>
