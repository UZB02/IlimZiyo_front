<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
    <div 
      v-for="(item, index) in summary" 
      :key="item.label"
      class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
      :class="getCardGradient(index)"
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
      <div class="w-full bg-gray-200 rounded-full h-1">
        <div 
          class="h-1 rounded-full transition-all duration-500"
          :class="getProgressColor(index)"
          :style="{ width: getProgressWidth(index) + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ summary: Array })

const formatNumber = (value) => new Intl.NumberFormat('uz-UZ').format(value)

const getCardGradient = (index) => {
  const gradients = [
    'bg-gradient-to-br from-blue-50 to-blue-100',
    'bg-gradient-to-br from-green-50 to-green-100',
    'bg-gradient-to-br from-purple-50 to-purple-100',
    'bg-gradient-to-br from-orange-50 to-orange-100',
    'bg-gradient-to-br from-pink-50 to-pink-100'
  ]
  return gradients[index % gradients.length]
}

const getIconBackground = (index) => {
  const backgrounds = [
    'bg-gradient-to-r from-blue-500 to-blue-600',
    'bg-gradient-to-r from-green-500 to-green-600',
    'bg-gradient-to-r from-purple-500 to-purple-600',
    'bg-gradient-to-r from-orange-500 to-orange-600',
    'bg-gradient-to-r from-pink-500 to-pink-600'
  ]
  return backgrounds[index % backgrounds.length]
}

const getIcon = (index) => {
  const icons = [
    'pi pi-money-bill',
    'pi pi-wallet',
    'pi pi-minus-circle',
    'pi pi-book',
    'pi pi-users'
  ]
  return icons[index % icons.length]
}

const getProgressColor = (index) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500'
  ]
  return colors[index % colors.length]
}

const getProgressWidth = () => Math.random() * 100
</script>
