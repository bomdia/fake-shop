<template>
  <v-app id="app">
    <app-bar/>
    <v-main class="bg-secondary on-secondary">
      <slot />
    </v-main>
    <v-footer color="secondary-darken-2">
      footer
    </v-footer>
  </v-app>
</template>
<script setup lang="ts">
  import AppBar from '../components/AppBar.vue';
</script>