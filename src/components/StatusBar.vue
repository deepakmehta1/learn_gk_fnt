<template>
  <div class="status-bar">
    <h4>Quiz Progress</h4>
    <ul>
      <li v-for="(unit, unitIndex) in book?.units" :key="unitIndex" class="unit">
        <h5>{{ unit[`title_${languageStore.language}`] }}</h5>
        <ul>
          <li
            v-for="(subunit, subunitIndex) in unit.subunits"
            :key="subunitIndex"
            :class="{ active: isActive(subunit) }"
          >
            {{ subunit[`title_${languageStore.language}`] }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useLanguageStore } from '@/stores/languageStore' // Access language store
import type { Book, Subunit } from '@/types/unitTypes' // Import Book and Subunit types

export default defineComponent({
  name: 'StatusBar',
  props: {
    book: {
      type: Object as () => Book | null,
      required: true,
    },
    currentSubunit: {
      type: Object as () => Subunit | null, // Correct type for subunit
      required: true,
    },
  },
  setup(props) {
    const languageStore = useLanguageStore()

    // Function to check if a subunit is the current one
    const isActive = (subunit: Subunit) => {
      return subunit.id === props.currentSubunit?.id
    }

    return {
      languageStore,
      isActive,
    }
  },
})
</script>

<style scoped>
.status-bar {
  padding: 10px;
  background-color: #f1f1f1;
}

.status-bar ul {
  list-style-type: none;
  padding-left: 0;
}

.status-bar li {
  opacity: 0.5;
}

.status-bar li.active {
  opacity: 1;
}

.status-bar li h5 {
  font-size: 18px;
  font-weight: bold;
}
</style>
