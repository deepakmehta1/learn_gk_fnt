<template>
  <div class="quiz-playground-view">
    <h1>Welcome to the Quiz Playground</h1>
    <!-- Render Question component dynamically -->
    <Question v-if="currentQuestion" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useQuizStore } from '@/stores/quizStore' // Access the quiz store
import Question from '@/components/Question.vue' // Import the Question component

export default defineComponent({
  name: 'QuizPlaygroundView',
  components: {
    Question, // Register Question component
  },
  setup() {
    const quizStore = useQuizStore() // Access quiz store

    // Get current question from the store
    const currentQuestion = computed(() => quizStore.currentQuestion)

    return {
      currentQuestion, // Return current question to the template
    }
  },
})
</script>

<style scoped>
.quiz-playground-view {
  text-align: center;
  margin: 2rem;
}
</style>
