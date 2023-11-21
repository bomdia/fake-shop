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
        <v-badge :content="apiStore.flattedUserCart.totalQuantity">
          <v-icon icon="mdi-cart"/>
        </v-badge>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar>
        <v-spacer/>
        <v-avatar class="mr-2" rounded="0">
          <v-badge :content="apiStore.flattedUserCart.totalQuantity">
            <v-icon icon="mdi-cart"/>
          </v-badge>
        </v-avatar>
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
            <v-btn @click="" icon="mdi-close" :density="'compact'"/>
          </template>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-spacer/>
        <v-btn @click="" icon="mdi-close"/>
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
</script>