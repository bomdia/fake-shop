import { defineStore, acceptHMRUpdate } from 'pinia'
import { fetchUserCarts } from '#imports'
import type { Carts } from '#imports'

const baseUrl = 'https://dummyjson.com'
export const useApiStore = defineStore('api', () => {
  const isAuthenticated = ref(false)
  const user = ref() as Ref<User>
  const userCarts = ref() as Ref<Carts>
  const errorMsg = ref('')

  async function login(username: string, password: string) {
    if (isAuthenticated.value) return true
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
      }),
    })
    if (response.ok) {
      const loginUser = (await response.json()) as LoginUser
      user.value = await fetchSingleUser(loginUser.id)
      userCarts.value = await fetchUserCarts(loginUser.id)
      errorMsg.value = ''
      const router = useRouter()
      await router.push('/')
      isAuthenticated.value = true
      return true
    } else {
      user.value = undefined
      errorMsg.value = (await response.json()).message
      isAuthenticated.value = false
      return false
    }
  }
  async function register(userData: Record<string, any> = {}) {
    if (isAuthenticated.value) return false
    const response = await fetch(`${baseUrl}/users/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
    if (response.ok) {
      errorMsg.value = ''
      return true
    } else {
      errorMsg.value = (await response.json()).message
      return false
    }
  }
  async function logout() {
    if (!isAuthenticated.value) return false
    isAuthenticated.value = false
    user.value = null
    const router = useRouter()
    await router.push('/login')
    return true
  }

  const flattedUserCart = computed(() => {
    const resCart: Cart = {
      id: -1,
      products: [],
      total: 0,
      discountedTotal: 0,
      userId: user.value?.id,
      totalProducts: 0,
      totalQuantity: 0,
    }
    if (userCarts.value?.carts) {
      const carts = userCarts.value?.carts as Cart[]
      for (const cart of carts) {
        resCart.products.push(...cart.products)
        resCart.total += cart.total
        resCart.discountedTotal += cart.discountedTotal
        resCart.totalProducts += cart.totalProducts
        resCart.totalQuantity += cart.totalQuantity
      }
    }
    return resCart
  })

  return {
    user,
    errorMsg,
    isAuthenticated,
    login,
    register,
    logout,
    userCarts,
    flattedUserCart,
  }
})
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useApiStore, import.meta.hot))
