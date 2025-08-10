<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
    <div class="px-4 sm:px-6 py-4 border-b border-gray-200">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        
        <!-- Avatar va ism -->
        <div class="flex items-center space-x-4">
          <Avatar 
            :label="getInitials(teacher.name, teacher.lastname)"
            class="bg-blue-500 text-white"
            size="xlarge"
            shape="circle"
          />
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
              {{ teacher.name }} {{ teacher.lastname }}
            </h1>
            <p class="text-gray-600 text-sm sm:text-base">{{ teacher.science }}</p>
          </div>
        </div>

        <!-- Ball va tahrirlash tugmasi -->
        <div class="flex items-center space-x-2">
          <Tag :value="teacher.points + ' ball'" severity="success" />
          <Button 
            icon="pi pi-pencil" 
            label="Tahrirlash" 
            class="p-button-outlined whitespace-nowrap"
            size="small"
            @click="openEditDialog"
          />
        </div>
      </div>
    </div>

    <!-- Tahrirlash dialogi -->
    <Dialog
      v-model:visible="editDialogVisible"
      header="O'qituvchini tahrirlash"
      modal
      class="w-[95vw] sm:w-[500px]"
    >
      <form @submit.prevent="updateTeacher" class="space-y-4">
        <div>
          <label>Ism</label>
          <InputText v-model="form.name" class="w-full" />
        </div>
        <div>
          <label>Familiya</label>
          <InputText v-model="form.lastname" class="w-full" />
        </div>
        <div>
          <label>Telefon</label>
          <InputText v-model="form.phone" class="w-full" />
        </div>
        <div>
          <label>Belgilangan ulush %</label>
          <InputNumber v-model="form.percentage" class="w-full" />
        </div>
        <div>
          <label>Fan</label>
          <Dropdown v-model="form.science" :options="scienceOptions" class="w-full" editable />
        </div>
        <div class="flex justify-end gap-2">
          <Button label="Bekor qilish" @click="editDialogVisible = false" outlined />
          <Button type="submit" label="Saqlash" :loading="saving" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const props = defineProps({
  teacher: Object,
})
const emit = defineEmits(['updated'])

const admin = JSON.parse(sessionStorage.getItem('admin'))

const editDialogVisible = ref(false)
const saving = ref(false)

const form = ref({
  name: '',
  lastname: '',
  phone: '',
  percentage: null,
  science: ''
})

const scienceOptions = [
  'Matematika',
  'Fizika',
  'Biologiya',
  'Ingliz tili',
  'Tarix',
  'Informatika'
]

watch(
  () => props.teacher,
  (newVal) => {
    if (newVal) {
      form.value = { ...newVal }
    }
  },
  { immediate: true }
)

const openEditDialog = () => {
  form.value = { ...props.teacher }
  editDialogVisible.value = true
}

const updateTeacher = async () => {
  saving.value = true
  try {
    await axios.put(`/teachers/${form.value._id}`, {
      ...form.value,
      userId: admin.id
    })
    toast.add({
      severity: 'success',
      summary: 'Yangilandi',
      detail: "O'qituvchi yangilandi",
      life: 3000
    })
    emit('updated') // Parentga signal yuboramiz
    editDialogVisible.value = false
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Xatolik',
      detail: err.response?.data?.message || 'Yangilashda xatolik',
      life: 4000
    })
  } finally {
    saving.value = false
  }
}

const getInitials = (name, lastname) => {
  return `${name?.[0] || ''}${lastname?.[0] || ''}`.toUpperCase()
}
</script>
