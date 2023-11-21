<template>
  <Head>
    <Title>{{ appStore.title }}</Title>
  </Head>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
const appStore = useAppStore()
if (process.client) {
  const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')
  onMounted(() => {
    appStore.isDarkTheme = darkThemeMq.matches
  })
}
</script>