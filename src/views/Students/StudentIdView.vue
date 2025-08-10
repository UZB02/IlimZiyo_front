<template>
  <div class="">
    <div class="mx-auto">
      <!-- Header with back button -->
      <div class="mb-6">
        <button
          @click="goBack"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <i class="pi pi-arrow-left mr-2"></i>
          Ortga
        </button>
      </div>

      <!-- Student Profile Card -->
      <div v-if="student" class="bg-white rounded-2xl overflow-hidden mb-8">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
          <div class="flex items-center space-x-4">
            <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <i class="pi pi-user text-4xl text-white"></i>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white">
                {{ student.name }} {{ student.lastname }}
              </h1>
              <p class="text-indigo-100 mt-1">O'quvchi profili</p>
            </div>
          </div>
        </div>

        <!-- Content Section -->
        <div class="md:p-8 p-4">
          <div class="flex flex-col gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Contact Information -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i class="pi pi-phone text-indigo-600 mr-2"></i>
                  Aloqa ma'lumotlari
                </h3>

                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
                    >
                      <i class="pi pi-phone text-green-600"></i>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Telefon raqami</p>
                      <a
                        :href="`tel:${student.phone}`"
                        class="text-lg font-medium text-green-600 hover:text-green-700 transition-colors"
                      >
                        {{ student.phone }}
                      </a>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                    >
                      <i class="pi pi-map-marker text-blue-600"></i>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Manzil</p>
                      <p class="text-lg font-medium text-gray-800">{{ student.location }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Additional Information -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i class="pi pi-info-circle text-indigo-600 mr-2"></i>
                  Qo'shimcha ma'lumotlar
                </h3>

                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"
                    >
                      <i class="pi pi-calendar text-purple-600"></i>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Qo'shilgan sana</p>
                      <p class="text-lg font-medium text-gray-800">
                        {{ formatDate(student.createdAt) }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-start space-x-3">
                    <div
                      class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mt-1"
                    >
                      <i class="pi pi-file-edit text-orange-600"></i>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-gray-500">Izoh</p>
                      <p class="text-lg font-medium text-gray-800 mt-1">
                        {{ student.description || 'Hech qanday izoh qoldirilmagan' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- To'lov holati -->
            <div
              class="bg-white rounded-lg shadow-sm p-4"
              :class="{
                'border-l-4 border-green-500': student.paymentStatus?.isPaid,
                'border-l-4 border-red-500': !student.paymentStatus?.isPaid,
              }"
            >
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-gray-500 text-sm">To'lov holati</p>
                  <h3
                    class="text-xl font-bold mt-1"
                    :class="student.paymentStatus?.isPaid ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ student.paymentStatus?.message || 'Nomaʼlum' }}
                  </h3>
                  <p class="text-sm text-gray-600 mt-1">
                    To'langan: {{ formatCurrency(student.paymentStatus?.totalPaid || 0) }}
                  </p>
                  <p class="text-sm text-gray-600">
                    Qolgan: {{ formatCurrency(student.paymentStatus?.remainingAmount || 0) }}
                  </p>
                  <p class="text-sm text-gray-600">
                    Ortiqcha: {{ formatCurrency(student.paymentStatus?.overpaidAmount || 0) }}
                  </p>
                </div>
                <i
                  class="pi pi-info-circle text-2xl"
                  :class="student.paymentStatus?.isPaid ? 'text-green-500' : 'text-red-500'"
                ></i>
              </div>
            </div>
          </div>
          <!-- Action Buttons -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <div class="flex flex-wrap gap-3">
              <button
                @click="openEditModal(student)"
                class="inline-flex items-center cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <i class="pi pi-pencil mr-2"></i>
                Tahrirlash
              </button>

              <button
                @click="deleteModalVisible = true"
                class="inline-flex items-center cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <i class="pi pi-trash mr-2"></i>
                O'chirish
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="bg-gray-200 animate-pulse h-32 flex items-center justify-center">
          <i class="pi pi-spin pi-spinner text-4xl text-gray-400"></i>
        </div>
        <div class="p-8 space-y-4">
          <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          <div class="text-center text-gray-500 mt-4">
            <i class="pi pi-spin pi-spinner mr-2"></i>
            Ma'lumotlar yuklanmoqda...
          </div>
        </div>
      </div>

      <!-- Payment Table -->
      <div class="rounded-2xl overflow-hidden">
        <div class="flex justify-between py-6 border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800 flex items-center">
            <i class="pi pi-credit-card text-indigo-600 mr-2"></i>
            To'lov tarixi
          </h2>
          <button
            @click="addPaymentModalVisible = true"
            class="inline-flex items-center cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <i class="pi pi-plus mr-2"></i>
            To'lov qo'shish
          </button>
        </div>
        <div class="">
          <StudentPaymentTable ref="childRef" :studentId="studentId" />
        </div>
      </div>
    </div>
  </div>
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
          <InputText v-model="editedStudent.phone" class="w-full" placeholder="+998 90 123 45 67" />
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
  <Toast />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import StudentPaymentTable from '../../components/Students/StudentPaymentTable.vue'
function formatCurrency(value) {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
  }).format(value)
}

const admin = JSON.parse(sessionStorage.getItem('admin'))

const childRef = ref()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const student = ref(null)
const isLoading = ref(false)
const studentId = ref(route.params.id)
const groupId = ref(route.params.slug)

const deleteModalVisible = ref(false)
const editStudentModalVisible = ref(false)
const selectedStudentId = ref()
const addPaymentModalVisible = ref(false)
const showValidation = ref(false)
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

const editedStudent = ref({
  name: '',
  lastname: '',
  phone: '',
  location: '',
  description: '',
  groupId: groupId.value,
  status: 'active',
  admin: admin.id,
})

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
      getStudentById(d)
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

const deleteStudent = async () => {
  isLoading.value = true
  try {
    await axios.delete(`/students/${selectedStudentId.value}`)
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
      studentId: student.value._id,
      userId: admin.id, // ⚠️ "admin" obyektingiz login bo'lgan foydalanuvchimi? Unda `id` to‘g‘ri.
    })

    // Bolalar komponentidagi usulni chaqirish
    if (childRef.value?.getPaymentsByStudentId) {
      childRef.value.getPaymentsByStudentId()
    }

    // Muvaffaqiyatli xabar
    toast.add({
      severity: 'success',
      summary: 'Bajarildi',
      detail: 'To‘lov qabul qilindi',
      life: 3000,
    })

    // Modalni yopish
    addPaymentModalVisible.value = false
getStudentById()
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

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return "Noma'lum"
  const date = new Date(dateString)
  return date.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getStudentById = async () => {
  try {
    const res = await axios.get(`/students/byId/${studentId.value}`)
    student.value = res.data.student
    console.log(res.data)
  } catch (error) {
    console.error("O'quvchini yuklashda xatolik:", error)
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  getStudentById()
})
</script>

<style scoped>
/* Custom animations for loading */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
