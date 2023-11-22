import type { CSSProperties } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
export type ReactiveStyle = Partial<{
  xs: CSSProperties
  sm: CSSProperties
  md: CSSProperties
  lg: CSSProperties
  xl: CSSProperties
}>

export function useReactiveStyle(
  style: MaybeRef<ReactiveStyle>
): Ref<CSSProperties> {
  const display = useDisplay()
  return computed(() => {
    const styleProps = unref(style)
    if (display.xlAndUp.value && styleProps.xl) return styleProps.xl
    if (display.lgAndUp.value && styleProps.lg) return styleProps.lg
    if (display.mdAndUp.value && styleProps.md) return styleProps.md
    if (display.smAndUp.value && styleProps.sm) return styleProps.sm
    return styleProps.xs ?? {}
  })
}

export function useSingleFormCardStyle(): Ref<CSSProperties> {
  return useReactiveStyle({
    xs: { width: '100%', alignSelf: 'baseline' },
    sm: { width: '90%' },
    md: { width: '80%' },
    lg: { width: '60%' },
    xl: { width: '40%' },
  })
}
