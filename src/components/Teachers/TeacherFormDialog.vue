<template>
  <Dialog v-model:visible="visible" :header="editingTeacher ? 'Tahrirlash' : 'Qo\'shish'" modal>
    <form @submit.prevent="saveTeacher" class="space-y-4">
      <div>
        <label>Ism</label>
        <InputText v-model="form.name" class="w-full" :class="{ 'p-invalid': errors.name }" />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <div>
        <label>Familiya</label>
        <InputText v-model="form.lastname" class="w-full" :class="{ 'p-invalid': errors.lastname }" />
        <small v-if="errors.lastname" class="p-error">{{ errors.lastname }}</small>
      </div>

      <div>
        <label>Fan</label>
        <Dropdown
          v-model="form.science"
          :options="scienceOptions"
          class="w-full"
          editable
          :class="{ 'p-invalid': errors.science }"
        />
        <small v-if="errors.science" class="p-error">{{ errors.science }}</small>
      </div>

      <div class="flex justify-end gap-3">
        <Button label="Bekor qilish" severity="secondary" outlined @click="close" />
        <Button type="submit" :label="editingTeacher ? 'Saqlash' : 'Qo\'shish'" :loading="saving" />
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import axios from 'axios'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

const props = defineProps({
  visible: Boolean,
  editingTeacher: Object
})
const emit = defineEmits(['update:visible', 'saved'])

const toast = useToast()

const visible=ref(false)
const form = ref({ name: '', lastname: '', science: '' })
const errors = ref({})
const saving = ref(false)
const scienceOptions = ref(['Matematika', 'Fizika', 'Biologiya', 'Ingliz tili', 'Tarix', 'Informatika'])

watch(() => props.editingTeacher, (newVal) => {
  if (newVal) {
    form.value = { ...newVal }
  } else {
    form.value = { name: '', lastname: '', science: '' }
  }
})

const validateForm = () => {
  errors.value = {}
  if (!form.value.name) errors.value.name = 'Ism majburiy'
  if (!form.value.lastname) errors.value.lastname = 'Familiya majburiy'
  if (!form.value.science) errors.value.science = 'Fan tanlanishi kerak'
  return Object.keys(errors.value).length === 0
}

const saveTeacher = async () => {
  if (!validateForm()) return
  saving.value = true
  try {
    if (props.editingTeacher) {
      await axios.put(`/api/teachers/${props.editingTeacher._id}`, form.value)
    } else {
      await axios.post('/api/teachers', form.value)
    }
    toast.add({ severity: 'success', summary: 'Muvaffaqiyat', detail: 'Saqlash muvaffaqiyatli', life: 3000 })
    emit('saved')
    close()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: err.response?.data?.message || 'Xatolik yuz berdi', life: 3000 })
  } finally {
    saving.value = false
  }
}

const close = () => {
  emit('update:visible', false)
  errors.value = {}
}
</script>
