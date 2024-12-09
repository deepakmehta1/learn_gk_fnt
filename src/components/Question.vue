<template>
  <div class="question-container">
    <!-- Display current question -->
    <h2>{{ currentQuestion?.text_en }}</h2>

    <!-- Ordered list for the options -->
    <ol class="options-list">
      <ol v-for="(option, index) in currentQuestion?.choices" :key="option.id">
        <button @click="selectAnswer(option.id)">
          {{ String.fromCharCode(65 + index) }}. {{ option.text_en }}
        </button>
      </ol>
    </ol>

    <!-- Submit Answer Button -->
    <button class="btn btn-primary mt-3 submit-button" @click="submitAnswer">Submit Answer</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useQuizStore } from '@/stores/quizStore' // Access quiz store
import { getSubunitQuestions, getQuestionById } from '@/api' // Import API methods
import type { Question } from '@/types/quizTypes' // Import the Question type

export default defineComponent({
  name: 'Question',
  setup() {
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
  width: 70%; /* Adjust width of the question container */
  padding: 20px;
  background-color: #ffffff;
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
  width: 50%; /* Make buttons full width */
  padding: 10px;
  font-size: 16px;
  margin-top: 10px;
  background-color: #dce8df;
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
</style>
