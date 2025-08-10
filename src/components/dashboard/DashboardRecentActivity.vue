<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <i class="pi pi-clock text-purple-500"></i>
        So'nggi faoliyat
      </h3>
    </div>
    <div class="space-y-4 max-h-[400px] overflow-y-auto">
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
</template>

<script setup>
const props = defineProps({ activity: Array })

const formatDate = (date) =>
  new Date(date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })

const formatTime = (date) =>
  new Date(date).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })

const getActivityIcon = (type) => {
  const iconMap = {
    'Ariza': { icon: 'pi pi-book', bg: 'bg-blue-500' },
    'To\'lov': { icon: 'pi pi-credit-card', bg: 'bg-green-500' },
    'Xarajat': { icon: 'pi pi-minus-circle', bg: 'bg-red-500' },
    'default': { icon: 'pi pi-info-circle', bg: 'bg-gray-500' }
  }
  return iconMap[type] || iconMap.default
}
</script>
