<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    location="bottom" 
    v-if="apiStore.isAuthenticated"
  >
    <template v-slot:activator="{ props }">
      <v-btn icon variant="elevated" color="secondary" v-bind="props">
        <v-avatar :image="apiStore.user?.image"></v-avatar>
      </v-btn>
    </template>
    <v-card>
      <v-card-actions>
        <v-btn @click="apiStore.logout()">
          <v-icon icon="mdi-logout"/>  
          Logout
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">
const apiStore = useApiStore()
const menu = ref(false)
</script>