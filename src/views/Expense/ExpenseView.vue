<template>
  <div class="">
    <div class=" mx-auto ">
      <!-- Header Section -->
      <Card class="mb-8 border-0" style="background-color: transparent;">
        <template #content>
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="pi pi-credit-card text-white text-2xl"></i>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-800 mb-1">Xarajatlar boshqaruvi</h1>
                <p class="text-gray-600">Moliyaviy xarajatlarni kuzatish va tahlil qilish</p>
              </div>
            </div>
            <div class="flex gap-3 w-full md:w-auto">
              <Button 
                @click="refreshData" 
                :loading="loading"
                icon="pi pi-refresh" 
                label="Yangilash"
                class="flex-1 md:flex-none"
                severity="info"
              />
              <Button 
                @click="showAddDialog = true" 
                icon="pi pi-plus" 
                label="Yangi xarajat"
                class="flex-1 md:flex-none"
                severity="success"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Statistics Cards Component -->
      <StatisticsCards
        :expenses="expenses"
        :monthlyGrowth="monthlyGrowth"
        :totalAmount="totalAmount"
        :averageExpense="averageExpense"
        :balance="balance"
        :formatCurrency="formatCurrency"
        :formatDate="formatDate"
      />

      <!-- Expense Table -->
      <ExpenseTable :expenses="expenses" @openAddExpenseDialog="openAddExpenseDialog" @refreshData="refreshData"/>
    </div>

    <!-- Add/Edit Dialog -->
    <Dialog 
      v-model:visible="showAddDialog" 
      modal 
      :header="editingExpense ? 'Xarajatni tahrirlash' : 'Yangi xarajat qo\'shish'"
      class="w-full max-w-md mx-4"
    >
      <div class="space-y-4 pt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Izoh</label>
          <Textarea 
            v-model="expenseForm.description" 
            placeholder="Xarajat haqida izoh..."
            rows="3"
            class="w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Summa</label>
          <InputNumber 
            v-model="expenseForm.amount" 
            mode="currency" 
            currency="UZS" 
            locale="uz-UZ"
            placeholder="0"
            class="w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sana</label>
          <DatePicker 
            v-model="expenseForm.spentAt" 
            showTime 
            hourFormat="24"
            placeholder="Sana va vaqtni tanlang"
            class="w-full"
            showIcon
          />
        </div>
      </div>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <Button 
            @click="showAddDialog = false"
            label="Bekor qilish" 
            severity="secondary"
            outlined
          />
          <Button 
            @click="saveExpense"
            :label="editingExpense ? 'Saqlash' : 'Qo\'shish'"
            severity="success"
            :loading="saving"
          />
        </div>
      </template>
    </Dialog>
  </div>
  <Toast />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// PrimeVue komponentlari
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'

// Custom komponentlar
import ExpenseTable from '@/components/Expense/ExpenseTable.vue'
import StatisticsCards from '@/components/Expense/StatisticsCards.vue'

const admin = JSON.parse(sessionStorage.getItem('admin'))

// Reactive data
const toast = useToast()
const expenses = ref([])
const loading = ref(true)
const saving = ref(false)
const showAddDialog = ref(false)
const editingExpense = ref(null)
const balance=ref(null)

const monthlyGrowth = ref(15.3)

const expenseForm = ref({
  description: '',
  amount: null,
  spentAt: new Date()
})

// Computed
const totalAmount = computed(() => expenses.value.reduce((sum, e) => sum + (e.amount || 0), 0))

const averageExpense = computed(() =>
  expenses.value.length > 0 ? totalAmount.value / expenses.value.length : 0
)

// Methods
const formatCurrency = (amount) =>
  new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0
  }).format(amount)

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}


const getBalance = async () => {
  try {
     const res = await axios.get("balance/real",{  
      params: {
        userId:admin.id
      }}); // mos API endpointingiz
    balance.value = res.data
  } catch (err) {
    console.error('Balansni olishda xatolik:', err)
  }
}
getBalance()

const getExpenses = async () => {
  loading.value = true
  try {
    const res = await axios.get('/expense',{ params: { userId: admin.id } })
    expenses.value = res.data
    console.log(expenses.value);
  } catch (err) {
    console.error('Xarajatlarni olishda xatolik:', err)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  getExpenses()
  getBalance()
}

const saveExpense = async () => {
  saving.value = true;
  try {
    const res = await axios.post(`/expense`, {
      amount: expenseForm.value.amount,
      description: expenseForm.value.description,
      userId: admin.id // ✅ asosiy yechim shu
    });

    if (res.status === 201) {
      console.log(res);
      refreshData();
      toast.add({ severity: 'success', summary: 'Bajarildi', detail: "Xarajat qo'shildi", life: 3000 });

      expenseForm.value = {
        description: '',
        amount: null,
        spentAt: new Date()
      };
      editingExpense.value = null;
      showAddDialog.value = false;
    }
  } catch (err) {
    console.error('Xarajatni saqlashda xatolik:', err);
  } finally {
    saving.value = false;
  }
};

const openAddExpenseDialog = () => {
  showAddDialog.value = true
}

onMounted(getExpenses)
</script>
