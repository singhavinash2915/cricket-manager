import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useClub } from '../context/ClubContext';
import type { Member } from '../types';

export function useMembers() {
  const { club } = useClub();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!club) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('club_id', club.id)
        .order('name');

      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  }, [club]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const addMember = async (member: Omit<Member, 'id' | 'created_at' | 'matches_played' | 'club_id'>) => {
    if (!club) throw new Error('No club selected');
    try {
      const { data, error } = await supabase
        .from('members')
        .insert([{ ...member, club_id: club.id, matches_played: 0 }])
        .select()
        .single();

      if (error) throw error;
      setMembers(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add member');
    }
  };

  const updateMember = async (id: string, updates: Partial<Member>) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setMembers(prev => prev.map(m => m.id === id ? data : m));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update member');
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete member');
    }
  };

  const addFunds = async (memberId: string, amount: number, description: string, date?: string) => {
    if (!club) throw new Error('No club selected');
    try {
      const member = members.find(m => m.id === memberId);
      if (!member) throw new Error('Member not found');

      const newBalance = member.balance + amount;
      await updateMember(memberId, { balance: newBalance });

      await supabase.from('transactions').insert([{
        club_id: club.id,
        type: 'deposit',
        amount,
        member_id: memberId,
        description,
        date: date || new Date().toISOString().split('T')[0],
      }]);

      return newBalance;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add funds');
    }
  };

  const deductFunds = async (memberId: string, amount: number, description: string, matchId?: string) => {
    if (!club) throw new Error('No club selected');
    try {
      const member = members.find(m => m.id === memberId);
      if (!member) throw new Error('Member not found');

      const newBalance = member.balance - amount;
      await updateMember(memberId, { balance: newBalance });

      await supabase.from('transactions').insert([{
        club_id: club.id,
        type: 'match_fee',
        amount: -amount,
        member_id: memberId,
        match_id: matchId || null,
        description,
      }]);

      return newBalance;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to deduct funds');
    }
  };

  const uploadAvatar = async (memberId: string, file: File) => {
    try {
      const member = members.find(m => m.id === memberId);
      if (!member) throw new Error('Member not found');

      const fileExt = file.name.split('.').pop();
      const fileName = `${memberId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      if (member.avatar_url) {
        const oldPath = member.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('avatars').remove([`avatars/${oldPath}`]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateMember(memberId, { avatar_url: publicUrl });
      return publicUrl;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to upload avatar');
    }
  };

  const removeAvatar = async (memberId: string) => {
    try {
      const member = members.find(m => m.id === memberId);
      if (!member) throw new Error('Member not found');

      if (member.avatar_url) {
        const fileName = member.avatar_url.split('/').pop();
        if (fileName) {
          await supabase.storage.from('avatars').remove([`avatars/${fileName}`]);
        }
      }

      await updateMember(memberId, { avatar_url: null });
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to remove avatar');
    }
  };

  return {
    members,
    loading,
    error,
    fetchMembers,
    addMember,
    updateMember,
    deleteMember,
    addFunds,
    deductFunds,
    uploadAvatar,
    removeAvatar,
  };
}
