<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <NavBar @toggleSidebar="sidebarVisible = !sidebarVisible" />

    <!-- Kontent qismi -->
    <div class="flex-1 grid grid-cols-12">
      <!-- Sidebar -->
      <transition name="slide">
        <div
          v-if="sidebarVisible || screenIsLarge"
          class="col-span-12 md:col-span-2 p-2 z-20 bg-white h-screen md:h-auto absolute  w-full md:relative"
        >
          <SideBar @close="sidebarVisible = false" />
        </div>
      </transition>

      <!-- Asosiy kontent -->
      <main class="col-span-12 md:col-span-10 p-4 bg-gray-50 border-l border-slate-300">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar/Nav.vue'
import SideBar from '@/components/Sidebar/Sidebar.vue'

const sidebarVisible = ref(false)
const screenIsLarge = ref(window.innerWidth >= 768)

const handleResize = () => {
  screenIsLarge.value = window.innerWidth >= 768
  if (screenIsLarge.value) sidebarVisible.value = false
}

onMounted(() => window.addEventListener('resize', handleResize))
onUnmounted(() => window.removeEventListener('resize', handleResize))
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-enter-to {
  transform: translateX(0%);
}
.slide-leave-from {
  transform: translateX(0%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
