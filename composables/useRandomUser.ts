function between(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

export async function useRandomUser() {
  const { data, pending, error, refresh } = await useFetch(
    'https://dummyjson.com/users'
  )
  const users = computed(() => data.value as Users)
  const random = computed(() => between(0, users.value.users.length))
  return {
    user: computed(() => users.value.users[random.value] as User),
    pending,
    error,
    refresh,
  }
}
