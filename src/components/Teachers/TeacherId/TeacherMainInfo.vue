<template>
  <Card class="shadow-sm border border-gray-100">
    <template #title>
      <div class="flex items-center space-x-3">
        <i class="pi pi-id-card text-blue-500 text-lg"></i>
        <span class="text-lg font-semibold text-gray-700">Asosiy ma'lumotlar</span>
      </div>
    </template>
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Chap qism -->
        <div class="space-y-4">
          <div v-for="(label, key) in leftFields" :key="key" class="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
            <label class="block text-xs font-medium text-gray-400 uppercase tracking-wider">{{ label }}</label>
            <p class="text-gray-800 font-medium mt-1">{{ teacher[key] || '-' }}</p>
          </div>
        </div>
        
        <!-- O'ng qism -->
        <div class="space-y-4">
          <div v-for="(label, key) in rightFields" :key="key" class="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
            <label class="block text-xs font-medium text-gray-400 uppercase tracking-wider">{{ label }}</label>
            <p class="text-gray-800 font-mono mt-1">{{ teacher[key] || '-' }}</p>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'

defineProps({
  teacher: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const leftFields = {
  name: "Ism",
  lastname: "Familiya",
  science: "Fan"
}

const rightFields = {
  phone: "Telefon raqami",
  email: "Elektron pochta",
  birthDate: "Tug'ilgan sana"
}
</script>

<style scoped>
.p-card {
  border-radius: 0.75rem;
}

.p-card-title {
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.p-card-content {
  padding-top: 1.25rem;
}
</style>