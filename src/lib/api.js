const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

function authHeaders() {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function parseResponse(res) {
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = json.error || json.message || res.statusText
    throw new Error(message)
  }
  return json
}

export async function registerUser(payload) {
  const res = await fetch(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseResponse(res)
}

export async function loginUser(payload) {
  const res = await fetch(`${BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseResponse(res)
}

export async function renewAccess(refreshToken) {
  const res = await fetch(`${BASE}/tokens/renew_access`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
  return parseResponse(res)
}

export async function listAccounts(page_id = 1, page_size = 5) {
  const url = new URL(`${BASE}/accounts`)
  url.searchParams.set('page_id', page_id)
  url.searchParams.set('page_size', page_size)
  const res = await fetch(url.toString(), { headers: { ...authHeaders() } })
  return parseResponse(res)
}

export async function getAccount(id) {
  const res = await fetch(`${BASE}/accounts/${id}`, { headers: { ...authHeaders() } })
  return parseResponse(res)
}

export async function listTransfers(account_id, page_id = 1, page_size = 50) {
  const url = new URL(`${BASE}/transfers`)
  url.searchParams.set('account_id', account_id)
  url.searchParams.set('page_id', page_id)
  url.searchParams.set('page_size', page_size)
  const res = await fetch(url.toString(), { headers: { ...authHeaders() } })
  return parseResponse(res)
}

export async function createAccount(body) {
  const res = await fetch(`${BASE}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  })
  return parseResponse(res)
}

export async function createTransfer(body) {
  const res = await fetch(`${BASE}/transfers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  })
  return parseResponse(res)
}

export async function deposit(amount) {
  const res = await fetch(`${BASE}/accounts/deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ amount: Math.round(amount * 100) }), // Convert to cents
  })
  return parseResponse(res)
}

export async function withdraw(amount) {
  const res = await fetch(`${BASE}/accounts/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ amount: Math.round(amount * 100) }), // Convert to cents
  })
  return parseResponse(res)
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
  deposit,
  withdraw,
}
