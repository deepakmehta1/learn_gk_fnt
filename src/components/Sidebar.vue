<template>
  <div>
    <!-- Sidebar Toggle Button for Mobile (Show when collapsed) -->
    <button
      v-if="isMobile && !isSidebarVisible"
      class="btn btn-dark sidebar-toggle-btn"
      @click="toggleSidebar"
      aria-label="Expand Sidebar"
    >
      <span class="fa fa-arrow-right"></span>
    </button>

    <!-- Sidebar (Hidden on Mobile) -->
    <div
      id="sidebar-container"
      :class="{
        'sidebar-expanded': isSidebarVisible,
        'd-none': !isSidebarVisible && isMobile,
      }"
      class="d-md-block"
    >
      <!-- Close Button on Mobile at top right corner -->
      <button
        v-if="isSidebarVisible && isMobile"
        class="btn btn-dark sidebar-close-btn"
        @click="toggleSidebar"
        aria-label="Collapse Sidebar"
      >
        <span class="fa fa-times"></span>
      </button>

      <!-- Sidebar Content -->
      <ul class="list-group">
        <li class="list-group-item sidebar-separator-title">Book Progress</li>

        <!-- Iterate over units and subunits -->
        <li
          v-for="(unit, unitIndex) in quizStore.currentBook?.units"
          :key="unit.id"
          class="list-group-item bg-dark text-white"
        >
          <div class="d-flex justify-content-start" @click="toggleUnitExpansion(unitIndex)">
            <span class="fa fa-book mr-3"></span>
            <span>{{ unit[`title_${languageStore.language}`] }}</span>

            <!-- Add an indicator for expansion/collapse -->
            <span class="expand-collapse-indicator">
              {{ isUnitExpanded(unitIndex) ? '-' : '+' }}
            </span>
          </div>

          <ul class="list-group" v-if="isUnitExpanded(unitIndex)">
            <li
              v-for="subunit in unit.subunits"
              :key="subunit.id"
              class="list-group-item"
              :class="{
                'bg-success': isCurrentSubunit(subunit),
                'text-white': isCurrentSubunit(subunit),
                'bg-secondary': !isCurrentSubunit(subunit),
                blurry: !subunit.is_preview, // Add blurry class conditionally
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
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useQuizStore } from '@/stores/quizStore' // Access quiz store
import { useLanguageStore } from '@/stores/languageStore' // Access language store
import { getUserProgress } from '@/api' // Import the API function to fetch user progress
import type { UserProgress } from '@/types/progressTypes' // Import the UserProgress type
import type { Subunit } from '@/types/unitTypes'

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const quizStore = useQuizStore() // Access quiz store
    const languageStore = useLanguageStore() // Access language store
    const currentSubunitId = ref<number | null>(null)
    const currentExpandedUnit = ref<number | null>(null) // Track the currently expanded unit
    const isSidebarVisible = ref(false) // Track whether the sidebar is visible on mobile
    const isMobile = computed(() => window.innerWidth <= 768) // Detect if it's mobile screen

    // Fetch the user's progress on component mount
    onMounted(async () => {
      if (quizStore.currentBook) {
        try {
          const progress: UserProgress = await getUserProgress(quizStore.currentBook.id) // Use the typed response
          const recentQuestion = progress.recent_question_details[0]
          currentSubunitId.value = recentQuestion.sub_unit_id

          // Set the current expanded unit based on the current unit
          currentExpandedUnit.value = quizStore.currentUnitIndex // Expand the current unit by default
        } catch (error) {
          console.error('Error fetching user progress:', error)
        }
      }
    })

    // Computed to get the current subunit based on the user's progress
    const currentSubunit = computed(() => {
      const currentUnit = quizStore.getSortedUnits()[quizStore.currentUnitIndex]
      return quizStore.getSortedSubunits(currentUnit)[quizStore.currentSubunitIndex]
    })

    // Function to check if the subunit is the current one
    const isCurrentSubunit = (subunit: Subunit) => {
      return subunit.id === currentSubunit.value?.id
    }

    // Function to check if a unit is expanded
    const isUnitExpanded = (unitIndex: number) => {
      return currentExpandedUnit.value === unitIndex
    }

    // Toggle the expanded state of the unit
    const toggleUnitExpansion = (unitIndex: number) => {
      currentExpandedUnit.value = currentExpandedUnit.value === unitIndex ? null : unitIndex
    }

    // Toggle sidebar visibility on mobile
    const toggleSidebar = () => {
      isSidebarVisible.value = !isSidebarVisible.value
    }

    return {
      quizStore,
      languageStore,
      currentSubunit,
      isCurrentSubunit,
      isUnitExpanded,
      toggleUnitExpansion,
      toggleSidebar,
      isSidebarVisible,
      isMobile,
    }
  },
})
</script>

<style scoped>
#sidebar-container {
  min-height: 100vh;
  background-color: #333;
  padding: 0;
  transition: transform 0.3s ease-in-out; /* Added transition for smooth slide */
}

/* Sidebar is collapsed on mobile (d-none) and displayed on larger screens (d-md-block) */
.sidebar-expanded {
  width: 300px;
  transform: translateX(0); /* Slide-in effect */
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

.blurry {
  filter: blur(5px);
}

.expand-collapse-indicator {
  margin-left: auto;
  font-size: 1.2rem;
  cursor: pointer;
  color: #fff;
}

/* Sidebar toggle button for mobile */
.sidebar-toggle-btn {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background-color: #28a745;
  color: white;
  font-size: 1rem;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
}

/* Close Button for Sidebar on Mobile at top right corner */
.sidebar-close-btn {
  position: absolute;
  right: 10px; /* Move the close button to the top right */
  z-index: 1001;
  background-color: #dc3545;
  color: white;
  font-size: 1rem;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
}

/* Hide sidebar on mobile */
@media (max-width: 768px) {
  #sidebar-container {
    display: none;
  }

  #sidebar-container.sidebar-expanded {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    width: 300px;
    background-color: #333;
    height: 100vh;
    transform: translateX(0); /* Sidebar fully visible */
  }
}
</style>
