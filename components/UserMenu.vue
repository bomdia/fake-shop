<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    location="end top" 
    origin="overlap"
    v-if="apiStore.isAuthenticated"
  >
    <template v-slot:activator="{ props }">
      <v-btn icon variant="elevated" color="secondary" v-bind="props">
        <v-avatar :image="apiStore.user?.image"></v-avatar>
      </v-btn>
    </template>
    <v-card :style="style" color="secondary-lighten-1">
      <v-toolbar color="secondary-darken-1" elevation="10">
        <v-container>
          <v-row>
            <v-col>
              {{ apiStore.user?.firstName }} {{ apiStore.user?.lastName }}<br>
              <b>@{{ apiStore.user?.username }}</b>
            </v-col>
            <v-btn icon variant="elevated" color="secondary-darken-2" class="mr-1 align-self-center">
              <v-avatar :image="apiStore.user?.image"></v-avatar>
            </v-btn>
          </v-row>
        </v-container>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-row>
            <span>{{ apiStore.user?.email }}</span>
          </v-row>
          <v-row>
            <span>{{ apiStore.user?.phone }}</span>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="apiStore.logout()" block>
          <v-icon icon="mdi-logout"/>  
          Logout
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">
import { useReactiveStyle } from '~/composables/useCardStyle';

const apiStore = useApiStore()
const menu = ref(false)
const style = useReactiveStyle({
  xs: { minWidth: '20em' }
})
</script>