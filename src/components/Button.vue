<!-- src/components/Button.vue -->
<template>
  <button class="btn btn-primary" :class="customClass" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
export default defineComponent({
  name: 'Button',
  props: {
    customClass: {
      type: String,
      default: '',
    },
    onClick: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  methods: {
    handleClick() {
      this.onClick()
    },
  },
})
</script>

<style scoped>
/* You can add custom button styles here if needed */
</style>
