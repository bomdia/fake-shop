import { useDisplay } from 'vuetify/lib/framework.mjs'

export function useSingleFormCardStyle(): Ref<
  Partial<{ width: string; alignSelf: string }>
> {
  const display = useDisplay()
  return computed(() => {
    if (display.xlAndUp.value) return {}

    if (display.lgAndUp.value) return { width: '60%' }

    if (display.mdAndUp.value) return { width: '80%' }

    if (display.smAndUp.value) return { width: '90%' }

    return { width: '100%', alignSelf: 'baseline' }
  })
}
