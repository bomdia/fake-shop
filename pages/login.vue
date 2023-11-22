<template>
  <div class="expand">
    <v-card min-width="30%" color="secondary" :style="cardStyle">
      <v-toolbar color="secondary-darken-1" elevation="10">
        <v-toolbar-title>{{form.submit.name}}</v-toolbar-title>
        <v-spacer/>
        <v-btn
          :icon="showAlert ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          density="comfortable"
          variant="tonal"
          @click="showAlert = !showAlert"
        ></v-btn>
      </v-toolbar>
      <v-expand-transition>
        <div v-show="showAlert">
          <v-divider></v-divider>
          <v-card-text class="bg-warning-darken-2 on-warning-darken-2 d-flex">
            Load Random User from jsonDummy
            <v-spacer/>
            <v-btn density="compact" variant="tonal" color="primary-darken-2" icon="mdi-account-reactivate-outline" @click="loadRandomUser()"/>
          </v-card-text>
          <v-divider></v-divider>
        </div>
      </v-expand-transition>
      <v-form @submit.prevent="form.submit.action">
        <v-container>
          <v-row class="bg-secondary">
            <v-col v-for="(value, key) in form.data" :key="`login-form-${key}`" v-bind="value.vColProps">
              <component :is="value.component" v-bind="value.props" v-on="value.on" v-model="value.model"/>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn to="/register">Register</v-btn>
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
import { VTextField } from 'vuetify/lib/components/index.mjs';
import type {FormDescription} from '#imports'
definePageMeta({
  name: 'Login',
  middleware: 'no-auth'
})

const cardStyle = useSingleFormCardStyle()
const showAlert = ref(true)
const apiStore = useApiStore()

const form = reactive({
  submit: {
    name: 'Login',
    action: async function () {
      if (await apiStore.login(form.data.username.model, form.data.password.model)) {
        form.submit.showErrorPopup = false
      } else {
        form.submit.showErrorPopup = true
      }
    },
    color: 'success',
    showErrorPopup: false
  },
  data: {
    username: {
      component: markRaw(VTextField),
      model: '',
      vColProps: {
        cols: 12,
      },
      props: {
        label: "Username",
        placeholder: "Enter your username",
        prependInnerIcon: "mdi-account-circle-outline",
        clearable: true
      },
      on: {}
    },
    password: {
      component: markRaw(VTextField),
      model: '',
      vColProps: {
        cols: 12,
      },
      props: {
        type: computed(() => form.data.password.showCharacters ? 'text' : 'password'),
        label: "Password",
        placeholder: "Enter your password",
        prependInnerIcon: "mdi-lock-outline",
        appendInnerIcon: computed(() => form.data.password.showCharacters ? 'mdi-eye-off' : 'mdi-eye'),
        clearable: true
      },
      on: {
        'click:append-inner': () => { form.data.password.showCharacters = !form.data.password.showCharacters }
      },
      showCharacters: false,
    }
  }
}) as FormDescription

let firstLoad = true
async function loadRandomUser() {
  const { user, refresh } = await useRandomUser()
  if(!firstLoad) await refresh()
  if (user) {
    firstLoad = false
    form.data.username.model = user.value.username
    form.data.password.model = user.value.password
  }
}
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