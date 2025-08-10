<template>
  <Card style="">
    <template #title>
      <div class="flex items-center space-x-2">
        <i class="pi pi-cog text-gray-500"></i>
        <span>Amallar</span>
      </div>
    </template>
    <template #content>
      <div class="space-y-2">
        <Button label="Maosh to‘lash" icon="pi pi-wallet" class="w-full p-button-success" size="small" @click="showAddSalaryDialog = true" />
        <Button label="Ball qo‘shish" icon="pi pi-plus" class="w-full p-button-primary" size="small" @click="showAddPointsDialog = true" />
        <Button label="Ball ayirish" icon="pi pi-minus" class="w-full p-button-danger" size="small" @click="showSubtractPointsDialog = true" />
      </div>
    </template>
  </Card>

  <!-- Maosh qo‘shish dialog -->
  <Dialog v-model:visible="showAddSalaryDialog" header="Maosh qo‘shish" modal class="w-full max-w-md">
    <div class="space-y-4">
      <div class="flex flex-col">
        <label class="text-sm">Miqdor (UZS)</label>
        <InputNumber v-model="salaryForm.amount" inputClass="w-full" mode="currency" currency="UZS" locale="uz-UZ" />
      </div>
      <!-- <div>
        <label class="text-sm">Oy (masalan: 2025-07)</label>
        <InputText v-model="salaryForm.month" class="w-full" placeholder="YYYY-MM" />
      </div> -->
      <div>
        <label class="text-sm">Izoh (ixtiyoriy)</label>
        <InputText v-model="salaryForm.description" class="w-full" />
      </div>
    </div>
    <template #footer>
      <Button label="Bekor qilish" icon="pi pi-times" class="p-button-text" @click="showAddSalaryDialog = false" />
      <Button label="Saqlash" icon="pi pi-check" class="p-button-primary" @click="submitSalary" />
    </template>
  </Dialog>

  <!-- Ball qo‘shish dialog -->
  <Dialog v-model:visible="showAddPointsDialog" header="Ball qo‘shish" modal class="w-full max-w-sm">
    <div class="space-y-4">
      <label class="text-sm">Qo‘shiladigan ball</label>
      <InputNumber v-model="points" class="w-full" :min="1" />
    </div>
    <template #footer>
      <Button label="Bekor qilish" class="p-button-text" @click="showAddPointsDialog = false" />
      <Button label="Qo‘shish" class="p-button-primary" :loading="loading" @click="addPoints" />
    </template>
  </Dialog>

  <!-- Ball ayirish dialog -->
  <Dialog v-model:visible="showSubtractPointsDialog" header="Ball ayirish" modal class="w-full max-w-sm">
    <div class="space-y-4">
      <label class="text-sm">Ayiriladigan ball</label>
      <InputNumber v-model="points" class="w-full" :min="1" />
    </div>
    <template #footer>
      <Button label="Bekor qilish" class="p-button-text" @click="showSubtractPointsDialog = false" />
      <Button label="Ayirish" class="p-button-danger" :loading="loading" @click="subtractPoints" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'

import Card from 'primevue/card'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'

const props = defineProps({
  teacherId: String,
  userId: String
})

const emit = defineEmits(['salary-added'])

const toast = useToast()
const loading = ref(false)

// Dialog visibility
const showAddSalaryDialog = ref(false)
const showAddPointsDialog = ref(false)
const showSubtractPointsDialog = ref(false)

// Forms
const salaryForm = ref({
  amount: null,
  description: ''
})
const points = ref(null)

// Submit salary
const submitSalary = async () => {
  if (!salaryForm.value.amount) {
    toast.add({ severity: 'warn', summary: 'Ogohlantirish', detail: 'Miqdor va oy kiritilishi kerak', life: 3000 })
    return
  }

  try {
    await axios.post('/salaries/pay-part', {
      teacherId: props.teacherId,
      userId: props.userId,
      ...salaryForm.value
    })
    toast.add({ severity: 'success', summary: 'Bajarildi', detail: 'Maosh qo‘shildi', life: 3000 })
    emit('salary-added')
    showAddSalaryDialog.value = false
    salaryForm.value = { amount: null, month: '', description: '' }
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: err.response?.data?.message || 'Server xatoligi', life: 3000 })
  }
}

// Add points
const addPoints = async () => {
  if (!points.value || points.value <= 0) {
    toast.add({ severity: 'warn', summary: 'Xatolik', detail: 'Ball miqdori noto‘g‘ri', life: 3000 })
    return
  }

  loading.value = true
  try {
    await axios.post(`/teachers/${props.teacherId}/add-points`, {
      points: points.value,
      userId: props.userId
    })
    toast.add({ severity: 'success', summary: 'Ball qo‘shildi', detail: '', life: 3000 })
    emit('salary-added')
    showAddPointsDialog.value = false
    points.value = null
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Ball qo‘shilmadi', life: 3000 })
  } finally {
    loading.value = false
  }
}

// Subtract points
const subtractPoints = async () => {
  if (!points.value || points.value <= 0) {
    toast.add({ severity: 'warn', summary: 'Xatolik', detail: 'Ball miqdori noto‘g‘ri', life: 3000 })
    return
  }

  loading.value = true
  try {
    await axios.post(`/teachers/${props.teacherId}/subtract-points`, {
      points: points.value,
      userId: props.userId
    })
    toast.add({ severity: 'success', summary: 'Ball ayirildi', detail: '', life: 3000 })
    emit('salary-added')
    showSubtractPointsDialog.value = false
    points.value = null
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Ball ayirilmadi', life: 3000 })
  } finally {
    loading.value = false
  }
}
</script>
