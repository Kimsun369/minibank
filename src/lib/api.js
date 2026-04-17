const BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080')

function authHeaders() {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function registerUser(payload) {
  const res = await fetch(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function loginUser(payload) {
  const res = await fetch(`${BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function renewAccess(refreshToken) {
  const res = await fetch(`${BASE}/tokens/renew_access`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
  return res.json()
}

export async function listAccounts(page_id = 1, page_size = 5) {
  const url = new URL(`${BASE}/accounts`)
  url.searchParams.set('page_id', page_id)
  url.searchParams.set('page_size', page_size)
  const res = await fetch(url.toString(), { headers: { ...authHeaders() } })
  return res.json()
}

export async function getAccount(id) {
  const res = await fetch(`${BASE}/accounts/${id}`, { headers: { ...authHeaders() } })
  return res.json()
}

export async function listTransfers(account_id, page_id = 1, page_size = 50) {
  const url = new URL(`${BASE}/transfers`)
  url.searchParams.set('account_id', account_id)
  url.searchParams.set('page_id', page_id)
  url.searchParams.set('page_size', page_size)
  const res = await fetch(url.toString(), { headers: { ...authHeaders() } })
  return res.json()
}

export async function createAccount(body) {
  const res = await fetch(`${BASE}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  })
  return res.json()
}

export async function createTransfer(body) {
  const res = await fetch(`${BASE}/transfers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  })
  return res.json()
}

export default {
  registerUser,
  loginUser,
  renewAccess,
  listAccounts,
  listTransfers,
  getAccount,
  createAccount,
  createTransfer,
}
