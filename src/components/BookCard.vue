<template>
  <div class="card shadow-sm position-relative">
    <button
      class="btn btn-success position-absolute top-0 end-0 m-1 start-practicing-btn"
      style="width: 30%"
      @click="startPracticing"
    >
      <i class="fas fa-play-circle"></i> Start Practicing
    </button>

    <Loader v-if="isLoading" :subunitTitles="subunitTitles" />

    <div class="card-body">
      <h5 class="card-title">{{ book[`title_${languageStore.language}` as keyof typeof book] }}</h5>
      <h6 class="card-subtitle mb-2 text-muted">
        {{ book[`title_${languageStore.language}` as keyof typeof book] }}
      </h6>

      <button class="btn btn-primary mt-3" @click="toggleUnitsVisibility">
        {{ isExpanded ? 'Collapse Topics' : 'Expand Topics' }}
      </button>

      <UnitsList v-if="isExpanded && units.length" :units="units" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useBookCard } from '@/composables/useBookCard'
import type { Book } from '@/types/unitTypes'
import UnitsList from './UnitsList.vue'
import Loader from '@/components/Loader.vue'
import { useLanguageStore } from '@/stores/languageStore' // Import languageStore

export default defineComponent({
  name: 'BookCard',
  props: {
    book: {
      type: Object as PropType<Book>,
      required: true,
    },
  },
  components: {
    UnitsList,
    Loader,
  },
  setup(props) {
    const languageStore = useLanguageStore() // Access language store properly here
    const {
      units,
      isExpanded,
      isLoading,
      showQuestion,
      startPracticing,
      toggleUnitsVisibility,
      subunitTitles,
      subscribeToViewAll,
    } = useBookCard(props.book)

    return {
      units,
      isExpanded,
      isLoading,
      showQuestion,
      startPracticing,
      toggleUnitsVisibility,
      subunitTitles,
      subscribeToViewAll,
      languageStore, // Make sure to return languageStore to be used in the template
    }
  },
})
</script>

<style scoped>
.card-title {
  font-weight: bold;
}

.card-subtitle {
  font-style: italic;
}

.card-body {
  display: flex;
  flex-direction: column;
}

h5,
h6 {
  margin-bottom: 0.5rem;
}

.btn {
  width: 100%; /* Make button full width */
}

/* Position "Start Practicing" button at the top-right corner */
.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}

.top-0 {
  top: 0;
}

.end-0 {
  right: 0;
}

.m-3 {
  margin: 1rem;
}

/* Styling for "Start Practicing" button */
.start-practicing-btn {
  background-color: #9dc7a7; /* Green background */
  border-color: #2f4b35; /* Green border */
  color: rgb(9, 9, 9);
  font-size: 0.8 rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: glowing 1.5s infinite ease-in-out; /* Add glowing effect animation */
}

/* Add a glowing animation */
@keyframes glowing {
  0% {
    box-shadow:
      0 0 5px #28a745,
      0 0 10px #28a745,
      0 0 15px #28a745,
      0 0 20px #28a745;
    background-color: #34d058; /* Slightly lighter green */
  }
  50% {
    box-shadow:
      0 0 10px #34d058,
      0 0 20px #34d058,
      0 0 30px #34d058,
      0 0 40px #34d058;
    background-color: #28a745;
  }
  100% {
    box-shadow:
      0 0 5px #28a745,
      0 0 10px #28a745,
      0 0 15px #28a745,
      0 0 20px #28a745;
    background-color: #34d058;
  }
}

.start-practicing-btn i {
  margin-right: 10px; /* Space between the icon and the text */
}

.start-practicing-btn:hover {
  transform: scale(1.05); /* Slight scale effect to draw attention */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Add a shadow for a raised effect */
}

.start-practicing-btn:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); /* Highlight the button when focused */
}
</style>
