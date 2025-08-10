<!-- components/Expense/StatisticsCards.vue -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <!-- Last Expense -->
    <Card class="shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <template #content>
        <div class="relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full -translate-y-4 translate-x-4"></div>
          <div class="relative z-10">
            <div class="flex justify-between items-start mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <i class="pi pi-wallet text-white text-lg"></i>
              </div>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Balans</p>
              <h2 class="text-lg font-bold text-gray-800">
                {{ balance ? formatCurrency(balance.balance) : 'Mavjud emas' }}
              </h2>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Total Amount -->
    <Card class="shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <template #content>
        <div class="relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full -translate-y-4 translate-x-4"></div>
          <div class="relative z-10">
            <div class="flex justify-between items-start mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <i class="pi pi-dollar text-white text-lg"></i>
              </div>
              <Tag 
                :value="`${monthlyGrowth > 0 ? '+' : ''}${monthlyGrowth}%`" 
                :severity="monthlyGrowth > 0 ? 'danger' : 'success'" 
                class="text-xs"
              />
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Umumiy xarajat</p>
              <h2 class="text-2xl font-bold text-gray-800">{{ formatCurrency(totalAmount) }}</h2>
            </div>
          </div>
        </div>
      </template>
    </Card>

     <!-- Total Expenses -->
    <Card class="shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <template #content>
        <div class="relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-400/20 to-pink-500/20 rounded-full -translate-y-4 translate-x-4"></div>
          <div class="relative z-10">
            <div class="flex justify-between items-start mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <i class="pi pi-file text-white text-lg"></i>
              </div>
              <Tag value="Jami" severity="danger" class="text-xs" />
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Jami xarajatlar</p>
              <h2 class="text-2xl font-bold text-gray-800">{{ expenses.length }} ta</h2>
            </div>
          </div>
        </div>
      </template>
    </Card>
    <!-- Average Expense -->
    <Card class="shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <template #content>
        <div class="relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full -translate-y-4 translate-x-4"></div>
          <div class="relative z-10">
            <div class="flex justify-between items-start mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                <i class="pi pi-chart-bar text-white text-lg"></i>
              </div>
              <Tag value="O'rtacha" severity="success" class="text-xs" />
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">O'rtacha xarajat</p>
              <h2 class="text-lg font-bold text-gray-800">{{ formatCurrency(averageExpense) }}</h2>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import { defineProps } from 'vue'

const props = defineProps({
  expenses: Array,
  monthlyGrowth: Number,
  totalAmount: Number,
  averageExpense: Number,
  balance: Object,
  formatCurrency: Function,
  formatDate: Function
})
</script>
