<template>
    <div class="">
      <div class="">
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Guruh nomi -->
          <div class="space-y-2">
            <label for="groupName" class="block text-sm font-medium text-gray-700">
              Guruh nomi *
            </label>
            <InputText
              id="groupName"
              v-model="form.groupName"
              placeholder="Guruh nomini kiriting"
              class="w-full"
              :class="{ 'p-invalid': errors.groupName }"
            />
            <small v-if="errors.groupName" class="text-red-500">
              {{ errors.groupName }}
            </small>
          </div>

          <!-- O'qituvchi tanlash -->
          <div class="space-y-2">
            <label for="teacher" class="block text-sm font-medium text-gray-700">
              O'qituvchi *
            </label>
            <Dropdown
              id="teacher"
              v-model="form.teacher"
              :options="teachers"
              optionLabel="name"
              optionValue="_id"
              placeholder="O'qituvchini tanlang"
              class="w-full"
              :class="{ 'p-invalid': errors.teacher }"
            />
            <small v-if="errors.teacher" class="text-red-500">
              {{ errors.teacher }}
            </small>
          </div>
     <!-- Belgilangan oylik to'lovi -->
        <div class="space-y-2">
        <label for="groupName" class="block text-sm font-medium text-gray-700">
          Oylik to'lov *
        </label>
        <InputNumber
          id="monthlyFee"
          v-model="form.monthlyFee"
          placeholder="Oylik to'lovni kiriting"
          class="w-full"
          :class="{ 'p-invalid': errors.monthlyFee }"
        />
        <small v-if="errors.monthlyFee" class="text-red-500">
          {{ errors.monthlyFee }}
        </small>
      </div>
          <!-- Guruh haqida qo'shimcha ma'lumot -->
          <div class="space-y-2">
            <label for="description" class="block text-sm font-medium text-gray-700">
              Guruh haqida ma'lumot
            </label>
            <Textarea
              id="description"
              v-model="form.description"
              placeholder="Guruh haqida qo'shimcha ma'lumot kiriting"
              rows="3"
              class="w-full"
            />
          </div>

          <!-- Tugmalar -->
          <div class="flex gap-3 pt-4">
            <Button
              type="button"
              label="Bekor qilish"
              severity="secondary"
              outlined
              class="flex-1"
              @click="resetForm"
            />
            <Button
              type="submit"
              label="Guruh qo'shish"
              :loading="loading"
              class="flex-1"
            />
          </div>
        </form>

        <!-- Muvaffaqiyat xabari -->
        <div v-if="showSuccess" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <p class="text-sm text-green-700">Guruh muvaffaqiyatli qo'shildi!</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, reactive, defineEmits } from 'vue'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import axios from "axios"

const admin = JSON.parse(sessionStorage.getItem('admin'))
// Form ma'lumotlari
const form = reactive({
  groupName: '',
  teacher: null,
  monthlyFee:0,
  description: '',
  admin:admin.id
})
const emit = defineEmits(['getAllGroups', 'closeDrawer'])

console.log(emit);
// Xatoliklar
const errors = reactive({
  groupName: '',
  teacher: '',
  monthlyFee:0
})

// Holat o'zgaruvchilari
const loading = ref(false)
const showSuccess = ref(false)

// O'qituvchilar ro'yxati
const teachers = ref([
])

// Validatsiya funksiyasi
const validateForm = () => {
  let isValid = true
  
  // Xatoliklarni tozalash
  errors.groupName = ''
  errors.teacher = ''
  errors.monthlyFee = ''
  
  // Guruh nomi tekshiruvi
  if (!form.groupName.trim()) {
    errors.groupName = 'Guruh nomi kiritilishi shart'
    isValid = false
  } else if (form.groupName.trim().length < 2) {
    errors.groupName = 'Guruh nomi kamida 2 ta belgidan iborat bo\'lishi kerak'
    isValid = false
  }
  
  // O'qituvchi tekshiruvi
  if (!form.teacher) {
    errors.teacher = 'O\'qituvchi tanlanishi shart'
    isValid = false
  }
  if (!form.monthlyFee) {
    errors.monthlyFee = 'Oylik to\'lov kiritilishi shart'
    isValid = false
  }
  
  return isValid
}

// Formani yuborish
const submitForm = async () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  try{
    const res =await axios.post('/groups',{
      name:form.groupName,
      description:form.description,
      monthlyFee:form.monthlyFee,
      adminId:form.admin,
      teacher:form.teacher
    })
    loading.value=false
    emit('getAllGroups')
    emit('closeDrawer')
    console.log(res);
  }catch(err){
    console.log(err);
  }
}

// Formani tozalash
const resetForm = () => {
  form.groupName = ''
  form.teacher = null
  form.monthlyFee=0
  form.description = ''
  errors.groupName = ''
  errors.teacher = ''
  errors.monthlyFee = ''
}

const getAllTeachers = async () => {
  try {
    const res = await axios.get(`/teachers?userId=${admin.id}`)
    teachers.value = res.data
  } catch (err) {
    console.error(err)
  }
}
getAllTeachers()
</script>

<style scoped>
/* PrimeVue komponentlari uchun qo'shimcha stillar */

</style>