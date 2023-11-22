<template>
  <v-container>
    <v-row>
      <template v-for="product in products.data.value?.products">
        <v-col cols="12" md="6" lg="4"  v-if="typeof product === 'object' && product !== null" :key="product.id">
          <v-card :style="cardStyle" color="secondary">
              <v-row no-gutters>
                <v-col>
                  <v-img cover :src="product.thumbnail"></v-img>
                </v-col>
                <v-col>
                  <v-card-title>
                    {{ product.title }}
                  </v-card-title>
                  <v-card-text>
                    {{ product.description }}
                  </v-card-text>
                </v-col>
              </v-row>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
  <v-overlay
    v-model="loading"
    class="align-center justify-center"
  >
    <v-progress-circular indeterminate size="128"></v-progress-circular>
  </v-overlay>
  <v-container class="max-width">
    <v-row>
      <v-spacer/>
      <v-col cols="auto">
        <v-pagination
        v-model="page"
        :length="total"
        />
      </v-col>
      <v-col cols="1">
        <v-select v-model="pagination.limit" :items="limits" label="Elementi per Pagina" variant="outlined"/>
      </v-col>
      <v-spacer/>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { Products } from '~/stores/types';
import { BASE_URL } from '~/utils/fetchUtils';
definePageMeta({
  middleware: 'auth'
})

const apiStore = useApiStore()
const loading = ref(false)
const limits = ref([10,25,50,75,100])
const page = ref(1)
const pagination = reactive({
  limit: 25,
  skip: computed(()=>(page.value-1)*pagination.limit) 
}) as { limit: number, skip: number }

const products = useFetch<Products>(`${BASE_URL}/products`, {
  headers: { 'Content-Type': 'application/json', ...authHeader(apiStore.token) },
  query: pagination,
  onRequest: () => { 
    loading.value = true
  },
  onResponse: () => {
    loading.value = false
  }
})

const total = computed(() => Math.floor((products.data.value?.total ?? pagination.limit) / pagination.limit))

const cardStyle = useReactiveStyle({
  xs: { width: '100%', height: '10em' },
  // md: { width: '50%'}
})

</script>