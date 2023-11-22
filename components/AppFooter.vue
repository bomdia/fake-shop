<template>
  <v-footer color="secondary-darken-2">
    <v-container>
      <v-row width="50%">
        <v-col cols="12">
          <v-switch 
            v-model="appStore.useSystemTheme" 
            label="Usa Tema di Sistema"
            hide-details
          />
        </v-col>
        <v-col cols="12" v-if="!appStore.useSystemTheme">
          <v-switch 
            v-model="appStore.isDarkTheme"
            :true-icon="appStore.darkThemeIcon"
            :false-icon="appStore.lightThemeIcon"
            label="Usa Tema Scuro"
            hide-details
          />
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>
<script setup lang="ts">
  const appStore = useAppStore()
</script>