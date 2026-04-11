<template>
  <v-container>
    <div class="text-center mt-3">
      <img
        src="https://img.icons8.com/3d-fluency/94/maintenance.png"
        style="width: 60px; height: 60px"
        class="ml-2"
      />
      <h1 class="font-weight-black text-info">Page Under Maintenance</h1>
      <h3>
        We apologize for the inconvenience, but this page is currently undergoing maintenance.
      </h3>
      <p class="my-5">
        You will be redirected to the home page in
        <span class="font-weight-bold text-primary">{{ value }}</span>
        seconds.
      </p>

      <v-btn :to="{ name: 'home' }" color="primary" variant="outlined" class="text-uppercase">
        Go to Home
      </v-btn>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const value = ref<number>(10)
let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  interval = setInterval(() => {
    if (value.value === 1) {
      router.replace({ name: 'home' })
    }

    value.value -= 1
  }, 1000)
})

onBeforeUnmount(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>
