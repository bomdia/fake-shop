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
    watch(useSystemTheme, (val) => {
      if (val) {
        const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')
        isDarkTheme.value = darkThemeMq.matches
      }
    })
  }
  const darkThemeIcon = ref('mdi-weather-night')
  const lightThemeIcon = ref('mdi-brightness-7')
  const currentThemeIcon = computed(() =>
    isDarkTheme.value ? darkThemeIcon.value : lightThemeIcon.value
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
    darkThemeIcon,
    lightThemeIcon,
    toggleTheme,
  }
})
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
