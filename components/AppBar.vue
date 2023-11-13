<template>
  <v-app-bar color="primary">
    Fake Shop - App Bar
    <v-spacer/>
    <v-btn @click="toggleTheme" icon>
      <v-fade-transition>
        <v-icon :icon="currentThemeIcon"/>
      </v-fade-transition>
    </v-btn>
  </v-app-bar>
</template>
<script setup lang="ts">
import { useTheme } from 'vuetify';

const theme = useTheme()

const currentThemeIcon = computed(()=> theme.global.current.value.dark ? 'mdi-weather-night' : 'mdi-brightness-7')

function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
  
</script>