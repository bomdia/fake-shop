export const BASE_URL = 'https://dummyjson.com'

export function authHeader(token?: string): {} | { Authorization: string } {
  if (token) {
    return { Authorization: 'Bearer ' + token }
  }
  return {}
}

export async function fetchSingle<T>(
  endPoint: string,
  id: number,
  token?: string
): Promise<T> {
  const response = await fetch(`${BASE_URL}/${endPoint}/${id}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader(token) },
  })
  return (await response.json()) as T
}
export async function fetchUserCarts(
  userId: number,
  token?: string
): Promise<Carts> {
  const response = await fetch(`${BASE_URL}/users/${userId}/carts`, {
    headers: { 'Content-Type': 'application/json', ...authHeader(token) },
  })
  return (await response.json()) as Carts
}
export async function fetchSingleUser(
  id: number,
  token?: string
): Promise<User> {
  return await fetchSingle('user', id, token)
}
export async function postLogin(username: string, password: string) {
  return await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
    }),
  })
}
export async function postNewUser(
  userData: Record<string, any>,
  token?: string
) {
  return await fetch(`${BASE_URL}/users/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader(token) },
    body: JSON.stringify(userData),
  })
}
