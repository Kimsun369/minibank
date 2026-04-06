import React, { createContext, useContext, useState, useEffect } from 'react'
import { BankContextType, Account, Transaction } from '../types'

const BankContext = createContext<BankContextType | undefined>(undefined)

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    accountId: '1',
    type: 'debit',
    amount: 150,
    description: 'Starbucks Coffee',
    category: 'food',
    date: new Date(Date.now() - 1000000).toISOString(),
    status: 'completed'
  },
  {
    id: '2',
    accountId: '1',
    type: 'credit',
    amount: 2000,
    description: 'Monthly Salary',
    category: 'income',
    date: new Date(Date.now() - 2000000).toISOString(),
    status: 'completed'
  },
  {
    id: '3',
    accountId: '1',
    type: 'debit',
    amount: 500,
    description: 'Gym Membership',
    category: 'fitness',
    date: new Date(Date.now() - 3000000).toISOString(),
    status: 'completed'
  },
  {
    id: '4',
    accountId: '1',
    type: 'debit',
    amount: 75,
    description: 'Netflix Subscription',
    category: 'entertainment',
    date: new Date(Date.now() - 4000000).toISOString(),
    status: 'completed'
  },
  {
    id: '5',
    accountId: '1',
    type: 'debit',
    amount: 250,
    description: 'Amazon Purchase',
    category: 'shopping',
    date: new Date(Date.now() - 5000000).toISOString(),
    status: 'completed'
  }
]

export const BankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<Account | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedAccount = localStorage.getItem('account')
    const storedTransactions = localStorage.getItem('transactions')
    
    if (storedAccount) {
      setAccount(JSON.parse(storedAccount))
    } else {
      const mockAccount: Account = {
        id: '1',
        userId: '1',
        accountNumber: '****5678',
        balance: 12500,
        currency: 'USD',
        type: 'checking'
      }
      setAccount(mockAccount)
      localStorage.setItem('account', JSON.stringify(mockAccount))
    }

    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions))
    } else {
      setTransactions(MOCK_TRANSACTIONS)
      localStorage.setItem('transactions', JSON.stringify(MOCK_TRANSACTIONS))
    }
  }, [])

  const transfer = async (to: string, amount: number) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      if (account && account.balance >= amount) {
        const newBalance = account.balance - amount
        const updatedAccount = { ...account, balance: newBalance }
        setAccount(updatedAccount)
        localStorage.setItem('account', JSON.stringify(updatedAccount))

        const newTransaction: Transaction = {
          id: String(Date.now()),
          accountId: account.id,
          type: 'debit',
          amount,
          description: `Transfer to ${to}`,
          category: 'transfer',
          date: new Date().toISOString(),
          status: 'completed'
        }
        const updated = [newTransaction, ...transactions]
        setTransactions(updated)
        localStorage.setItem('transactions', JSON.stringify(updated))
      }
    } finally {
      setLoading(false)
    }
  }

  const deposit = async (amount: number) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      if (account) {
        const newBalance = account.balance + amount
        const updatedAccount = { ...account, balance: newBalance }
        setAccount(updatedAccount)
        localStorage.setItem('account', JSON.stringify(updatedAccount))

        const newTransaction: Transaction = {
          id: String(Date.now()),
          accountId: account.id,
          type: 'credit',
          amount,
          description: 'Deposit',
          category: 'deposit',
          date: new Date().toISOString(),
          status: 'completed'
        }
        const updated = [newTransaction, ...transactions]
        setTransactions(updated)
        localStorage.setItem('transactions', JSON.stringify(updated))
      }
    } finally {
      setLoading(false)
    }
  }

  const withdraw = async (amount: number) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      if (account && account.balance >= amount) {
        const newBalance = account.balance - amount
        const updatedAccount = { ...account, balance: newBalance }
        setAccount(updatedAccount)
        localStorage.setItem('account', JSON.stringify(updatedAccount))

        const newTransaction: Transaction = {
          id: String(Date.now()),
          accountId: account.id,
          type: 'debit',
          amount,
          description: 'Withdrawal',
          category: 'withdrawal',
          date: new Date().toISOString(),
          status: 'completed'
        }
        const updated = [newTransaction, ...transactions]
        setTransactions(updated)
        localStorage.setItem('transactions', JSON.stringify(updated))
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      setLoading(false)
    }
  }

  return (
    <BankContext.Provider value={{ account, transactions, transfer, deposit, withdraw, fetchTransactions, loading }}>
      {children}
    </BankContext.Provider>
  )
}

export const useBank = () => {
  const context = useContext(BankContext)
  if (!context) {
    throw new Error('useBank must be used within BankProvider')
  }
  return context
}
