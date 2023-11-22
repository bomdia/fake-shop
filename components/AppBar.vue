<template>
  <v-app-bar color="primary">
    <v-app-bar-nav-icon icon="mdi-shopping" />
    <v-app-bar-title>
      {{ appStore.title }}
    </v-app-bar-title>
    <v-spacer v-if="apiStore.isAuthenticated"/>
    <theme-btn />
    <cart-menu />
    <user-menu />
  </v-app-bar>
</template>
<script setup lang="ts">
const appStore = useAppStore()
const apiStore = useApiStore()
</script>