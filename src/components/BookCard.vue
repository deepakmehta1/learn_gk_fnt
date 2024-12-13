<template>
  <div class="card shadow-sm position-relative">
    <!-- "Start Practicing" button at the top right with glowing effect -->
    <button
      class="btn btn-success position-absolute top-0 end-0 m-1 start-practicing-btn"
      style="width: 30%"
      @click="startPracticing"
    >
      <i class="fas fa-play-circle"></i> Start Practicing
    </button>

    <!-- Loader Component - This will be shown when the user clicks "Start Practicing" -->
    <Loader v-if="isLoading" :subunitTitles="subunitTitles" />

    <div class="card-body">
      <!-- Display title based on current language (en/hi) -->
      <h5 class="card-title">{{ book[`title_${languageStore.language}` as keyof typeof book] }}</h5>

      <!-- Display subtitle in the selected language -->
      <h6 class="card-subtitle mb-2 text-muted">
        {{ book[`title_${languageStore.language}` as keyof typeof book] }}
      </h6>

      <!-- Button to toggle the visibility of topics -->
      <button class="btn btn-primary mt-3" @click="toggleUnitsVisibility">
        {{ isExpanded ? 'Collapse Topics' : 'Expand Topics' }}
      </button>

      <!-- Conditionally render UnitsList if units data exists and topics are expanded -->
      <UnitsList v-if="isExpanded && units.length" :units="units" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import type { PropType } from 'vue' // Correct import for PropType
import { useLanguageStore } from '@/stores/languageStore' // Access language store
import { getBookDetails } from '@/api' // Fetch book details
import UnitsList from './UnitsList.vue' // UnitsList component
import type { Unit, Book } from '@/types/unitTypes' // Import Unit and Book types
import { useQuizStore } from '@/stores/quizStore' // Import the quiz store
import { useRouter } from 'vue-router' // To navigate to a new route
import Loader from '@/components/Loader.vue' // Import the Loader component

export default defineComponent({
  name: 'BookCard',
  props: {
    book: {
      type: Object as PropType<Book>, // Updated prop type to use the full Book type
      required: true,
    },
  },
  components: {
    UnitsList, // Register UnitsList component
    Loader, // Register the Loader component
  },
  setup(props) {
    const languageStore = useLanguageStore() // Access language store
    const units = ref<Unit[]>([]) // Units data
    const isExpanded = ref(false) // Track the visibility of units
    const quizStore = useQuizStore() // Access quiz store
    const router = useRouter() // To navigate to new route
    const isLoading = ref(false) // Track loader visibility

    // Reactive computed property for current language
    const currentLanguage = computed(() => languageStore.language)

    // Fetch book details when expanding the topics
    const toggleUnitsVisibility = async () => {
      if (!isExpanded.value) {
        // Fetch book details when expanding
        try {
          const bookDetails = await getBookDetails(props.book.id)
          units.value = bookDetails.units // Set units data
        } catch (error) {
          console.error('Error fetching book details:', error)
        }
      }
      isExpanded.value = !isExpanded.value // Toggle the expanded state
    }

    // Start practicing: save book in store and navigate to quiz playground
    const startPracticing = () => {
      isLoading.value = true // Show loader
      // Save current book in the store using the store instance
      quizStore.setCurrentBook(props.book)
      setTimeout(() => {
        // After 3 seconds, navigate to quiz playground
        router.push('/quiz-playground')
      }, 5000) // 5 seconds
    }

    // Get the titles of all subunits
    const subunitTitles = computed(() => {
      const subunitTitlesArray: string[] = []
      if (quizStore.currentBook) {
        quizStore.currentBook.units.forEach((unit) => {
          unit.subunits.forEach((subunit) => {
            subunitTitlesArray.push(subunit[`title_${languageStore.language}`])
          })
        })
      }
      return subunitTitlesArray
    })

    return {
      units,
      toggleUnitsVisibility,
      isExpanded,
      languageStore,
      currentLanguage,
      book_obj: props.book,
      startPracticing, // Expose the startPracticing method
      isLoading, // Expose the loading state
      subunitTitles,
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
