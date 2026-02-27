import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { PlatformSettings, PlatformPricing, PlatformContact } from '../types';

const DEFAULT_PRICING: PlatformPricing = {
  setup_fee: 999,
  monthly_fee: 499,
  trial_days: 15,
};

const DEFAULT_CONTACT: PlatformContact = {
  whatsapp: '919876543210',
  email: 'admin@cricmates.in',
};

let cachedSettings: PlatformSettings | null = null;

export function usePlatformSettings() {
  const [settings, setSettings] = useState<PlatformSettings>(
    cachedSettings || { pricing: DEFAULT_PRICING, contact: DEFAULT_CONTACT }
  );
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    if (cachedSettings) return;

    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('platform_settings')
          .select('key, value');

        if (error) throw error;

        const result: PlatformSettings = {
          pricing: DEFAULT_PRICING,
          contact: DEFAULT_CONTACT,
        };

        if (data) {
          for (const row of data) {
            if (row.key === 'pricing') {
              result.pricing = row.value as unknown as PlatformPricing;
            } else if (row.key === 'contact') {
              result.contact = row.value as unknown as PlatformContact;
            }
          }
        }

        cachedSettings = result;
        setSettings(result);
      } catch {
        // Use defaults on error
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return { settings, loading };
}
