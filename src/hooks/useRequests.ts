import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useClub } from '../context/ClubContext';
import type { MemberRequest } from '../types';

export function useRequests() {
  const { club } = useClub();
  const [requests, setRequests] = useState<MemberRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!club) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('member_requests')
        .select('*')
        .eq('club_id', club.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  }, [club]);

  useEffect(() => {
    fetchRequests();

    const channel = supabase
      .channel('member_requests_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'member_requests' },
        () => { fetchRequests(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchRequests]);

  const submitRequest = async (request: {
    name: string;
    phone?: string;
    email?: string;
    experience?: string;
    message?: string;
  }) => {
    if (!club) throw new Error('No club selected');
    try {
      const { data, error } = await supabase
        .from('member_requests')
        .insert([{ ...request, club_id: club.id, status: 'pending' }])
        .select()
        .single();

      if (error) throw error;
      setRequests(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to submit request');
    }
  };

  const approveRequest = async (id: string) => {
    if (!club) throw new Error('No club selected');
    try {
      const { data, error } = await supabase
        .from('member_requests')
        .update({ status: 'approved' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setRequests(prev => prev.map(r => r.id === id ? data : r));

      const request = requests.find(r => r.id === id);
      if (request) {
        await supabase.from('members').insert([{
          club_id: club.id,
          name: request.name,
          phone: request.phone,
          email: request.email,
          status: 'active',
          balance: 0,
          matches_played: 0,
        }]);
      }

      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to approve request');
    }
  };

  const rejectRequest = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('member_requests')
        .update({ status: 'rejected' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setRequests(prev => prev.map(r => r.id === id ? data : r));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to reject request');
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      const { error } = await supabase.from('member_requests').delete().eq('id', id);
      if (error) throw error;
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete request');
    }
  };

  const getPendingCount = () => requests.filter(r => r.status === 'pending').length;

  return {
    requests, loading, error, fetchRequests,
    submitRequest, approveRequest, rejectRequest, deleteRequest, getPendingCount,
  };
}
