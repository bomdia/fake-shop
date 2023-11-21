<template>
  <v-btn @click="appStore.toggleTheme" icon v-if="!appStore.useSystemTheme">
    <v-fade-transition>
      <v-icon :icon="appStore.currentThemeIcon"/>
    </v-fade-transition>
  </v-btn>
</template>
<script setup lang="ts">
  const appStore = useAppStore()
</script>