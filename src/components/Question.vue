<template>
  <div class="question-container">
    <!-- Show subscribe button if showQuestion is false -->
    <div v-if="!showQuestion">
      <button class="subscribe-button" @click="subscribeToViewAll">
        Subscribe to view all questions 🚀
      </button>
    </div>

    <!-- Show question if showQuestion is true -->
    <div v-else>
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

      <!-- Submit Answer Button -->
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
import { defineComponent } from 'vue'
import { useQuestion } from '@/composables/useQuestion'

export default defineComponent({
  name: 'Question',
  props: {
    language: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const {
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
    } = useQuestion(props.language)

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
