<template>
  <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
    <DashboardChartCard
      title="Arizalar (oylik)"
      icon="pi pi-file"
      color="blue"
      :chartData="applicationChart"
      :options="chartOptions"
    />
    <!-- <DashboardChartCard
      title="To'lovlar (oylik)"
      icon="pi pi-credit-card"
      color="green"
      :chartData="paymentChart"
      :options="enhancedChartOptions"
    />
    <DashboardChartCard
      title="Xarajatlar (oylik)"
      icon="pi pi-minus-circle"
      color="red"
      :chartData="expenseChart"
      :options="enhancedChartOptions"
    /> -->
    <DashboardChartCard
      title="Joriy balans (oylik)"
      icon="pi pi-chart-line"
      color="orange"
      :chartData="balanceChart"
      :options="lineChartOptions"
      chartType="line"
    />
  </div>
</template>

<script setup>
import DashboardChartCard from './DashboardChartCard.vue'
const props = defineProps({
  applicationChart: Object,
  paymentChart: Object,
  expenseChart: Object,
  balanceChart: Object,
  chartOptions: Object,
  enhancedChartOptions: Object,
  lineChartOptions: Object
})
</script>
