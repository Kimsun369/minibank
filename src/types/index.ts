export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface Account {
  id: string
  userId: string
  accountNumber: string
  balance: number
  currency: string
  type: 'checking' | 'savings'
}

export interface Transaction {
  id: string
  accountId: string
  type: 'debit' | 'credit'
  amount: number
  description: string
  category: string
  date: string
  status: 'pending' | 'completed' | 'failed'
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  loading: boolean
}

export interface BankContextType {
  account: Account | null
  transactions: Transaction[]
  transfer: (to: string, amount: number) => Promise<void>
  deposit: (amount: number) => Promise<void>
  withdraw: (amount: number) => Promise<void>
  fetchTransactions: () => Promise<void>
  loading: boolean
}
