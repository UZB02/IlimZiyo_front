<template>
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p class="text-gray-600">Boshqaruv paneli va statistikalar</p>
    </div>
    <div class="flex items-center gap-2 bg-white rounded-lg shadow-sm p-2">
      <i class="pi pi-calendar text-blue-500"></i>
      <Calendar
        v-model="year"
        view="year"
        dateFormat="yy"
        class="border-0"
        @update:modelValue="emit('update:year')"
        placeholder="Yil tanlang"
        :showIcon="false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Calendar from 'primevue/calendar'

const props = defineProps({ selectedYear: Date })
const emit = defineEmits(['update:year'])

const year = ref(props.selectedYear)
watch(() => props.selectedYear, (newVal) => {
  year.value = newVal
})
</script>
