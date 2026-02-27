import { useState, useEffect, useCallback } from 'react';
import { supabase, SUPER_ADMIN_PASSWORD } from '../lib/supabase';
import type { Club } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, TextArea, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import {
  Shield, Plus, Building2, Users, MapPin, Edit, Trash2, Lock, LogOut,
  CheckCircle, XCircle, Clock, Eye
} from 'lucide-react';

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
  });

  const resetForm = () => {
    setForm({
      name: '', short_name: '', primary_color: '#10b981', phone: '', email: '',
      instagram_url: '', location: '', founded_year: '', season: '',
      team_a_name: 'Team A', team_b_name: 'Team B', admin_password_hash: '',
      razorpay_key_id: '', payment_link: '',
      subscription_status: 'trial', about_story: '', about_mission: '',
    });
  };

  const fetchClubs = useCallback(async () => {
    try {
      setLoading(true);
      const { data: clubsData, error } = await supabase
        .from('clubs')
        .select('*')
        .order('name');

      if (error) throw error;

      // Get member counts for each club
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

  useEffect(() => {
    if (isAuthenticated) fetchClubs();
  }, [isAuthenticated, fetchClubs]);

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

  const handleAddClub = async () => {
    try {
      const clubData = {
        name: form.name,
        short_name: form.short_name.toLowerCase().replace(/\s+/g, '-'),
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
          ? new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()
          : null,
        about_story: form.about_story || null,
        about_mission: form.about_mission || null,
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
      const updates: Record<string, unknown> = {
        name: form.name,
        short_name: form.short_name.toLowerCase().replace(/\s+/g, '-'),
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

      // Only update password if a new one is provided
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

  const toggleSubscription = async (clubId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'expired' : 'active';
    const expiresAt = newStatus === 'active'
      ? new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()
      : null;

    try {
      const { error } = await supabase
        .from('clubs')
        .update({ subscription_status: newStatus, subscription_expires_at: expiresAt })
        .eq('id', clubId);

      if (error) throw error;
      await fetchClubs();
    } catch (err) {
      console.error('Failed to toggle subscription:', err);
    }
  };

  const openEditModal = (club: Club) => {
    setEditingClub(club);
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
    });
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <Card className="max-w-sm w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Super Admin</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Platform administration access</p>

            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <div className="relative mb-4">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              {loginError && (
                <p className="text-red-500 text-sm mb-4">{loginError}</p>
              )}
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'trial': return <Badge variant="warning"><Clock className="w-3 h-3 mr-1" />Trial</Badge>;
      case 'expired': return <Badge variant="danger"><XCircle className="w-3 h-3 mr-1" />Expired</Badge>;
      default: return null;
    }
  };

  const clubForm = (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
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
          { value: 'active', label: 'Active (6 months)' },
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary-400" />
            <div>
              <h1 className="text-xl font-bold">Super Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">Manage all cricket clubs</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={() => { resetForm(); setShowAddModal(true); }}>
              <Plus className="w-4 h-4" /> Add Club
            </Button>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <LogOut className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{clubs.length}</p>
            <p className="text-sm text-gray-500">Total Clubs</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{clubs.filter(c => c.subscription_status === 'active').length}</p>
            <p className="text-sm text-gray-500">Active</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{clubs.filter(c => c.subscription_status === 'trial').length}</p>
            <p className="text-sm text-gray-500">Trial</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{clubs.reduce((sum, c) => sum + (c.member_count || 0), 0)}</p>
            <p className="text-sm text-gray-500">Total Members</p>
          </Card>
        </div>

        {/* Club List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {clubs.map(club => (
              <Card key={club.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                      style={{ backgroundColor: club.primary_color || '#10b981' }}
                    >
                      {club.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">{club.name}</h3>
                        {getStatusBadge(club.subscription_status)}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        {club.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />{club.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />{club.member_count} members
                        </span>
                        <span className="text-gray-400">{club.short_name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/?club=${club.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="View club"
                    >
                      <Eye className="w-4 h-4 text-gray-400" />
                    </a>
                    <button
                      onClick={() => toggleSubscription(club.id, club.subscription_status)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        club.subscription_status === 'active'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                      }`}
                    >
                      {club.subscription_status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => openEditModal(club)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteClub(club.id, club.name)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
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
    </div>
  );
}
