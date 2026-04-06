import React from 'react'
import { Link } from 'react-router-dom'
import { useBank } from '../context/BankContext'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'

interface RecentTransactionsProps {
  limit?: number
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ limit = 10 }) => {
  const { transactions } = useBank()
  const displayTransactions = transactions.slice(0, limit)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-neutral-200">
        <h3 className="text-lg font-bold text-neutral-900">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-neutral-200">
        {displayTransactions.length > 0 ? (
          displayTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4 hover:bg-neutral-50 transition-smooth">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      transaction.type === 'credit'
                        ? 'bg-accent-50'
                        : 'bg-primary-50'
                    }`}
                  >
                    {transaction.type === 'credit' ? (
                      <ArrowDownLeft className={`w-5 h-5 ${transaction.type === 'credit' ? 'text-accent-600' : 'text-primary-600'}`} />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 text-sm">{transaction.description}</p>
                    <p className="text-xs text-neutral-500">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <p
                  className={`font-semibold text-sm ${
                    transaction.type === 'credit'
                      ? 'text-accent-600'
                      : 'text-neutral-900'
                  }`}
                >
                  {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-neutral-500">No transactions yet</p>
          </div>
        )}
      </div>
      <Link
        to="/transactions"
        className="p-4 block text-center text-primary-600 font-semibold hover:bg-neutral-50 transition-smooth border-t border-neutral-200"
      >
        View All →
      </Link>
    </div>
  )
}

export default RecentTransactions
