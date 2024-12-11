<template>
  <div id="sidebar-container" class="sidebar-expanded">
    <!-- Timeline -->
    <ul class="list-group">
      <li class="list-group-item sidebar-separator-title text-muted">Book Progress</li>

      <!-- Iterate over units and subunits -->
      <li
        v-for="unit in quizStore.currentBook?.units"
        :key="unit.id"
        class="list-group-item bg-dark text-white"
      >
        <div class="d-flex justify-content-start">
          <span class="fa fa-book mr-3"></span>
          <span>{{ unit[`title_${languageStore.language}`] }}</span>
        </div>

        <ul class="list-group">
          <li
            v-for="subunit in unit.subunits"
            :key="subunit.id"
            class="list-group-item"
            :class="{
              'bg-success': isCurrentSubunit(subunit),
              'text-white': isCurrentSubunit(subunit),
              'bg-secondary': !isCurrentSubunit(subunit),
            }"
          >
            <div class="d-flex justify-content-between subunit-title">
              <span>{{ subunit[`title_${languageStore.language}`] }}</span>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useQuizStore } from '@/stores/quizStore' // Access quiz store
import { useLanguageStore } from '@/stores/languageStore' // Access language store

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const quizStore = useQuizStore() // Access quiz store
    const languageStore = useLanguageStore() // Access language store

    // Computed to get the current subunit based on the current question index
    const currentSubunit = computed(() => {
      const currentUnit = quizStore.currentBook?.units[0] // Access the first unit
      return currentUnit?.subunits[quizStore.currentQuestionIndex]
    })

    // Function to check if the subunit is the current one
    const isCurrentSubunit = (subunit: any) => {
      return subunit.id === currentSubunit.value?.id
    }

    return {
      quizStore,
      languageStore,
      currentSubunit,
      isCurrentSubunit,
    }
  },
})
</script>

<style scoped>
#sidebar-container {
  min-height: 100vh;
  background-color: #333;
  padding: 0;
}

.sidebar-expanded {
  width: 300px;
}

.sidebar-separator-title {
  background-color: #333;
  height: 35px;
  padding: 10px;
  font-size: 18px;
  color: #fff;
}

.list-group-item {
  background-color: #333;
  color: #fff;
}

.list-group-item.bg-dark {
  background-color: #333;
}

.list-group-item.bg-secondary {
  background-color: #444;
}

.list-group-item.bg-success {
  background-color: #28a745 !important;
}

.list-group-item.text-white {
  color: white;
}

.fa-book {
  font-size: 18px;
}

.sidebar-separator {
  background-color: #333;
  height: 25px;
}

.subunit-title {
  font-size: 14px;
}
</style>
