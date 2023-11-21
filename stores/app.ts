import { defineStore, acceptHMRUpdate } from 'pinia'
import { useTheme } from 'vuetify'

export const useAppStore = defineStore('app', () => {
  const theme = useTheme()
  const route = useRoute()

  const isHome = computed(() => route.name === 'index')

  const baseTitle = ref('Fake Shop')
  const title = computed(() =>
    isHome.value
      ? baseTitle.value
      : `${baseTitle.value} - ${route.name?.toString()}`
  )

  const useSystemTheme = ref(true)
  const isDarkTheme = ref(false)
  watch(isDarkTheme, (val) => {
    theme.global.name.value = val ? 'dark' : 'light'
  })
  if (process.client) {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')
    darkThemeMq.addEventListener('change', (evnt) => {
      if (useSystemTheme.value) isDarkTheme.value = evnt.matches
    })
  }

  const currentThemeIcon = computed(() =>
    isDarkTheme.value ? 'mdi-weather-night' : 'mdi-brightness-7'
  )
  function toggleTheme() {
    if (!useSystemTheme.value) isDarkTheme.value = !isDarkTheme.value
  }

  return {
    title,
    isHome,
    isDarkTheme,
    useSystemTheme,
    currentThemeIcon,
    toggleTheme,
  }
})
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
