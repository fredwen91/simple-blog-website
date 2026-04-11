<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import LogoutDialog from '@/components/LogoutDialog.vue'

const auth = useAuthStore()
const router = useRouter()

const toolbarItems = ref([
  { name: 'Home', to: 'home', icon: 'mdi-home' },
  { name: 'About', to: 'about', icon: 'mdi-information' },
])

const initial = computed(() => {
  if (auth.user) {
    return auth.user.name.charAt(0)
  }

  return ''
})

const showLogout = ref(false)

const onLogout = async () => {
  showLogout.value = true

  await auth.logout()
  router.push({ name: 'login' })
  showLogout.value = false
}
</script>

<template>
  <v-toolbar color="blue-darken-4">
    <v-toolbar-title>
      <!-- <v-img :src="require('@/assets/logo.png')" max-width="220" min-width="150"></v-img> -->
    </v-toolbar-title>

    <v-toolbar-items>
      <v-btn
        v-for="(item, index) in toolbarItems"
        :key="index"
        :to="{ name: item.to }"
        :prepend-icon="item.icon"
        stacked
        size="small"
      >
        {{ item.name }}
      </v-btn>
    </v-toolbar-items>

    <v-divider class="border-opacity-25" vertical></v-divider>

    <div v-if="!auth.isAuthenticated" class="d-flex ga-2 mx-3">
      <v-btn :to="{ name: 'login' }" variant="outlined" rounded> Login </v-btn>
      <v-btn :to="{ name: 'register' }" variant="text" rounded> Register </v-btn>
    </div>

    <v-menu width="256" rounded v-else>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" class="ml-2">
          <v-avatar color="primary">
            <span>{{ initial }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card class="menu-card">
        <v-list>
          <v-list-item>
            <template v-slot:prepend>
              <v-avatar color="primary" size="large">
                <span class="text-h5">{{ initial }}</span>
              </v-avatar>
            </template>

            <v-list-item-title>
              {{ auth.user?.name }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ auth.user?.email }}
            </v-list-item-subtitle>
          </v-list-item>
          <!-- <v-list-item>
            <v-btn size="small" color="primary" block variant="tonal" :to="{ name: 'profile' }">
              View Profile
            </v-btn>
          </v-list-item> -->
          <v-list-item>
            <v-btn size="small" color="primary" block variant="tonal"> View Profile </v-btn>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>

        <v-list density="compact">
          <v-list-item :to="{ name: 'myPosts' }" color="primary">
            <template v-slot:prepend>
              <v-icon icon="mdi-post"></v-icon>
            </template>

            <v-list-item-title> My Posts </v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item class="account-link text-red-darken-1 mt-1" @click="onLogout">
            <template v-slot:prepend>
              <v-icon icon="mdi-logout-variant"></v-icon>
            </template>

            <v-list-item-title> Logout </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-toolbar>

  <LogoutDialog v-model="showLogout" />
</template>

<style scoped>
.menu-card {
  font-family: 'Poppins', sans-serif !important;
}

.account-link:hover {
  cursor: pointer;
  background-color: #f5f5f5;
}
</style>
