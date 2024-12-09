<template>
  <div class="question-container">
    <h2>{{ currentQuestion?.question_text }}</h2>
    <ul>
      <li v-for="option in currentQuestion?.options" :key="option.id">
        <button @click="selectAnswer(option.id)">
          {{ option.option_text }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useQuizStore } from '@/stores/quizStore' // Access the quiz store
import type { Question } from '@/types/quizTypes' // Import the Question type

export default defineComponent({
  name: 'Question',
  setup() {
    const quizStore = useQuizStore() // Access quiz store
    const currentQuestion = computed<Question | null>(() => quizStore.currentQuestion) // Use computed with the correct type

    // Handle selecting an answer
    const selectAnswer = (optionId: number) => {
      console.log('Selected answer:', optionId)
      // Logic to check if the answer is correct and move to the next question
    }

    return {
      currentQuestion,
      selectAnswer,
    }
  },
})
</script>

<style scoped>
.question-container {
  margin-top: 2rem;
}

button {
  margin: 1rem;
  padding: 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  width: 100%;
}

button:hover {
  background-color: #218838;
}
</style>
