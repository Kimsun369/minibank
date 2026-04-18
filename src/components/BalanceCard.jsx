import React from 'react';
import { useBank } from '../context/BankContext';
import { CreditCard } from 'lucide-react';
const BalanceCard = ({
  visible
}) => {
  const {
    account
  } = useBank();
  if (!account) return null;
  return <div className="relative h-56 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white overflow-hidden group cursor-pointer transition-smooth hover:shadow-2xl">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-300" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-8 -mb-8" />

      <div className="relative z-10">
        {/* Card header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6" />
            <span className="text-sm font-semibold opacity-90">Mini Bank</span>
          </div>
          <span className="text-sm font-semibold opacity-75">CHECKING</span>
        </div>

        {/* Account number */}
        <p className="text-sm opacity-75 mb-8 tracking-widest">{account.id}</p>

        {/* Balance display */}
        <div className="mb-4">
          <p className="text-sm opacity-75 mb-2">Available Balance</p>
          <p className="text-4xl font-bold">
            {visible ? `$${(account.balance / 100).toLocaleString('en-US', {
            minimumFractionDigits: 2
          })}` : '••••••'}
          </p>
        </div>

        {/* Card footer */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs opacity-75 mb-1">Account Type</p>
            <p className="text-sm font-semibold capitalize">{account.type}</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-75 mb-1">Valid Thru</p>
            <p className="text-sm font-semibold">12/26</p>
          </div>
        </div>
      </div>
    </div>;
};
export default BalanceCard;