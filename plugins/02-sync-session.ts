export default defineNuxtPlugin((app) => {
  const apiStore = useApiStore(usePinia())
  async function bindKeys(...keys: (keyof typeof apiStore)[]) {
    const { session, update } = await useSession()
    for (const key of keys) {
      if (!process.server && session.value) {
        ;(apiStore[key] as any) = session.value[key]
      }
      if (process.server && app.ssrContext?.event.context.session) {
        ;(apiStore[key] as any) = app.ssrContext?.event.context.session[key]
      }
      watch(
        () => apiStore[key],
        (value) => {
          update({ [key]: value })
        },
        { immediate: true, deep: true }
      )
    }
  }
  bindKeys('isAuthenticated', 'user', 'userCarts')
})

// import type { Session } from '@sidebase/nuxt-session'
// import type { Pinia, StateTree } from 'pinia'

// export default defineNuxtPlugin((app) => {
//   async function getPiniaSession() {
//     const { session, update } = await useSession()
//     return {
//       get value() {
//         if (process.server) {
//           return (app.ssrContext?.event.context.session as Session | null)
//             ?.pinia as Record<string, StateTree>
//         } else {
//           return session.value?.pinia as Record<string, StateTree>
//         }
//       },
//       set value(value: Record<string, StateTree> | null) {
//         update({ pinia: value })
//       },
//     }
//   }
//   getPiniaSession().then((session) => {
//     const pinia = usePinia() as Pinia
//     if (session.value) {
//       pinia.state.value = session.value
//     }
//     watch(
//       pinia.state,
//       (value) => {
//         session.value = value
//       },
//       { immediate: true, deep: true }
//     )
//   })
// })
