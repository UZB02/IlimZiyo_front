<template>
  <div class="bg-gradient-to-br p-2 sm:p-1">
    <div class="">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Arizalar bo'limi</h1>
          <p class="text-gray-600">Vazifalarni boshqaring va jarayonni kuzatib boring</p>
        </div>

        <!-- Yangi ustun qo'shish -->
        <div class="flex items-center gap-2 bg-white rounded-lg shadow-sm p-3">
          <input
            v-model="newColumnName"
            placeholder="Ustun nomi kiriting..."
            class="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[200px]"
            @keyup.enter="addColumn"
          />
          <button
            @click="addColumn"
            :disabled="!newColumnName.trim()"
            class="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md px-4 py-2 hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <i class="pi pi-plus"></i>
            Ustun qo'shish
          </button>
        </div>
      </div>

      <!-- Kanban Board -->
      <div class="flex gap-6 overflow-x-auto md:flex-row  flex-col pb-4">
        <div
          v-for="(column, columnIndex) in columns"
          :key="column._id"
          class="bg-red h-auto rounded-xl shadow-sm border border-gray-100 p-4  md:w-80 flex-shrink-0 transition-all duration-200 hover:shadow-md"
          @dragover.prevent
          @drop="onDrop(column._id)"
          @dragenter.prevent="onDragEnter(column._id)"
          @dragleave.prevent="onDragLeave(column._id)"
          :class="{ 'ring-2 ring-blue-300 bg-blue-50': dragOverColumn === column._id }"
        >
          <!-- Column Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" :class="getColumnColor(columnIndex)"></div>
              <h2 class="text-lg font-semibold text-gray-800">{{ column.name }}</h2>
              <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                {{ column.applications.length }}
              </span>
            </div>
            <i
              class="pi pi-cog cursor-pointer text-gray-500"
              @click="toggle($event, column._id)"
            ></i>
          </div>

          <!-- applications -->
          <div class="space-y-3 mb-4 min-h-[100px]">
            <div
              v-for="application in column.applications"
              :key="application.id"
              class="bg-gradient-to-r from-white to-gray-300 rounded-lg p-3 cursor-move border border-gray-100 hover:shadow-md transition-all duration-200 group flex flex-col gap-2"
              draggable="true"
              @dragstart="onDragStart(application, column._id)"
              :class="{ 'opacity-50 scale-95': draggedapplication?.id === application.id }"
            >
              <div class="flex items-start justify-between">
                <div class="flex flex-col gap-2">
                  <p class="text-sm font-medium flex-1">{{ application.name }} {{ application.lastname }}</p>
                  <div class="text-gray-700 flex gap-2">
                    <span class="flex items-center text-sm">
                      <i class="pi pi-phone text-sm"></i> {{ application.phone }}
                    </span>
                    <span class="flex items-center text-sm">
                      <i class="pi pi-map-marker text-sm"></i> {{ application.location }}
                    </span>
                  </div>
                </div>
                <i
                  class="pi pi-trash opacity-0 cursor-pointer group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200 ml-2"
                  @click="openDelapplicationModal(column._id, application)"
                ></i>
                <i
                  class="pi pi-info opacity-0 cursor-pointer group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200 ml-2"
                  @click="openeditApplicationModal(application)"
                ></i>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full" :class="getColumnColor(columnIndex)"></div>
                  <span class="text-xs text-gray-500">{{ formatDate(application.createdAt) }}</span>
                </div>
                <button
                  :class="getColumnColor(columnIndex)"
                  @click="openAppActiveFunctionModal(application)"
                  class="py-1/2 px-2 rounded cursor-pointer text-white"
                >
                  Qabul
                </button>
                <!-- <Button class="" onLabel="On" offLabel="Off" label="Qabul" size="small" /> -->
              </div>
            </div>
          </div>
          <button
            @click="addModalToogle(column._id)"
            class="w-full bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 text-white rounded-lg px-3 py-2 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <i class="pi pi-plus"></i>
            Ariza qo'shish
          </button>
        </div>

        <!-- Empty state agar ustunlar bo'lmasa -->
        <div v-if="columns.length === 0" class="flex items-center justify-center w-full h-64">
          <div class="text-center">
            <h3 class="text-lg font-medium text-gray-600 mb-2">Ustunlar yo'q</h3>
            <p class="text-gray-500 text-sm">
              Birinchi ustun qo'shish uchun yuqoridagi tugmani bosing
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Begin Menu -->
  <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  <!-- End Menu -->
  <!-- Begin AddApplication Modal -->
  <Dialog
    v-model:visible="addmodalvisible"
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
          <h2 class="text-xl font-semibold text-gray-800 m-0">Yangi ariza qo'shish</h2>
          <p class="text-sm text-gray-500 m-0">Ariza beruvchi ma'lumotlarini kiriting</p>
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
              v-model="newApplicant.name"
              placeholder="Ismingizni kiriting"
              class="w-full"
              :class="{ 'p-invalid': !newApplicant.name && showValidation }"
            />
            <small v-if="!newApplicant.name && showValidation" class="text-red-500">
              Ism kiritish majburiy
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
              Familiya <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="newApplicant.lastname"
              placeholder="Familiyangizni kiriting"
              class="w-full"
              :class="{ 'p-invalid': !newApplicant.lastname && showValidation }"
            />
            <small v-if="!newApplicant.lastname && showValidation" class="text-red-500">
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
            <InputText
              v-model="newApplicant.phone"
              placeholder="+998 90 123 45 67"
              class="w-full"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Manzil</label>
            <InputText
              v-model="newApplicant.location"
              placeholder="Yashash manzili"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Ta'lim ma'lumotlari bo'limi -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <i class="pi pi-briefcase w-5 h-5 text-purple-500"></i>
          Ta'lim ma'lumotlari
        </h3>

        <div class="flex flex-col w-full gap-2">
          <label class="text-sm font-medium text-gray-700">Guruh</label>
          <Dropdown
            id="teacher"
            v-model="newApplicant.groupId"
            :options="gurupOptions"
            optionLabel="name"
            optionValue="_id"
            placeholder="O'qituvchini tanlang"
            class="w-full"
          />
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
              v-model="newApplicant.description"
              placeholder="Qo'shimcha ma'lumotlar yoki izohlar..."
              class="w-full"
              rows="3"
              autoResize
            />
          </div>

          <!-- <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Mas'ul admin</label>
            <InputText
              v-model="newApplicant.admin"
              placeholder="Admin ismini kiriting"
              class="w-full"
            />
          </div> -->
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
            @click="addmodalvisible = false"
            class="px-4 py-2"
          />
          <Button
            label="Saqlash"
            icon="pi pi-check"
            @click="addapplication()"
            :loading="isLoading"
            class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 border-blue-500 hover:from-blue-600 hover:to-blue-700"
          />
        </div>
      </div>
    </template>
  </Dialog>
  <!-- End AddApplication Modal -->
  <!-- Begin EditApplication Modal -->
  <Dialog
    v-model:visible="editAppModalVisible"
    :modal="true"
    :closable="true"
    :draggable="false"
    class="custom-dialog"
    :style="{ width: '600px' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
  >
    <template #header>
      <div class="flex items-center gap-3 w-full">
        <div
          class="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center"
        >
          <i class="pi pi-pencil w-5 h-5 text-white"></i>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-800 m-0">Arizani tahrirlash</h2>
          <p class="text-sm text-gray-500 m-0">Ma'lumotlarni yangilang</p>
        </div>
      </div>
    </template>

    <div class="space-y-6 p-1">
      <!-- Ism, Familiya -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Ism</label>
          <InputText v-model="editedApplication.name" class="w-full" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Familiya</label>
          <InputText v-model="editedApplication.lastname" class="w-full" />
        </div>
      </div>

      <!-- Telefon, Manzil -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Telefon raqami</label>
          <InputText v-model="editedApplication.phone" class="w-full" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Manzil</label>
          <InputText v-model="editedApplication.location" class="w-full" />
        </div>
      </div>

      <!-- Guruh -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-gray-700">Guruh</label>
        <Dropdown
          id="teacher"
          v-model="editedApplication.groupId"
          :options="gurupOptions"
          optionLabel="name"
          optionValue="_id"
          placeholder="O'qituvchini tanlang"
          class="w-full"
        />
      </div>

      <!-- Izoh -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-gray-700">Izoh</label>
        <Textarea v-model="editedApplication.description" rows="3" class="w-full" autoResize />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <button
          @click="openAppActiveFunctionModal(editedApplication)"
          class="py-1/2 flex items-center justify-center gap-2 font-bold px-2 rounded cursor-pointer bg-green-500 text-white"
        >
          <i class="pi pi-plus"></i> Qabul
        </button>
        <Button
          label="Bekor qilish"
          icon="pi pi-times"
          severity="secondary"
          @click="editAppModalVisible = false"
        />
        <Button
          label="Yangilash"
          icon="pi pi-check"
          :loading="isLoading"
          @click="uppdqateApplication(editedApplication._id)"
        />
      </div>
    </template>
  </Dialog>
  <!-- End EditApplication Modal -->
  <!-- Begin delete Column Modal -->
  <Dialog
    v-model:visible="columnDelModal"
    :modal="true"
    :closable="false"
    :draggable="false"
    class="custom-dialog"
    :style="{ width: '500px' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
  >
    <template #header>
      <div class="text-lg font-semibold text-red-600">Diqqat!</div>
    </template>

    <div class="text-gray-700 text-base py-4">
      Ushbu ustunni o‘chirmoqchimisiz? Bu amal qaytarib bo‘lmaydi.
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <Button
          label="Bekor qilish"
          icon="pi pi-times"
          class="p-button-outlined p-button-secondary"
          @click="columnDelModal = false"
        />
        <Button
          :label="isLoading ? 'Loading...' : 'Ha o\'chirish'"
          icon="pi pi-trash"
          class="p-button-danger"
          @click="deleteColumn(columnID)"
        />
      </div>
    </template>
  </Dialog>
  <!-- End delete Column Modal -->
  <!-- Begin delete Column Modal -->
  <Dialog
    v-model:visible="columnDelapplicationModal"
    :modal="true"
    :closable="false"
    :draggable="false"
    class="custom-dialog"
    :style="{ width: '500px' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
  >
    <template #header>
      <div class="text-lg font-semibold text-red-600">Diqqat!</div>
    </template>

    <div class="text-gray-700 text-base py-4">
      Ushbu arizani o‘chirmoqchimisiz? Bu amal qaytarib bo‘lmaydi.
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <Button
          label="Bekor qilish"
          icon="pi pi-times"
          class="p-button-outlined p-button-secondary"
          @click="columnDelapplicationModal = false"
        />
        <Button
          :label="isLoading ? 'Loading...' : 'Ha o\'chirish'"
          icon="pi pi-trash"
          class="p-button-danger"
          @click="deleteapplication(columnID)"
        />
      </div>
    </template>
  </Dialog>
  <!-- End delete Column Modal -->
  <!-- Begin Activeapplication Modal -->
  <Dialog
    v-model:visible="openappDoneModall"
    :modal="true"
    :closable="false"
    :draggable="false"
    class="custom-dialog"
    :style="{ width: '500px' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
  >
    <template #header>
      <div class="text-lg font-semibold text-red-600">Diqqat!</div>
    </template>

    <div class="text-gray-700 text-base py-4">
      {{ chosenApplication.name }} {{ chosenApplication.lastname }} ni qo'shmoqchimisiz?
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <Button
          label="Bekor qilish"
          icon="pi pi-times"
          class="p-button-outlined p-button-secondary"
          @click="openappDoneModall = false"
        />
        <Button
          :label="isLoading ? 'Loading...' : 'Ha qo\'shish'"
          icon="pi pi-plus"
          @click="addAPlicationToGroup(chosenApplication._id)"
        />
      </div>
    </template>
  </Dialog>
  <!-- End Activeapplication Modal -->
  <!-- Begin editColumn Modal -->
  <Dialog
    v-model:visible="editColumnModalVisible"
    :modal="true"
    :closable="false"
    :draggable="false"
    class="custom-dialog"
    :style="{ width: '500px' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
  >
    <template #header>
      <div class="flex items-center gap-3 w-full">
        <div
          class="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center"
        >
          <i class="pi pi-pencil w-5 h-5 text-white"></i>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-800 m-0">Ustunni tahrirlash</h2>
          <p class="text-sm text-gray-500 m-0">Nomini yangilang</p>
        </div>
      </div>
    </template>

    <div class="py-4">
      <label for="columnName" class="block text-gray-700 mb-2">Ustun nomi</label>
      <InputText
        id="columnName"
        v-model="editColumnName"
        class="w-full"
        placeholder="Yangi ustun nomini kiriting"
      />
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <Button
          label="Bekor qilish"
          icon="pi pi-times"
          class="p-button-outlined p-button-secondary"
          @click="editColumnModalVisible = false"
        />
        <Button
          :label="isLoading ? 'Yuklanmoqda...' : 'Saqlash'"
          icon="pi pi-check"
          @click="updateColumn()"
        />
      </div>
    </template>
  </Dialog>
  <!-- End editColumn Modal -->
  <Toast />
</template>

<script setup>
import { ref, reactive, toRaw, onMounted } from 'vue'
import axios from 'axios'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Menu from 'primevue/menu'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'

const toast = useToast()

let nextColumnId = 4
const admin = JSON.parse(sessionStorage.getItem('admin')) // o'zgaruvchini haqiqiy admin id bilan almashtiring

const newColumnName = ref('')
const draggedapplication = ref(null)
const draggedFromColumnId = ref(null)
const dragOverColumn = ref(null)
const columnID = ref(null)
const addmodalvisible = ref(false)
const showValidation = ref(false)
const isLoading = ref(false)
const columnDelModal = ref(false)
const columnDelapplicationModal = ref(false)
const editAppModalVisible = ref(false)
const openappDoneModall = ref(false)
const chosenApplication = ref()
const editColumnModalVisible = ref(false)
const editColumnName = ref('')

const menu = ref()
const items = ref([
  {
    label: 'Tahrirlash',
    icon: 'pi pi-pencil',
    command: () => {
      editColumnModalVisible.value = true
    },
  },
  {
    label: "O'chirish",
    icon: 'pi pi-trash',
    command: () => {
      columnDelModal.value = true
    },
  },
])

const editedApplication = ref({
  name: '',
  lastname: '',
  phone: '',
  location: '',
  groupId: '',
  status: '',
  description: '',
  admin: admin.id,
})

const columns = ref([])

const newApplicant = ref({
  name: '',
  lastname: '',
  phone: '',
  location: '',
  groupId: null,
  status: 'new',
  description: '',
  admin: admin.id,
})

const gurupOptions = ref()

const getAllGroups = async () => {
  try {
    const res = await axios.get(`/groups`, {
      params: { adminId: admin.id },
    })
    gurupOptions.value = res.data
    console.log(res, 55)
  } catch (err) {
    console.log(err)
  }
}
getAllGroups()

onMounted(async () => {
  await fetchColumns()
})

const openDelapplicationModal=(columnId,application)=>{
  columnDelapplicationModal.value=true
columnID.value=columnId
chosenApplication.value=application
}

async function fetchColumns() {
  const colRes = await axios.get(`/columns/${admin.id}`)
  console.log(colRes)
  const appRes = await axios.get(`/applications/${admin.id}`)
  columns.value = colRes.data.map((col) => ({
    ...col,
    applications: appRes.data.filter((app) => app.columnId === col._id),
  }))
}

const addModalToogle = (columnId) => {
  addmodalvisible.value = true
  columnID.value = columnId
  console.log(columnID.value)
}

function onDragStart(application, columnId) {
  draggedapplication.value = application
  draggedFromColumnId.value = columnId
}

function onDragEnter(columnId) {
  dragOverColumn.value = columnId
}

function onDragLeave() {
  dragOverColumn.value = null
}

async function onDrop(targetColumnId) {
  if (!draggedapplication.value) return

  const fromColumn = columns.value.find((col) => col._id === draggedFromColumnId.value)
  const toColumn = columns.value.find((col) => col._id === targetColumnId)

  if (fromColumn && toColumn) {
    fromColumn.applications = fromColumn.applications.filter((t) => t._id !== draggedapplication.value._id)
    toColumn.applications.push(draggedapplication.value)

    try {
      await axios.put(`/applications/${draggedapplication.value._id}/move`, {
        columnId: targetColumnId,
      })
    } catch (err) {
      console.error('Backend update error:', err)
    }
  }

  draggedapplication.value = null
  draggedFromColumnId.value = null
  dragOverColumn.value = null
}

async function addColumn() {
  if (newColumnName.value.trim() === '') return

  try {
    const res = await axios.post('/columns', {
      name: newColumnName.value.trim(),
      userId: admin.id,
    })
    columns.value.push({ ...res.data, applications: [] })
    newColumnName.value = ''
  } catch (err) {
    console.error('Error adding column:', err)
  }
}

async function deleteColumn(columnId) {
  isLoading.value = true
  try {
    await axios.delete(`/columns/${columnId}`)
    columns.value = columns.value.filter((col) => col._id !== columnId)
    toast.add({
      severity: 'success',
      summary: 'Muvaffaqiyatli',
      detail: 'Ustun muvaffaqiyatli o‘chirildi',
      life: 3000
    })
    columnDelModal.value = false
  } catch (err) {
    console.error('Error deleting column:', err)
    toast.add({
      severity: 'error',
      summary: 'Xatolik',
      detail: 'Ustunni o‘chirishda xatolik yuz berdi',
      life: 3000
    })
  } finally {
    isLoading.value = false
  }
}

async function addapplication() {
  const applicant = newApplicant.value
  console.log(applicant)
  if (!applicant.name || !applicant.lastname || !applicant.phone) {
    showValidation.value = true
    return
  }

  const column = columns.value.find((c) => c._id === columnID.value)
  console.log(columnID.value)
  if (column) {
    isLoading.value = true
    try {
      const response = await axios.post('/applications', {
        ...applicant,
        columnId: column._id,
      })
      column.applications.push(response.data)
      fetchColumns()
    } catch (err) {
      console.error('Error adding application:', err)
    } finally {
      isLoading.value = false
    }

    newApplicant.value = {
      name: '',
      lastname: '',
      phone: '',
      location: '',
      groupId: '',
      status: column.name,
      description: '',
      admin: '',
    }
    addmodalvisible.value = false
    showValidation.value = false
  }
}

async function deleteapplication(columnId) {
  try {
    // Backend'ga DELETE so‘rov yuborish
    await axios.delete(`/applications/${chosenApplication.value._id}`)

    // Lokal holatda column ichidan application (application) ni olib tashlash
    const column = columns.value.find((c) => c._id === columnId)
    if (column) {
      column.applications = column.applications.filter((t) => t._id !== chosenApplication.value._id)
    }

    columnDelapplicationModal.value = false

    toast.add({
      severity: 'success',
      summary: 'Muvaffaqiyatli',
      detail: 'Ariza muvaffaqiyatli o‘chirildi',
      life: 3000
    })
  } catch (error) {
    console.error("O‘chirishda xatolik:", error)
    toast.add({
      severity: 'error',
      summary: 'Xatolik',
      detail: 'Arizani o‘chirishda xatolik yuz berdi',
      life: 3000
    })
  }
}

function getColumnColor(index) {
  const colors = [
    'bg-green-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-indigo-500',
  ]
  return colors[index % colors.length]
}

function formatDate(date) {
  return new Intl.DateTimeFormat('uz-UZ', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

const toggle = (event, colId) => {
  menu.value.toggle(event)
  columnID.value = colId
  console.log(columnID.value)
}

const openeditApplicationModal = (aplication) => {
  console.log(aplication)
  editAppModalVisible.value = true
  editedApplication.value = { ...aplication }
}

const openAppActiveFunctionModal = (item) => {
  if (item.groupId == null) {
    toast.add({
      severity: 'error',
      summary: 'Xatolik',
      detail: 'Guruh tanlang',
      life: 3000,
    })
  } else {
    openappDoneModall.value = true
    chosenApplication.value = item
    console.log(chosenApplication.value)
  }
}

const addAPlicationToGroup = async (id) => {
  try {
    const res = await axios.put(`/applications/${id}/status`, {
      status: 'active',
    })
    fetchColumns()
    openappDoneModall.value = false
    editAppModalVisible.value = false
    console.log(res)
  } catch (err) {
    console.log(err)
  }
}

const uppdqateApplication = async (id) => {
  isLoading.value = true
  try {
    const payload = {
      name: editedApplication.value.name,
      lastname: editedApplication.value.lastname,
      phone: editedApplication.value.phone,
      location: editedApplication.value.location,
      groupId: editedApplication.value.groupId,
      description: editedApplication.value.description,
      status: editedApplication.value.status,
      admin: editedApplication.value.admin,
    }

    const res = await axios.put(`/applications/${id}`, payload)
    if (res.status === 200) {
      toast.add({ severity: 'success', summary: 'Bajarildi', detail: 'Tahrirlandi', life: 3000 })
      fetchColumns()
      editAppModalVisible.value = false
      console.log('Yangilandi:', res.data)
    }
  } catch (err) {
    console.error('Xato:', err)
  } finally {
    isLoading.value = false
  }
}

const updateColumn = async () => {
  isLoading.value = true
  try {
    const res=await axios.put(`/columns/${columnID.value}`, {
      name: editColumnName.value,
    })
    if(res.status===200){
         toast.add({ severity: 'success', summary: 'Bajarildi', detail: 'Ustun nomi yangilandi', life: 3000 })
         editColumnModalVisible.value = false
    fetchColumns()
    }
  } catch (err) {
    console.error('Xatolik:', err)
  } finally {
    isLoading.value = false
  }
}
</script>
<style scoped>
::-webkit-scrollbar {
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: grey;
  border-radius: 24px;
  cursor: grab;
}
</style>
