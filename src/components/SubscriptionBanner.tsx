import { useState } from 'react';
import { AlertTriangle, Clock, CreditCard, MessageCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useClub } from '../context/ClubContext';
import { usePlatformSettings } from '../hooks/usePlatformSettings';
import { useSubscriptionPayment } from '../hooks/useSubscriptionPayment';

export function SubscriptionBanner() {
  const { club } = useClub();
  const { settings } = usePlatformSettings();
  const { recordManualPayment, loading: paymentLoading } = useSubscriptionPayment();
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  if (!club) return null;

  const { subscription_status, subscription_expires_at, setup_fee_paid } = club;

  if (subscription_status === 'active') return null;

  if (subscription_status === 'trial') {
    const expiresAt = subscription_expires_at ? new Date(subscription_expires_at) : null;
    const now = new Date();
    const daysLeft = expiresAt ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;

    return (
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2 flex-wrap">
        <Clock className="w-4 h-4" />
        <span>Free Trial: {daysLeft} days remaining</span>
        <span className="hidden sm:inline">|</span>
        <a
          href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent(`Hi, I want to activate the subscription for ${club.name}. Club ID: ${club.short_name}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          Subscribe now
        </a>
      </div>
    );
  }

  if (subscription_status === 'expired') {
    const needsSetup = !setup_fee_paid;
    const amount = needsSetup ? settings.pricing.setup_fee : settings.pricing.monthly_fee;
    const paymentType = needsSetup ? 'setup' : 'monthly';
    const whatsappMessage = needsSetup
      ? `Hi, I want to pay the setup fee (₹${settings.pricing.setup_fee}) for ${club.name}. Club ID: ${club.short_name}`
      : `Hi, I want to renew my monthly subscription (₹${settings.pricing.monthly_fee}) for ${club.name}. Club ID: ${club.short_name}`;

    if (paymentStatus === 'success') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {statusMessage}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Continue to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Subscription Expired
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            Your club's subscription has expired. {needsSetup ? 'Pay the one-time setup fee to activate your account.' : 'Renew your monthly subscription to continue.'}
          </p>

          {/* Amount Due */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount Due</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              ₹{amount}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {needsSetup ? 'One-time setup fee' : 'Monthly subscription'}
            </p>
          </div>

          {paymentStatus === 'error' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4">
              <p className="text-sm text-red-600 dark:text-red-400">{statusMessage}</p>
            </div>
          )}

          {/* Payment Options */}
          <div className="space-y-3">
            <a
              href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Pay via WhatsApp / UPI
            </a>

            <button
              onClick={async () => {
                const result = await recordManualPayment(paymentType, 'Self-service payment request');
                if (result.success) {
                  setPaymentStatus('success');
                  setStatusMessage('Your subscription has been activated. Welcome back!');
                } else {
                  setPaymentStatus('error');
                  setStatusMessage(result.message);
                }
              }}
              disabled={paymentLoading}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              {paymentLoading ? 'Processing...' : `Pay ₹${amount} Online`}
            </button>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            Need help? Contact us at {settings.contact.email}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
