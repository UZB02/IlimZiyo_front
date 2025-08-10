<template>
  <div>
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

      <!-- O'qituvchi -->
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

      <!-- Qo'shimcha ma'lumot -->
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
          @click="emit('closeDrawer')"
        />
        <Button
          type="submit"
          label="Saqlash"
          :loading="loading"
          class="flex-1"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, watch } from 'vue'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import axios from "axios"
import { onMounted } from 'vue'

// Props va emitlar
const props = defineProps({
  changegroup: Object
})
const emit = defineEmits(['refreshFunctions', 'closeDrawer'])

// Admin ma'lumotlari
const admin = JSON.parse(sessionStorage.getItem('admin'))

// Form
const form = reactive({
  groupName: '',
  teacher: null,
  monthlyFee:0,
  description: '',
  admin: admin.id
})

// Xatoliklar
const errors = reactive({
  groupName: '',
  teacher: '',
  monthlyFee:0
})

const loading = ref(false)
const teachers = ref([])
const isEditMode = ref(false)

// O'qituvchilarni olish
const getAllTeachers = async () => {
  try {
    const res = await axios.get(`/teachers?userId=${admin.id}`)
    teachers.value = res.data
  } catch (err) {
    console.error(err)
  }
}

// Validatsiya
const validateForm = () => {
  let isValid = true
  errors.groupName = ''
  errors.teacher = ''
  errors.monthlyFee = ''

  if (!form.groupName.trim()) {
    errors.groupName = 'Guruh nomi kiritilishi shart'
    isValid = false
  } else if (form.groupName.length < 2) {
    errors.groupName = 'Guruh nomi kamida 2 ta belgidan iborat bo\'lishi kerak'
    isValid = false
  }

  if (!form.teacher) {
    errors.teacher = 'O\'qituvchi tanlanishi shart'
    isValid = false
  }
  if (!form.monthlyFee) {
    errors.monthlyFee = 'Kurs to\'lovi kiritilishi shart'
    isValid = false
  }

  return isValid
}

// Form yuborish
const submitForm = async () => {
  if (!validateForm()) return
  loading.value = true

  try {
    if (isEditMode.value && props.changegroup && props.changegroup._id) {
      // Tahrirlash
      await axios.put(`/groups/${props.changegroup._id}`, {
        name: form.groupName,
        description: form.description,
        monthlyFee:form.monthlyFee,
        teacher: form.teacher,
        adminId: form.admin
      })
    } else {
      // Qo‘shish
      await axios.post('/groups', {
        name: form.groupName,
        description: form.description,
        monthlyFee:form.monthlyFee,
        teacher: form.teacher,
        adminId: form.admin
      })
    }

    emit('refreshFunctions')
    emit('closeDrawer')
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Guruhni tahrirlash uchun formani to‘ldirish
watch(
  () => props.changegroup,
  (newVal) => {
    if (newVal && newVal._id) {
      isEditMode.value = true
      form.groupName = newVal.name || ''
      form.monthlyFee=newVal.monthlyFee || 0
      form.teacher = newVal.teacher?._id || null
      form.description = newVal.description || ''
    } else {
      isEditMode.value = false
      form.groupName = ''
      form.monthlyFee=0
      form.teacher = null
      form.description = ''
    }
  },
  { immediate: true }
)

onMounted(() => {
  getAllTeachers()
})
</script>

<style scoped>
/* Qo‘shimcha style kerak bo‘lsa shu yerga yozing */
</style>
