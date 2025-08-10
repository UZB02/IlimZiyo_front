<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <i :class="icon"></i>
        {{ title }}
      </h3>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <div :class="`w-3 h-3 bg-${color}-500 rounded-full`"></div>
        <span>{{ title.split(' ')[0] }} miqdori</span>
      </div>
    </div>
    <div class="h-80">
      <Chart :type="chartType" :data="chartData" :options="options" class="h-full" />
    </div>
  </div>
</template>

<script setup>
import Chart from 'primevue/chart'
const props = defineProps({
  title: String,
  icon: String,
  color: String,
  chartData: Object,
  options: Object,
  chartType: {
    type: String,
    default: 'bar'
  }
})
</script>
