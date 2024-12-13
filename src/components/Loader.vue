<template>
  <div v-if="isVisible" id="loader-wrapper">
    <div id="page">
      <div id="phrase_box">
        <!-- Scrollable container for phrases -->
        <div class="phrases-container">
          <div v-for="(phrase, index) in phrases" :key="index" class="phrase-item">
            <!-- Phrase text -->
            <span>{{ phrase }}</span>
            <!-- Emoji or tick mark animation -->
            <span v-if="showTick(index)" class="tick">✅</span>
          </div>
        </div>
      </div>

      <!-- Preloader spinner -->
      <div id="ighex">
        <div class="preloader loading">
          <span class="slice"></span>
          <span class="slice"></span>
          <span class="slice"></span>
          <span class="slice"></span>
          <span class="slice"></span>
          <span class="slice"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'Loader',
  props: {
    subunitTitles: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const isVisible = ref(true)
    const phrases = ref<string[]>(props.subunitTitles)
    const ticksVisible = ref<boolean[]>(new Array(props.subunitTitles.length).fill(false))

    // Show tick (or emoji) after a delay for each phrase
    const showTick = (index: number) => {
      setTimeout(() => {
        ticksVisible.value[index] = true
      }, index * 1000) // Show tick after a delay based on the index
      return ticksVisible.value[index]
    }

    // Hide the loader after 3 seconds
    onMounted(() => {
      setTimeout(() => {
        isVisible.value = false
      }, 5000) // 5 seconds
    })

    return { isVisible, phrases, showTick }
  },
})
</script>

<style scoped>
#loader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000000;
  background: rgba(0, 0, 0, 0.7); /* Dark background */
  display: flex;
  justify-content: center;
  align-items: center;
}

#page {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#phrase_box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  width: 260px;
  overflow: hidden; /* Hide any extra part of the scrolling phrases */
}

.phrases-container {
  display: flex;
  flex-direction: column;
  animation: scrollUp 15s linear infinite;
}

.phrase-item {
  font-size: 18px;
  color: white;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0;
  animation: fadeIn 1s forwards;
}

.tick {
  margin-left: 10px;
  font-size: 24px;
}

@keyframes scrollUp {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-100%);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

#ighex {
  bottom: 30px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
}

.preloader {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 10px;
  display: block;
  width: 3.75em;
  height: 4.25em;
  margin-left: -1.875em;
  margin-top: -2.125em;
  transform-origin: center center;
  animation: preload-flip 2s steps(2) infinite;
}

.preloader .slice {
  border-top: 1.125em solid transparent;
  border-right: none;
  border-bottom: 1em solid transparent;
  border-left: 1.875em solid #e74c3c;
  position: absolute;
  top: 0px;
  left: 50%;
  transform-origin: left bottom;
  border-radius: 3px 3px 0 0;
}

@keyframes preload-flip {
  0% {
    transform: rotateY(0deg) rotateZ(-60deg);
  }
  100% {
    transform: rotateY(360deg) rotateZ(-60deg);
  }
}
</style>
