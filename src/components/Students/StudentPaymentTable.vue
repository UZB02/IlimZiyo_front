<template>
  <div class=" bg-gray-50">
    <div class="mx-auto">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">Jami to'lovlar</p>
              <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ payments.length }} ta</h3>
            </div>
            <i class="pi pi-wallet text-blue-500 text-2xl"></i>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">Umumiy summa</p>
              <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ formatCurrency(totalAmount) }}</h3>
            </div>
            <i class="pi pi-money-bill text-green-500 text-2xl"></i>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">Oxirgi to'lov</p>
              <h3 class="text-xl font-bold text-gray-800 mt-1">
                {{ lastPaymentDate ? formatDate(lastPaymentDate) : 'Mavjud emas' }}
              </h3>
            </div>
            <i class="pi pi-calendar text-purple-500 text-2xl"></i>
          </div>
        </div>
      </div>

      <!-- Payments Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <DataTable 
          :value="payments" 
          v-if="!loading"
          :paginator="true"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20]"
          class="p-datatable-sm"
          stripedRows
          responsiveLayout="scroll"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="{first} dan {last} gacha {totalRecords} ta ma'lumot"
        >
          <template #empty>
            <div class="text-center py-8">
              <i class="pi pi-inbox text-4xl text-gray-400 mb-4"></i>
              <p class="text-gray-500 text-lg">Hech qanday to'lov topilmadi</p>
            </div>
          </template>

          <Column field="amount" header="Summasi" sortable headerClass="font-semibold">
            <template #body="{ data }">
              <div class="flex items-center">
                <i class="pi pi-money-bill text-green-500 mr-2"></i>
                <span class="font-semibold text-green-600">
                  {{ formatCurrency(data.amount) }}
                </span>
              </div>
            </template>
          </Column>

          <Column field="method" header="To'lov turi" sortable headerClass="font-semibold">
            <template #body="{ data }">
              <div class="flex items-center">
                <i :class="getPaymentIcon(data.method)" class="mr-2"></i>
                <span>{{ getPaymentMethodName(data.method) }}</span>
              </div>
            </template>
          </Column>

          <Column field="description" header="Izoh" headerClass="font-semibold">
            <template #body="{ data }">
              <span class="text-gray-600">
                {{ data.description || 'Izoh yo\'q' }}
              </span>
            </template>
          </Column>

          <Column field="paidAt" header="Sana" sortable headerClass="font-semibold">
            <template #body="{ data }">
              <div class="flex items-center">
                <i class="pi pi-calendar text-blue-500 mr-2"></i>
                <span>{{ formatDate(data.paidAt) }}</span>
              </div>
            </template>
          </Column>

          <Column header="Holat" headerClass="font-semibold">
            <template #body="{ data }">
              <Tag 
                :value="'To\'langan'" 
                severity="success" 
                class="font-medium"
                icon="pi pi-check"
              />
            </template>
          </Column>
        </DataTable>

        <!-- Loading State -->
        <div v-else class="p-8">
          <div class="space-y-4">
            <Skeleton height="60px" class="mb-4" />
            <Skeleton height="40px" class="mb-2" />
            <Skeleton height="40px" class="mb-2" />
            <Skeleton height="40px" class="mb-2" />
            <Skeleton height="40px" class="mb-2" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { formatDate } from '@/utils/FormatDate'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'

const route = useRoute()
const router = useRouter()
const studentId = route.params.id
const payments = ref([])
const studentInfo = ref({})
const loading = ref(true)

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0
  }).format(amount)
}

// Helper function to get payment method icon and display name
const getPaymentIcon = (method) => {
  const icons = {
    'cash': 'pi pi-money-bill text-green-500',
    'card': 'pi pi-credit-card text-blue-500',
    'bank': 'pi pi-building text-purple-500',
    'online': 'pi pi-globe text-orange-500'
  }
  return icons[method] || 'pi pi-circle text-gray-500'
}

const getPaymentMethodName = (method) => {
  const names = {
    'cash': 'Naqd',
    'card': 'Karta',
    'bank': 'Bank',
    'online': 'Online'
  }
  return names[method] || method
}

// Computed property for total amount
const totalAmount = computed(() => {
  return payments.value.reduce((sum, payment) => sum + (payment.amount || 0), 0)
})

// Computed property for last payment date
const lastPaymentDate = computed(() => {
  if (payments.value.length === 0) return null
  const sorted = [...payments.value].sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt))
  return sorted[0].paidAt
})

const fetchStudentInfo = async () => {
  try {
    const res = await axios.get(`/students/${studentId}`)
    studentInfo.value = res.data
  } catch (error) {
    console.error('Talaba ma\'lumotlarini olishda xatolik:', error)
  }
}

const getPaymentsByStudentId = async () => {
  try {
    const res = await axios.get(`payments/student/${studentId}`)
    payments.value = res.data
  } catch (error) {
    console.error('To\'lovlarni olishda xatolik:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    fetchStudentInfo(),
    getPaymentsByStudentId()
  ])
})

defineExpose({ getPaymentsByStudentId })
</script>

<style scoped>
/* Custom styles for better appearance */
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f8fafc;
  color: #374151;
  font-weight: 600;
  border-bottom: 2px solid #e5e7eb;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f9fafb;
}

:deep(.p-tag) {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

:deep(.p-button-outlined) {
  border-color: #d1d5db;
  color: #374151;
}

:deep(.p-button-outlined:hover) {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  :deep(.p-datatable) {
    font-size: 0.875rem;
  }
  
  :deep(.p-column-title) {
    min-width: 100px;
  }
}
</style>