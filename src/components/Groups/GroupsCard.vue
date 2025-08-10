<template>
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
    <!-- Card Header with Gradient -->
    <div class="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h2 class="text-xl font-bold text-white mb-1 line-clamp-2">
            {{ group.name }}
          </h2>
          <div class="flex items-center text-indigo-100">
            <i class="pi pi-user text-sm mr-2"></i>
            <span class="text-sm font-medium">
              {{ group.teacher?.name }} {{ group.teacher?.lastname }}
            </span>
          </div>
        </div>
        <div class="ml-4">
          <!-- <button 
            @click="toggle($event, group._id, group)"
            class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
          >
            <i class="pi pi-ellipsis-v text-white text-sm"></i>
          </button>
          <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" /> -->
        </div>
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-6">
      <!-- Stats Section -->
<div class="grid grid-cols-12 gap-4 mb-4">
  <!-- O'quvchilar -->
  <div class="bg-gray-50 col-span-6 rounded-lg p-3 text-center">
    <div class="flex items-center justify-center mb-1">
      <i class="pi pi-users text-blue-500 text-lg"></i>
    </div>
    <div class="text-2xl font-bold text-gray-800">{{ group.students.length }}</div>
    <div class="text-xs text-gray-500">O'quvchilar</div>
  </div>

  <!-- Yaratilgan sana -->
  <div class="bg-gray-50 col-span-6 rounded-lg  p-3 text-center">
    <div class="flex items-center justify-center mb-1">
      <i class="pi pi-calendar text-green-500 text-lg"></i>
    </div>
    <div class="text-sm font-semibold text-gray-800">{{ formatDate(group.createdAt) }}</div>
    <div class="text-xs text-gray-500">Yaratilgan</div>
  </div>

  <!-- Oylik to'lov -->
  <div class="bg-gray-50 col-span-12 rounded-lg p-3 text-center">
    <div class="flex items-center justify-center mb-1">
      <i class="pi pi-wallet text-yellow-500 text-lg"></i>
    </div>
    <div class="text-xl font-bold text-gray-800">
      {{ group.monthlyFee.toLocaleString() }} so'm
    </div>
    <div class="text-xs text-gray-500">Oylik to'lov</div>
  </div>
</div>


      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button 
          @click="router.push(`/group/${group._id}`)"
          class="flex-1 bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
        >
          <i class="pi pi-eye mr-2"></i>
          Batafsil
        </button>
        <button 
          @click="visibleEditGroup = true; changegroup = group"
          class="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg transition-colors duration-200"
        >
          <i class="pi pi-pencil"></i>
        </button>
        <button 
          @click="openDeleteModal(); changegroup = group; groupId = group._id"
          class="bg-red-50 cursor-pointer hover:bg-red-100 text-red-600 py-2 px-3 rounded-lg transition-colors duration-200"
        >
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </div>

    <!-- Status Indicator -->
    <div class="absolute top-4 right-4">
      <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
    </div>
  </div>

  <!-- Delete Modal -->
  <Dialog
    v-model:visible="deleteModalVisible"
    :modal="true"
    :closable="false"
    :draggable="false"
    class="custom-dialog"
    :style="{ width: '450px' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
  >
    <template #header>
      <div class="flex items-center">
        <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
          <i class="pi pi-exclamation-triangle text-red-600"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Guruhni o'chirish</h3>
          <p class="text-sm text-gray-500">Bu amalni qaytarib bo'lmaydi</p>
        </div>
      </div>
    </template>
    
    <div class="py-4">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div class="flex items-start">
          <i class="pi pi-info-circle text-red-500 mt-1 mr-3"></i>
          <div>
            <p class="text-red-800 font-medium mb-1">
              "{{ changegroup.name }}" guruhini o'chirmoqchimisiz?
            </p>
            <p class="text-red-600 text-sm">
              Bu guruhga tegishli barcha ma'lumotlar ham o'chiriladi.
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
          class="p-button-outlined p-button-secondary"
          @click="deleteModalVisible = false"
        />
        <Button
          :label="isLoading ? 'O\'chirilmoqda...' : 'Ha, o\'chirish'"
          icon="pi pi-trash"
          class="p-button-danger"
          :disabled="isLoading"
          :loading="isLoading"
          @click="deleteGroup()"
        />
      </div>
    </template>
  </Dialog>

  <!-- Edit Drawer -->
  <Drawer v-model:visible="visibleEditGroup" header="Guruh Tahrirlash" position="right" class="w-full md:w-96">
    <template #header>
      <div class="flex items-center">
        <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
          <i class="pi pi-pencil text-indigo-600"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Guruh Tahrirlash</h3>
          <p class="text-sm text-gray-500">{{ changegroup.name }}</p>
        </div>
      </div>
    </template>
    <EditGroupForm 
      @refreshFunctions="refreshFunctions"  
      @closeDrawer="visibleEditGroup = false" 
      :changegroup="changegroup"
    />
  </Drawer>
</template>

<script setup>
import { formatDate } from '../../utils/FormatDate.js'
import { ref } from 'vue'
import Menu from 'primevue/menu'
import { useRoute, useRouter } from 'vue-router'
import axios from "axios"
import Dialog from 'primevue/dialog'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import EditGroupForm from './EditGroupForm.vue'

const router = useRouter()
const emit = defineEmits(['getAllGroups'])
const admin = JSON.parse(sessionStorage.getItem('admin'))

const menu = ref()
const groupId = ref()
const changegroup = ref({})
const deleteModalVisible = ref(false)
const visibleEditGroup = ref(false)
const isLoading = ref(false)

const items = ref([
  {
    label: 'Batafsil ko\'rish',
    icon: 'pi pi-eye',
    command: () => {
      router.push(`/group/${groupId.value}`)
    }
  },
  {
    label: 'Tahrirlash',
    icon: 'pi pi-pencil',
    command: () => {
      visibleEditGroup.value = true
    }
  },
  {
    label: "O'chirish",
    icon: 'pi pi-trash',
    command: () => {
      openDeleteModal()
    },
  },
])

const toggle = (event, Id, item) => {
  menu.value.toggle(event)
  groupId.value = Id
  changegroup.value = item
  console.log(groupId.value)
}

defineProps({
  group: {
    type: Object,
    required: true,
    default: () => ({
      name: 'Frontend Guruh',
      description: 'Vue 3 va Tailwind o\'rganuvchilar uchun guruh',
      createdAt: '2025-07-17',
      students: [],
      teacher: {
        name: 'John',
        lastname: 'Doe'
      }
    })
  }
})

const openDeleteModal = () => {
  deleteModalVisible.value = true
}

const deleteGroup = async () => {
  isLoading.value = true
  try {
    const res = await axios.delete(`/groups/${groupId.value}`, {
      params: {
        adminId: admin.id
      }
    })
    emit("getAllGroups")
    deleteModalVisible.value = false
  } catch (err) {
    console.log(err)
  } finally {
    isLoading.value = false
  }
}

const refreshFunctions = () => {
  emit("getAllGroups")
  visibleEditGroup.value = false
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom dialog styles */
:deep(.p-dialog .p-dialog-header) {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-dialog .p-dialog-content) {
  padding: 0 1.5rem;
}

:deep(.p-dialog .p-dialog-footer) {
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}

/* Custom drawer styles */
:deep(.p-drawer .p-drawer-header) {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-drawer .p-drawer-content) {
  padding: 1.5rem;
}

/* Animation for status indicator */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>