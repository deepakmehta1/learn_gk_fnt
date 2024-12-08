<!-- src/components/UnitsList.vue -->
<template>
  <div v-if="units.length" class="mt-4">
    <h6>Units:</h6>
    <ul>
      <li v-for="unit in units" :key="unit.id">
        <strong>{{ unit.title_en }}</strong> ({{ unit.title_hi }})
        <ul>
          <li v-for="subunit in unit.subunits" :key="subunit.id">
            {{ subunit.title_en }} ({{ subunit.title_hi }})
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
export default defineComponent({
  name: 'UnitsList',
  props: {
    units: {
      type: Array as PropType<
        {
          id: number
          title_en: string
          title_hi: string
          subunits: Array<{ id: number; title_en: string; title_hi: string }>
        }[]
      >,
      required: true,
    },
  },
})
</script>

<style scoped>
ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  margin-bottom: 0.5rem;
}

li strong {
  font-weight: bold;
}
</style>
