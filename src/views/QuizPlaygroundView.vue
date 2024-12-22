<template>
  <div class="quiz-playground-view">
    <!-- Sidebar Component -->
    <Sidebar />

    <!-- Main content area -->
    <div class="content-area">
      <!-- Title in the top center -->
      <h2 class="text-center mt-4 title-content">
        {{ languageStore.language === 'en' ? 'Practicing: ' : 'अभ्यास कर रहे हैं: ' }}
        {{ quizStore.currentBook?.[`title_${languageStore.language}`] }}
      </h2>

      <!-- View Progress Button -->
      <button
        class="btn btn-info position-absolute top-0 end-0 m-3 show-progress-button"
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
          <p>Current Subunit: {{ currentSubunit?.[`title_${languageStore.language}`] }}</p>
          <p>Questions Attempted: {{ attemptedQuestions }} / {{ totalQuestions }}</p>
        </div>
      </div>

      <!-- Question Component -->
      <div class="d-flex justify-content-center align-items-center" style="height: 80vh">
        <Question :language="languageStore.language" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useQuizStore } from '@/stores/quizStore' // Access quiz store
import Question from '@/components/Question.vue' // Import the Question component
import Sidebar from '@/components/Sidebar.vue' // Import the Sidebar component
import { useLanguageStore } from '@/stores/languageStore' // Access the language store

export default defineComponent({
  name: 'QuizPlaygroundView',
  components: {
    Question,
    Sidebar, // Include Sidebar here
  },
  setup() {
    const quizStore = useQuizStore() // Access quiz store
    const languageStore = useLanguageStore() // Access language store
    const showProgressModal = ref(false) // For controlling the visibility of the modal

    // Calculate the total number of questions in the current subunit
    const totalQuestions = computed(() => {
      return quizStore.currentQuestions.length
    })

    // Calculate the number of questions attempted based on the current question index
    const attemptedQuestions = computed(() => {
      return quizStore.currentQuestionIndex + 1
    })

    // Compute progress for the current subunit
    const progress = computed(() => {
      if (!quizStore.currentBook) return 0

      const currentUnit = quizStore.getSortedUnits()[quizStore.currentUnitIndex]
      const currentSubunit = quizStore.getSortedSubunits(currentUnit)[quizStore.currentSubunitIndex]

      if (!currentSubunit) return 0

      // Calculate percentage progress for the current subunit
      const progressPercentage = (attemptedQuestions.value / totalQuestions.value) * 100
      return progressPercentage
    })

    // Get current subunit title
    const currentSubunit = computed(() => {
      const currentUnit = quizStore.getSortedUnits()[quizStore.currentUnitIndex]
      return quizStore.getSortedSubunits(currentUnit)[quizStore.currentSubunitIndex]
    })

    return {
      showProgressModal,
      progress,
      currentSubunit,
      languageStore,
      quizStore,
      totalQuestions,
      attemptedQuestions,
    }
  },
})
</script>

<style scoped>
.quiz-playground-view {
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: 0;
}

.show-progress-button {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
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

/* Content Area */
.content-area {
  flex: 1;
}

h2 {
  font-size: 30px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .title-content {
    font-size: 20px;
    font-weight: bold;
    padding-top: 10%;
    margin-bottom: -20px;
  }

  .show-progress-button {
    width: 40%;
    margin: 0 auto;
  }
}
</style>
