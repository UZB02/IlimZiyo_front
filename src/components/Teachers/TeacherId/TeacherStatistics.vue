<template>
  <Card>
    <template #title>
      <div class="flex items-center space-x-2">
        <i class="pi pi-chart-bar text-purple-500"></i>
        <span>Maosh statistikasi</span>
      </div>
    </template>

    <template #content>
      <div class="space-y-4">
        <div class="stat-card bg-blue-50 text-blue-600">
          <i class="pi pi-percentage" /> Belgilangan ulush
          <span>{{ teacherSalaryStats.percentage }} %</span>
        </div>

        <div class="stat-card bg-green-50 text-green-600">
          <i class="pi pi-money-bill" /> Oylik maosh
          <span>{{ formatCurrency(teacherSalaryStats.calculatedSalary) }}</span>
        </div>

        <div class="stat-card bg-orange-50 text-orange-600">
          <i class="pi pi-bookmark-fill" /> To'landi
          <span>{{ formatCurrency(teacherSalaryStats.totalPaidOut) }}</span>
        </div>

        <div class="stat-card bg-red-50 text-red-600">
          <i class="pi pi-dollar" /> Qoldi
          <span>{{ formatCurrency(teacherSalaryStats.remainingSalary) }}</span>
        </div>

        <!-- ✅ Qarzdorlik bo‘lsa, ko‘rsatamiz -->
        <div
          v-if="teacherSalaryStats.isOverpaid"
          class="stat-card bg-pink-50 text-pink-600 border border-pink-400"
        >
          <i class="pi pi-exclamation-triangle" /> Ortiqcha to‘lov (qarzdorlik)
          <span>{{ formatCurrency(teacherSalaryStats.overpaid) }}</span>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'

defineProps(['teacherSalaryStats'])

const formatCurrency = (amount) =>
  new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0
  }).format(amount)
</script>

<style scoped>
</style>
