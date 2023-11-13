import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import colors from 'vuetify/util/colors'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    blueprint: md3,
    theme: {
      variations: {
        colors: ['primary', 'secondary'],
        lighten: 4,
        darken: 5,
      },
      themes: {
        light: {
          dark: false,
          colors: {
            primary: colors.red.accent4,
            secondary: colors.grey.lighten2,
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: colors.red.darken4,
            secondary: colors.grey.darken4,
          },
        },
      },
    },
  })
  app.vueApp.use(vuetify)
})
