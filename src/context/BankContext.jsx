import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from './AuthContext';
const BankContext = createContext(undefined);
// transactions are fetched from backend
export const BankProvider = ({
  children
}) => {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const normalizeAccount = acc => acc ? { ...acc, type: acc.type || 'checking' } : acc;

  const clearAccount = () => {
    setAccount(null);
    setTransactions([]);
    localStorage.removeItem('account');
    localStorage.removeItem('transactions');
  };

  const loadUserAccount = async () => {
    if (!isAuthenticated || !user) return;

    try {
      let acc = null;
      
      // Always fetch fresh data from backend, don't use localStorage cache
      const accounts = await api.listAccounts(1, 5);
      if (Array.isArray(accounts) && accounts.length > 0) {
        acc = normalizeAccount(accounts[0]);
        setAccount(acc);
        localStorage.setItem('account', JSON.stringify(acc));
      } else {
        // Create new account for user
        const createdAccount = normalizeAccount(await api.createAccount({ currency: 'USD' }));
        acc = createdAccount;
        setAccount(acc);
        localStorage.setItem('account', JSON.stringify(acc));
      }

      if (acc) {
        try {
          console.log('Fetching transactions for account:', acc.id);
          // Fetch both transfers and entries (deposits/withdrawals)
          const [transfers, entries] = await Promise.all([
            api.listTransfers(acc.id, 1, 50).catch((err) => {
              console.error('Error fetching transfers:', err);
              return [];
            }),
            api.listEntries(acc.id, 1, 50).catch((err) => {
              console.error('Error fetching entries:', err);
              return [];
            }),
          ]);

          const allTransactions = [];

          // Map transfers
          if (Array.isArray(transfers) && transfers.length > 0) {
            console.log('Processing transfers:', transfers);
            transfers.forEach(t => {
              allTransactions.push({
                id: String(t.id),
                accountId: String(acc.id),
                type: t.from_account_id === acc.id ? 'debit' : 'credit',
                amount: t.amount / 100,
                description: t.from_account_id === acc.id ? `Transfer to ${t.to_account_id}` : `Transfer from ${t.from_account_id}`,
                category: 'transfer',
                date: t.created_at,
                status: 'completed',
              });
            });
          }

          // Map entries (deposits/withdrawals)
          if (Array.isArray(entries) && entries.length > 0) {
            console.log('Processing entries:', entries);
            entries.forEach(e => {
              allTransactions.push({
                id: `entry_${e.id}`,
                accountId: String(acc.id),
                type: e.amount > 0 ? 'credit' : 'debit',
                amount: Math.abs(e.amount / 100),
                description: e.amount > 0 ? 'Deposit' : 'Withdrawal',
                category: e.amount > 0 ? 'deposit' : 'withdrawal',
                date: e.created_at,
                status: 'completed',
              });
            });
          }

          // Sort by date descending
          allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

          console.log('All transactions:', allTransactions);
          setTransactions(allTransactions);
          localStorage.setItem('transactions', JSON.stringify(allTransactions));
        } catch (e) {
          console.error('Failed to load transactions:', e);
          setTransactions([]);
        }
      }
    } catch (e) {
      console.error('Failed to load account:', e);
      clearAccount();
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadUserAccount();
    } else {
      clearAccount();
    }
  }, [isAuthenticated, user]);
  const transfer = async (toAccountId, amount) => {
    setLoading(true);
    try {
      const intAmount = Math.round(amount * 100);
      const body = { from_account_id: Number(account.id), to_account_id: Number(toAccountId), amount: intAmount, currency: account?.currency || 'USD' };
      const res = await api.createTransfer(body);
      if (res && res.from_account) {
        const updatedAccount = normalizeAccount(res.from_account);
        setAccount(updatedAccount);
        localStorage.setItem('account', JSON.stringify(updatedAccount));
      }
      // Refresh transactions from backend
      await fetchTransactions();
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };
  const deposit = async amount => {
    setLoading(true);
    try {
      const result = await api.deposit(amount);
      if (result && result.account) {
        const updatedAccount = normalizeAccount(result.account);
        setAccount(updatedAccount);
        localStorage.setItem('account', JSON.stringify(updatedAccount));
      }
      // Refresh transactions from backend
      await fetchTransactions();
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };
  const withdraw = async amount => {
    setLoading(true);
    try {
      const result = await api.withdraw(amount);
      if (result && result.account) {
        const updatedAccount = normalizeAccount(result.account);
        setAccount(updatedAccount);
        localStorage.setItem('account', JSON.stringify(updatedAccount));
      }
      // Refresh transactions from backend
      await fetchTransactions();
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      if (account) {
        const [transfers, entries] = await Promise.all([
          api.listTransfers(account.id, 1, 50).catch(() => []),
          api.listEntries(account.id, 1, 50).catch(() => []),
        ]);

        const allTransactions = [];

        // Map transfers
        if (Array.isArray(transfers)) {
          transfers.forEach(t => {
            allTransactions.push({
              id: String(t.id),
              accountId: String(account.id),
              type: t.from_account_id === account.id ? 'debit' : 'credit',
              amount: t.amount / 100,
              description: t.from_account_id === account.id ? `Transfer to ${t.to_account_id}` : `Transfer from ${t.from_account_id}`,
              category: 'transfer',
              date: t.created_at,
              status: 'completed',
            });
          });
        }

        // Map entries (deposits/withdrawals)
        if (Array.isArray(entries)) {
          entries.forEach(e => {
            allTransactions.push({
              id: `entry_${e.id}`,
              accountId: String(account.id),
              type: e.amount > 0 ? 'credit' : 'debit',
              amount: Math.abs(e.amount / 100),
              description: e.amount > 0 ? 'Deposit' : 'Withdrawal',
              category: e.amount > 0 ? 'deposit' : 'withdrawal',
              date: e.created_at,
              status: 'completed',
            });
          });
        }

        // Sort by date descending
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        setTransactions(allTransactions);
        localStorage.setItem('transactions', JSON.stringify(allTransactions));
      }
    } catch (e) {
      console.error('Failed to fetch transactions:', e);
    } finally {
      setLoading(false);
    }
  };
  return <BankContext.Provider value={{
    account,
    transactions,
    transfer,
    deposit,
    withdraw,
    fetchTransactions,
    loading
  }}>
      {children}
    </BankContext.Provider>;
};
export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within BankProvider');
  }
  return context;
};