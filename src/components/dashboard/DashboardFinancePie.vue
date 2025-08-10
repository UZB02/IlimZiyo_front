<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
    <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
      <i class="pi pi-chart-pie text-indigo-500"></i>
      To'lov va Xarajatlar Taqqoslash
    </h3>
    <div class=" flex justify-center items-center">
      <Chart type="pie" :data="chartData" :options="chartOptions" class="w-full max-w-md" />
    </div>
  </div>
</template>

<script setup>
import Chart from 'primevue/chart'
const props = defineProps({
  chartData: Object
})

const chartOptions = {
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#6B7280',
        font: { size: 14 }
      }
    },
    tooltip: {
      callbacks: {
        label: (context) =>
          `${context.label}: ${context.raw.toLocaleString()} so'm`
      }
    }
  }
}
</script>
