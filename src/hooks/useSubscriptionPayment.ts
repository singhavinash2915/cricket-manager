import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useClub } from '../context/ClubContext';
import { usePlatformSettings } from './usePlatformSettings';

interface PaymentResult {
  success: boolean;
  message: string;
}

export function useSubscriptionPayment() {
  const { club, refreshClub } = useClub();
  const { settings } = usePlatformSettings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recordManualPayment = async (
    type: 'setup' | 'monthly',
    notes: string
  ): Promise<PaymentResult> => {
    if (!club) return { success: false, message: 'No club selected' };

    setLoading(true);
    setError(null);

    try {
      const amount = type === 'setup' ? settings.pricing.setup_fee : settings.pricing.monthly_fee;
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setDate(periodEnd.getDate() + 30);

      // Insert subscription order
      const { error: insertError } = await supabase
        .from('subscription_orders')
        .insert({
          club_id: club.id,
          type,
          amount,
          payment_method: 'manual',
          status: 'paid',
          period_start: now.toISOString().split('T')[0],
          period_end: periodEnd.toISOString().split('T')[0],
          notes,
          paid_at: now.toISOString(),
        });

      if (insertError) throw insertError;

      // Update club subscription
      const updateData: Record<string, unknown> = {
        subscription_status: 'active',
        subscription_expires_at: periodEnd.toISOString(),
      };
      if (type === 'setup') {
        updateData.setup_fee_paid = true;
      }

      const { error: updateError } = await supabase
        .from('clubs')
        .update(updateData)
        .eq('id', club.id);

      if (updateError) throw updateError;

      await refreshClub();
      setLoading(false);
      return { success: true, message: 'Payment recorded successfully' };
    } catch (err) {
      setLoading(false);
      const message = err instanceof Error ? err.message : 'Failed to record payment';
      setError(message);
      return { success: false, message };
    }
  };

  const getSubscriptionOrders = async () => {
    if (!club) return [];

    const { data, error } = await supabase
      .from('subscription_orders')
      .select('*')
      .eq('club_id', club.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  const getAllSubscriptionOrders = async () => {
    const { data, error } = await supabase
      .from('subscription_orders')
      .select('*, club:clubs(id, name, short_name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  return {
    recordManualPayment,
    getSubscriptionOrders,
    getAllSubscriptionOrders,
    loading,
    error,
  };
}
