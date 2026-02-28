import { useState } from 'react';
import {
  Users, Calendar, Trophy, BarChart3, CreditCard, MessageCircle,
  CalendarDays, Check, ChevronDown, ChevronUp, ArrowRight, Star,
  Smartphone, Globe, Zap
} from 'lucide-react';
import { usePlatformSettings } from '../hooks/usePlatformSettings';
import { CricMatesLogo } from '../components/CricMatesLogo';

const FEATURES = [
  { icon: Users, title: 'Members', description: 'Track members, balances, activity status, and contact details with ease.', color: 'from-blue-500 to-blue-600' },
  { icon: CalendarDays, title: 'Matches', description: 'Schedule matches, record scores, track player stats, and man of the match.', color: 'from-emerald-500 to-emerald-600' },
  { icon: CreditCard, title: 'Finance', description: 'Manage deposits, match fees, expenses, and export financial reports.', color: 'from-violet-500 to-violet-600' },
  { icon: Calendar, title: 'Calendar', description: 'Visual monthly calendar for matches, tournaments, and events.', color: 'from-amber-500 to-amber-600' },
  { icon: Trophy, title: 'Tournaments', description: 'Organize and track tournament participation, stages, and results.', color: 'from-rose-500 to-rose-600' },
  { icon: BarChart3, title: 'Analytics', description: 'Win/loss trends, player performance charts, and financial summaries.', color: 'from-cyan-500 to-cyan-600' },
  { icon: CreditCard, title: 'Payments', description: 'Accept deposits via Razorpay — UPI, cards, net banking.', color: 'from-pink-500 to-pink-600' },
  { icon: MessageCircle, title: 'WhatsApp', description: 'Send match reminders and fee collection messages directly.', color: 'from-green-500 to-green-600' },
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
  'Custom subdomain (yourclub.cricmates.in)',
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
    question: 'What\'s the difference between monthly and yearly plans?',
    answer: 'Both plans include all features. The yearly plan gives you a 20% discount — you pay for 10 months and get 12 months of access. Great for clubs committed for the full season!',
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
    answer: 'Yes! Each club gets a custom subdomain like yourclub.cricmates.in. Your club is automatically loaded when members visit your subdomain.',
  },
];

const STATS = [
  { value: '15', label: 'Day Free Trial' },
  { value: '100%', label: 'Mobile Friendly' },
  { value: '24/7', label: 'Data Access' },
  { value: '0', label: 'Hidden Charges' },
];

export function Pricing() {
  const { settings } = usePlatformSettings();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Nav */}
      <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="./pricing" className="hover:opacity-80 transition-opacity">
            <CricMatesLogo size={36} showText textClassName="text-lg text-gray-900 dark:text-gray-100" />
          </a>
          <div className="flex items-center gap-3">
            <a
              href="./how-it-works"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              How It Works
            </a>
            <a
              href="./"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all"
            >
              Enter App <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500"></div>
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl"></div>

        <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-8 border border-white/20">
            <Zap className="w-4 h-4 text-yellow-300" />
            Trusted by cricket clubs across India
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            Manage Your<br />
            <span className="bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent">Cricket Club</span><br />
            Like a Pro
          </h1>

          <p className="text-lg md:text-xl text-emerald-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Members, matches, finances, tournaments, analytics — everything your cricket club needs, beautifully organized in one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent('Hi, I want to start a free trial for my cricket club on CricMates.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-bold py-4 px-8 rounded-2xl hover:bg-emerald-50 transition-all text-lg shadow-xl shadow-emerald-900/20 hover:shadow-2xl hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              Start Free Trial
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-2xl hover:bg-white/20 transition-all text-lg border border-white/20"
            >
              View Pricing <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            {STATS.map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="text-sm text-emerald-200/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-1.5 rounded-full mb-4">
            <Star className="w-4 h-4" /> Features
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
            Everything You Need to<br />Run Your Club
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            From tracking members to managing finances — all the tools your cricket club needs, accessible from any device.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why CricMates */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-4 py-1.5 rounded-full mb-4">
              <Globe className="w-4 h-4" /> Why CricMates?
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
              Built for Indian Cricket Clubs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Smartphone, title: 'Mobile-First Design', desc: 'Works perfectly on any phone. Your team can access everything on the go — no app download needed.', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
              { icon: Globe, title: 'Custom Subdomain', desc: 'Get your own yourclub.cricmates.in URL. Share it with your team for instant access to your club.', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
              { icon: Zap, title: 'Instant Setup', desc: '15-day free trial with zero setup hassle. We configure everything — just start adding your members.', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-5`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-lg">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-1.5 rounded-full mb-4">
              <CreditCard className="w-4 h-4" /> Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              One plan. All features. No hidden charges.
            </p>

            {/* Billing Cycle Toggle */}
            <div className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mt-8">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all relative ${
                  billingCycle === 'yearly'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Yearly
                <span className="absolute -top-2.5 -right-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  -20%
                </span>
              </button>
            </div>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-emerald-500 p-8 md:p-10 relative shadow-xl shadow-emerald-500/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-6 py-1.5 rounded-full shadow-lg">
                  15-DAY FREE TRIAL
                </span>
              </div>

              <div className="text-center mb-8 mt-2">
                <CricMatesLogo size={48} className="justify-center mb-4" showText textClassName="text-2xl text-gray-900 dark:text-gray-100" />

                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-gray-100">
                    ₹{settings.pricing.setup_fee}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">one-time setup</span>
                </div>

                <div className="flex items-center justify-center gap-2 my-3">
                  <div className="h-px w-8 bg-gray-200 dark:bg-gray-700"></div>
                  <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">PLUS</span>
                  <div className="h-px w-8 bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {billingCycle === 'monthly' ? (
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-extrabold text-emerald-600 dark:text-emerald-400">₹{settings.pricing.monthly_fee}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">/month</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-extrabold text-emerald-600 dark:text-emerald-400">₹{settings.pricing.yearly_fee?.toLocaleString()}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">/year</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <span className="text-sm text-gray-400 line-through">₹{(settings.pricing.monthly_fee * 12).toLocaleString()}</span>
                      <span className="text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-rose-500 px-3 py-1 rounded-full">
                        Save ₹{(settings.pricing.monthly_fee * 12 - (settings.pricing.yearly_fee || 0)).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      That's just ₹{Math.round((settings.pricing.yearly_fee || 0) / 12).toLocaleString()}/month
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                {PLAN_FEATURES.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <a
                  href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent('Hi, I want to start a free trial for my cricket club on CricMates.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-xl text-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Free Trial
                </a>
                <a
                  href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent(
                    billingCycle === 'yearly'
                      ? `Hi, I want to pay the setup fee (₹${settings.pricing.setup_fee}) and subscribe yearly (₹${settings.pricing.yearly_fee?.toLocaleString()}/year) to CricMates for my cricket club.`
                      : `Hi, I want to pay the setup fee (₹${settings.pricing.setup_fee}) and subscribe monthly (₹${settings.pricing.monthly_fee}/month) to CricMates for my cricket club.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold py-4 px-6 rounded-xl transition-all border border-gray-200 dark:border-gray-700"
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
      <section className="bg-gray-50 dark:bg-gray-900 py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-full mb-4">
              <Zap className="w-4 h-4" /> Getting Started
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
              Up & Running in 3 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Contact Us', desc: 'Reach out on WhatsApp to start your 15-day free trial. We\'ll set up your club in minutes.', color: 'from-emerald-500 to-teal-500' },
              { step: '02', title: 'Set Up Your Club', desc: 'Add members, configure team names, set your brand colors. Your admin dashboard is ready.', color: 'from-blue-500 to-indigo-500' },
              { step: '03', title: 'Manage & Grow', desc: 'Track matches, manage finances, collect payments online. Focus on cricket!', color: 'from-violet-500 to-purple-500' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className={`text-6xl font-extrabold bg-gradient-to-br ${item.color} bg-clip-text text-transparent mb-4`}>
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-4 py-1.5 rounded-full mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`bg-white dark:bg-gray-900 rounded-2xl border transition-all ${
                  openFaq === i
                    ? 'border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-500/5'
                    : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-gray-900 dark:text-gray-100 pr-4">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    openFaq === i ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {openFaq === i ? (
                      <ChevronUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to Level Up Your Club?
          </h2>
          <p className="text-lg text-emerald-100/90 mb-8 max-w-xl mx-auto">
            Join cricket clubs across India who trust CricMates to manage their teams.
          </p>
          <a
            href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent('Hi, I want to start a free trial for my cricket club on CricMates.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-bold py-4 px-10 rounded-2xl hover:bg-emerald-50 transition-all text-lg shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            Start Your Free Trial
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <a href="./pricing" className="inline-block hover:opacity-80 transition-opacity">
            <CricMatesLogo size={40} className="justify-center mb-4" showText textClassName="text-xl text-white" />
          </a>
          <p className="text-sm mb-8 text-gray-500">The complete cricket club management platform</p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a
              href={`https://wa.me/${settings.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
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
              href="./how-it-works"
              className="hover:text-emerald-400 transition-colors"
            >
              How It Works
            </a>
            <a
              href="./"
              className="hover:text-emerald-400 transition-colors"
            >
              Enter App
            </a>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-800">
            <p className="text-xs text-gray-600">Built with care for cricket lovers across India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
