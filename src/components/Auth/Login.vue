<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <Card class="shadow-2xl border-0">
        <!-- Header -->
        <template #header>
          <div class="text-center py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <i class="pi pi-user text-4xl mb-3"></i>
            <h2 class="text-2xl font-bold">Tizimga kirish</h2>
            <p class="text-blue-100 mt-2">Telefon raqamingiz orqali kiring</p>
          </div>
        </template>

        <!-- Content -->
        <template #content>
          <form @submit.prevent="handleLogin" class="p-6 space-y-6">
            <!-- Phone Number -->
            <div class="space-y-2">
              <label for="phone" class="block text-sm font-medium text-gray-700">
                Telefon raqam
              </label>
              <InputText
                id="phone"
                v-model="phone"
                type="tel"
                placeholder="+998901234567"
                :class="[ 
                  'w-full p-3 border rounded-lg transition-all duration-200', 
                  phoneError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500' 
                ]"
                :invalid="!!phoneError"
              />
              <small v-if="phoneError" class="text-red-500">{{ phoneError }}</small>
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label for="password" class="block text-sm font-medium text-gray-700">
                Parol
              </label>
              <Password
                id="password"
                v-model="password"
                placeholder="Parolingizni kiriting"
                :feedback="false"
                toggleMask
                :class="[ 'w-full', passwordError ? 'p-invalid' : '' ]"
                inputClass="w-full p-3 border rounded-lg transition-all duration-200"
                :invalid="!!passwordError"
                @blur="validatePassword"
              />
              <small v-if="passwordError" class="text-red-500">{{ passwordError }}</small>
            </div>

            <!-- Remember me -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <Checkbox id="remember" v-model="rememberMe" :binary="true" class="mr-2" />
                <label for="remember" class="text-sm text-gray-600 cursor-pointer">
                  Meni eslab qol
                </label>
              </div>
              <a href="#" class="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                Parolni unutdingizmi?
              </a>
            </div>

            <!-- Submit Button -->
            <Button
              type="submit"
              :loading="isLoading"
              :disabled="!isFormValid || isLoading"
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              label="Kirish"
              icon="pi pi-sign-in"
            />
          </form>
        </template>

        <!-- Footer -->
        <template #footer>
          <div class="text-center py-4 bg-gray-50 rounded-b-lg">
            <p class="text-sm text-gray-600">
              Hisobingiz yo‘qmi?
              <a href="#" class="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Ro‘yxatdan o‘ting
              </a>
            </p>
          </div>
        </template>
      </Card>
    </div>
  </div>
  <Toast />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const toast = useToast()

// Form data
const phone = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)

// Validation errors
const phoneError = ref('')
const passwordError = ref('')


// Password validation
const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'Parol kiritilishi shart'
  } else {
    passwordError.value = ''
  }
}

// Form validation
const isFormValid = computed(() => {
  return phone.value && password.value && !phoneError.value && !passwordError.value
})

// Login handler
const handleLogin = async () => {
  validatePassword()

  if (!isFormValid.value) return

  isLoading.value = true

  try {
    const res = await axios.post('/auth/login', {
      phone: phone.value,
      password: password.value,
    })

    if (res.status === 200) {
      sessionStorage.setItem('admin', JSON.stringify(res.data))

      phone.value = ''
      password.value = ''

      router.push('/')
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    }
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Xatolik',
      detail: err.response?.data?.message || 'Nomaʼlum xatolik',
      life: 3000,
    })
    console.error('Login xatoligi:', err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
:deep(.p-card) {
  border-radius: 12px;
  overflow: hidden;
}
:deep(.p-card-content),
:deep(.p-card-footer) {
  padding: 0;
}
:deep(.p-inputtext:focus),
:deep(.p-password input:focus) {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
:deep(.p-button:enabled:hover) {
  transform: translateY(-1px);
}
:deep(.p-message) {
  border-radius: 8px;
}
</style>
