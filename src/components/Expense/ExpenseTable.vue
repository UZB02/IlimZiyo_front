<template>
  <!-- Filters and Search -->
  <Card class="mb-6 shadow-lg border-0">
    <template #content>
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <div class="flex-1 w-full md:w-auto flex gap-2">
          <span class="p-input-icon-left">
            <InputText
              v-model="searchQuery"
              placeholder="Xarajatlarni qidirish..."
              class="w-full"
            />
          </span>
          <Button
            icon="pi pi-download"
            size="small"
            label="Excel"
            @click="exportToExcelHandler"
            class="bg-white/20 hover:bg-white/30 border-white/30 text-white"
          />
        </div>

        <div class="flex gap-3 w-full md:w-auto">
          <Calendar
            v-model="dateRange"
            selectionMode="range"
            :manualInput="false"
            placeholder="Sana oralig'i"
            class="w-full md:w-64"
            showIcon
          />
        </div>
      </div>
    </template>
  </Card>

  <!-- Expenses Table -->
  <Card class="shadow-lg border-0">
    <template #content>
      <DataTable
        :value="filteredExpenses"
        v-if="!isLoading"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        stripedRows
        responsiveLayout="scroll"
        currentPageReportTemplate="{first} dan {last} gacha {totalRecords} ta yozuvdan"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :globalFilterFields="['category', 'description']"
        class="custom-datatable"
      >
        <template #empty>
          <div class="text-center py-12">
            <div
              class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i class="pi pi-inbox text-4xl text-gray-400"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Xarajatlar topilmadi</h3>
            <p class="text-gray-500 mb-4">Hozircha hech qanday xarajat mavjud emas</p>
            <Button
              @click="emit('openAddExpenseDialog')"
              icon="pi pi-plus"
              label="Birinchi xarajatni qo'shish"
              severity="success"
            />
          </div>
        </template>

        <Column field="description" header="Izoh" class="min-w-60">
          <template #body="{ data }">
            <div>
              <p class="text-gray-800 font-medium">{{ data.description || 'Izoh yo‘q' }}</p>
              <p class="text-xs text-gray-500 mt-1">ID: {{ data.id }}</p>
            </div>
          </template>
        </Column>

        <Column field="amount" header="Summasi" sortable class="min-w-32">
          <template #body="{ data }">
            <div class="text-right">
              <span class="text-lg font-bold text-red-600">
                {{ formatCurrency(data.amount) }}
              </span>
            </div>
          </template>
        </Column>

        <Column field="spentAt" header="Sana" sortable class="min-w-32">
          <template #body="{ data }">
            <div class="text-center">
              <div class="text-sm font-medium text-gray-800">{{ formatDate(data.spentAt) }}</div>
              <div class="text-xs text-gray-500">{{ formatTime(data.spentAt) }}</div>
            </div>
          </template>
        </Column>

        <Column header="Amallar" class="min-w-32">
          <template #body="{ data }">
            <div class="flex gap-2 justify-center">
              <!-- <Button 
                @click="editExpense(data)"
                icon="pi pi-pencil" 
                size="small"
                severity="info"
                outlined
                v-tooltip="'Tahrirlash'"
              /> -->
              <Button
                @click="openDelExpenseModal(data)"
                icon="pi pi-trash"
                size="small"
                severity="danger"
                outlined
                v-tooltip="'Ochirish'"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- isLoading holati -->
      <div v-else class="p-8">
        <div class="space-y-4">
          <Skeleton height="60px" class="rounded-lg" />
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton height="40px" class="rounded" />
            <Skeleton height="40px" class="rounded" />
            <Skeleton height="40px" class="rounded" />
            <Skeleton height="40px" class="rounded" />
          </div>
          <div class="space-y-3">
            <Skeleton height="50px" class="rounded" v-for="i in 5" :key="i" />
          </div>
        </div>
      </div>
    </template>
  </Card>

  <!-- Delete Confirmation Modal -->
  <Dialog
    v-model:visible="deleteExpenseModal"
    :modal="true"
    :closable="false"
    :draggable="false"
    :style="{ width: '450px' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
  >
    <template #header>
      <div class="flex items-center">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
          <i class="pi pi-exclamation-triangle text-red-600 text-xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800 m-0">Xarajatni o'chirish</h3>
          <p class="text-sm text-gray-500 m-0 mt-1">
            Bu amalni qaytarib bo'lmaydi va o'chirilgan summa balansga qo'shiladi
          </p>
        </div>
      </div>
    </template>

    <div class="py-4">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-start">
          <i class="pi pi-info-circle text-red-500 mt-1 mr-3"></i>
          <div>
            <p class="text-red-800 font-medium mb-1">
              Haqiqatan ham {{ expense.description }} ni o'chirmoqchimisiz?
            </p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <Button
          label="Bekor qilish"
          icon="pi pi-times"
          severity="secondary"
          @click="deleteExpenseModal = false"
        />
        <Button
          :label="isLoading ? 'O\'chirilmoqda...' : 'Ha, o\'chirish'"
          icon="pi pi-trash"
          severity="danger"
          :loading="isLoading"
          @click="deleteExpense()"
        />
      </div>
    </template>
  </Dialog>
  <Toast />
</template>

<script setup>
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Skeleton from 'primevue/skeleton'
import InputText from 'primevue/inputtext'
import Column from 'primevue/column'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import axios from 'axios'
import { exportToExcel } from '@/utils/formatToExcel.js'
import { formatDate } from '@/utils/FormatDate.js'

// Props
const props = defineProps({
  expenses: {
    type: Array,
    required: true,
  },
})

// Emits
const emit = defineEmits(['refreshData','openAddExpenseDialog'])

// UI state
const toast = useToast()
const expense = ref({})
const deleteExpenseModal = ref(false)
const isLoading = ref(false)
const searchQuery = ref('')
const dateRange = ref(null)
const showAddDialog = ref(false)

// Filtered list
const filteredExpenses = computed(() => {
  let filtered = [...props.expenses]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (expense) =>
        expense.category?.toLowerCase().includes(query) ||
        expense.description?.toLowerCase().includes(query),
    )
  }

  if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
    const startDate = new Date(dateRange.value[0])
    const endDate = new Date(dateRange.value[1])
    filtered = filtered.filter((expense) => {
      const expenseDate = new Date(expense.spentAt)
      return expenseDate >= startDate && expenseDate <= endDate
    })
  }

  return filtered
})

// Helpers
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('uz-UZ')
}

const openDelExpenseModal = (item) => {
  deleteExpenseModal.value = true
  expense.value = item
}

const deleteExpense = async () => {
  try {
    isLoading.value = true
    const res = await axios.delete(`/expense/${expense.value._id}`)
    if (res.status === 200) {
      toast.add({
        severity: 'success',
        summary: 'Bajarildi',
        detail: "Xarajat o'chirildi",
        life: 3000,
      })
      deleteExpenseModal.value = false
      emit('refreshData')
    }
  } catch (err) {
    console.log(err)
    toast.add({
      severity: 'error',
      summary: 'Xatolik',
      detail: 'O‘chirishda xatolik yuz berdi',
      life: 3000,
    })
  } finally {
    isLoading.value = false
  }
}

const exportToExcelHandler = () => {
  const exportData = filteredExpenses.value.map((expense, index) => ({
    ID: index + 1,
    Izoh: expense.description || '—',
    Summasi: expense.amount,
    Sana: formatDate(expense.spentAt),
  }))

  const today = new Date()
  const fileName = `Xarajatlar_${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}.xlsx`

  exportToExcel(exportData, fileName)
}
</script>

<style scoped>
/* Qo‘shimcha uslublar kerak bo‘lsa shu yerga yozing */
</style>
