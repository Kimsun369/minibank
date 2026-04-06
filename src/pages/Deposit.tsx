import React, { useState } from 'react'
import { useBank } from '../context/BankContext'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'

const Deposit: React.FC = () => {
  const { deposit, loading } = useBank()
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<'card' | 'bank'>('card')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    const depositAmount = parseFloat(amount)
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (depositAmount > 50000) {
      setError('Maximum deposit amount is $50,000')
      return
    }

    try {
      await deposit(depositAmount)
      setSuccess(true)
      setAmount('')
      setTimeout(() => navigate('/transactions'), 2000)
    } catch (err) {
      setError('Deposit failed. Please try again.')
    }
  }

  const quickAmounts = [100, 250, 500, 1000]

  return (
    <div className="min-h-screen bg-neutral-50 p-4 lg:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-accent-50 to-accent-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-accent-600 rounded-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Deposit Funds</h1>
                <p className="text-neutral-600">Add money to your account</p>
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
                <h2 className="text-xl font-bold text-neutral-900 mb-2">Deposit Successful!</h2>
                <p className="text-neutral-600 mb-4">
                  ${parseFloat(amount).toFixed(2)} has been added to your account
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

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'card', label: 'Debit Card', icon: '💳' },
                      { id: 'bank', label: 'Bank Transfer', icon: '🏦' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMethod(m.id as 'card' | 'bank')}
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
                    Deposit Amount
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
                      max="50000"
                      className="w-full pl-8 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-smooth"
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
                  className="w-full bg-gradient-to-r from-accent-600 to-accent-700 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:from-accent-700 hover:to-accent-800 transition-smooth disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Continue to Payment'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Deposit
