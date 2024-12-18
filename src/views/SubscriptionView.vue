<template>
  <div class="subscription-container">
    <h1 class="text-center mb-4">Choose Your Subscription</h1>
    <div class="card-group">
      <!-- Render subscription cards dynamically -->
      <div v-for="subscription in subscriptions" :key="subscription.id" class="card">
        <div class="card-body">
          <h5 class="card-title">{{ subscription.name }}</h5>
          <p class="card-text">{{ subscription.description }}</p>
          <p class="card-text"><strong>Cost: </strong>₹{{ subscription.cost }}</p>
          <button class="btn btn-primary" @click="subscribe(subscription.code)">
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getSubscriptions } from '@/api'
import type { Subscription } from '@/types/subscriptionTypes'

export default defineComponent({
  name: 'SubscriptionView',
  setup() {
    const subscriptions = ref<Subscription[]>([]) // Holds subscription data

    // Fetch subscriptions on component mount
    onMounted(async () => {
      try {
        const response = await getSubscriptions()
        subscriptions.value = response
      } catch (error) {
        console.error('Error fetching subscriptions:', error)
      }
    })

    // Handle subscription button click
    const subscribe = (subscriptionCode: string) => {
      console.log(`Subscribed to ${subscriptionCode}`)
      // Handle the actual subscription process here (e.g., navigate to a subscription page or update the store)
    }

    return {
      subscriptions,
      subscribe,
    }
  },
})
</script>

<style scoped>
.subscription-container {
  margin-top: 20px;
  width: 60%;
  margin-left: 20%;
}

.card-group {
  display: flex;
  justify-content: space-around;
}

.card {
  width: 45%;
  margin: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.card-body {
  text-align: center;
}

.card-title {
  font-size: 1.5rem;
}

.card-text {
  font-size: 1rem;
}

.btn {
  background-color: #28a745;
  color: white;
  width: 100%;
}
</style>
