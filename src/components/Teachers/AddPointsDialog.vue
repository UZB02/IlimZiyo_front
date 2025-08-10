<template>
  <Dialog v-model:visible="visible" header="Ball qo'shish" modal>
    <form @submit.prevent="addPoints" class="space-y-4">
      <label>{{ teacher?.name }} uchun ball</label>
      <InputNumber v-model="points" class="w-full" :min="1" :max="100" />
      <div class="flex justify-end gap-3">
        <Button label="Bekor qilish" severity="secondary" outlined @click="close" />
        <Button type="submit" label="Qo'shish" :loading="loading" />
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import axios from 'axios'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

const props = defineProps({
  visible: Boolean,
  teacher: Object
})
const emit = defineEmits(['update:visible', 'added'])


const visible=ref(false)
const toast = useToast()
const points = ref(null)
const loading = ref(false)

const addPoints = async () => {
  if (!points.value || points.value <= 0) {
    toast.add({ severity: 'warn', summary: 'Ogohlantirish', detail: 'Ball miqdorini kiriting', life: 3000 })
    return
  }
  loading.value = true
  try {
    await axios.post(`/teachers/${props.teacher._id}/add-points`, { points: points.value })
    toast.add({ severity: 'success', summary: 'Qo‘shildi', detail: 'Ball qo‘shildi', life: 3000 })
    emit('added')
    close()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Ball qo‘shishda xatolik', life: 3000 })
  } finally {
    loading.value = false
  }
}

const close = () => {
  emit('update:visible', false)
  points.value = null
}
</script>
