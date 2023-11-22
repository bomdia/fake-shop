<template>
  <v-app id="app">
    <app-bar/>
    <v-main class="bg-background on-background">
      <slot />
    </v-main>
    <app-footer/>
  </v-app>
</template>
<script setup lang="ts">
  import AppBar from '../components/AppBar.vue';
</script>