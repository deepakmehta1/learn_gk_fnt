<template>
  <div class="quiz-playground-view">
    <!-- View Progress Button -->
    <button
      class="btn btn-info position-absolute top-0 end-12 m-3 show-progress-button"
      @click="showProgressModal = true"
    >
      View Progress
    </button>

    <!-- Progress Modal -->
    <div v-if="showProgressModal" class="modal">
      <div class="modal-content">
        <span class="close-btn" @click="showProgressModal = false">&times;</span>
        <h3>Quiz Progress</h3>
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <p>{{ progress }}% Completed</p>
        <p>Current Subunit: {{ currentSubunit?.title_en }}</p>
      </div>
    </div>

    <!-- Question Component -->
    <div class="d-flex justify-content-center align-items-center" style="height: 80vh">
      <Question />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useQuizStore } from '@/stores/quizStore' // Access quiz store
import Question from '@/components/Question.vue' // Import the Question component
import { useLanguageStore } from '@/stores/languageStore' // Access the language store

export default defineComponent({
  name: 'QuizPlaygroundView',
  components: {
    Question,
  },
  setup() {
    const quizStore = useQuizStore() // Access quiz store
    const languageStore = useLanguageStore() // Access language store
    const showProgressModal = ref(false) // For controlling the visibility of the modal

    // Compute current progress (percentage)
    const progress = computed(() => {
      if (!quizStore.currentBook) return 0

      // Calculate how many subunits the user has completed
      const totalSubunits = quizStore.currentBook.units.reduce(
        (acc, unit) => acc + unit.subunits.length,
        0,
      )
      const completedSubunits = quizStore.currentBook.units.reduce((acc, unit) => {
        return (
          acc +
          unit.subunits.filter((subunit) => subunit.id <= quizStore.currentQuestionIndex).length
        )
      }, 0)

      return (completedSubunits / totalSubunits) * 100
    })

    // Get current subunit title
    const currentSubunit = computed(() => {
      const currentUnit = quizStore.currentBook?.units[0] // Access the first unit as an example
      return currentUnit?.subunits[quizStore.currentQuestionIndex]
    })

    return {
      showProgressModal,
      progress,
      currentSubunit,
    }
  },
})
</script>

<style scoped>
.quiz-playground-view {
  position: relative;
  margin: 2rem;
}

.btn-info {
  margin-top: 1rem;
}

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

/* Centering the question in the middle of the screen */
.question-container {
  text-align: center;
}

/* Bootstrap grid adjustment for responsiveness */
@media (max-width: 768px) {
  .show-progress-button {
    width: 100%;
    margin: 0 auto;
  }
}
</style>
