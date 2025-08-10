<template>
  <Card>
    <template #title>
      <div class="flex items-center space-x-2">
        <i class="pi pi-clock text-indigo-500"></i>
        <span>Vaqt jadvali</span>
      </div>
    </template>
    <template #content>
      <div class="space-y-4">
        <div class="flex items-start space-x-3">
          <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
          <div>
            <p class="text-sm font-medium text-gray-900">Yaratilgan</p>
            <p class="text-xs text-gray-500">{{ formatDate(teacher.createdAt) }}</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
          <div>
            <p class="text-sm font-medium text-gray-900">Oxirgi yangilanish</p>
            <p class="text-xs text-gray-500">{{ formatDate(teacher.updatedAt) }}</p>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
defineProps(['teacher'])

const formatDate = (date) => new Date(date).toLocaleDateString('uz-UZ', {
  year: 'numeric', month: 'long', day: 'numeric',
  hour: '2-digit', minute: '2-digit'
})
</script>
