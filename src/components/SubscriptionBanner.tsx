import { AlertTriangle, Clock } from 'lucide-react';
import { useClub } from '../context/ClubContext';

export function SubscriptionBanner() {
  const { club } = useClub();

  if (!club) return null;

  const { subscription_status, subscription_expires_at } = club;

  if (subscription_status === 'active') return null;

  if (subscription_status === 'trial') {
    const expiresAt = subscription_expires_at ? new Date(subscription_expires_at) : null;
    const now = new Date();
    const daysLeft = expiresAt ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;

    return (
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
        <Clock className="w-4 h-4" />
        <span>Free Trial: {daysLeft} days remaining</span>
        <span className="hidden sm:inline">| Contact admin to activate your subscription</span>
      </div>
    );
  }

  if (subscription_status === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Subscription Expired
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your club's subscription has expired. Please contact the platform administrator to renew your subscription and regain access.
          </p>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Contact Support via WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return null;
}
