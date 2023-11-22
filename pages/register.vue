<template>
  <div class="expand">
    <v-card min-width="30%" color="secondary" :style="cardStyle">
      <v-toolbar color="secondary-darken-1" elevation="10">
        <v-toolbar-title>{{form.submit.name}}</v-toolbar-title>
      </v-toolbar>
      <v-form @submit.prevent="form.submit.action">
        <v-container>
          <v-row class="bg-secondary">
            <v-col v-for="(value, key) in form.data" :key="`register-form-${key}`" v-bind="value.vColProps">
              <component :is="value.component" v-bind="value.props" v-on="value.on" v-model="value.model"/>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn to="/login">login</v-btn>
          <v-spacer/>
          <v-btn type="submit" :color="form.submit.color">{{ form.submit.name }}</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
  <v-dialog
    v-model="form.submit.showErrorPopup"
    width="auto"
  >
    <v-card>
      <v-card-title class="d-flex">
        <v-spacer/>
        <v-btn density="compact" color="primary" icon="mdi-close" @click="form.submit.showErrorPopup = false"></v-btn>
      </v-card-title>
      <v-card-text>
        {{ apiStore.errorMsg }}
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { VSelect, VTextField } from 'vuetify/lib/components/index.mjs';
import type { FormDescription } from '#imports'

definePageMeta({
  name: 'Register',
  middleware: 'no-auth'
})
const cardStyle = useSingleFormCardStyle()
const apiStore = useApiStore()

function col (cols: Partial<{ xs: number; sm: number; md: number; lg: number; xl: number }> =
  { xs: 1, md: 2, lg: 3 }
) {
  return {
    vColProps: {
      cols: cols.xs ? 12 / cols.xs : undefined,
      sm: cols.sm ? 12 / cols.sm : undefined,
      md: cols.md ? 12 / cols.md : undefined,
      lg: cols.lg ? 12 / cols.lg : undefined,
      xl: cols.xl ? 12 / cols.xl : undefined,
    }
  }
}
function isRequired (text: string) {
  return (value: any) => !!value || text
}

interface ItemConf {
  title: string
  value: string
  props: {
    appendIcon: string
  }
}

const form = reactive({
  submit: {
    name: 'Register',
    action: async function () {
      if (await apiStore.register(formData.value)) {
        form.submit.showErrorPopup = false
      } else {
        form.submit.showErrorPopup = true
      }
    },
    color: 'success',
    showErrorPopup: false
  },
  data: {
    firstName: {
      component: markRaw(VTextField),
      model: '',
      ...col(),
      props: {
        label: "Nome",
        hint: "Scrivi il tuo nome",
        persistentHint: true,
        clearable: true,
        rules: [
          isRequired("Il Nome è Obbligatorio"),
        ]
      },
      on: {}
    },
    lastName: {
      component: markRaw(VTextField),
      model: '',
      ...col(),
      props: {
        label: "Cognome",
        hint: "Scrivi il tuo cognome",
        persistentHint: true,
        clearable: true,
        rules: [
          isRequired("Il Cognome è Obbligatorio"),
        ]
      },
      on: {}
    },
    age: {
      component: markRaw(VTextField),
      model: 18,
      ...col(),
      props: {
        label: 'Età',
        type: "number",
        hint: 'Quanti anni hai?',
        persistentHint: true
      },
      on: {}
    },
    gender: {
      component: markRaw(VSelect),
      model: 'male',
      ...col(),
      props: {
        label: 'Sesso',
        hint: 'Di che sesso sei?',
        appendInnerIcon: computed(() => {
          const item: ItemConf = form.data.gender.props.items.find(
            (item: ItemConf) => form.data.gender.model === item.value
          )
          return item.props.appendIcon
        }),
        items: [
          {
            title: 'Maschio', value: 'male', props: {
              appendIcon: 'mdi-human-male'
            }
          },
          {
            title: 'Femmina', value: 'female', props: {
              appendIcon: 'mdi-human-female'
            }
          },
          {
            title: 'Altro', value: 'others', props: {
              appendIcon: 'mdi-robot'
            }
          },
        ],
        persistentHint: true
      },
      on: {

      }
    },
    username: {
      component: markRaw(VTextField),
      model: '',
      ...col(),
      props: {
        label: "Username",
        hint: "Scrivi il tuo username",
        prependInnerIcon: "mdi-account-circle-outline",
        clearable: true,
        persistentHint: true,
        required: true,
        rules: [
          isRequired("L'Username è Obbligatorio"),
        ]
      },
      on: {}
    },
    password: {
      component: markRaw(VTextField),
      model: '',
      ...col(),
      props: {
        type: computed(() => form.data.password.showCharacters ? 'text' : 'password'),
        label: "Password",
        hint: "Scrivi la password che desideri",
        prependInnerIcon: "mdi-lock-outline",
        appendInnerIcon: computed(() => form.data.password.showCharacters ? 'mdi-eye-off' : 'mdi-eye'),
        clearable: true,
        persistentHint: true,
        required: true,
        rules: [
          isRequired("La Password è Obbligatoria"),
        ]
      },
      on: {
        'click:append-inner': () => { form.data.password.showCharacters = !form.data.password.showCharacters }
      },
      showCharacters: false,
    }
  }
}) as FormDescription

const formData = computed(() => {
  const keys = Object.keys(form.data)
  const record = {} as Record<string,any>
  for (const key of keys) {
    record[key] = form.data[key].model
  }
  return record
})

</script>

<style scoped>
  .expand{
    width: 100%;
    height: 100%;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    justify-items: center;
  }
</style>