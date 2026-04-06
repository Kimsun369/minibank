import React, { useState } from 'react'
import { useBank } from '../context/BankContext'
import { useNavigate } from 'react-router-dom'
import { Minus } from 'lucide-react'

const Withdraw: React.FC = () => {
  const { account, withdraw, loading } = useBank()
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<'atm' | 'transfer'>('atm')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    const withdrawAmount = parseFloat(amount)
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (account && withdrawAmount > account.balance) {
      setError('Insufficient balance')
      return
    }

    try {
      await withdraw(withdrawAmount)
      setSuccess(true)
      setAmount('')
      setTimeout(() => navigate('/transactions'), 2000)
    } catch (err) {
      setError('Withdrawal failed. Please try again.')
    }
  }

  const quickAmounts = [100, 250, 500, 1000]

  return (
    <div className="min-h-screen bg-neutral-50 p-4 lg:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-primary-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary-600 rounded-lg">
                <Minus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Withdraw Money</h1>
                <p className="text-neutral-600">Withdraw cash from your account</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-accent-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">Withdrawal Successful!</h2>
                <p className="text-neutral-600 mb-4">
                  ${parseFloat(amount).toFixed(2)} has been withdrawn from your account
                </p>
                <p className="text-sm text-neutral-500">Redirecting...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                {/* Current Balance */}
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-600 mb-1">Available Balance</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    ${account?.balance.toFixed(2)}
                  </p>
                </div>

                {/* Withdrawal Method */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">
                    Withdrawal Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'atm', label: 'ATM Withdrawal', icon: '🏧' },
                      { id: 'transfer', label: 'Bank Transfer', icon: '📤' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMethod(m.id as 'atm' | 'transfer')}
                        className={`p-4 rounded-lg border-2 transition-smooth text-center font-semibold ${
                          method === m.id
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        <div className="text-2xl mb-2">{m.icon}</div>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Withdrawal Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-neutral-600 font-semibold">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      max={account?.balance.toString()}
                      className="w-full pl-8 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-smooth"
                    />
                  </div>
                </div>

                {/* Quick Amounts */}
                <div>
                  <p className="text-sm font-semibold text-neutral-700 mb-3">Quick amounts</p>
                  <div className="grid grid-cols-4 gap-2">
                    {quickAmounts.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setAmount(q.toString())}
                        className="p-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-smooth font-semibold text-neutral-700"
                      >
                        ${q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:from-primary-700 hover:to-primary-800 transition-smooth disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Confirm Withdrawal'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Withdraw
