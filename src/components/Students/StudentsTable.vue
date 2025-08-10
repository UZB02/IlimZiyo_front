<template>
  <div class="bg-white rounded-2xl overflow-hidden">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center">
            <i class="pi pi-users mr-2"></i>
            O'quvchilar ro'yxati
          </h2>
          <p class="text-indigo-100 text-sm mt-1">Jami: {{ sortedStudents.length }} ta o'quvchi</p>
        </div>
        <div class="flex gap-3">
          <div class="relative">
            <i
              class="pi pi-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            ></i>
            <InputText
              v-model="filters.global.value"
              placeholder="O'quvchi qidirish..."
              class="pl-10 bg-white/90 border-0 rounded-lg shadow-sm"
            />
          </div>
          <Button
            icon="pi pi-download"
            label="Excel"
            @click="exportToExcelHandler()"
            class="bg-white/20 hover:bg-white/30 border-white/30 text-white"
          />
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="p-6">
      <DataTable
        :value="sortedStudents"
        ref="dt"
        :filters="filters"
        filterDisplay="menu"
        :loading="loading"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} dan {last} gacha, jami {totalRecords} ta"
        class="custom-table"
        :globalFilterFields="['name', 'lastname', 'phone', 'location']"
        stripedRows
        responsiveLayout="scroll"
      >
        <!-- Empty State -->
        <template #empty>
          <div class="text-center py-12">
            <i class="pi pi-users text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-500 mb-2">O'quvchilar topilmadi</h3>
            <p class="text-gray-400">Qidiruv so'zini o'zgartiring yoki yangi o'quvchi qo'shing</p>
          </div>
        </template>

        <!-- ID Column -->
        <Column header="#" :style="{ width: '60px' }">
          <template #body="slotProps">
            <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span class="text-sm font-semibold text-indigo-600">
                {{ slotProps.index + 1 }}
              </span>
            </div>
          </template>
        </Column>

        <!-- Student Info Column -->
        <Column header="O'quvchi ma'lumotlari" :style="{ minWidth: '250px' }">
          <template #body="slotProps">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
              >
                <span class="text-white font-semibold text-sm">
                  {{ slotProps.data.name.charAt(0) }}{{ slotProps.data.lastname.charAt(0) }}
                </span>
              </div>
              <div>
                <div class="font-semibold text-gray-800">
                  {{ slotProps.data.name }} {{ slotProps.data.lastname }}
                </div>
                <div class="text-sm text-gray-500 flex items-center">
                  <i class="pi pi-map-marker mr-1"></i>
                  {{ slotProps.data.location }}
                </div>
              </div>
            </div>
          </template>
        </Column>

        <!-- Contact Column -->
        <Column header="Aloqa" :style="{ minWidth: '180px' }">
          <template #body="slotProps">
            <div class="space-y-1">
              <a
                :href="`tel:${slotProps.data.phone}`"
                class="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                v-tooltip.top="'Qo\'ng\'iroq qilish'"
              >
                <i class="pi pi-phone mr-2 text-sm"></i>
                {{ slotProps.data.phone }}
              </a>
            </div>
          </template>
        </Column>

        <!-- Date Column -->
        <Column header="Qo'shilgan sana" :style="{ minWidth: '150px' }">
          <template #body="slotProps">
            <div class="flex items-center text-gray-600">
              <i class="pi pi-calendar mr-2 text-sm"></i>
              <span class="text-sm">{{ formatDate(slotProps.data.createdAt) }}</span>
            </div>
          </template>
        </Column>

        <!-- Status Column -->
        <Column header="Holat" :style="{ width: '120px' }">
          <template #body="slotProps">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="
                slotProps.data.paymentStatus?.isPaid
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              "
            >
              <i
                :class="
                  slotProps.data.paymentStatus?.isPaid
                    ? 'pi pi-check-circle mr-1'
                    : 'pi pi-times-circle mr-1'
                "
              ></i>
              {{ slotProps.data.paymentStatus.message }}
            </span>
          </template>
        </Column>

      <!-- Actions Column -->
<Column header="Amallar" :style="{ width: '80px' }">
  <template #body="slotProps">
    <div>
      <Button
        icon="pi pi-ellipsis-v"
        class=" p-button-text"
        @click="toggleMenu($event, slotProps.data)"
      />
      <Menu
        :model="menuItems"
        popup
        ref="menu"
      />
    </div>
  </template>
</Column>
      </DataTable>
    </div>

    <!-- Context Menu -->

    <!-- Delete Confirmation Modal -->
    <Dialog
      v-model:visible="deleteModalVisible"
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
            <h3 class="text-lg font-semibold text-gray-800 m-0">O'quvchini o'chirish</h3>
            <p class="text-sm text-gray-500 m-0 mt-1">Bu amalni qaytarib bo'lmaydi</p>
          </div>
        </div>
      </template>

      <div class="py-4">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-start">
            <i class="pi pi-info-circle text-red-500 mt-1 mr-3"></i>
            <div>
              <p class="text-red-800 font-medium mb-1">
                Haqiqatan ham bu o'quvchini o'chirmoqchimisiz?
              </p>
              <p class="text-red-600 text-sm">
                O'quvchiga tegishli barcha ma'lumotlar ham o'chiriladi.
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
            @click="deleteModalVisible = false"
          />
          <Button
            :label="isLoading ? 'O\'chirilmoqda...' : 'Ha, o\'chirish'"
            icon="pi pi-trash"
            severity="danger"
            :loading="isLoading"
            @click="deleteStudent"
          />
        </div>
      </template>
    </Dialog>

    <!-- Edit Student Modal -->
    <Dialog
      v-model:visible="editStudentModalVisible"
      :modal="true"
      :closable="true"
      :draggable="false"
      :style="{ width: '600px' }"
      :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
    >
      <template #header>
        <div class="flex items-center w-full">
          <div
            class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-4"
          >
            <i class="pi pi-pencil text-white text-lg"></i>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-800 m-0">O'quvchini tahrirlash</h2>
            <p class="text-sm text-gray-500 m-0 mt-1">Ma'lumotlarni yangilang</p>
          </div>
        </div>
      </template>

      <div class="space-y-6 py-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              <i class="pi pi-user mr-1"></i>
              Ism
            </label>
            <InputText v-model="editedStudent.name" class="w-full" placeholder="Ismni kiriting" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              <i class="pi pi-user mr-1"></i>
              Familiya
            </label>
            <InputText
              v-model="editedStudent.lastname"
              class="w-full"
              placeholder="Familiyani kiriting"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              <i class="pi pi-phone mr-1"></i>
              Telefon raqami
            </label>
            <InputText
              v-model="editedStudent.phone"
              class="w-full"
              placeholder="+998 90 123 45 67"
            />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              <i class="pi pi-map-marker mr-1"></i>
              Manzil
            </label>
            <InputText
              v-model="editedStudent.location"
              class="w-full"
              placeholder="Yashash manzilini kiriting"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            <i class="pi pi-file-edit mr-1"></i>
            Izoh
          </label>
          <Textarea
            v-model="editedStudent.description"
            rows="3"
            class="w-full"
            autoResize
            placeholder="Qo'shimcha ma'lumotlar..."
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button
            label="Bekor qilish"
            icon="pi pi-times"
            severity="secondary"
            @click="editStudentModalVisible = false"
          />
          <Button label="Yangilash" icon="pi pi-check" :loading="isLoading" @click="editStudent" />
        </div>
      </template>
    </Dialog>

    <!-- Begin Payment Modal -->
    <Dialog
      v-model:visible="addPaymentModalVisible"
      :modal="true"
      :closable="true"
      :draggable="false"
      class="custom-dialog"
      :style="{ width: '500px' }"
      :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
    >
      <!-- Custom Header -->
      <template #header>
        <div class="flex items-center gap-3 w-full">
          <div
            class="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center"
          >
            <i class="pi pi-wallet w-5 h-5 text-white"></i>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-800 m-0">To‘lov qilish</h2>
            <p class="text-sm text-gray-500 m-0">To‘lov ma'lumotlarini kiriting</p>
          </div>
        </div>
      </template>

      <!-- Form Content -->
      <div class="space-y-6 p-1">
        <div class="bg-gray-50 rounded-lg p-4 space-y-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
              To‘lov summasi <span class="text-red-500">*</span>
            </label>
            <InputNumber
              v-model="newPayment.amount"
              placeholder="Masalan: 200000"
              inputClass="w-full"
              class="w-full"
              :class="{ 'p-invalid': !newPayment.amount && showValidation }"
            />
            <small v-if="!newPayment.amount && showValidation" class="text-red-500">
              To‘lov summasi majburiy
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
              To‘lov turi <span class="text-red-500">*</span>
            </label>
            <Dropdown
              v-model="newPayment.method"
              :options="paymentMethods"
              optionLabel="label"
              optionValue="value"
              placeholder="Tanlang"
              class="w-full"
              :class="{ 'p-invalid': !newPayment.method && showValidation }"
            />
            <small v-if="!newPayment.method && showValidation" class="text-red-500">
              To‘lov turini tanlash majburiy
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Izoh</label>
            <Textarea
              v-model="newPayment.description"
              placeholder="Ixtiyoriy izoh..."
              class="w-full"
              rows="3"
              autoResize
            />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <template #footer>
        <div class="flex justify-between items-center w-full pt-4 border-t border-gray-200">
          <div class="text-sm text-gray-500">
            <span class="text-red-500">*</span> Majburiy maydonlar
          </div>
          <div class="flex gap-3">
            <Button
              label="Bekor qilish"
              icon="pi pi-times"
              severity="secondary"
              @click="addPaymentModalVisible = false"
              class="px-4 py-2"
            />
            <Button
              label="To‘lovni saqlash"
              icon="pi pi-check"
              @click="addPayment"
              :loading="isLoading"
              class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 border-green-500 hover:from-green-600 hover:to-green-700"
            />
          </div>
        </div>
      </template>
    </Dialog>
    <!-- End Payment Modal -->

    <!-- Send Message Modal -->
<Dialog
  v-model:visible="sendMessageModalVisible"
  :modal="true"
  :closable="false"
  :draggable="false"
  :style="{ width: '450px' }"
  :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
>
  <template #header>
    <div class="flex items-center">
      <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
        <i class="pi pi-envelope text-blue-600 text-xl"></i>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-800 m-0">{{ changeStudent.name }} {{ changeStudent.lastname }} ga xabar yuborish</h3>
        <p class="text-sm text-gray-500 m-0 mt-1">
          Xabar matnini kiriting va yuboring
        </p>
      </div>
    </div>
  </template>

  <div class="py-4">
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start flex-col gap-2">
        <div class="flex items-center justify-center gap-1">
          <i class="pi pi-info-circle text-blue-500 "></i>
           <label class="text-sm font-medium text-gray-700  block">
            Xabar matni <span class="text-red-500">*</span>
          </label>
        </div>
        <div class="flex-1 w-full">
          <Textarea
            v-model="messageText"
            placeholder="Yuboriladigan xabar..."
            class="w-full"
            rows="4"
            autoResize
            :class="{ 'p-invalid': !messageText && showValidation }"
          />
          <small v-if="!messageText && showValidation" class="text-red-500">
            Xabar matni majburiy
          </small>
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
        @click="sendMessageModalVisible = false"
      />
      <Button
        :label="isLoading ? 'Yuborilmoqda...' : 'Xabar yuborish'"
        icon="pi pi-send"
        class="bg-blue-500 border-blue-500 hover:bg-blue-600"
        :loading="isLoading"
        @click="sendMessageFunction()"
      />
    </div>
  </template>
</Dialog>

    <Toast />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import axios from 'axios'
import Menu from 'primevue/menu';
import { exportToExcel } from '@/utils/formatToExcel'
import { formatDate } from '../../utils/FormatDate'

const router = useRouter()
const toast = useToast()
const admin = JSON.parse(sessionStorage.getItem('admin'))

// Props & Emit
const props = defineProps({ group: Object })
const emit = defineEmits(['getGroupById'])

// Refs
const menu = ref(null);
const menuItems = ref([]);
const dt = ref()
const filters = ref({ global: { value: null, matchMode: 'contains' } })
const deleteModalVisible = ref(false)
const editStudentModalVisible = ref(false)
const addPaymentModalVisible = ref(false)
const selectedStudentId = ref(null)
const showValidation = ref(false)
const changeStudent = ref({})
const sendMessageModalVisible=ref(false)
const messageText=ref('')
const isLoading = ref(false)
const loading = ref(false)
const editedStudent = ref({
  name: '',
  lastname: '',
  phone: '',
  location: '',
  description: '',
  groupId: props.group._id,
  status: 'active',
  admin: admin.id,
})

const newPayment = ref({
  amount: null,
  method: null,
  description: '',
})

const paymentMethods = [
  { label: 'Naqd', value: 'cash' },
  { label: 'Karta orqali', value: 'card' },
  { label: 'Bank o‘tkazmasi', value: 'bank' },
]


const toggleMenu = (event, student) => {
  changeStudent.value = student;

  menuItems.value = [
    {
      label: "Batafsil",
      icon: "pi pi-eye",
      command: () => router.push(`/group/${student.groupId}/student/${student._id}`)
    },
    {
      label: "To‘lov",
      icon: "pi pi-money-bill",
      command: () => opentPaymentModal(student)
    },
      {
      label: "Xabar yuborish",
      icon: "pi pi-send",
      command: () => openMessageModal(changeStudent.value)
    },
         {
      label: "Tahrirlash",
      icon: "pi pi-pencil",
      command: () => openEditModal(student)
    },
    {
      label: "O'chirish",
      icon: "pi pi-trash",
      command: () => openDeleteModal()
    }
  ];

  menu.value.toggle(event);
};
const opentPaymentModal = (item) => {
  addPaymentModalVisible.value = true
  changeStudent.value = item
  console.log(changeStudent.value)
}
const openMessageModal = (item) => {
  sendMessageModalVisible.value = true
  changeStudent.value = item
  console.log(changeStudent.value)
}

// Computed: students sorted by createdAt (desc)
const sortedStudents = computed(() =>
  [...(props.group.students || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
)

// Export Excel
const exportToExcelHandler = () => {
  const exportData = sortedStudents.value.map((student, index) => ({
    ID: index + 1,
    Ism: student.name,
    Familiya: student.lastname,
    Telefon: student.phone,
    'Yashash joyi': student.location,
    "Qo'shilgan sanasi": formatDate(student.createdAt),
  }))
  const fileName = `${props.group.name.replace(/\s+/g, '_')}_${getTodayDate()}.xlsx`
  exportToExcel(exportData, fileName)
}

const getTodayDate = () => {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

// Delete
const openDeleteModal = () => {
  deleteModalVisible.value = true
}

const deleteStudent = async () => {
  isLoading.value = true
  try {
    await axios.delete(`/students/${changeStudent.value._id}`)
    toast.add({
      severity: 'success',
      summary: 'Bajarildi',
      detail: "O'quvchi o'chirildi",
      life: 3000,
    })
    emit('getGroupById')
    deleteModalVisible.value = false
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: error.message, life: 3000 })
  } finally {
    isLoading.value = false
  }
}

// Edit
const openEditModal = (student) => {
  selectedStudentId.value = student._id
  Object.assign(editedStudent.value, {
    name: student.name,
    lastname: student.lastname,
    phone: student.phone,
    location: student.location,
    description: student.description,
  })
  editStudentModalVisible.value = true
}

const editStudent = async () => {
  isLoading.value = true
  try {
    const res = await axios.put(`/students/${selectedStudentId.value}`, {
      ...editedStudent.value,
      admin: admin.id,
    })
    if (res.status === 200) {
      editStudentModalVisible.value = false
      emit('getGroupById')
      toast.add({
        severity: 'success',
        summary: 'Yangilandi',
        detail: "O'quvchi yangilandi",
        life: 3000,
      })
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: error.message, life: 3000 })
  } finally {
    isLoading.value = false
  }
}

const addPayment = async () => {
  showValidation.value = true

  // Minimal tekshiruv
  if (!newPayment.value.amount || !newPayment.value.method) {
    return
  }

  isLoading.value = true

  try {
    await axios.post('/payments', {
      ...newPayment.value,
      studentId: changeStudent.value._id,
      userId: admin.id, // ⚠️ "admin" obyektingiz login bo'lgan foydalanuvchimi? Unda `id` to‘g‘ri.
    })
    // Muvaffaqiyatli xabar
    toast.add({
      severity: 'success',
      summary: 'Bajarildi',
      detail: 'To‘lov qabul qilindi',
      life: 3000,
    })

    // Modalni yopish
    addPaymentModalVisible.value = false
    emit('getGroupById')
    // Formani tozalash (xohlasangiz)
    newPayment.value = {
      amount: null,
      method: '',
      description: '',
    }
  } catch (error) {
    console.error('To‘lovni saqlashda xatolik:', error)
    toast.add({
      severity: 'error',
      summary: 'Xatolik',
      detail: 'To‘lovni saqlab bo‘lmadi',
      life: 3000,
    })
  } finally {
    isLoading.value = false
  }
}

const sendMessageFunction = async () => {
  isLoading.value=true
  try {
    const res = await axios.post("/students/send-message", {
      studentId: changeStudent.value._id,
      message: messageText.value
    });

    if (res.status >= 200 && res.status < 300) {
      sendMessageModalVisible.value = false;
      toast.add({
        severity: 'success',
        summary: 'Muvaffaqiyatli',
        detail: "Xabar yuborildi ✅",
        life: 3000,
      });
      messageText.value = '';
      isLoading.value=false
      changeStudent.value = null;
    }
  } catch (err) {
    isLoading.value=false
    console.error("Xabar yuborishda xatolik:", err);
    toast.add({
      severity: 'error',
      summary: 'Xatolik',
      detail: "Xabar yuborib bo‘lmadi ❌",
      life: 3000,
    });
  }
};

</script>

<style scoped>
:deep(.custom-table .p-datatable-header) {
  display: none;
}

:deep(.custom-table .p-datatable-thead > tr > th) {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  color: #475569;
  font-weight: 600;
  padding: 1rem;
}

:deep(.custom-table .p-datatable-tbody > tr > td) {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.custom-table .p-datatable-tbody > tr:hover) {
  background: #f8fafc;
}

:deep(.p-paginator) {
  background: #f8fafc;
  border: none;
  border-top: 1px solid #e2e8f0;
  padding: 1rem;
}

:deep(.p-dialog .p-dialog-header) {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-dialog .p-dialog-content) {
  padding: 0 1.5rem;
}

:deep(.p-dialog .p-dialog-footer) {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}
</style>
