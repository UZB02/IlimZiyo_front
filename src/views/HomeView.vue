<template>
  <div class="min-h-screen">
    <div class="mx-auto space-y-6">
      <!-- Header with Year Selector -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p class="text-gray-600">Boshqaruv paneli va statistikalar</p>
        </div>
        <div class="flex items-center gap-2 bg-white rounded-lg shadow-sm p-2">
          <i class="pi pi-calendar text-blue-500"></i>
          <Calendar
            v-model="selectedYear"
            view="year"
            dateFormat="yy"
            class=" border-0"
            @update:modelValue="loadDashboard"
            placeholder="Yil tanlang"
            :showIcon="false"
          />
        </div>
      </div>

      <!-- Statistics Cards -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <div v-for="i in 5" :key="'skeleton-card-' + i" class="bg-gray-100 animate-pulse rounded-xl h-28"></div>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <div 
          v-for="(item, index) in summary" 
          :key="item.label"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 rounded-lg" :class="getIconBackground(index)">
              <i :class="getIcon(index)" class="text-xl text-white"></i>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-600 mb-1">{{ item.label }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatNumber(item.value) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <!-- Applications Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <i class="pi pi-book text-blue-500"></i>
              Arizalar (oylar kesimida)
            </h3>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Arizalar soni</span>
            </div>
          </div>
          <div class="h-80">
            <div v-if="isLoading" class="w-full h-full bg-gray-100 animate-pulse rounded-lg"></div>
            <Chart v-else type="bar" :data="applicationChart" :options="chartOptions" class="h-full" />
          </div>
        </div>

        <!-- Payments + Expenses Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <i class="pi pi-chart-bar text-green-500"></i>
              To'lovlar va xarajatlar (oylar kesimida)
            </h3>
          </div>
          <div class="h-80">
            <div v-if="isLoading" class="w-full h-full bg-gray-100 animate-pulse rounded-lg"></div>
            <Chart v-else type="bar" :data="paymentExpenseChart" :options="enhancedChartOptions" class="h-full" />
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <i class="pi pi-clock text-purple-500"></i>
            So'nggi faoliyat
          </h3>
        </div>
        <div class="space-y-4">
          <div v-if="isLoading">
            <div v-for="i in 4" :key="'activity-skeleton-' + i" class="p-4 bg-gray-100 animate-pulse rounded-lg h-20"></div>
          </div>
          <div v-else>
            <div 
              v-for="(item, index) in activity" 
              :key="item.date"
              class="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
            >
              <div class="flex items-center gap-4">
                <div class="p-2 rounded-lg" :class="getActivityIcon(item.type).bg">
                  <i :class="getActivityIcon(item.type).icon" class="text-white text-sm"></i>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ item.type }}</p>
                  <p class="text-sm text-gray-600">{{ item.description }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ formatDate(item.date) }}</p>
                <p class="text-xs text-gray-400">{{ formatTime(item.date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Chart from 'primevue/chart'
import Calendar from 'primevue/calendar'

const adminId = JSON.parse(sessionStorage.getItem('admin'))
const selectedYear = ref(new Date())
const isLoading = ref(true)

const summary = ref([])
const applicationChart = ref({})
const paymentExpenseChart = ref({})
const balanceChart = ref({})
const activity = ref([])

const formatNumber = (value) => new Intl.NumberFormat('uz-UZ').format(value)
const formatDate = (date) => new Date(date).toLocaleDateString('uz-UZ', {
  day: 'numeric', month: 'short'
})
const formatTime = (date) => new Date(date).toLocaleTimeString('uz-UZ', {
  hour: '2-digit', minute: '2-digit'
})

const getIconBackground = (index) => [
  'bg-gradient-to-r from-blue-500 to-blue-600',
  'bg-gradient-to-r from-green-500 to-green-600',
  'bg-gradient-to-r from-pink-500 to-pink-600',
  'bg-gradient-to-r from-orange-500 to-orange-600',
  'bg-gradient-to-r from-purple-500 to-purple-600'
][index % 5]

const getIcon = (index) => [
  'pi pi-credit-card',
  'pi pi-money-bill',
  'pi pi-minus-circle',
  'pi pi-book',
  'pi pi-users'
][index % 5]

const getActivityIcon = (type) => ({
  'Ariza': { icon: 'pi pi-book', bg: 'bg-blue-500' },
  'To\'lov': { icon: 'pi pi-credit-card', bg: 'bg-green-500' },
  'Xarajat': { icon: 'pi pi-minus-circle', bg: 'bg-red-500' },
  'default': { icon: 'pi pi-info-circle', bg: 'bg-gray-500' }
})[type] || { icon: 'pi pi-info-circle', bg: 'bg-gray-500' }

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      callbacks: {
        label: (context) => {
          const label = context.dataset.label || '';
          const value = context.raw;
          if (label.toLowerCase().includes('ariza')) {
            return ` ${label}: ${value.toLocaleString()} ta`;
          } else {
            return ` ${label}: ${value.toLocaleString()} so'm`;
          }
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
      ticks: { color: '#6B7280', font: { size: 12 }, callback: (value) => `${value.toLocaleString()}` }
    },
    x: {
      grid: { display: false },
      ticks: { color: '#6B7280', font: { size: 12 } }
    }
  }
}

const enhancedChartOptions = {
  ...chartOptions,
  plugins: {
    ...chartOptions.plugins,
    legend: { display: true },
    tooltip: {
      ...chartOptions.plugins.tooltip,
      callbacks: {
        label: (context) => ` ${context.dataset.label}: ${context.raw.toLocaleString()} so'm`
      }
    }
  }
}

const lineChartOptions = {
  ...chartOptions,
  elements: {
    point: { radius: 4, hoverRadius: 6 },
    line: { tension: 0.4 }
  }
}

const loadDashboard = async () => {
  isLoading.value = true
  try {
    const year = selectedYear.value.getFullYear()
    const yearQuery = `?year=${year}`

    const [summaryRes, appRes, payRes, expRes, balRes, actRes] = await Promise.all([
      axios.get(`/dashboard/summary/${adminId.id}${yearQuery}`),
      axios.get(`/dashboard/applications-by-month/${adminId.id}${yearQuery}`),
      axios.get(`/dashboard/payments-by-month/${adminId.id}${yearQuery}`),
      axios.get(`/dashboard/expenses-by-month/${adminId.id}${yearQuery}`),
      axios.get(`/dashboard/balance-by-month/${adminId.id}${yearQuery}`),
      axios.get(`/dashboard/recent-activity/${adminId.id}`)
    ])

    summary.value = summaryRes.data

    applicationChart.value = {
      labels: appRes.data.labels,
      datasets: [{
        label: 'Arizalar',
        data: appRes.data.values,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false
      }]
    }

    paymentExpenseChart.value = {
      labels: payRes.data.labels,
      datasets: [
        {
          label: "To'lovlar",
          data: payRes.data.values,
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false
        },
        {
          label: "Xarajatlar",
          data: expRes.data.values,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false
        }
      ]
    }

    balanceChart.value = {
      labels: balRes.data.labels,
      datasets: [{
        label: "Balans",
        data: balRes.data.values,
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(249, 115, 22)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    }

    activity.value = actRes.data
  } catch (err) {
    console.error("Dashboard ma'lumotlarini yuklashda xatolik:", err)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadDashboard)
</script>
