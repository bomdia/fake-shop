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
    <v-card min-width="30em">
      <v-toolbar elevation="10">
        <v-toolbar-title>
          Carrello
        </v-toolbar-title>
        <v-spacer/>
        <v-badge :content="apiStore.flattedUserCart.totalQuantity" location="start top" class="mr-4">
          <v-icon icon="mdi-cart"/>
        </v-badge>
      </v-toolbar>
      <v-list>
        <v-list-item 
          v-for="product of products" 
          :key="`cart-product-${product.id}`"
          :prepend-avatar="product.thumbnail"
          :title="product.title"
        >
          <v-list-item-subtitle>
            <v-row>
              <v-col>{{product.price}}€</v-col>
              <v-col>{{product.quantity}}</v-col>
              <v-col>{{product.total}}€</v-col>
            </v-row>
          </v-list-item-subtitle>
          <template #append>
            <v-btn @click="removeProduct(product.id)" icon="mdi-close" :density="'compact'"/>
          </template>
        </v-list-item>
      </v-list>
      <v-toolbar elevation="10">
        <v-container>
          <v-row>
            <v-col>
              Totale
            </v-col>
            <v-col style="text-align: end !important">
              {{ apiStore.flattedUserCart.total }} €
            </v-col>
          </v-row>
        </v-container>
      </v-toolbar>
      <v-card-actions>
        <v-spacer/>
        <v-btn @click="removeAllProducts()" icon="mdi-close" block/>
        <v-spacer/>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">
import type { Product } from '~/stores/types';
const apiStore = useApiStore()
const menu = ref(false)
const products = computed(() => apiStore.flattedUserCart.products as Product[])

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
</script>