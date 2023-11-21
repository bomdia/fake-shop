import { VCol } from 'vuetify/lib/components/index.mjs'

export interface FormDescription {
  submit: {
    name: string
    action: Function
    color: string
    showErrorPopup: boolean
  }
  data: Record<
    string,
    {
      [key: string]: any
      model: any
      component: Component
      vColProps: VCol['$props']
      props: Record<string, any>
      on: Record<string, Function>
    }
  >
}
