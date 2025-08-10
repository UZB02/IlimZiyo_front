<template>
  <div class="sticky top-0 z-30 bg-white border-b border-slate-200 ">
    <div class="px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Start Section -->
        <div class="flex items-center gap-3">
          <button 
            class="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200" 
            @click="$emit('toggleSidebar')"
          >
            <i class="pi pi-bars text-xl text-slate-700"></i>
          </button>
          <div class="flex items-center gap-2">
            <div>
              <img src="../../assets/Logo.png" alt="" class="w-12 rounded">
            </div>
            <h1 class="text-xl font-bold text-slate-800">MDEDU</h1>
          </div>
        </div>

        <!-- End Section -->
        <div class="flex items-center gap-2">
          <div class="relative">
            <button 
              @click="toggle"
              class="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-all duration-200"
            >
              <div class="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                <i class="pi pi-user text-white text-sm"></i>
              </div>
              <span class="hidden md:block text-sm font-medium text-slate-700">
                {{ admin.name || 'Admin' }} {{ admin.lastname || '' }}
              </span>
              <i class="pi pi-chevron-down text-xs text-slate-400"></i>
            </button>

            <!-- Custom Dropdown Menu -->
            <div 
              v-if="showMenu" 
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50"
            >
              <div class="px-4 py-2 border-b border-slate-100">
                <div class="text-sm font-medium text-slate-800">
                  {{ admin.name || 'Admin' }} {{ admin.lastname || '' }}
                </div>
              </div>
              
              <button 
                @click="logout"
                class="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <i class="pi pi-sign-out text-red-500"></i>
                Chiqish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Admin ma'lumotlari
const admin = ref({})
const storedAdmin = sessionStorage.getItem('admin')
if (storedAdmin) {
  admin.value = JSON.parse(storedAdmin)
}

// Menu state
const showMenu = ref(false)

// Toggle menu
const toggle = () => {
  showMenu.value = !showMenu.value
}

// Logout function
const logout = () => {
  sessionStorage.removeItem('authToken')
  sessionStorage.removeItem('admin')
  router.push('/login')
  showMenu.value = false
}

// Close menu when clicking outside
const closeMenu = (event) => {
  if (!event.target.closest('.relative')) {
    showMenu.value = false
  }
}

// Emit events
const emit = defineEmits(['toggleSidebar'])

onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})
</script>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease-in-out;
}

.transition-colors {
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
}
</style>