<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    location="end top" 
    origin="overlap"
    v-if="apiStore.isAuthenticated"
  >
    <template v-slot:activator="{ props }">
      <v-btn v-if="apiStore.isAuthenticated" v-bind="props" icon class="mr-1">
        <v-badge :content="apiStore.flattedUserCart.totalQuantity" location="start top">
          <v-icon icon="mdi-cart"/>
        </v-badge>
      </v-btn>
    </template>
    <v-card min-width="20em" color="secondary">
      <v-toolbar elevation="10" color="secondary-darken-1">
        <v-toolbar-title>
          <v-btn icon="mdi-chevron-left" @click="step--" v-if="step>1"></v-btn>
          Carrello
        </v-toolbar-title>
        <v-spacer/>
        <v-badge :content="apiStore.flattedUserCart.totalQuantity" location="start top" class="mr-4">
          <v-icon icon="mdi-cart"/>
        </v-badge>
      </v-toolbar>
      <v-stepper 
        :items="['Controlla', 'Spedizione', 'Pagamento']" 
        v-model="step" 
        flat 
        hide-actions 
        class="no-margin"
        color="secondary"
      >
        <template v-slot:item.1>
          <v-list color="secondary">
            <v-list-item 
              v-for="product of products" 
              :key="`cart-product-${product.id}`"
              :prepend-avatar="product.thumbnail"
              :title="product.title"
              :to="`/product/${product.id}`"
              color="secondary"
            >
              <v-list-item-subtitle>
                <v-row>
                  <v-col><s>{{toEuro(product.price)}}</s> {{singleDiscountedPrice(product)}}</v-col>
                  <v-col>{{product.quantity}}</v-col>
                  <v-col><s>{{toEuro(product.total)}}</s> {{toEuro(product.discountedPrice)}}</v-col>
                </v-row>
              </v-list-item-subtitle>
              <template #append>
                <v-btn @click="removeProduct(product.id)" icon="mdi-cart-remove" :density="'compact'"/>
              </template>
            </v-list-item>
          </v-list>
          <v-toolbar elevation="10" color="secondary-darken-1">
            <v-container>
              <v-row>
                <v-col>
                  Totale
                </v-col>
                <v-col style="text-align: end !important">
                  <s>{{ toEuro(apiStore.flattedUserCart.total) }}</s> {{ toEuro(apiStore.flattedUserCart.discountedTotal) }}
                </v-col>
                <v-col>
                  <v-btn @click="step++">Compra</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-toolbar>
          <v-card-actions>
            <v-spacer/>
            <v-btn @click="removeAllProducts()" icon="mdi-close" block/>
            <v-spacer/>
          </v-card-actions>
        </template>

        <template v-slot:item.2>
          <v-form @submit.prevent="formSpedizione.submit.action">
        <v-container>
          <v-row class="bg-secondary">
            <v-col v-for="(value, key) in formSpedizione.data" :key="`register-form-${key}`" v-bind="value.vColProps">
              <component :is="value.component" v-bind="value.props" v-on="value.on" v-model="value.model"/>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer/>
          <v-btn type="submit" :color="formSpedizione.submit.color">{{ formSpedizione.submit.name }}</v-btn>
        </v-card-actions>
      </v-form>
        </template>

        <template v-slot:item.3>
          
        </template>
      </v-stepper>
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">
import { VTextField } from 'vuetify/lib/components/index.mjs';
import type { Product } from '~/stores/types';
const apiStore = useApiStore()
const menu = ref(false)
const products = computed(() => apiStore.flattedUserCart.products as Product[])
const step = ref(1)
const EURO = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
});
function toEuro (value: number | bigint) {
  return EURO.format(value)
}

function removeAllProducts () {
  for (const cart of apiStore.userCarts.carts) {
    cart.products.length = 0
  }
}
function removeProduct (id: number) {
  for (const cart of apiStore.userCarts.carts) {
    let i = 0
    for (const product of cart.products) {
      if (product.id === id) {
        cart.discountedTotal -= product.discountedPrice
        cart.total-= product.total
        cart.totalProducts--
        cart.totalQuantity -= product.quantity
        cart.products.splice(i,1)
      }
      i++
    }
  }
}
function isRequired (text: string) {
  return (value: any) => !!value || text
}
function singleDiscountedPrice (product: Product) {
  return toEuro(product.discountedPrice / product.quantity)
}

const formSpedizione = reactive({
  submit: {
    name: 'Continua',
    action: async function () {
      step.value++
    },
    color: 'success',
    showErrorPopup: false
  },
  data: {
    address: {
      component: markRaw(VTextField),
      model: apiStore.user.address.address,
      vColProps: {
        cols: 8,
      },
      props: {
        label: "Indirizzo",
        hint: "L'indirizzo di spedizione",
        persistentHint: true,
        clearable: true,
        required: true,
        rules: [
          isRequired("L'indirizzo è Obbligatorio"),
        ]
      },
      on: {}
    },
    postalCode: {
      component: markRaw(VTextField),
      model: apiStore.user.address.postalCode,
      vColProps: {
        cols: 4,
      },
      props: {
        label: "CAP",
        hint: "IL tuo codice postale",
        persistentHint: true,
        clearable: true,
        required: true,
        rules: [
          isRequired("La Città è Obbligatoria"),
        ]
      },
      on: {}
    },
    city: {
      component: markRaw(VTextField),
      model: apiStore.user.address.city,
      vColProps: {
        cols: 12,
      },
      props: {
        label: "Città",
        hint: "La Città di spedizione",
        persistentHint: true,
        clearable: true,
        required: true,
        rules: [
          isRequired("La Città è Obbligatoria"),
        ]
      },
      on: {}
    },
    state: {
      component: markRaw(VTextField),
      model: apiStore.user.address.state,
      vColProps: {
        cols: 12,
      },
      props: {
        label: "Stato",
        hint: "Lo Stato in cui spedire",
        persistentHint: true,
        clearable: true,
        required: true,
        rules: [
          isRequired("Lo Stato è Obbligatorio"),
        ]
      },
      on: {}
    }
  }
}) as FormDescription

</script>
<style>
.no-margin .v-stepper-window{
  margin: 0;
}
</style>