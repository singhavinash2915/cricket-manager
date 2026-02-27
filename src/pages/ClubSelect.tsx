import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useClub } from '../context/ClubContext';
import type { Club } from '../types';
import { Building2, MapPin, ChevronRight, Search, Shield } from 'lucide-react';
import { usePlatformSettings } from '../hooks/usePlatformSettings';

export function ClubSelect() {
  const { selectClub } = useClub();
  const { settings } = usePlatformSettings();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const { data, error } = await supabase
          .from('clubs')
          .select('*')
          .neq('subscription_status', 'expired')
          .order('name');

        if (error) throw error;
        setClubs(data || []);
      } catch (err) {
        console.error('Failed to fetch clubs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(search.toLowerCase()) ||
    club.short_name.toLowerCase().includes(search.toLowerCase()) ||
    (club.location && club.location.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold">CricMates</h1>
          </div>
          <p className="text-primary-100 text-lg">
            Select your club to get started
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search clubs by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300 shadow-lg text-lg"
          />
        </div>
      </div>

      {/* Club List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {filteredClubs.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400">
              {search ? 'No clubs found' : 'No clubs available'}
            </h3>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              {search ? 'Try a different search term' : 'Contact the administrator to register your club'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredClubs.map((club, index) => (
              <button
                key={club.id}
                onClick={() => selectClub(club.id)}
                className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:scale-[1.01] hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 text-left group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
              >
                <div className="flex items-center gap-4">
                  {/* Club Logo / Color Badge */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-md"
                    style={{ backgroundColor: club.primary_color || '#10b981' }}
                  >
                    {club.logo_url ? (
                      <img src={club.logo_url} alt={club.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      club.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  {/* Club Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                      {club.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      {club.location && (
                        <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="w-3.5 h-3.5" />
                          {club.location}
                        </span>
                      )}
                      {club.season && (
                        <span className="text-sm text-gray-400 dark:text-gray-500">
                          Season {club.season}
                        </span>
                      )}
                    </div>
                    {club.subscription_status === 'trial' && (
                      <span className="inline-flex items-center mt-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800">
                        Free Trial
                      </span>
                    )}
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-400 dark:text-gray-500 space-y-2">
          <p>Want to register your cricket club?</p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="pricing"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              View Pricing
            </a>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <a
              href={`https://wa.me/${settings.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              Contact us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
