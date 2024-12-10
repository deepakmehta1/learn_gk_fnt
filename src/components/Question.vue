<template>
  <div class="question-container">
    <!-- Display current question based on language -->
    <h2>{{ currentQuestion?.[`text_${language}`] }}</h2>

    <!-- Ordered list for the options -->
    <ol class="options-list">
      <ol v-for="(option, index) in currentQuestion?.choices" :key="option.id">
        <button class="btn btn-option" @click="selectAnswer(option.id)">
          {{ String.fromCharCode(65 + index) }}. {{ option[`text_${language}`] }}
        </button>
      </ol>
    </ol>

    <!-- Submit Answer Button -->
    <div class="d-flex justify-content-center">
      <button class="btn btn-primary mt-3 submit-button" @click="submitAnswer">
        Submit Answer
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useQuizStore } from '@/stores/quizStore' // Access quiz store
import { getSubunitQuestions, getQuestionById } from '@/api' // Import API methods
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
      console.log('Selected answer:', optionId)
      // Logic to check if the answer is correct and move to the next question
    }

    // Handle submitting the answer
    const submitAnswer = () => {
      console.log('Answer submitted')
      // Logic to check the answer and update the state
    }

    return {
      currentQuestion,
      selectAnswer,
      submitAnswer,
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
