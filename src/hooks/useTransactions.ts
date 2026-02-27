import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useClub } from '../context/ClubContext';
import type { Transaction } from '../types';

export function useTransactions() {
  const { club } = useClub();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!club) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          member:members(id, name),
          match:matches(id, venue, date)
        `)
        .eq('club_id', club.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [club]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'member' | 'match' | 'club_id'>) => {
    if (!club) throw new Error('No club selected');
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...transaction, club_id: club.id }])
        .select(`
          *,
          member:members(id, name),
          match:matches(id, venue, date)
        `)
        .single();

      if (error) throw error;
      setTransactions(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add transaction');
    }
  };

  const addExpense = async (amount: number, description: string, date?: string) => {
    if (!club) throw new Error('No club selected');
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          club_id: club.id,
          type: 'expense',
          amount: -Math.abs(amount),
          description,
          date: date || new Date().toISOString().split('T')[0],
        }])
        .select()
        .single();

      if (error) throw error;
      setTransactions(prev => {
        const newTransactions = [data, ...prev];
        return newTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add expense');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete transaction');
    }
  };

  const getTotalFunds = () => {
    return transactions.reduce((total, t) => total + t.amount, 0);
  };

  const getMemberTransactions = (memberId: string) => {
    return transactions.filter(t => t.member_id === memberId);
  };

  return {
    transactions, loading, error, fetchTransactions,
    addTransaction, addExpense, deleteTransaction, getTotalFunds, getMemberTransactions,
  };
}
