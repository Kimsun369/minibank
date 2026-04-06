import React, { useState } from 'react'
import { useBank } from '../context/BankContext'
import { Search, Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

const Transactions: React.FC = () => {
  const { transactions } = useBank()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all')

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || t.type === filterType
    return matchesSearch && matchesType
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Transactions</h1>
          <p className="text-neutral-600">View and manage all your transactions</p>
        </div>

        {/* Search and Filter */}
        <div className="card mb-6 p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-smooth"
              />
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                  filterType === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('credit')}
                className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                  filterType === 'credit'
                    ? 'bg-accent-600 text-white'
                    : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setFilterType('debit')}
                className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                  filterType === 'debit'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                }`}
              >
                Expenses
              </button>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="card overflow-hidden">
          {filteredTransactions.length > 0 ? (
            <div className="divide-y divide-neutral-200">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-neutral-50 transition-smooth">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`p-3 rounded-lg ${
                          transaction.type === 'credit'
                            ? 'bg-accent-50'
                            : 'bg-primary-50'
                        }`}
                      >
                        {transaction.type === 'credit' ? (
                          <ArrowDownLeft className="w-6 h-6 text-accent-600" />
                        ) : (
                          <ArrowUpRight className="w-6 h-6 text-primary-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">{transaction.description}</h3>
                        <p className="text-sm text-neutral-500">
                          {formatDate(transaction.date)} at {formatTime(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === 'credit'
                            ? 'text-accent-600'
                            : 'text-neutral-900'
                        }`}
                      >
                        {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          transaction.status === 'completed'
                            ? 'bg-accent-50 text-accent-700'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Filter className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600">No transactions found</p>
              <p className="text-sm text-neutral-500 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Transactions
