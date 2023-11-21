const apiStore = useApiStore()

export default defineNuxtRouteMiddleware((to, from) => {
  if (apiStore.isAuthenticated) {
    return navigateTo('/')
  }
})
