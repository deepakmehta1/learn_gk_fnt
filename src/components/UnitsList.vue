<template>
  <div v-if="units.length" class="mt-4">
    <h6>Units:</h6>
    <ol>
      <li v-for="unit in units" :key="unit.id">
        <!-- Dynamically access title_en or title_hi based on the current language -->
        <strong>{{ unit[`title_${languageStore.language}` as keyof typeof unit] }}</strong>
        <ol>
          <li v-for="subunit in unit.subunits" :key="subunit.id">
            {{ subunit[`title_${languageStore.language}` as keyof typeof subunit] }}
          </li>
        </ol>
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue' // Correct import for PropType
import { useLanguageStore } from '@/stores/languageStore' // Import the language store
import type { Unit } from '@/types/unitTypes' // Import the Unit type

export default defineComponent({
  name: 'UnitsList',
  props: {
    units: {
      type: Array as PropType<Unit[]>, // Use the centralized Unit type here
      required: true,
    },
  },
  setup() {
    const languageStore = useLanguageStore() // Access the language store
    return { languageStore }
  },
})
</script>

<style scoped>
ol {
  list-style-type: decimal; /* Makes the list numbered */
  padding-left: 20px;
}

li {
  margin-bottom: 0.5rem;
}

li strong {
  font-weight: bold;
}
</style>
