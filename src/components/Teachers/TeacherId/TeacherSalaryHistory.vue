<template>
  <Card>
    <template #title>
      <div class="flex items-center space-x-2">
        <i class="pi pi-money-bill text-green-500"></i>
        <span>Maosh tarixi</span>
      </div>
    </template>

    <template #content>
      <div v-if="salaries && salaries.length" class="space-y-4">
        <div
          v-for="(salary, index) in salaries"
          :key="index"
          class="bg-gray-50 rounded-lg p-4 border"
        >
          <div class="flex flex-row items-center justify-between gap-4">
            <!-- Maosh summasi va sanasi -->
            <div>
              <p class="font-medium text-gray-900">
                {{ formatCurrency(salary.amount || 0) }}
              </p>
              <p class="text-sm text-gray-500">
                {{ formatDate(salary.paidAt) }}
              </p>
            </div>

            <!-- Status va amallar -->
            <div class="flex items-center space-x-2">
              <Button
                icon="pi pi-pencil"
                class="p-button-text p-button-sm"
                @click="onEdit(salary, index)"
                v-tooltip="'Tahrirlash'"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-text p-button-sm p-button-danger"
                @click="onDelete(salary._id)"
                v-tooltip="'O‘chirish'"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <i class="pi pi-inbox text-4xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">Maosh tarixi mavjud emas</p>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import { defineEmits, defineProps } from 'vue'

const props = defineProps(['salaries'])
const emit = defineEmits(['edit-salary', 'delete-salary'])

const formatDate = (date) =>
  new Date(date).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

const formatCurrency = (amount) =>
  new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0
  }).format(amount)

// Emitlar orqali parent componentga tahrirlash/o'chirishni uzatamiz
const onEdit = (salary, index) => {
  emit('edit-salary', { salary, index })
}

const onDelete = (salaryId) => {
  emit('delete-salary', salaryId)
}
</script>
