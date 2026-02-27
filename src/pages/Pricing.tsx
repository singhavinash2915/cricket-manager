import { useState } from 'react';
import { 
  Users, Calendar, Trophy, BarChart3, CreditCard, MessageCircle, 
  Shield, CalendarDays, Check, ChevronDown, ChevronUp, ArrowRight
} from 'lucide-react';
import { usePlatformSettings } from '../hooks/usePlatformSettings';

const FEATURES = [
  { icon: Users, title: 'Members Management', description: 'Track members, balances, activity status, and contact details. Add, edit, or deactivate members easily.' },
  { icon: CalendarDays, title: 'Match Tracking', description: 'Schedule matches, record scores, track player participation, assign man of the match, and upload photos.' },
  { icon: CreditCard, title: 'Finance & Accounting', description: 'Manage deposits, match fees, expenses, and refunds. Export financial reports with one click.' },
  { icon: Calendar, title: 'Calendar & Scheduling', description: 'Visual monthly calendar showing upcoming matches, tournaments, and key events at a glance.' },
  { icon: Trophy, title: 'Tournaments', description: 'Organize and track tournament participation, stages, results, and performance history.' },
  { icon: BarChart3, title: 'Analytics & Reports', description: 'Match statistics, win/loss trends, player performance charts, and financial summaries.' },
  { icon: CreditCard, title: 'Online Payments', description: 'Accept member deposits via Razorpay (UPI, cards, net banking). Automated balance updates.' },
  { icon: MessageCircle, title: 'WhatsApp Reminders', description: 'Send match reminders, fee collection messages, and announcements directly via WhatsApp.' },
];

const PLAN_FEATURES = [
  'Unlimited members',
  'Unlimited matches & tournaments',
  'Finance & expense tracking',
  'Online payment collection (Razorpay)',
  'Match photo gallery',
  'Analytics dashboard',
  'WhatsApp reminders',
  'Calendar & scheduling',
  'Member join requests',
  'Feedback system',
  'Custom club branding & colors',
  'Admin access control',
  'Data export (CSV)',
  'Mobile-friendly design',
];

const FAQS = [
  {
    question: 'How does the free trial work?',
    answer: 'You get a full-featured 15-day free trial. No payment required to start. All features are available during the trial period. After 15 days, you can subscribe to continue using the platform.',
  },
  {
    question: 'What happens when my subscription expires?',
    answer: 'Your data is safely stored. You just lose access to the dashboard until you renew. No data is ever deleted — renew anytime to pick up where you left off.',
  },
  {
    question: 'Can I set up my own Razorpay for member payments?',
    answer: 'Yes! Each club can configure their own Razorpay account. Member deposits go directly to your club\'s account. The platform subscription payment is separate.',
  },
  {
    question: 'How many members can I add?',
    answer: 'There are no limits. Add as many members, matches, and transactions as you need. The platform scales with your club.',
  },
  {
    question: 'Is my club data private?',
    answer: 'Absolutely. Each club\'s data is completely isolated. Only your club admin (with the password) can manage your club\'s data. Other clubs cannot see your information.',
  },
  {
    question: 'Can I get a custom domain for my club?',
    answer: 'Custom subdomains (e.g., yourclub.cricketmanager.in) are coming soon. Currently all clubs are accessible via the main platform URL.',
  },
];

export function Pricing() {
  const { settings } = usePlatformSettings();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Nav */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-emerald-500" />
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Cricket Club Manager</span>
          </div>
          <a
            href="./"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
          >
            Enter App <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            Manage Your Cricket Club<br />Like a Pro
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Complete club management platform — members, matches, finances, tournaments, analytics, and online payments. Everything your cricket club needs in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent('Hi, I want to start a free trial for my cricket club on Cricket Club Manager.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-bold py-3 px-8 rounded-xl hover:bg-emerald-50 transition-colors text-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Start Free Trial
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 bg-emerald-700/50 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-700/70 transition-colors text-lg border border-emerald-400/30"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Everything You Need to Run Your Club
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            From tracking members to managing finances — all the tools your cricket club needs, accessible from any device.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all"
            >
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              One plan. All features. No hidden charges.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border-2 border-emerald-500 p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  15-DAY FREE TRIAL
                </span>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Cricket Club Manager</h3>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">₹{settings.pricing.setup_fee}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">one-time setup</span>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-lg text-gray-500 dark:text-gray-400">+</span>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">₹{settings.pricing.monthly_fee}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">/month</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {PLAN_FEATURES.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <a
                  href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent('Hi, I want to start a free trial for my cricket club on Cricket Club Manager.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Free Trial
                </a>
                <a
                  href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent(`Hi, I want to pay the setup fee (₹${settings.pricing.setup_fee}) and subscribe to Cricket Club Manager for my cricket club.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold py-3 px-6 rounded-xl transition-colors border border-gray-200 dark:border-gray-600"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay & Subscribe
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-10 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Contact Us', desc: 'Reach out on WhatsApp to start your 15-day free trial. We\'ll set up your club in minutes.' },
            { step: '2', title: 'Set Up Your Club', desc: 'Add members, configure team names, set your brand colors. Your admin dashboard is ready to go.' },
            { step: '3', title: 'Manage & Grow', desc: 'Track matches, manage finances, collect payments online. Focus on cricket, we handle the rest.' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                {item.step}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-10 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-semibold text-gray-900 dark:text-gray-100 pr-4">{faq.question}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-emerald-400" />
            <span className="text-lg font-bold text-white">Cricket Club Manager</span>
          </div>
          <p className="text-sm mb-6">The complete cricket club management platform</p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a
              href={`https://wa.me/${settings.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <a
              href={`mailto:${settings.contact.email}`}
              className="hover:text-emerald-400 transition-colors"
            >
              {settings.contact.email}
            </a>
            <a
              href="./"
              className="hover:text-emerald-400 transition-colors"
            >
              Enter App
            </a>
          </div>
          <p className="text-xs text-gray-600 mt-8">Built with care for cricket lovers</p>
        </div>
      </footer>
    </div>
  );
}
