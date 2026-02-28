import { useState, useEffect, useCallback } from 'react';
import { supabase, SUPER_ADMIN_PASSWORD } from '../lib/supabase';
import type { Club, SubscriptionOrder } from '../types';
import { Button } from '../components/ui/Button';
import { Input, TextArea, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import {
  Shield, Plus, Users, MapPin, Edit, Trash2, Lock, LogOut,
  CheckCircle, XCircle, Clock, Eye, DollarSign, CalendarPlus,
  Receipt, AlertCircle, Upload, X, TrendingUp, CreditCard,
  Globe, Search, ChevronRight, Zap, IndianRupee
} from 'lucide-react';
import { CricMatesLogo } from '../components/CricMatesLogo';

interface ClubWithStats extends Club {
  member_count?: number;
}

export function SuperAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    localStorage.getItem('cm-superadmin') === 'true'
  );
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [clubs, setClubs] = useState<ClubWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [activeTab, setActiveTab] = useState<'clubs' | 'payments'>('clubs');
  const [subscriptionOrders, setSubscriptionOrders] = useState<(SubscriptionOrder & { club?: { name: string; short_name: string } })[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'trial' | 'expired'>('all');

  // Payment modal state
  const [paymentClub, setPaymentClub] = useState<Club | null>(null);
  const [selectedPayments, setSelectedPayments] = useState<Set<'setup' | 'monthly' | 'yearly'>>(new Set());
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Logo upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    short_name: '',
    primary_color: '#10b981',
    phone: '',
    email: '',
    instagram_url: '',
    location: '',
    founded_year: '',
    season: '',
    team_a_name: 'Team A',
    team_b_name: 'Team B',
    admin_password_hash: '',
    razorpay_key_id: '',
    payment_link: '',
    subscription_status: 'trial' as 'active' | 'trial' | 'expired',
    about_story: '',
    about_mission: '',
    logo_url: '' as string,
  });

  const resetForm = () => {
    setForm({
      name: '', short_name: '', primary_color: '#10b981', phone: '', email: '',
      instagram_url: '', location: '', founded_year: '', season: '',
      team_a_name: 'Team A', team_b_name: 'Team B', admin_password_hash: '',
      razorpay_key_id: '', payment_link: '',
      subscription_status: 'trial', about_story: '', about_mission: '',
      logo_url: '',
    });
    setLogoFile(null);
    setLogoPreview(null);
  };

  const fetchClubs = useCallback(async () => {
    try {
      setLoading(true);
      const { data: clubsData, error } = await supabase
        .from('clubs')
        .select('*')
        .order('name');

      if (error) throw error;

      const clubsWithStats: ClubWithStats[] = [];
      for (const club of clubsData || []) {
        const { count } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true })
          .eq('club_id', club.id);

        clubsWithStats.push({ ...club, member_count: count || 0 });
      }

      setClubs(clubsWithStats);
    } catch (err) {
      console.error('Failed to fetch clubs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubscriptionOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      const { data, error } = await supabase
        .from('subscription_orders')
        .select('*, club:clubs(name, short_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptionOrders(data || []);
    } catch (err) {
      console.error('Failed to fetch subscription orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchClubs();
      fetchSubscriptionOrders();
    }
  }, [isAuthenticated, fetchClubs, fetchSubscriptionOrders]);

  const handleLogin = () => {
    if (password === SUPER_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('cm-superadmin', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('cm-superadmin');
  };

  const uploadLogo = async (file: File, shortName: string): Promise<string> => {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const filePath = `logos/${shortName}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('club-logos')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('club-logos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAddClub = async () => {
    try {
      const shortName = form.short_name.toLowerCase().replace(/\s+/g, '-');

      let logoUrl: string | null = null;
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile, shortName);
      }

      const clubData = {
        name: form.name,
        short_name: shortName,
        primary_color: form.primary_color,
        phone: form.phone || null,
        email: form.email || null,
        instagram_url: form.instagram_url || null,
        location: form.location || null,
        founded_year: form.founded_year ? parseInt(form.founded_year) : null,
        season: form.season || null,
        team_a_name: form.team_a_name || 'Team A',
        team_b_name: form.team_b_name || 'Team B',
        admin_password_hash: form.admin_password_hash,
        razorpay_key_id: form.razorpay_key_id || null,
        payment_link: form.payment_link || null,
        subscription_status: form.subscription_status,
        subscription_expires_at: form.subscription_status === 'trial'
          ? new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
          : form.subscription_status === 'active'
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : null,
        about_story: form.about_story || null,
        about_mission: form.about_mission || null,
        logo_url: logoUrl,
      };

      const { error } = await supabase.from('clubs').insert([clubData]);
      if (error) throw error;

      setShowAddModal(false);
      resetForm();
      await fetchClubs();
    } catch (err) {
      console.error('Failed to add club:', err);
      alert(`Failed to add club: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleUpdateClub = async () => {
    if (!editingClub) return;
    try {
      const shortName = form.short_name.toLowerCase().replace(/\s+/g, '-');

      let logoUrl: string | null | undefined = undefined;
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile, shortName);
      } else if (!form.logo_url && editingClub.logo_url) {
        logoUrl = null;
      }

      const updates: Record<string, unknown> = {
        name: form.name,
        short_name: shortName,
        primary_color: form.primary_color,
        phone: form.phone || null,
        email: form.email || null,
        instagram_url: form.instagram_url || null,
        location: form.location || null,
        founded_year: form.founded_year ? parseInt(form.founded_year) : null,
        season: form.season || null,
        team_a_name: form.team_a_name || 'Team A',
        team_b_name: form.team_b_name || 'Team B',
        razorpay_key_id: form.razorpay_key_id || null,
        payment_link: form.payment_link || null,
        subscription_status: form.subscription_status,
        about_story: form.about_story || null,
        about_mission: form.about_mission || null,
      };

      if (logoUrl !== undefined) {
        updates.logo_url = logoUrl;
      }

      if (form.admin_password_hash) {
        updates.admin_password_hash = form.admin_password_hash;
      }

      const { error } = await supabase
        .from('clubs')
        .update(updates)
        .eq('id', editingClub.id);

      if (error) throw error;

      setEditingClub(null);
      resetForm();
      await fetchClubs();
    } catch (err) {
      console.error('Failed to update club:', err);
      alert(`Failed to update club: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDeleteClub = async (clubId: string, clubName: string) => {
    if (!confirm(`Are you sure you want to delete "${clubName}"? This will delete ALL data for this club including members, matches, and transactions. This action cannot be undone.`)) {
      return;
    }
    try {
      const { error } = await supabase.from('clubs').delete().eq('id', clubId);
      if (error) throw error;
      await fetchClubs();
    } catch (err) {
      console.error('Failed to delete club:', err);
    }
  };

  const handleExtendSubscription = async (clubId: string) => {
    try {
      const club = clubs.find(c => c.id === clubId);
      if (!club) return;

      const currentExpiry = club.subscription_expires_at
        ? new Date(club.subscription_expires_at)
        : new Date();
      const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
      const newExpiry = new Date(baseDate);
      newExpiry.setDate(newExpiry.getDate() + 30);

      const { error } = await supabase
        .from('clubs')
        .update({
          subscription_status: 'active',
          subscription_expires_at: newExpiry.toISOString(),
        })
        .eq('id', clubId);

      if (error) throw error;
      await fetchClubs();
    } catch (err) {
      console.error('Failed to extend subscription:', err);
    }
  };

  const handleRecordPayment = async () => {
    if (!paymentClub || selectedPayments.size === 0) return;

    setPaymentLoading(true);
    try {
      const now = new Date();
      let totalDays = 0;
      let markSetupPaid = false;

      // Process each selected payment type
      for (const type of selectedPayments) {
        const amount = type === 'setup' ? 999 : type === 'yearly' ? 4790 : 499;
        const days = type === 'setup' ? 0 : type === 'yearly' ? 365 : 30;
        totalDays += days;

        if (type === 'setup') markSetupPaid = true;

        const periodEnd = new Date(now);
        periodEnd.setDate(periodEnd.getDate() + days);

        const { error: insertError } = await supabase
          .from('subscription_orders')
          .insert({
            club_id: paymentClub.id,
            type,
            amount,
            payment_method: 'manual',
            status: 'paid',
            period_start: now.toISOString().split('T')[0],
            period_end: periodEnd.toISOString().split('T')[0],
            notes: paymentNotes || null,
            paid_at: now.toISOString(),
          });

        if (insertError) throw insertError;
      }

      // Update club subscription
      const updateData: Record<string, unknown> = {};

      if (totalDays > 0) {
        const periodEnd = new Date(now);
        periodEnd.setDate(periodEnd.getDate() + totalDays);
        updateData.subscription_status = 'active';
        updateData.subscription_expires_at = periodEnd.toISOString();
      }

      if (markSetupPaid) {
        updateData.setup_fee_paid = true;
        // If only setup fee (no monthly/yearly), still activate for 30 days
        if (totalDays === 0) {
          const periodEnd = new Date(now);
          periodEnd.setDate(periodEnd.getDate() + 30);
          updateData.subscription_status = 'active';
          updateData.subscription_expires_at = periodEnd.toISOString();
        }
      }

      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from('clubs')
          .update(updateData)
          .eq('id', paymentClub.id);

        if (updateError) throw updateError;
      }

      setPaymentClub(null);
      setPaymentNotes('');
      setSelectedPayments(new Set());
      await fetchClubs();
      await fetchSubscriptionOrders();
    } catch (err) {
      console.error('Failed to record payment:', err);
      alert(`Failed to record payment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setPaymentLoading(false);
    }
  };

  const togglePaymentType = (type: 'setup' | 'monthly' | 'yearly') => {
    setSelectedPayments(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        // Monthly and yearly are mutually exclusive
        if (type === 'monthly') next.delete('yearly');
        if (type === 'yearly') next.delete('monthly');
        next.add(type);
      }
      return next;
    });
  };

  const getSelectedTotal = () => {
    let total = 0;
    if (selectedPayments.has('setup')) total += 999;
    if (selectedPayments.has('monthly')) total += 499;
    if (selectedPayments.has('yearly')) total += 4790;
    return total;
  };

  const openPaymentModal = (club: Club) => {
    setPaymentClub(club);
    // Pre-select based on club state
    const initial = new Set<'setup' | 'monthly' | 'yearly'>();
    if (!club.setup_fee_paid) initial.add('setup');
    initial.add('monthly'); // default to monthly
    setSelectedPayments(initial);
    setPaymentNotes('');
  };

  const openEditModal = (club: Club) => {
    setEditingClub(club);
    setLogoFile(null);
    setLogoPreview(club.logo_url || null);
    setForm({
      name: club.name,
      short_name: club.short_name,
      primary_color: club.primary_color || '#10b981',
      phone: club.phone || '',
      email: club.email || '',
      instagram_url: club.instagram_url || '',
      location: club.location || '',
      founded_year: club.founded_year?.toString() || '',
      season: club.season || '',
      team_a_name: club.team_a_name || 'Team A',
      team_b_name: club.team_b_name || 'Team B',
      admin_password_hash: '',
      razorpay_key_id: club.razorpay_key_id || '',
      payment_link: club.payment_link || '',
      subscription_status: club.subscription_status,
      about_story: club.about_story || '',
      about_mission: club.about_mission || '',
      logo_url: club.logo_url || '',
    });
  };

  const getDaysRemaining = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-sm w-full">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center border border-white/10">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30 rotate-3">
              <Shield className="w-10 h-10 text-white -rotate-3" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-1">Super Admin</h2>
            <p className="text-purple-300/70 mb-8 text-sm">CricMates Platform Control</p>

            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <div className="relative mb-4">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-purple-300/40 focus:border-emerald-400/50 focus:bg-white/10 outline-none transition-all focus:ring-2 focus:ring-emerald-400/20"
                />
              </div>
              {loginError && (
                <p className="text-rose-400 text-sm mb-4 bg-rose-500/10 py-2 rounded-lg">{loginError}</p>
              )}
              <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active': return { label: 'Active', color: 'bg-emerald-500', textColor: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20', icon: CheckCircle };
      case 'trial': return { label: 'Trial', color: 'bg-amber-500', textColor: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20', icon: Clock };
      case 'expired': return { label: 'Expired', color: 'bg-rose-500', textColor: 'text-rose-400', bgColor: 'bg-rose-500/10', borderColor: 'border-rose-500/20', icon: XCircle };
      default: return { label: status, color: 'bg-gray-500', textColor: 'text-gray-400', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/20', icon: Clock };
    }
  };

  const expiringSoonClubs = clubs.filter(c => {
    if (c.subscription_status !== 'active' && c.subscription_status !== 'trial') return false;
    const days = getDaysRemaining(c.subscription_expires_at);
    return days !== null && days <= 7 && days >= 0;
  });

  const totalRevenue = subscriptionOrders
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + o.amount, 0);

  const thisMonthRevenue = subscriptionOrders
    .filter(o => {
      if (o.status !== 'paid') return false;
      const date = new Date(o.created_at);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, o) => sum + o.amount, 0);

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = !searchQuery ||
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.short_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (club.location && club.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || club.subscription_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const clubForm = (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      {/* Club Logo Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Club Logo</label>
        <div className="flex items-center gap-4">
          {logoPreview ? (
            <div className="relative">
              <img src={logoPreview} alt="Logo preview" className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600" />
              <button
                type="button"
                onClick={() => { setLogoFile(null); setLogoPreview(null); setForm({ ...form, logo_url: '' }); }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400">
              <Upload className="w-6 h-6" />
            </div>
          )}
          <div>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              <Upload className="w-4 h-4" />
              {logoPreview ? 'Change Logo' : 'Upload Logo'}
              <input type="file" accept="image/*" onChange={handleLogoSelect} className="hidden" />
            </label>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG or SVG. Recommended: 200x200px</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Club Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Pune Warriors CC" required />
        <Input label="Short Name *" value={form.short_name} onChange={e => setForm({ ...form, short_name: e.target.value })} placeholder="pune-warriors" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Pune, Maharashtra" />
        <Input label="Season" value={form.season} onChange={e => setForm({ ...form, season: e.target.value })} placeholder="2025-26" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
        <Input label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="admin@club.com" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Team A Name" value={form.team_a_name} onChange={e => setForm({ ...form, team_a_name: e.target.value })} placeholder="Spartans" />
        <Input label="Team B Name" value={form.team_b_name} onChange={e => setForm({ ...form, team_b_name: e.target.value })} placeholder="Gladiators" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Primary Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={form.primary_color} onChange={e => setForm({ ...form, primary_color: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer" />
            <input type="text" value={form.primary_color} onChange={e => setForm({ ...form, primary_color: e.target.value })} className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        </div>
        <Input label="Founded Year" type="number" value={form.founded_year} onChange={e => setForm({ ...form, founded_year: e.target.value })} placeholder="2020" />
      </div>
      <Input label={editingClub ? "New Admin Password (leave blank to keep)" : "Admin Password *"} type="password" value={form.admin_password_hash} onChange={e => setForm({ ...form, admin_password_hash: e.target.value })} placeholder="Enter admin password" />
      <Select
        label="Subscription Status"
        value={form.subscription_status}
        onChange={e => setForm({ ...form, subscription_status: e.target.value as 'active' | 'trial' | 'expired' })}
        options={[
          { value: 'trial', label: 'Trial (15 days)' },
          { value: 'active', label: 'Active (30 days)' },
          { value: 'expired', label: 'Expired' },
        ]}
      />
      <Input label="Instagram URL" value={form.instagram_url} onChange={e => setForm({ ...form, instagram_url: e.target.value })} placeholder="https://instagram.com/clubname" />
      <Input label="Payment Link" value={form.payment_link} onChange={e => setForm({ ...form, payment_link: e.target.value })} placeholder="https://yourclub.com/payment" />
      <Input label="Razorpay Key ID" value={form.razorpay_key_id} onChange={e => setForm({ ...form, razorpay_key_id: e.target.value })} placeholder="rzp_live_xxx" />
      <TextArea label="About Story" value={form.about_story} onChange={e => setForm({ ...form, about_story: e.target.value })} placeholder="Club's story..." rows={3} />
      <TextArea label="About Mission" value={form.about_mission} onChange={e => setForm({ ...form, about_mission: e.target.value })} placeholder="Club's mission..." rows={3} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-transparent to-purple-600/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-3">
                <Shield className="w-6 h-6 text-white -rotate-3" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white">CricMates Admin</h1>
                <p className="text-sm text-slate-400">Platform Management Console</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { resetForm(); setShowAddModal(true); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" /> Add Club
              </button>
              <button onClick={handleLogout} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                <LogOut className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: 'Total Clubs', value: clubs.length, icon: Globe, gradient: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-500/20' },
            { label: 'Active', value: clubs.filter(c => c.subscription_status === 'active').length, icon: CheckCircle, gradient: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20' },
            { label: 'Trial', value: clubs.filter(c => c.subscription_status === 'trial').length, icon: Clock, gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/20' },
            { label: 'Expired', value: clubs.filter(c => c.subscription_status === 'expired').length, icon: XCircle, gradient: 'from-rose-500 to-pink-500', shadow: 'shadow-rose-500/20' },
            { label: 'This Month', value: `₹${thisMonthRevenue.toLocaleString()}`, icon: TrendingUp, gradient: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-500/20' },
            { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, gradient: 'from-emerald-500 to-cyan-500', shadow: 'shadow-emerald-500/20' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-4.5 h-4.5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Expiring Soon Alert */}
        {expiringSoonClubs.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-4 mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="font-bold text-amber-300 text-sm">Expiring Soon</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {expiringSoonClubs.map(club => (
                <button
                  key={club.id}
                  onClick={() => openPaymentModal(club)}
                  className="text-sm bg-amber-500/10 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
                >
                  <Clock className="w-3 h-3" />
                  {club.name} — {getDaysRemaining(club.subscription_expires_at)}d left
                  <ChevronRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
            <button
              onClick={() => setActiveTab('clubs')}
              className={`flex items-center gap-2 py-2 px-5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'clubs'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Globe className="w-4 h-4" />
              Clubs ({clubs.length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex items-center gap-2 py-2 px-5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'payments'
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Payments ({subscriptionOrders.length})
            </button>
          </div>

          {activeTab === 'clubs' && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Status filter pills */}
              <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/5">
                {(['all', 'active', 'trial', 'expired'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all capitalize ${
                      statusFilter === status
                        ? status === 'all' ? 'bg-white/10 text-white' :
                          status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                          status === 'trial' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-rose-500/20 text-rose-400'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search clubs..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full sm:w-56 pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Club List Tab */}
        {activeTab === 'clubs' && (
          loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-slate-500 text-sm">Loading clubs...</p>
            </div>
          ) : filteredClubs.length === 0 ? (
            <div className="text-center py-20">
              <Globe className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <h3 className="font-bold text-slate-400 mb-1">{searchQuery ? 'No clubs found' : 'No clubs yet'}</h3>
              <p className="text-slate-600 text-sm">{searchQuery ? 'Try a different search term' : 'Click "Add Club" to get started'}</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredClubs.map(club => {
                const daysLeft = getDaysRemaining(club.subscription_expires_at);
                const statusConfig = getStatusConfig(club.subscription_status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={club.id}
                    className={`group bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all p-5`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 min-w-0">
                        {/* Club logo */}
                        {club.logo_url ? (
                          <img
                            src={club.logo_url}
                            alt={club.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 ring-2 ring-white/10"
                          />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg"
                            style={{ backgroundColor: club.primary_color || '#10b981' }}
                          >
                            {club.name.charAt(0)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-white">{club.name}</h3>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </span>
                            {club.setup_fee_paid && (
                              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                SETUP PAID
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-sm text-slate-500 flex-wrap">
                            {club.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />{club.location}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />{club.member_count} members
                            </span>
                            <span className="text-slate-600 font-mono text-xs">{club.short_name}.cricmates.in</span>
                          </div>
                          {club.subscription_expires_at && (
                            <div className="mt-1.5">
                              {daysLeft !== null && daysLeft > 0 ? (
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all ${daysLeft <= 7 ? 'bg-amber-500' : daysLeft <= 3 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                      style={{ width: `${Math.min(100, (daysLeft / 30) * 100)}%` }}
                                    />
                                  </div>
                                  <span className={`text-xs font-medium ${daysLeft <= 7 ? 'text-amber-400' : 'text-slate-500'}`}>
                                    {daysLeft}d remaining
                                  </span>
                                </div>
                              ) : daysLeft !== null && daysLeft <= 0 ? (
                                <span className="text-xs font-semibold text-rose-400">
                                  Expired {new Date(club.subscription_expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </span>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={`https://${club.short_name}.cricmates.in`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 border border-transparent hover:border-blue-500/30 transition-all"
                          title="Visit site"
                        >
                          <Eye className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                        </a>
                        <button
                          onClick={() => openPaymentModal(club)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 border border-transparent hover:border-emerald-500/30 transition-all"
                          title="Record payment"
                        >
                          <DollarSign className="w-4 h-4 text-slate-500 hover:text-emerald-400" />
                        </button>
                        {club.subscription_status === 'active' && (
                          <button
                            onClick={() => handleExtendSubscription(club.id)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-violet-500/20 border border-transparent hover:border-violet-500/30 transition-all"
                            title="Extend 30 days"
                          >
                            <CalendarPlus className="w-4 h-4 text-slate-500 hover:text-violet-400" />
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(club)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-slate-500 hover:text-white" />
                        </button>
                        <button
                          onClick={() => handleDeleteClub(club.id, club.name)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-slate-500 hover:text-rose-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Payment History Tab */}
        {activeTab === 'payments' && (
          loadingOrders ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-violet-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-slate-500 text-sm">Loading payments...</p>
            </div>
          ) : subscriptionOrders.length === 0 ? (
            <div className="text-center py-20">
              <Receipt className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <h3 className="font-bold text-slate-400 mb-1">No payments yet</h3>
              <p className="text-slate-600 text-sm">Payment records will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {subscriptionOrders.map(order => (
                <div key={order.id} className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/5 p-4 hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        order.status === 'paid'
                          ? 'bg-emerald-500/10 border border-emerald-500/20'
                          : 'bg-white/5 border border-white/10'
                      }`}>
                        {order.status === 'paid' ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Clock className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">
                            {order.club?.name || 'Unknown Club'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            order.type === 'setup'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : order.type === 'yearly'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}>
                            {order.type.toUpperCase()}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            order.payment_method === 'manual'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {order.payment_method === 'manual' ? 'MANUAL' : 'RAZORPAY'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {order.notes && <span className="text-slate-600"> — {order.notes}</span>}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-white">₹{order.amount.toLocaleString()}</p>
                      <p className={`text-[10px] font-bold ${
                        order.status === 'paid' ? 'text-emerald-400' : order.status === 'failed' ? 'text-rose-400' : 'text-slate-500'
                      }`}>
                        {order.status.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>

      {/* Add Club Modal */}
      <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); resetForm(); }} title="Add New Club" size="xl">
        {clubForm}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={() => { setShowAddModal(false); resetForm(); }}>Cancel</Button>
          <Button onClick={handleAddClub} disabled={!form.name || !form.short_name || !form.admin_password_hash}>
            <Plus className="w-4 h-4" /> Add Club
          </Button>
        </div>
      </Modal>

      {/* Edit Club Modal */}
      <Modal isOpen={!!editingClub} onClose={() => { setEditingClub(null); resetForm(); }} title={`Edit: ${editingClub?.name || ''}`} size="xl">
        {clubForm}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={() => { setEditingClub(null); resetForm(); }}>Cancel</Button>
          <Button onClick={handleUpdateClub} disabled={!form.name || !form.short_name}>
            Save Changes
          </Button>
        </div>
      </Modal>

      {/* Record Payment Modal — Multi-select */}
      <Modal isOpen={!!paymentClub} onClose={() => { setPaymentClub(null); setSelectedPayments(new Set()); }} title={`Record Payment`}>
        <div className="space-y-5">
          {/* Club info */}
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3">
            {paymentClub?.logo_url ? (
              <img src={paymentClub.logo_url} alt={paymentClub.name} className="w-10 h-10 rounded-lg object-cover" />
            ) : (
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: paymentClub?.primary_color || '#10b981' }}
              >
                {paymentClub?.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-bold text-gray-900 dark:text-gray-100">{paymentClub?.name}</p>
              <p className="text-xs text-gray-500">{paymentClub?.short_name}.cricmates.in</p>
            </div>
          </div>

          {/* Payment type selection — checkboxes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Payments</label>
            <div className="space-y-2">
              {/* Setup Fee */}
              <button
                onClick={() => togglePaymentType('setup')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  selectedPayments.has('setup')
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                } ${paymentClub?.setup_fee_paid ? 'opacity-50' : ''}`}
                disabled={paymentClub?.setup_fee_paid}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                  selectedPayments.has('setup') ? 'bg-blue-500 border-blue-500' : 'border-gray-300 dark:border-gray-500'
                }`}>
                  {selectedPayments.has('setup') && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">Setup Fee</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">₹999</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {paymentClub?.setup_fee_paid ? 'Already paid' : 'One-time platform activation fee'}
                  </p>
                </div>
              </button>

              {/* Monthly */}
              <button
                onClick={() => togglePaymentType('monthly')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  selectedPayments.has('monthly')
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                  selectedPayments.has('monthly') ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-gray-500'
                }`}>
                  {selectedPayments.has('monthly') && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">Monthly Plan</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">₹499</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">30 days of access</p>
                </div>
              </button>

              {/* Yearly */}
              <button
                onClick={() => togglePaymentType('yearly')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left relative ${
                  selectedPayments.has('yearly')
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                  selectedPayments.has('yearly') ? 'bg-violet-500 border-violet-500' : 'border-gray-300 dark:border-gray-500'
                }`}>
                  {selectedPayments.has('yearly') && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">Yearly Plan</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">₹4,790</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">365 days of access — Save 20%</p>
                </div>
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  BEST VALUE
                </span>
              </button>
            </div>
          </div>

          {/* Total */}
          {selectedPayments.size > 0 && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                    {Array.from(selectedPayments).map(t => t === 'setup' ? 'Setup' : t === 'monthly' ? 'Monthly' : 'Yearly').join(' + ')}
                  </p>
                </div>
                <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  ₹{getSelectedTotal().toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <TextArea
            label="Payment Notes"
            value={paymentNotes}
            onChange={e => setPaymentNotes(e.target.value)}
            placeholder="UPI transaction ID, bank transfer ref, cash receipt..."
            rows={2}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={() => { setPaymentClub(null); setSelectedPayments(new Set()); }}>Cancel</Button>
          <Button onClick={handleRecordPayment} disabled={paymentLoading || selectedPayments.size === 0}>
            {paymentLoading ? 'Processing...' : `Record ₹${getSelectedTotal().toLocaleString()}`}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
