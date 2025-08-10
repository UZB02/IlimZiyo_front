<template>
  <div class="min-h-screen bg-gray-50 py-4" v-if="teacher.name && teacher.lastname">
    <div class="">
      <!-- Header -->
      <TeacherHeader :teacher="teacher" @updated="fetchTeacher" />

      <!-- Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="lg:col-span-2 space-y-6">
          <TeacherMainInfo :teacher="teacher" />
          <TeacherSalaryHistory
            :salaries="teacher.salaries"
            @edit-salary="openEditSalaryDialog"
            @delete-salary="confirmDeleteSalary"
          />
        </div>

        <div class="space-y-6">
          <TeacherStatistics :teacherSalaryStats="teacherSalaryStats" />
          <TeacherTimeline :teacher="teacher" />
         <TeacherActions :teacher-id="teacher._id" :user-id="admin.id" @salary-added="fetchTeacher" />

        </div>
      </div>
    </div>
  </div>

  <!-- Edit Salary Dialog -->
  <Dialog v-model:visible="showEditDialog" header="Maoshni tahrirlash" :modal="true" class="w-full max-w-md">
    <div class="space-y-4">
      <div>
        <label class="text-sm text-gray-600">Miqdor (UZS)</label>
        <InputNumber v-model="selectedSalary.amount" inputClass="w-full" mode="currency" currency="UZS" locale="uz-UZ" />
      </div>

      <div>
        <label class="text-sm text-gray-600">Sana</label>
        <Calendar v-model="selectedSalary.paidAt" showTime hourFormat="24" class="w-full" />
      </div>

      <div>
        <label class="text-sm text-gray-600">Holat</label>
        <select v-model="selectedSalary.status" class="w-full p-2 border rounded">
          <option value="paid">To‘langan</option>
          <option value="pending">Kutilmoqda</option>
        </select>
      </div>
    </div>

    <template #footer>
      <Button label="Bekor qilish" icon="pi pi-times" class="p-button-text" @click="showEditDialog = false" />
      <Button label="Saqlash" icon="pi pi-check" class="p-button-primary" @click="updateSalary" />
    </template>
  </Dialog>

  <!-- Delete Salary Dialog -->
  <Dialog v-model:visible="showDeleteDialog" header="Maoshni o‘chirish" :modal="true" class="w-full max-w-sm">
    <div class="text-gray-700 space-y-4">
      <p>Haqiqatan ham bu maosh yozuvini o‘chirmoqchimisiz?</p>
      <div class="flex justify-end gap-2">
        <Button label="Bekor qilish" class="p-button-text" @click="showDeleteDialog = false" />
        <Button label="O‘chirish" icon="pi pi-trash" class="p-button-danger" @click="deleteSalary" />
      </div>
    </div>
  </Dialog>
  <Toast />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import TeacherHeader from '../../components/Teachers/TeacherId/TeacherHeader.vue'
import TeacherMainInfo from '../../components/Teachers/TeacherId/TeacherMainInfo.vue'
import TeacherSalaryHistory from '../../components/Teachers/TeacherId/TeacherSalaryHistory.vue'
import TeacherStatistics from '../../components/Teachers/TeacherId/TeacherStatistics.vue'
import TeacherTimeline from '../../components/Teachers/TeacherId/TeacherTimeline.vue'
import TeacherActions from '../../components/Teachers/TeacherId/TeacherActions.vue'

import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const toast = useToast()


// Auth
const admin = JSON.parse(sessionStorage.getItem('admin'))

// Router
const route = useRoute()
const teacherId = route.params.id

// States
const teacher = ref({})
const teacherSalaryStats=ref({})
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedSalary = ref(null)
const selectedIndex = ref(null)
const salaryIdToDelete = ref(null)

// Fetch teacher
const fetchTeacher = async () => {
  try {
    const res = await axios.get(`/teachers/${teacherId}?userId=${admin.id}`)
    teacher.value = res.data.teacher
    teacherSalaryStats.value=res.data.salaryStats
    console.log(teacherSalaryStats.value);
  } catch (error) {
    console.error('O‘qituvchini yuklashda xatolik:', error)
  }
}
// // Fetch teacher
// const fetchsalaryStats = async () => {
//   try {
//     const res = await axios.get(`/teachers/${teacherId}/salary-stats`)
//     console.log(res.data);
//   } catch (error) {
//     console.error('O‘qituvchini yuklashda xatolik:', error)
//   }
// }
// fetchsalaryStats()

// Open edit dialog
const openEditSalaryDialog = ({ salary, index }) => {
  selectedSalary.value = { ...salary }
  selectedIndex.value = index
  showEditDialog.value = true
}

// Update salary
const updateSalary = async () => {
  if (!selectedSalary.value) return
  teacher.value.salaries[selectedIndex.value] = selectedSalary.value
  showEditDialog.value = false

  try {
    await axios.put(`/teachers/${teacherId}/salaries/${selectedSalary.value._id}?userId=${admin.id}`, selectedSalary.value)
  } catch (error) {
    console.error('Maoshni yangilashda xatolik:', error)
  }
}

// Confirm delete
const confirmDeleteSalary = (salaryId) => {
  salaryIdToDelete.value = salaryId
  showDeleteDialog.value = true
}

// Delete salary
const deleteSalary = async () => {
  try {
    const res = await axios.delete(
      `/salaries/${salaryIdToDelete.value}`,
      {
        params: { userId: admin.id }
      }
    )

    if (res.status === 200) {
      showDeleteDialog.value = false
      toast.add({
        severity: 'success',
        summary: 'Bajarildi',
        detail: "Xarajat o‘chirildi",
        life: 3000
      })
      fetchTeacher()
    }
  } catch (err) {
    console.error('O‘chirishda xatolik:', err)
    toast.add({
      severity: 'error',
      summary: 'Xatolik',
      detail: "Xarajatni o‘chirishda xatolik yuz berdi",
      life: 4000
    })
  }
}


onMounted(() => {
  fetchTeacher()
})
</script>
