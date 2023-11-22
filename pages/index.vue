<template>
  <v-container>
    <v-row align-content="center">
      <v-col>
        <v-text-field
          :loading="loading"
          label="Cerca"
          variant="outlined"
          rounded="10"
          append-inner-icon="mdi-magnify"
          clearable
          v-model="pagination.q"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-chip-group
          v-model="currentCategories"
          column
          multiple
        >
          <v-chip
            v-for="(quantity, category, i) in productsCategories"
            filter
            variant="outlined"
            rounded="10"
            :value="category"
            :key="`category-filterer-${i}-${category}`"
            style="text-transform: capitalize;"
          >
            <span class="mr-1">{{category.replaceAll('-',' ')}}</span>
            <span class="badge">{{ quantity }}</span>
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
    <v-row>
      <template v-for="product in filteredProducts">
        <v-col cols="12" md="6" lg="4"  v-if="typeof product === 'object' && product !== null" :key="product.id">
          <v-card :style="cardStyle" color="secondary" :to="`/product/${product.id}`">
              <v-row no-gutters>
                <v-col>
                  <v-img cover :src="product.thumbnail"></v-img>
                </v-col>
                <v-col>
                  <v-card-title>
                    {{ product.title }}
                    <v-spacer/>
                    {{ discountedPrice(product) }}
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
    <v-row align-content="center">
      <v-spacer/>
      <v-col cols="1">
        <v-text-field
          density="compact"
          v-model="totalElements"
          disabled
          label="Totale Elementi"
          variant="outlined"
        />
      </v-col>
      <v-col cols="auto">
        <v-pagination
        density="compact"
        v-model="page"
        :length="totalPages"
        />
      </v-col>
      <v-col cols="1">
        <v-select           
          density="compact"
          v-model="pagination.limit" 
          :items="limits" 
          label="Elementi per Pagina" 
          variant="outlined"
        />
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
  skip: computed(() => (page.value - 1) * pagination.limit),
  q: ''
}) as { limit: number, skip: number, q: string }

const products = useFetch<Products>(`${BASE_URL}/products/search`, {
  headers: { 'Content-Type': 'application/json', ...authHeader(apiStore.token) },
  query: pagination,
  onRequest: () => { 
    loading.value = true
  },
  onResponse: () => {
    loading.value = false
  }
})
const productsCategories = computed(() => {
  const cat:Record<string,number> = {}
  if (products.data.value) {
    for (const product of products.data.value.products) {
      if (cat[product.category]) cat[product.category]++
      else cat[product.category] = 1
    }
  }
  return cat
})

const currentCategories = ref([] as string[])

const filteredProducts = computed(() => {
  const prods: FullProduct[] = []
  if (products.data.value) {
    if (currentCategories.value.length > 0) {
      for (const product of products.data.value.products) {
        if (currentCategories.value.includes(product.category)) {
          prods.push(product)
        }
      }
    } else return products.data.value.products
  }
  return prods
})

const totalElements = computed(()=>products.data.value?.total??0)

const totalPages = computed(() => Math.floor((products.data.value?.total ?? pagination.limit) / pagination.limit))

const cardStyle = useReactiveStyle({
  xs: { width: '100%', height: '10em',textOverflow: 'ellipsis' },
  // md: { width: '50%'}
})

function discountedPrice (product: FullProduct) {
    if (product.discountPercentage > 0) {
      return toEuro(product.price * ( 1 - product.discountPercentage / 100))
    }
    return toEuro(product.price)
}
</script>
<style>
  .badge{
    background: rgb(var(--v-theme-on-code));
    width: 1.2em;
    height: 1.2em;
    color: rgb(var(--v-theme-code));
    border-radius: 1.5em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>