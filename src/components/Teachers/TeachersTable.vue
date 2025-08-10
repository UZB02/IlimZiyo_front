<template>
  <Card class="shadow-sm">
    <template #header>
      <div class="flex justify-between p-6 pb-0">
        <h2 class="text-lg font-semibold text-slate-900">O'qituvchilar</h2>
        <div class="flex gap-3">
          <div class="relative">
            <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <InputText v-model="searchQuery" placeholder="Qidirish..." class="pl-10 w-64" />
          </div>
          <Button icon="pi pi-refresh" @click="$emit('refresh')" :loading="loading" outlined />
        </div>
      </div>
    </template>

    <template #content>
      <DataTable :value="teachers" :loading="loading" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20]" responsiveLayout="scroll">
        <template #empty>
          <div class="text-center py-8">
            <i class="pi pi-users text-4xl text-slate-300 mb-4"></i>
            <p class="text-slate-500">O'qituvchilar topilmadi</p>
          </div>
        </template>

        <Column field="name" header="Ism" sortable>
          <template #body="{ data }">
            <div class="flex items-center space-x-3">
              <Avatar :label="getInitials(data.name, data.lastname)" class="bg-gradient-to-r from-blue-500 to-purple-500 text-white" shape="circle" />
              <div>
                <p class="font-medium text-slate-900">{{ data.name }} {{ data.lastname }}</p>
                <p class="text-sm text-slate-500">{{ data.science }}</p>
              </div>
            </div>
          </template>
        </Column>

        <Column field="science" header="Fan" sortable>
          <template #body="{ data }">
            <Tag :value="data.science" severity="info" rounded />
          </template>
        </Column>

        <Column field="points" header="Ball" sortable>
          <template #body="{ data }">
            <div class="flex items-center space-x-2">
              <i class="pi pi-star text-yellow-500"></i>
              <span class="font-semibold">{{ data.points || 0 }}</span>
            </div>
          </template>
        </Column>

        <Column header="Amallar">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button icon="pi pi-plus" size="small" severity="success" outlined @click="$emit('add-points', data)" />
              <Button icon="pi pi-pencil" size="small" severity="warning" outlined @click="$emit('edit', data)" />
              <Button icon="pi pi-trash" size="small" severity="danger" outlined @click="$emit('delete', data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup>
import { defineProps,ref } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'

const props = defineProps({
  teachers: Array,
  loading: Boolean,
  searchQuery: String
})

const searchQuery=ref()
const getInitials = (name, lastname) => {
  return `${name?.[0] || ''}${lastname?.[0] || ''}`.toUpperCase()
}
</script>
