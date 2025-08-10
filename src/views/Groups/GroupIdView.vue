<template>
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ group.name || 'Loading...' }}</h1>
      <p class="text-gray-600">
        {{
          group.teacher
            ? group.teacher.name + ' ' + group.teacher.lastname
            : 'O‘qituvchi maʼlumoti yo‘q'
        }}
      </p>
    </div>

    <!-- Yangi guruh qo‘shish -->
    <div class="flex items-center gap-2 bg-white rounded-lg shadow-sm p-3">
      <button
        class="bg-gradient-to-r cursor-pointer from-green-500 to-green-600 text-white rounded-md px-4 py-2 hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        @click="addStudentmodalvisible = true"
      >
        <i class="pi pi-plus"></i>
        O'quvchi qo‘shish
      </button>
    </div>
  </div>
  <div>
    <StudentsTable :group="group" @getGroupById="getGroupById"></StudentsTable>
  </div>

  <!-- Begin AddStudent Modal -->
  <Dialog
    v-model:visible="addStudentmodalvisible"
    :modal="true"
    :closable="true"
    :draggable="false"
    class="custom-dialog"
    :style="{ width: '600px' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
  >
    <!-- Custom Header -->
    <template #header>
      <div class="flex items-center gap-3 w-full">
        <div
          class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center"
        >
          <i class="pi pi-user-plus w-5 h-5 text-white"></i>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-800 m-0">Yangi o'quvchi qo'shish</h2>
          <p class="text-sm text-gray-500 m-0">O'quvchi ma'lumotlarini kiriting</p>
        </div>
      </div>
    </template>

    <!-- Form Content -->
    <div class="space-y-6 p-1">
      <!-- Shaxsiy ma'lumotlar bo'limi -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <i class="pi pi-user w-5 h-5 text-blue-500"></i>
          Shaxsiy ma'lumotlar
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
              Ism <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="newStudent.name"
              placeholder="Ismingizni kiriting"
              class="w-full"
              :class="{ 'p-invalid': !newStudent.name && showValidation }"
            />
            <small v-if="!newStudent.name && showValidation" class="text-red-500">
              Ism kiritish majburiy
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
              Familiya <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="newStudent.lastname"
              placeholder="Familiyangizni kiriting"
              class="w-full"
              :class="{ 'p-invalid': !newStudent.lastname && showValidation }"
            />
            <small v-if="!newStudent.lastname && showValidation" class="text-red-500">
              Familiya kiritish majburiy
            </small>
          </div>
        </div>
      </div>

      <!-- Aloqa ma'lumotlari bo'limi -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <i class="pi pi-phone w-5 h-5 text-green-500"></i>
          Aloqa ma'lumotlari
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Telefon raqami</label>
            <InputText v-model="newStudent.phone" placeholder="+998 90 123 45 67" class="w-full" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Manzil</label>
            <InputText v-model="newStudent.location" placeholder="Yashash manzili" class="w-full" />
          </div>
        </div>
      </div>
      <!-- Qo'shimcha ma'lumotlar bo'limi -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <i class="pi pi-clipboard w-5 h-5 text-orange-500"></i>
          Qo'shimcha ma'lumotlar
        </h3>

        <div class="space-y-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Izoh</label>
            <Textarea
              v-model="newStudent.description"
              placeholder="Qo'shimcha ma'lumotlar yoki izohlar..."
              class="w-full"
              rows="3"
              autoResize
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Footer -->
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
            @click="addStudentmodalvisible = false"
            class="px-4 py-2"
          />
          <Button
            label="Saqlash"
            icon="pi pi-check"
            @click="addStudent()"
            :loading="isLoading"
            class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 border-blue-500 hover:from-blue-600 hover:to-blue-700"
          />
        </div>
      </div>
    </template>
  </Dialog>
  <!-- End AddStudent Modal -->
   <Toast />
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import StudentsTable from '../../components/Students/StudentsTable.vue'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'

const toast = useToast()

const route = useRoute()
const groupId = ref(route.params.slug)
const admin = JSON.parse(sessionStorage.getItem('admin'))

const isLoading = ref(false)
const group = ref({})
const addStudentmodalvisible = ref(false)

const newStudent = ref({
  name: 'Alisher',
  lastname: 'Sobirov',
  phone: '+998974589652',
  location: 'Namangan',
  groupId: group.value._id,
  status: 'active',
  description: 'Sertefikat olmoqchi',
  admin: admin.id,
})

const getGroupById = async () => {
  try {
    const res = await axios.get(`/groups/${groupId.value}`, {
      params: {
        adminId: admin.id,
      },
    })
    group.value = res.data
    console.log(group.value)
  } catch (err) {
    console.error('Xatolik:', err)
  }
}
getGroupById()

// const gurupOptions = ref()

// const getAllGroups = async () => {
//   try {
//     const res = await axios.get(`/groups`, {
//       params: { adminId: admin.id },
//     })
//     gurupOptions.value = res.data
//     console.log(res, 55)
//   } catch (err) {
//     console.log(err)
//   }
// }
// getAllGroups()

const addStudent = async () => {
  console.log(newStudent.value)
  console.log(group.value._id)
  try {
    const res = await axios.post('/students', {
      name: newStudent.value.name,
      lastname: newStudent.value.lastname,
      phone: newStudent.value.phone,
      location: newStudent.value.location,
      groupId: group.value._id,
      status: 'new',
      description: newStudent.value.description,
      admin: admin.id,
    })
    if(res.status===201){
    toast.add({ severity: 'success', summary: 'Success', detail: "O'quvchi qo‘shildi", life: 3000 })
    addStudentmodalvisible.value = false
    refreshFunction()
    getGroupById()
    }
  } catch (error) {
    console.error(error)
    toast.add({ severity: 'error', summary: 'Xatolik', detail: "O'quvchi qo‘shilmadi", life: 3000 })
  }
}


const refreshFunction=()=>{
    newStudent.value.name=''
    newStudent.value.lastname=''
    newStudent.value.phone=''
    newStudent.value.location=''
    newStudent.value.description=''
}
</script>
