<template>
  <div class="subscription-container">
    <h1 class="text-center mb-4">Choose Your Subscription</h1>
    <div class="card-group">
      <!-- First Subscription Card -->
      <div class="card">
        <!-- <img src="/path/to/your-image1.jpg" class="card-img-top" alt="Subscription Type 1"> -->
        <div class="card-body">
          <h5 class="card-title">Subscription Type 1</h5>
          <p class="card-text">Access to basic content, limited questions, and features.</p>
          <a href="#" class="btn btn-primary">Subscribe Now</a>
        </div>
      </div>

      <!-- Second Subscription Card -->
      <div class="card">
        <!-- <img src="/path/to/your-image2.jpg" class="card-img-top" alt="Subscription Type 2"> -->
        <div class="card-body">
          <h5 class="card-title">Subscription Type 2</h5>
          <p class="card-text">
            Access to premium content, unlimited questions, and additional features.
          </p>
          <a href="#" class="btn btn-primary">Subscribe Now</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SubscriptionView',
}
</script>

<style scoped>
.subscription-container {
  margin-top: 20px;
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
