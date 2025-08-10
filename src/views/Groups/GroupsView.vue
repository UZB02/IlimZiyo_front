<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Guruhlar bo'limi</h1>
        <p class="text-gray-600">Guruhlarni boshqaring va jarayonni kuzatib boring</p>
      </div>

      <!-- Yangi ustun qo'shish -->
      <div class="flex items-center gap-2 bg-white rounded-lg shadow-sm p-3">
        <button
          class="bg-gradient-to-r cursor-pointer from-green-500 to-green-600 text-white rounded-md px-4 py-2 hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          @click="visibleAddGroup = true"
        >
          <i class="pi pi-plus"></i>
          Guruh qo'shish
        </button>
      </div>
    </div>

    <!-- Guruh kartalari yoki Skeleton -->
    <div class="grid md:grid-cols-4 grid-cols-1 gap-2">
      <template v-if="isLoading">
        <div v-for="i in 4" :key="i" class="h-40 bg-gray-100 animate-pulse rounded-xl"></div>
      </template>
      <template v-else>
        <GroupsCard
          v-for="group in groups"
          :key="group._id"
          :group="group"
          @getAllGroups="getAllGroups"
        />
      </template>
    </div>
  </div>

  <!-- Drawer: Guruh Qo'shish -->
  <Drawer v-model:visible="visibleAddGroup" header="Guruh Qo'shish" position="right">
    <AddGroupForm @getAllGroups="getAllGroups" @closeDrawer="visibleAddGroup = false" />
  </Drawer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Drawer from 'primevue/drawer'
import AddGroupForm from '../../components/Groups/AddGroupsForm.vue'
import GroupsCard from '../../components/Groups/GroupsCard.vue'

const admin = JSON.parse(sessionStorage.getItem('admin'))
const visibleAddGroup = ref(false)
const groups = ref([])
const isLoading = ref(true)

const getAllGroups = async () => {
  isLoading.value = true
  try {
    const res = await axios.get('/groups', {
      params: { adminId: admin.id }
    })
    groups.value = res.data
    console.log(groups.value);
  } catch (err) {
    console.error('Guruhlarni olishda xatolik:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(getAllGroups)
</script>

<style scoped></style>
