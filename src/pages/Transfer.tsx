import React, { useState } from 'react'
import { useBank } from '../context/BankContext'
import { useNavigate } from 'react-router-dom'
import { Send } from 'lucide-react'

const Transfer: React.FC = () => {
  const { transfer, account, loading } = useBank()
  const navigate = useNavigate()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!recipient.trim()) {
      setError('Please enter recipient account number')
      return
    }

    const transferAmount = parseFloat(amount)
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (account && transferAmount > account.balance) {
      setError('Insufficient balance')
      return
    }

    try {
      await transfer(recipient, transferAmount)
      setSuccess(true)
      setRecipient('')
      setAmount('')
      setMessage('')
      setTimeout(() => navigate('/transactions'), 2000)
    } catch (err) {
      setError('Transfer failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4 lg:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-primary-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary-600 rounded-lg">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Transfer Money</h1>
                <p className="text-neutral-600">Send money to another account</p>
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
                <h2 className="text-xl font-bold text-neutral-900 mb-2">Transfer Successful!</h2>
                <p className="text-neutral-600 mb-4">
                  ${parseFloat(amount).toFixed(2)} transferred to {recipient}
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

                {/* Recipient */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Recipient Account Number
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter account number"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-smooth"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Amount
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
                      className="w-full pl-8 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-smooth"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a message for the recipient"
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-smooth resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:from-primary-700 hover:to-primary-800 transition-smooth disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : 'Confirm Transfer'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transfer
