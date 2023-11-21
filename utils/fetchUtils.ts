export async function fetchSingle<T>(endPoint: string, id: number): Promise<T> {
  const response = await fetch(`https://dummyjson.com/${endPoint}/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  })
  return (await response.json()) as T
}
export async function fetchUserCarts(userId: number): Promise<Carts> {
  const response = await fetch(`https://dummyjson.com/users/${userId}/carts`, {
    headers: { 'Content-Type': 'application/json' },
  })
  return (await response.json()) as Carts
}
export async function fetchSingleUser(id: number): Promise<User> {
  return fetchSingle('user', id)
}
