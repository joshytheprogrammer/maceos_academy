<template>
  <div class="max-w-4xl">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white">My Profile</h1>
      <p class="mt-1 text-gray-400">Manage your account settings and preferences</p>
    </div>

    <!-- Profile Overview Card -->
    <div class="mb-6 rounded-2xl border border-surface-border bg-surface-dark p-6">
      <div class="flex items-start gap-6">
        <!-- Avatar -->
        <div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20 text-3xl font-bold text-primary">
          {{ userInitials }}
        </div>

        <!-- Info -->
        <div class="flex-1">
          <h2 class="text-xl font-bold text-white">{{ user?.name || 'Student' }}</h2>
          <p class="text-gray-400">{{ user?.email }}</p>
          <div class="mt-3 flex flex-wrap items-center gap-2">
            <span class="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
              Student
            </span>
            <span v-if="user?.emailVerification" class="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
              <span class="material-symbols-outlined mr-1 text-sm align-middle">verified</span>
              Email Verified
            </span>
            <span v-else class="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-400">
              <span class="material-symbols-outlined mr-1 text-sm align-middle">warning</span>
              Email Not Verified
            </span>
          </div>
        </div>

        <!-- Account Created -->
        <div class="text-right text-sm text-gray-500">
          <p>Member since</p>
          <p class="text-white">{{ formatDate(user?.$createdAt) }}</p>
        </div>
      </div>
    </div>

    <!-- Settings Grid -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Personal Information -->
      <div class="rounded-2xl border border-surface-border bg-surface-dark p-6">
        <div class="mb-6 flex items-center gap-3">
          <span class="material-symbols-outlined text-primary">person</span>
          <h3 class="text-lg font-semibold text-white">Personal Information</h3>
        </div>

        <form @submit.prevent="savePersonalInfo" class="space-y-4">
          <!-- Name -->
          <div>
            <label for="name" class="mb-2 block text-sm font-medium text-gray-300">Full Name</label>
            <input
              id="name"
              v-model="personalForm.name"
              type="text"
              required
              class="w-full rounded-lg border border-surface-border bg-surface px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors focus:border-primary"
            />
          </div>

          <!-- Email (read-only for now) -->
          <div>
            <label for="email" class="mb-2 block text-sm font-medium text-gray-300">Email Address</label>
            <input
              id="email"
              :value="user?.email"
              type="email"
              disabled
              class="w-full cursor-not-allowed rounded-lg border border-surface-border bg-surface/50 px-4 py-3 text-gray-400"
            />
            <p class="mt-1 text-xs text-gray-500">Contact support to change your email address</p>
          </div>

          <!-- Save Button -->
          <button
            type="submit"
            :disabled="savingPersonal || personalForm.name === user?.name"
            class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span v-if="savingPersonal" class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
            {{ savingPersonal ? 'Saving...' : 'Save Changes' }}
          </button>

          <!-- Success Message -->
          <p v-if="personalSuccess" class="text-sm text-green-400">
            <span class="material-symbols-outlined mr-1 text-sm align-middle">check_circle</span>
            Profile updated successfully!
          </p>
        </form>
      </div>

      <!-- Change Password -->
      <div class="rounded-2xl border border-surface-border bg-surface-dark p-6">
        <div class="mb-6 flex items-center gap-3">
          <span class="material-symbols-outlined text-primary">lock</span>
          <h3 class="text-lg font-semibold text-white">Change Password</h3>
        </div>

        <form @submit.prevent="changePassword" class="space-y-4">
          <!-- Current Password -->
          <div>
            <label for="currentPassword" class="mb-2 block text-sm font-medium text-gray-300">Current Password</label>
            <div class="relative">
              <input
                id="currentPassword"
                v-model="passwordForm.current"
                :type="showCurrentPassword ? 'text' : 'password'"
                required
                placeholder="Enter current password"
                class="w-full rounded-lg border border-surface-border bg-surface px-4 py-3 pr-12 text-white placeholder-gray-500 outline-none transition-colors focus:border-primary"
              />
              <button
                type="button"
                @click="showCurrentPassword = !showCurrentPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <span class="material-symbols-outlined text-xl">
                  {{ showCurrentPassword ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
          </div>

          <!-- New Password -->
          <div>
            <label for="newPassword" class="mb-2 block text-sm font-medium text-gray-300">New Password</label>
            <div class="relative">
              <input
                id="newPassword"
                v-model="passwordForm.new"
                :type="showNewPassword ? 'text' : 'password'"
                required
                minlength="8"
                placeholder="Enter new password"
                class="w-full rounded-lg border border-surface-border bg-surface px-4 py-3 pr-12 text-white placeholder-gray-500 outline-none transition-colors focus:border-primary"
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <span class="material-symbols-outlined text-xl">
                  {{ showNewPassword ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
            <!-- Password Strength Indicator -->
            <div class="mt-2">
              <div class="flex gap-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1 flex-1 rounded-full transition-colors"
                  :class="passwordStrength >= i ? strengthColors[passwordStrength - 1] : 'bg-surface-border'"
                ></div>
              </div>
              <p class="mt-1 text-xs" :class="strengthTextColors[passwordStrength] || 'text-gray-500'">
                {{ strengthLabels[passwordStrength] || 'Enter a password' }}
              </p>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="mb-2 block text-sm font-medium text-gray-300">Confirm New Password</label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="passwordForm.confirm"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                placeholder="Confirm new password"
                class="w-full rounded-lg border border-surface-border bg-surface px-4 py-3 pr-12 text-white placeholder-gray-500 outline-none transition-colors focus:border-primary"
                :class="passwordForm.confirm && passwordForm.confirm !== passwordForm.new ? 'border-red-500' : ''"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <span class="material-symbols-outlined text-xl">
                  {{ showConfirmPassword ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
            <p v-if="passwordForm.confirm && passwordForm.confirm !== passwordForm.new" class="mt-1 text-xs text-red-400">
              Passwords do not match
            </p>
          </div>

          <!-- Error Message -->
          <p v-if="passwordError" class="text-sm text-red-400">
            <span class="material-symbols-outlined mr-1 text-sm align-middle">error</span>
            {{ passwordError }}
          </p>

          <!-- Success Message -->
          <p v-if="passwordSuccess" class="text-sm text-green-400">
            <span class="material-symbols-outlined mr-1 text-sm align-middle">check_circle</span>
            Password changed successfully!
          </p>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="savingPassword || !canChangePassword"
            class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span v-if="savingPassword" class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
            {{ savingPassword ? 'Updating...' : 'Update Password' }}
          </button>
        </form>
      </div>

      <!-- Account Information -->
      <div class="rounded-2xl border border-surface-border bg-surface-dark p-6">
        <div class="mb-6 flex items-center gap-3">
          <span class="material-symbols-outlined text-primary">info</span>
          <h3 class="text-lg font-semibold text-white">Account Information</h3>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between rounded-lg border border-surface-border bg-surface p-4">
            <div>
              <p class="text-sm text-gray-400">Account ID</p>
              <p class="font-mono text-sm text-white">{{ user?.$id }}</p>
            </div>
            <button
              @click="copyToClipboard(user?.$id)"
              class="text-gray-400 hover:text-primary"
              title="Copy to clipboard"
            >
              <span class="material-symbols-outlined">content_copy</span>
            </button>
          </div>

          <div class="flex items-center justify-between rounded-lg border border-surface-border bg-surface p-4">
            <div>
              <p class="text-sm text-gray-400">Last Login</p>
              <p class="text-sm text-white">{{ formatDateTime(user?.accessedAt) }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between rounded-lg border border-surface-border bg-surface p-4">
            <div>
              <p class="text-sm text-gray-400">Account Status</p>
              <p class="text-sm text-green-400">Active</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="rounded-2xl border border-surface-border bg-surface-dark p-6">
        <div class="mb-6 flex items-center gap-3">
          <span class="material-symbols-outlined text-primary">link</span>
          <h3 class="text-lg font-semibold text-white">Quick Links</h3>
        </div>

        <div class="space-y-2">
          <NuxtLink
            to="/dashboard/support"
            class="flex items-center gap-3 rounded-lg border border-surface-border bg-surface p-4 transition-colors hover:border-primary/30"
          >
            <span class="material-symbols-outlined text-gray-400">support_agent</span>
            <div class="flex-1">
              <p class="font-medium text-white">Support Center</p>
              <p class="text-sm text-gray-500">Get help with your account</p>
            </div>
            <span class="material-symbols-outlined text-gray-500">chevron_right</span>
          </NuxtLink>

          <NuxtLink
            to="/dashboard/schedule"
            class="flex items-center gap-3 rounded-lg border border-surface-border bg-surface p-4 transition-colors hover:border-primary/30"
          >
            <span class="material-symbols-outlined text-gray-400">calendar_month</span>
            <div class="flex-1">
              <p class="font-medium text-white">My Schedule</p>
              <p class="text-sm text-gray-500">View your learning timeline</p>
            </div>
            <span class="material-symbols-outlined text-gray-500">chevron_right</span>
          </NuxtLink>

          <NuxtLink
            to="/dashboard/materials"
            class="flex items-center gap-3 rounded-lg border border-surface-border bg-surface p-4 transition-colors hover:border-primary/30"
          >
            <span class="material-symbols-outlined text-gray-400">folder</span>
            <div class="flex-1">
              <p class="font-medium text-white">Course Materials</p>
              <p class="text-sm text-gray-500">Access your study resources</p>
            </div>
            <span class="material-symbols-outlined text-gray-500">chevron_right</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="mt-6 rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
      <div class="mb-4 flex items-center gap-3">
        <span class="material-symbols-outlined text-red-400">warning</span>
        <h3 class="text-lg font-semibold text-red-400">Danger Zone</h3>
      </div>
      <p class="mb-4 text-sm text-gray-400">
        If you need to delete your account or have other serious account concerns, please contact support.
      </p>
      <NuxtLink
        to="/dashboard/support"
        class="inline-flex items-center gap-2 rounded-lg border border-red-500/50 px-4 py-2 text-red-400 transition-colors hover:bg-red-500/10"
      >
        <span class="material-symbols-outlined text-xl">mail</span>
        Contact Support
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const { user, updatePassword, updateName } = useAuth()

// Personal Info Form
const personalForm = ref({
  name: ''
})
const savingPersonal = ref(false)
const personalSuccess = ref(false)

// Password Form
const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})
const savingPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Password strength
const strengthColors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
const strengthTextColors = { 1: 'text-red-400', 2: 'text-yellow-400', 3: 'text-blue-400', 4: 'text-green-400' }
const strengthLabels = { 1: 'Weak', 2: 'Fair', 3: 'Good', 4: 'Strong' }

const passwordStrength = computed(() => {
  const pwd = passwordForm.value.new
  if (!pwd) return 0
  
  let strength = 0
  if (pwd.length >= 8) strength++
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
  if (/\d/.test(pwd)) strength++
  if (/[^a-zA-Z0-9]/.test(pwd)) strength++
  
  return strength
})

const canChangePassword = computed(() => {
  return passwordForm.value.current &&
         passwordForm.value.new &&
         passwordForm.value.new.length >= 8 &&
         passwordForm.value.new === passwordForm.value.confirm
})

// User initials
const userInitials = computed(() => {
  const name = user.value?.name || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

// Initialize form with user data
watch(user, (newUser) => {
  if (newUser) {
    personalForm.value.name = newUser.name || ''
  }
}, { immediate: true })

// Save personal info
const savePersonalInfo = async () => {
  if (savingPersonal.value) return
  
  savingPersonal.value = true
  personalSuccess.value = false
  
  try {
    const result = await updateName(personalForm.value.name)
    if (result.success) {
      personalSuccess.value = true
      setTimeout(() => personalSuccess.value = false, 3000)
    }
  }
  finally {
    savingPersonal.value = false
  }
}

// Change password
const changePassword = async () => {
  if (savingPassword.value || !canChangePassword.value) return
  
  savingPassword.value = true
  passwordError.value = ''
  passwordSuccess.value = false
  
  try {
    const result = await updatePassword(passwordForm.value.current, passwordForm.value.new)
    
    if (result.success) {
      passwordSuccess.value = true
      passwordForm.value = { current: '', new: '', confirm: '' }
      setTimeout(() => passwordSuccess.value = false, 3000)
    } else {
      passwordError.value = result.error || 'Failed to update password'
    }
  }
  finally {
    savingPassword.value = false
  }
}

// Copy to clipboard
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
  }
  catch (e) {
    console.error('Failed to copy:', e)
  }
}

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

// Format date time
const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}
</script>
