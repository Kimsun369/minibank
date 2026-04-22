import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useBank } from '../context/BankContext';
import api from '../lib/api';

const SpendingSummary = () => {
  const { transactions } = useBank();

  // Calculate weekly spending from transactions
  const getWeeklySpending = () => {
    const now = new Date();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekData = weekDays.map(day => ({ name: day, value: 0 }));

    // Get transactions from the last 7 days
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      if (txDate >= sevenDaysAgo && tx.type === 'debit') {
        const dayIndex = txDate.getDay();
        weekData[dayIndex].value += tx.amount; // Already in dollars from BankContext
      }
    });

    return weekData;
  };

  const data = getWeeklySpending();

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-neutral-900">Weekly Spending</h3>
        <ClearSpendingControl />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value) => [`$${value.toFixed(2)}`, 'Spent']}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0ea5e9"
            strokeWidth={3}
            dot={{ fill: '#0ea5e9', r: 6 }}
            activeDot={{ r: 8 }}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default SpendingSummary;

function ClearSpendingControl() {
  const { fetchTransactions } = useBank();
  const [config, setConfig] = React.useState({ enabled: false, options: [] });
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    api.getSpendingClearConfig().then(cfg => {
      console.debug('spending clear config response:', cfg);
      if (!mounted) return;
      setConfig(cfg);
    }).catch(err => {
      console.debug('spending clear config error:', err);
    });
    return () => { mounted = false };
  }, []);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      await api.clearSpending(action);
      await fetchTransactions();
      setOpen(false);
    } catch (e) {
      console.error('Failed to clear spending:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!config.enabled || !Array.isArray(config.options) || config.options.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1 text-sm font-medium bg-neutral-100 rounded-md"
        disabled={loading}
      >
        Clear
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-20">
          {config.options.map(opt => {
            const label = opt === 'this_week' ? 'Clear This Week' : opt === 'today' ? 'Clear Today' : opt;
            return (
              <button
                key={opt}
                onClick={() => handleAction(opt)}
                className="w-full text-left px-3 py-2 hover:bg-neutral-50"
                disabled={loading}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}