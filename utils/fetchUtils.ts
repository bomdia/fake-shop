const baseUrl = 'https://dummyjson.com'
export async function fetchSingle<T>(endPoint: string, id: number): Promise<T> {
  const response = await fetch(`${baseUrl}/${endPoint}/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  })
  return (await response.json()) as T
}
export async function fetchUserCarts(userId: number): Promise<Carts> {
  const response = await fetch(`${baseUrl}/${userId}/carts`, {
    headers: { 'Content-Type': 'application/json' },
  })
  return (await response.json()) as Carts
}
export async function fetchSingleUser(id: number): Promise<User> {
  return await fetchSingle('user', id)
}
export async function postLogin(username: string, password: string) {
  return await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
    }),
  })
}
export async function postNewUser(userData: Record<string, any>) {
  return await fetch(`${baseUrl}/users/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })
}
