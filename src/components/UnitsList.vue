<template>
  <div v-if="units.length" class="mt-4">
    <h6>Units:</h6>
    <ol>
      <!-- Loop through units and display them -->
      <li v-for="unit in units" :key="unit.id">
        <!-- Dynamically access title_en or title_hi based on current language -->
        <strong>{{ unit[`title_${languageStore.language}` as keyof typeof unit] }}</strong>
        <!-- Display question count for each unit -->
        <span>({{ unit.question_count }} questions)</span>

        <ol>
          <!-- Loop through subunits and display them -->
          <li v-for="subunit in unit.subunits" :key="subunit.id">
            {{ subunit[`title_${languageStore.language}` as keyof typeof subunit] }}
            <!-- Display question count for each subunit -->
            <span>({{ subunit.question_count }} questions)</span>
          </li>
        </ol>
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue' // Import type for PropType
import { useLanguageStore } from '@/stores/languageStore' // Access language store
import type { Unit } from '@/types/unitTypes' // Import the Unit type

export default defineComponent({
  name: 'UnitsList',
  props: {
    units: {
      type: Array as PropType<Unit[]>, // Type the units prop as an array of Unit objects
      required: true,
    },
  },
  setup() {
    const languageStore = useLanguageStore() // Access the language store
    return { languageStore } // Make languageStore available to the template
  },
})
</script>

<style scoped>
ol {
  list-style-type: decimal; /* Numbered list style */
  padding-left: 20px; /* Indent the list */
}

li {
  margin-bottom: 0.5rem; /* Add spacing between list items */
}

li strong {
  font-weight: bold; /* Make unit titles bold */
}

span {
  font-size: 0.9rem; /* Make question count text slightly smaller */
  color: #6c757d; /* Add a muted color for question count */
}
</style>
