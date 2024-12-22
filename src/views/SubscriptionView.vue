<template>
  <div class="subscription-container">
    <h1 class="text-center mb-4">Choose Your Subscription</h1>

    <!-- Cards container with Bootstrap grid -->
    <div class="card-deck row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-2">
      <!-- Render subscription cards dynamically -->
      <div v-for="subscription in subscriptions" :key="subscription.id" class="col">
        <div class="card h-100">
          <img
            :src="subscription.code === 'full_subscription' ? '/multi-books.png' : '/book.png'"
            class="card-img-top"
            alt="Subscription Image"
          />
          <div class="card-body">
            <h5 class="card-title">{{ subscription.name }}</h5>
            <p class="card-text">{{ subscription.description }}</p>
            <p class="card-text"><strong>Cost: </strong>₹{{ subscription.cost }} for a month</p>

            <!-- Dropdown for base subscription -->
            <div v-if="subscription.code === 'base_subscription'">
              <label for="bookSelect">Select a Book:</label>
              <select id="bookSelect" v-model="selectedBook" class="form-select">
                <option v-for="book in books" :key="book.id" :value="book.id">
                  {{ book[`title_${languageStore.language}`] }}
                </option>
              </select>
            </div>

            <!-- Subscribe button -->
            <button class="btn btn-primary w-100" @click="subscribe(subscription.code)">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for subscription result -->
    <div v-if="showModal" class="modal">
      <div class="modal-content" :class="{ 'success-modal': isSuccess, 'error-modal': !isSuccess }">
        <span class="close-btn" @click="showModal = false">&times;</span>
        <div v-if="isSuccess">
          <h3>Subscription Successful!</h3>
          <p>Your subscription has been applied successfully.</p>
        </div>
        <div v-else>
          <h3>Subscription Failed</h3>
          <p>{{ errorMessage }}</p>
        </div>
        <button class="btn btn-primary" @click="goToHome">Go to Home</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getSubscriptions, getBooks, createSubscription } from '@/api'
import type { Subscription } from '@/types/subscriptionTypes'
import type { Book } from '@/types/unitTypes'
import { useLanguageStore } from '@/stores/languageStore' // For language management
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'SubscriptionView',
  setup() {
    const subscriptions = ref<Subscription[]>([]) // Holds subscription data
    const books = ref<Book[]>([]) // Holds book data for dropdown
    const selectedBook = ref<number | null>(null) // Holds the selected book
    const languageStore = useLanguageStore() // Access language store
    const router = useRouter() // For navigation
    const showModal = ref(false) // Controls modal visibility
    const isSuccess = ref(true) // Determines success or failure of the subscription
    const errorMessage = ref('') // Stores the error message if subscription fails

    // Fetch subscriptions and books on component mount
    onMounted(async () => {
      try {
        // Fetch subscription data
        const response = await getSubscriptions()
        subscriptions.value = response

        // Fetch books data for the dropdown
        const booksResponse = await getBooks()
        books.value = booksResponse

        // Set default book for base subscription dropdown (first book)
        if (books.value.length > 0) {
          selectedBook.value = books.value[0].id
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    })

    // Handle subscription button click
    const subscribe = async (subscriptionCode: string) => {
      if (subscriptionCode === 'base_subscription' && selectedBook.value === null) {
        console.error('Please select a book for Base Subscription')
        return
      }

      try {
        const bookId = subscriptionCode === 'base_subscription' ? selectedBook.value : null
        const response = await createSubscription(subscriptionCode, bookId)

        if (response && response.status === 200) {
          isSuccess.value = true
        } else {
          isSuccess.value = false
          errorMessage.value =
            response?.detail || 'An error occurred while processing your subscription.'
        }

        showModal.value = true // Show modal after response
      } catch (error) {
        isSuccess.value = false
        errorMessage.value =
          error?.response?.data?.detail || 'An error occurred while processing your subscription.'
        showModal.value = true // Show modal after error
      }
    }

    // Navigate to the home route
    const goToHome = () => {
      router.push('/')
    }

    return {
      subscriptions,
      books,
      selectedBook,
      subscribe,
      languageStore,
      showModal,
      isSuccess,
      errorMessage,
      goToHome,
    }
  },
})
</script>

<style scoped>
.subscription-container {
  margin-top: 5%;
  padding: 0 15px;
}

.card-deck {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-img-top {
  height: 300px;
  width: 300px;
  object-fit: cover;
  margin-left: 20%;
}

.card-body {
  text-align: center;
}

.card-title {
  font-size: 1.2rem;
}

.card-text {
  font-size: 1rem;
}

.btn {
  background-color: #92a04c;
  color: white;
  width: 100%;
}

select {
  margin-top: 10px;
  background-color: antiquewhite;
}

/* Modal Styling */
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
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  text-align: center;
}

/* Success Modal */
.success-modal {
  color: green;
}

.error-modal {
  color: red;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 30px;
  cursor: pointer;
}

button {
  margin-top: 20px;
}

/* Mobile Friendly Adjustments using Bootstrap classes */
@media (max-width: 768px) {
  .subscription-container {
    padding: 0 10px;
  }

  /* Cards will be stacked one over the other on mobile */
  .card-deck {
    display: grid;
    grid-template-columns: 1fr; /* 1 card per row on mobile */
    gap: 15px; /* Adjusting gap between cards */
  }

  .card {
    margin-bottom: 10px;
  }

  .card-img-top {
    height: 100px;
    width: 100px;
    object-fit: cover;
    margin-left: 35%;
  }

  .modal-content {
    width: 80%; /* Modal width adjustment for smaller screens */
  }
}
</style>
