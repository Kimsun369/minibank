import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
const BankContext = createContext(undefined);
// transactions are fetched from backend
export const BankProvider = ({
  children
}) => {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const normalizeAccount = acc => acc ? { ...acc, type: acc.type || 'checking' } : acc;

  useEffect(() => {
    async function loadFromBackend() {
      const storedAccount = localStorage.getItem('account');
      let acc = null;

      try {
        if (storedAccount) {
          acc = normalizeAccount(JSON.parse(storedAccount));
          setAccount(acc);
        } else {
          const accounts = await api.listAccounts(1, 5);
          if (Array.isArray(accounts) && accounts.length > 0) {
            acc = normalizeAccount(accounts[0]);
            setAccount(acc);
            localStorage.setItem('account', JSON.stringify(acc));
          } else {
            const createdAccount = normalizeAccount(await api.createAccount({ currency: 'USD' }));
            acc = createdAccount;
            setAccount(acc);
            localStorage.setItem('account', JSON.stringify(acc));
          }
        }
      } catch (e) {
        console.error('Failed to load account:', e);
      }

      if (acc) {
        try {
          const txs = await api.listTransfers(acc.id, 1, 50);
          const mapped = (Array.isArray(txs) ? txs : []).map(t => ({
            id: String(t.id),
            accountId: String(acc.id),
            type: t.from_account_id === acc.id ? 'debit' : 'credit',
            amount: t.amount / 100,
            description: 'Transfer',
            category: 'transfer',
            date: t.created_at,
            status: 'completed',
          }));
          setTransactions(mapped);
          localStorage.setItem('transactions', JSON.stringify(mapped));
        } catch (e) {
          console.error('Failed to load transactions:', e);
          setTransactions([]);
        }
      }
    }
    loadFromBackend();
  }, []);
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
      if (res && res.transfer) {
        const newTx = { id: String(res.transfer.id), accountId: String(account.id), type: 'debit', amount: amount, description: `Transfer to ${toAccountId}`, category: 'transfer', date: res.transfer.created_at, status: 'completed' };
        const updated = [newTx, ...transactions];
        setTransactions(updated);
        localStorage.setItem('transactions', JSON.stringify(updated));
      }
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
      // Add transaction to local state for UI
      const newTransaction = { 
        id: String(result.entry?.id || Date.now()), 
        accountId: account.id, 
        type: 'credit', 
        amount: amount, 
        description: 'Deposit', 
        category: 'deposit', 
        date: result.entry?.created_at || new Date().toISOString(), 
        status: 'completed' 
      };
      const updated = [newTransaction, ...transactions];
      setTransactions(updated);
      localStorage.setItem('transactions', JSON.stringify(updated));
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
      // Add transaction to local state for UI
      const newTransaction = { 
        id: String(result.entry?.id || Date.now()), 
        accountId: account.id, 
        type: 'debit', 
        amount: amount, 
        description: 'Withdrawal', 
        category: 'withdrawal', 
        date: result.entry?.created_at || new Date().toISOString(), 
        status: 'completed' 
      };
      const updated = [newTransaction, ...transactions];
      setTransactions(updated);
      localStorage.setItem('transactions', JSON.stringify(updated));
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
        const txs = await api.listTransfers(account.id, 1, 50);
        const mapped = (Array.isArray(txs) ? txs : []).map(t => ({ id: String(t.id), accountId: String(account.id), type: t.from_account_id === account.id ? 'debit' : 'credit', amount: t.amount / 100, description: 'Transfer', category: 'transfer', date: t.created_at, status: 'completed' }));
        setTransactions(mapped);
        localStorage.setItem('transactions', JSON.stringify(mapped));
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