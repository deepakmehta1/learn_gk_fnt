<template>
  <!-- Button component with optional custom class and click handler -->
  <button class="btn btn-primary" :class="customClass" @click="handleClick">
    <slot></slot>
    <!-- Slot for button content -->
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue' // Correct type-only import for PropType

export default defineComponent({
  name: 'Button',
  props: {
    customClass: {
      type: String, // Optional custom class for styling
      default: '',
    },
    onClick: {
      type: Function as PropType<() => void>, // Function to call on button click
      required: true,
    },
  },
  methods: {
    // Method to trigger the onClick function passed as a prop
    handleClick() {
      this.onClick() // Invoke the passed onClick function
    },
  },
})
</script>

<style scoped>
/* Custom button styles can be added here if needed */
</style>
