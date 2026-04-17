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
  useEffect(() => {
    async function loadFromBackend() {
      const storedAccount = localStorage.getItem('account');
      let acc = null;
      if (storedAccount) {
        acc = JSON.parse(storedAccount);
        setAccount(acc);
      } else {
        try {
          const accounts = await api.listAccounts(1, 5);
          if (Array.isArray(accounts) && accounts.length > 0) {
            acc = accounts[0];
            setAccount(acc);
            localStorage.setItem('account', JSON.stringify(acc));
          } else {
            acc = { id: '1', userId: '1', accountNumber: '****5678', balance: 12500, currency: 'USD', type: 'checking' };
            setAccount(acc);
            localStorage.setItem('account', JSON.stringify(acc));
          }
        } catch (e) {
          acc = { id: '1', userId: '1', accountNumber: '****5678', balance: 12500, currency: 'USD', type: 'checking' };
          setAccount(acc);
          localStorage.setItem('account', JSON.stringify(acc));
        }
      }

      const storedTransactions = localStorage.getItem('transactions');
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      } else {
        // fetch transfers for the resolved account
        if (acc) {
          try {
            const txs = await api.listTransfers(acc.id, 1, 50);
            const mapped = (Array.isArray(txs) ? txs : []).map(t => ({ id: String(t.id), accountId: String(acc.id), type: t.from_account_id === acc.id ? 'debit' : 'credit', amount: t.amount, description: 'Transfer', category: 'transfer', date: t.created_at, status: 'completed' }));
            setTransactions(mapped);
            localStorage.setItem('transactions', JSON.stringify(mapped));
          } catch (e) {
            setTransactions([]);
          }
        }
      }
    }
    loadFromBackend()
  }, []);
  const transfer = async (toAccountId, amount) => {
    setLoading(true);
    try {
      // backend expects integer amounts; round to nearest integer
      const intAmount = Number.isInteger(amount) ? amount : Math.round(amount);
      const body = { from_account_id: Number(account.id), to_account_id: Number(toAccountId), amount: intAmount, currency: account?.currency || 'USD' };
      const res = await api.createTransfer(body);
      if (res && res.from_account) {
        setAccount(res.from_account);
      }
      if (res && res.from_entry) {
        const newTx = { id: String(res.transfer?.id || Date.now()), accountId: String(account.id), type: 'debit', amount: res.transfer?.amount ?? amount, description: `Transfer to ${toAccountId}`, category: 'transfer', date: res.transfer?.created_at || new Date().toISOString(), status: 'completed' };
        const updated = [newTx, ...transactions];
        setTransactions(updated);
        localStorage.setItem('transactions', JSON.stringify(updated));
      }
    } catch (e) {
      throw e
    } finally {
      setLoading(false);
    }
  };
  const deposit = async amount => {
    // backend does not expose a deposit endpoint by default; update state locally
    setLoading(true);
    try {
      const newBalance = account.balance + amount;
      const updatedAccount = { ...account, balance: newBalance };
      setAccount(updatedAccount);
      localStorage.setItem('account', JSON.stringify(updatedAccount));
      const newTransaction = { id: String(Date.now()), accountId: account.id, type: 'credit', amount, description: 'Deposit', category: 'deposit', date: new Date().toISOString(), status: 'completed' };
      const updated = [newTransaction, ...transactions];
      setTransactions(updated);
      localStorage.setItem('transactions', JSON.stringify(updated));
    } finally {
      setLoading(false);
    }
  };
  const withdraw = async amount => {
    // backend does not have withdraw endpoint; apply locally
    setLoading(true);
    try {
      if (account && account.balance >= amount) {
        const newBalance = account.balance - amount;
        const updatedAccount = { ...account, balance: newBalance };
        setAccount(updatedAccount);
        localStorage.setItem('account', JSON.stringify(updatedAccount));
        const newTransaction = { id: String(Date.now()), accountId: account.id, type: 'debit', amount, description: 'Withdrawal', category: 'withdrawal', date: new Date().toISOString(), status: 'completed' };
        const updated = [newTransaction, ...transactions];
        setTransactions(updated);
        localStorage.setItem('transactions', JSON.stringify(updated));
      }
    } finally {
      setLoading(false);
    }
  };
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
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