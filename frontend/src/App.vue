<script setup lang="ts">
import Navigation from './components/Navigation.vue';
</script>

<template>
  <v-app>
    <Navigation />
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped></style>
