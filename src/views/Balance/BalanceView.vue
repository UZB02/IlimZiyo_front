<template>
  <div class="min-h-screen ">
    <!-- Header Section -->
    <Card class="mb-6 shadow-lg border-0">
      <template #content>
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <i class="pi pi-chart-line text-white text-xl"></i>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Moliyaviy hisobot</h1>
              <p class="text-gray-600 text-sm md:text-base">Joriy moliyaviy holat va statistika</p>
            </div>
          </div>
          <div class="flex gap-2 w-full md:w-auto">
            <Button 
              @click="refreshData" 
              :loading="isLoading"
              icon="pi pi-refresh" 
              label="Yangilash"
              class="flex-1 md:flex-none"
              severity="info"
            />
            <!-- <Button 
              @click="exportData" 
              icon="pi pi-download" 
              label="Eksport"
              class="flex-1 md:flex-none"
              outlined
            /> -->
          </div>
        </div>
      </template>
    </Card>

    <!-- Balance Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <!-- Income Card -->
      <Card class="shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <template #content>
          <div class="relative overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full -translate-y-8 translate-x-8"></div>
            
            <div class="relative z-10">
              <div class="flex justify-between items-start mb-4">
                <div class="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <i class="pi pi-arrow-down-left text-white text-xl"></i>
                </div>
                <Tag 
                  :value="`+${incomeGrowth}%`" 
                  severity="success" 
                  class="text-xs font-semibold"
                  icon="pi pi-arrow-up"
                />
              </div>
              
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-1">Kirimlar</h3>
                <p class="text-sm text-gray-500">Umumiy to'lovlar</p>
                <div class="mt-3">
                  <span class="text-3xl font-bold text-gray-800">{{ formatNumber(balanceData.income) }}</span>
                  <span class="text-lg text-gray-500 ml-2">so'm</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Outcome Card -->
      <Card class="shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <template #content>
          <div class="relative overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/20 to-rose-500/20 rounded-full -translate-y-8 translate-x-8"></div>
            
            <div class="relative z-10">
              <div class="flex justify-between items-start mb-4">
                <div class="w-14 h-14 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <i class="pi pi-arrow-up-right text-white text-xl"></i>
                </div>
                <Tag 
                  :value="`-${outcomeGrowth}%`" 
                  severity="danger" 
                  class="text-xs font-semibold"
                  icon="pi pi-arrow-down"
                />
              </div>
              
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-1">Chiqimlar</h3>
                <p class="text-sm text-gray-500">Umumiy xarajatlar</p>
                <div class="mt-3">
                  <span class="text-3xl font-bold text-gray-800">{{ formatNumber(balanceData.outcome) }}</span>
                  <span class="text-lg text-gray-500 ml-2">so'm</span>
                </div>
              </div>
              
            </div>
          </div>
        </template>
      </Card>

      <!-- Balance Card -->
      <Card class="shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 md:col-span-2 lg:col-span-1">
        <template #content>
          <div class="relative overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full -translate-y-8 translate-x-8"></div>
            
            <div class="relative z-10">
              <div class="flex justify-between items-start mb-4">
                <div class="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <i class="pi pi-wallet text-white text-xl"></i>
                </div>
                <Tag 
                  :value="`${balanceChangePercent}%`" 
                  :severity="balanceData.balance >= 0 ? 'success' : 'danger'" 
                  class="text-xs font-semibold"
                  :icon="balanceData.balance >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
                />
              </div>
              
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-1">Joriy balans</h3>
                <p class="text-sm text-gray-500">Hozirgi holat</p>
                <div class="mt-3">
                  <span 
                    class="text-3xl font-bold"
                    :class="balanceData.balance >= 0 ? 'text-gray-800' : 'text-red-600'"
                  >
                    {{ formatNumber(Math.abs(balanceData.balance)) }}
                  </span>
                  <span class="text-lg text-gray-500 ml-2">so'm</span>
                </div>
              </div>
              
              <div class="flex items-center gap-2 p-3 rounded-lg" :class="getBalanceStatusClass()">
                <i :class="getBalanceStatusIcon()" class="text-sm"></i>
                <span class="text-sm font-medium">{{ getBalanceStatusText() }}</span>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Additional Info Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Quick Stats -->
      <!-- <Card class="shadow-lg border-0">
        <template #header>
          <div class="flex items-center gap-3 p-6 pb-0">
            <i class="pi pi-clock text-blue-600 text-xl"></i>
            <h3 class="text-xl font-semibold text-gray-800">Tezkor ma'lumot</h3>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <i class="pi pi-calendar text-white text-sm"></i>
                </div>
                <span class="text-gray-700 font-medium">Bugungi to'lovlar</span>
              </div>
              <span class="text-lg font-bold text-gray-800">{{ formatNumber(dailyIncome) }} so'm</span>
            </div>
            
            <div class="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <i class="pi pi-users text-white text-sm"></i>
                </div>
                <span class="text-gray-700 font-medium">Faol o'quvchilar</span>
              </div>
              <span class="text-lg font-bold text-gray-800">{{ activeStudents }}</span>
            </div>
            
            <div class="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <i class="pi pi-chart-bar text-white text-sm"></i>
                </div>
                <span class="text-gray-700 font-medium">O'rtacha to'lov</span>
              </div>
              <span class="text-lg font-bold text-gray-800">{{ formatNumber(averagePayment) }} so'm</span>
            </div>
          </div>
        </template>
      </Card> -->

      <!-- Recent Activity -->
      <!-- <Card class="shadow-lg border-0">
        <template #header>
          <div class="flex items-center gap-3 p-6 pb-0">
            <i class="pi pi-history text-blue-600 text-xl"></i>
            <h3 class="text-xl font-semibold text-gray-800">So'nggi faoliyat</h3>
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div 
              v-for="activity in recentActivities" 
              :key="activity.id"
              class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div 
                class="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
                :class="activity.type === 'income' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'"
              >
                <i :class="activity.icon" class="text-white text-sm"></i>
              </div>
              
              <div class="flex-1 min-w-0">
                <p class="text-gray-800 font-medium text-sm">{{ activity.description }}</p>
                <p class="text-gray-500 text-xs mt-1">{{ activity.time }}</p>
              </div>
              
              <div 
                class="text-right"
                :class="activity.type === 'income' ? 'text-green-600' : 'text-red-600'"
              >
                <span class="font-bold text-sm">
                  {{ activity.type === 'income' ? '+' : '-' }}{{ formatNumber(activity.amount) }}
                </span>
                <p class="text-xs text-gray-500">so'm</p>
              </div>
            </div>
          </div>
        </template>
      </Card> -->
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <Card class="w-80 shadow-2xl border-0">
        <template #content>
          <div class="text-center py-8">
            <ProgressSpinner class="mb-4" strokeWidth="4" />
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Ma'lumotlar yuklanmoqda...</h3>
            <p class="text-gray-600 text-sm">Iltimos, kuting</p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Card from 'primevue/card';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import ProgressBar from 'primevue/progressbar';
import ProgressSpinner from 'primevue/progressspinner';

const balanceData = ref({
  income: 0,
  outcome: 0,
  balance: 0,
});


const admin = JSON.parse(sessionStorage.getItem('admin'))
const isLoading = ref(false);
const monthlyIncome = ref(0);
const monthlyOutcome = ref(0);
const dailyIncome = ref(0);
const activeStudents = ref(0);
const averagePayment = ref(0);
const incomeGrowth = ref(12.5);
const outcomeGrowth = ref(3.2);

const recentActivities = ref([
  {
    id: 1,
    type: 'income',
    icon: 'pi pi-plus',
    description: 'Yangi to\'lov qabul qilindi',
    time: '10 daqiqa oldin',
    amount: 500000
  },
  {
    id: 2,
    type: 'outcome',
    icon: 'pi pi-minus',
    description: 'O\'qituvchi maoshi to\'landi',
    time: '2 soat oldin',
    amount: 2000000
  },
  {
    id: 3,
    type: 'income',
    icon: 'pi pi-plus',
    description: 'Guruh to\'lovi qabul qilindi',
    time: '5 soat oldin',
    amount: 1200000
  },
  {
    id: 4,
    type: 'outcome',
    icon: 'pi pi-minus',
    description: 'Ofis ijarasi to\'landi',
    time: '1 kun oldin',
    amount: 3000000
  }
]);

const incomeProgress = computed(() => {
  const total = balanceData.value.income + balanceData.value.outcome;
  return total > 0 ? (balanceData.value.income / total) * 100 : 0;
});

const outcomeProgress = computed(() => {
  const total = balanceData.value.income + balanceData.value.outcome;
  return total > 0 ? (balanceData.value.outcome / total) * 100 : 0;
});

const balanceChangePercent = computed(() => {
  return Math.abs(((balanceData.value.balance / balanceData.value.income) * 100).toFixed(1));
});

const fetchBalance = async () => {
  isLoading.value = true;
  try {
    // Simulate API delay
    const res = await axios.get("balance/real",{  
      params: {
        userId:admin.id
      }});
    balanceData.value = res.data;
    
    // Mock data for demonstratio
    
    monthlyIncome.value = balanceData.value.income * 0.3;
    monthlyOutcome.value = balanceData.value.outcome * 0.25;
    dailyIncome.value = balanceData.value.income * 0.05;
    activeStudents.value = 248;
    averagePayment.value = balanceData.value.income / 50;
    
  } catch (err) {
    console.error("Balansni olishda xatolik:", err);
  } finally {
    isLoading.value = false;
  }
};

const refreshData = () => {
    syncBalance()
  fetchBalance();
};

const exportData = () => {
  console.log("Exporting data...");
  // Implement export functionality
};

const formatNumber = (num) => {
  return new Intl.NumberFormat("uz-UZ").format(num);
};

const getBalanceStatusClass = () => {
  if (balanceData.value.balance > 5000000) return 'bg-green-100 text-green-800 border border-green-200';
  if (balanceData.value.balance > 0) return 'bg-blue-100 text-blue-800 border border-blue-200';
  return 'bg-red-100 text-red-800 border border-red-200';
};

const getBalanceStatusIcon = () => {
  if (balanceData.value.balance > 5000000) return 'pi pi-check-circle text-green-600';
  if (balanceData.value.balance > 0) return 'pi pi-info-circle text-blue-600';
  return 'pi pi-exclamation-triangle text-red-600';
};

const getBalanceStatusText = () => {
  if (balanceData.value.balance > 5000000) return 'Ajoyib holat';
  if (balanceData.value.balance > 0) return 'Yaxshi holat';
  return 'Diqqat talab';
};

const syncBalance = async () => {
  try {
    await axios.post("/balance/sync", {
      userId: admin.id, // yoki admin._id
    });
    // toast.add({ severity: "success", summary: "Balans yangilandi", life: 3000 });
    await fetchBalance(); // qayta yuklash
  } catch (err) {
    console.error("Balansni sinxronlashtirishda xatolik:", err);
  }
};

onMounted(fetchBalance);
</script>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-enter-active {
  animation: fadeInUp 0.5s ease-out;
}

/* Custom scrollbar for activity list */
.activity-scroll::-webkit-scrollbar {
  width: 4px;
}

.activity-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.activity-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.activity-scroll::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive text sizing */
@media (max-width: 640px) {
  .text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
}
</style>