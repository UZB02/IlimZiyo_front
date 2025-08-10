<template>
  <div class="bg-white shadow-sm border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 flex items-center">
            <i class="pi pi-users mr-3 text-blue-600"></i> O'qituvchilar boshqaruvi
          </h1>
          <p class="text-slate-600 mt-1">O'qituvchilarni qo‘shish, tahrirlash va boshqarish</p>
        </div>
        <Button 
          label="Yangi o'qituvchi" 
          icon="pi pi-plus" 
          @click="$emit('add')" 
          class="bg-blue-600 hover:bg-blue-700"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
</script>
