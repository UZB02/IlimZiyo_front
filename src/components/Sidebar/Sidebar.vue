<template>
  <aside class="w-full h-full  md:sticky md:h-auto md:top-21 ">
    <div class="">
      <!-- Header -->
      <div class="flex items-center justify-between mb-2">
        <!-- Mobilda yopish tugmasi -->
        <button 
          class="md:hidden flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 shadow-sm" 
          @click="$emit('close')"
        >
          <i class="pi pi-times text-sm"></i>
          Yopish
        </button>
      </div>

      <!-- Navigation -->
      <nav class="space-y-2">
        <div v-for="item in views" :key="item.to" class="group">
          <RouterLink 
            :to="item.to" 
            @click="$emit('close')"
            class="flex items-center gap-3 p-3 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 group-hover:shadow-sm border border-transparent hover:border-slate-200"
            active-class="bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
          >
            <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-white transition-colors duration-200">
              <i :class="item.icon" class="text-sm"></i>
            </div>
            <span class="font-medium">{{ item.name }}</span>
          </RouterLink>
        </div>
      </nav>

      <!-- Footer qismi (ixtiyoriy) -->
      <div class="mt-8 pt-4 border-t border-slate-200">
        <div class="text-xs text-slate-500 text-center">
          © 2025 MD Dashboard
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Emit events
defineEmits(['close'])

const views = ref([
  {
    name: 'Bosh sahifa',
    to: '/',
    icon: 'pi pi-home'
  },
  {
    name: 'Arizalar',
    to: '/application',
    icon: 'pi pi-book'
  },
  {
    name: 'Guruhlar',
    to: '/groups',
    icon: 'pi pi-graduation-cap'
  },
  {
    name: 'O\'qtuvchilar',
    to: '/teachers',
    icon: 'pi pi-address-book'
  },
  {
    name: 'Balans',
    to: '/balance',
    icon: 'pi pi-wallet'
  },
  {
    name: 'Xarajatlar',
    to: '/expense',
    icon: 'pi pi-credit-card'
  }
])
</script>

<style scoped>
/* Qo'shimcha animatsiyalar */
.router-link-active {
  transform: translateX(2px);
}

/* Hover effektlari */
nav .group:hover {
  transform: translateY(-1px);
}

/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}
</style>