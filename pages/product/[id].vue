<template>
  <v-container>
    <v-row v-if="hasProduct">
      <v-col>
        <v-carousel
          cycle
          height="400"
          hide-delimiter-background
          hide-delimiters
          show-arrows="hover"
          v-model="index"
        >
          <v-carousel-item
            v-for="(image, i) in product.images"
            :key="`prod-image-${i}`"
            :src="image"
          >
          </v-carousel-item>
        </v-carousel>
        <v-row class="mt-2">
          <v-slide-group
            v-model="index"            
            show-arrows
            mandatory
          >
            <v-slide-group-item
              v-for="(image, i) in product.images"
              :key="`prod-slid-img-${i}`"
              v-slot="{ isSelected, toggle }"
            >
              <v-card
                class="ma-2"
                rounded="1"
                width="5em"
                height="3em"
                @click="toggle"
                :variant="index === i ? 'outlined' : 'plain'"
                color="primary"
              >
                <img :src="image" style="width:100%; height: 100%" :alt="`thumb image ${i}`"/>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-row>
      </v-col>
      <v-col>
        <v-row>
          <v-col cols="12">
            <v-card :style="cardStyle" color="secondary" >
              <v-card-title>
                {{ product.title }}
              </v-card-title>
              <v-card-text>
                {{ product.description }}
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card :style="cardStyle" color="secondary" >
              <v-row>
                <v-col cols="8">
                  <v-card-title>
                    <s>{{ toEuro(product.price) }}</s> - {{ product.discountPercentage }}% = {{ priceDiscounted }}
                  </v-card-title>
                  <v-card-text>
                    <v-rating
                      half-increments
                      readonly
                      :length="5"
                      :size="32"
                      :model-value="product.rating"
                      active-color="primary"
                    />
                  </v-card-text>
                </v-col>
                <v-col cols="4">
                  <v-container>
                    <v-row>
                      <v-col>
                        <v-btn icon="mdi-cart-plus" @click="addToCart()"></v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
  <v-overlay
    v-model="loading"
    class="align-center justify-center"
  >
    <v-progress-circular indeterminate size="128"></v-progress-circular>
  </v-overlay>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
definePageMeta({
  middleware: 'auth',
  name: 'Prodotto'
})

const apiStore = useApiStore()
const route = useRoute()
const loading = ref(false)
const index = ref(0)

const prod = useFetch<FullProduct>(`${BASE_URL}/products/${route.params.id }`, {
  headers: { 'Content-Type': 'application/json', ...authHeader(apiStore.token) },
  onRequest: () => { 
    loading.value = true
  },
  onResponse: () => {
    loading.value = false
  }
})
const hasProduct = computed(()=>!!prod.data.value)
const product = computed(() => (prod.data.value ?? {}) as FullProduct)
const priceDiscounted = computed(() => {
  if (hasProduct) {
    if (product.value.discountPercentage > 0) {
      return toEuro(product.value.price * ( 1 - product.value.discountPercentage / 100))
    }
    return toEuro(product.value.price)
  }
  return ''
})
const cardStyle = useReactiveStyle({
  // xs: { width: '100%', height: '10em',textOverflow: 'ellipsis' },
  // md: { width: '50%'}
})
function addToCart () {
  if (apiStore.userCarts.carts.length === 0) {
    apiStore.userCarts.carts.push({
      id: -1,
      products: [],
      total: 0,
      discountedTotal: 0,
      userId: apiStore.user?.id,
      totalProducts: 0,
      totalQuantity: 0,
    })
  }
  const cart = apiStore.userCarts.carts[0]
  cart.discountedTotal += product.value.price * (1 - product.value.discountPercentage / 100)
  const { id, title, price, discountPercentage, thumbnail } = product.value
  const existent = cart.products.find(p => p.id === id)
  if (existent) {
    existent.quantity++
    existent.total = existent.quantity * existent.price
    existent.discountedPrice = existent.total * (1 - existent.discountPercentage / 100)
    cart.totalProducts++
    cart.total+=existent.total
  } else {
    cart.products.push({ id, title, price, discountPercentage, thumbnail, quantity: 1, total: price, discountedPrice: product.value.price * (1 - product.value.discountPercentage / 100) })
  }
  cart.totalQuantity++
}
console.log(addToCart)
</script>