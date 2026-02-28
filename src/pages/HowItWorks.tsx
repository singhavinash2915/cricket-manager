import { useState } from 'react';
import {
  ArrowRight, Users, CalendarDays, CreditCard, Trophy, BarChart3,
  MessageCircle, Shield, CheckCircle, ChevronDown, ChevronUp,
  UserPlus, Lock, Smartphone, Globe, Star, FileText, Camera,
  Wallet, Bell, ClipboardList, Settings, Heart
} from 'lucide-react';
import { CricMatesLogo } from '../components/CricMatesLogo';
import { usePlatformSettings } from '../hooks/usePlatformSettings';

const ONBOARDING_STEPS = [
  {
    step: '01',
    title: 'Contact Us on WhatsApp',
    description: 'Reach out to us with your club name, location, and contact number. We\'ll set up your club on CricMates within minutes.',
    info: ['Club Name', 'Club Location', 'Contact Number', 'Admin\'s Name'],
    color: 'from-emerald-500 to-teal-500',
    icon: MessageCircle,
  },
  {
    step: '02',
    title: 'We Create Your Club',
    description: 'Our team sets up your club with a custom subdomain (yourclub.cricmates.in), brand colors, and admin access. You get a 15-day free trial.',
    info: ['Custom Subdomain', 'Brand Colors', 'Admin Password', '15-Day Free Trial'],
    color: 'from-blue-500 to-indigo-500',
    icon: Globe,
  },
  {
    step: '03',
    title: 'Admin Sets Up the Club',
    description: 'The club admin logs in, adds all members, configures team names, and sets up the club profile with story and mission.',
    info: ['Add Members', 'Set Team Names', 'Configure Club Profile', 'Set Up Razorpay (Optional)'],
    color: 'from-violet-500 to-purple-500',
    icon: Settings,
  },
  {
    step: '04',
    title: 'Share with Your Team',
    description: 'Share your club\'s subdomain link (yourclub.cricmates.in) with all members. They can view everything — no login needed for viewing.',
    info: ['Share Link via WhatsApp', 'Members Bookmark the URL', 'Works on Any Phone/Device'],
    color: 'from-amber-500 to-orange-500',
    icon: Users,
  },
];

const ADMIN_FEATURES = [
  {
    icon: UserPlus,
    title: 'Add & Manage Members',
    description: 'Add members with their name, phone, email, and birthday. Track their balance, match participation, and activity status.',
    required: ['Full Name'],
    optional: ['Phone Number', 'Email', 'Birthday', 'Initial Balance', 'Profile Photo'],
  },
  {
    icon: CalendarDays,
    title: 'Schedule & Record Matches',
    description: 'Create matches with venue, date, match fee, and expenses. Select players, record scores, and award Man of the Match.',
    required: ['Match Date', 'Venue'],
    optional: ['Opponent Name', 'Match Fee (₹)', 'Ground Cost', 'Other Expenses', 'Match Type (External/Internal)', 'Notes'],
  },
  {
    icon: CreditCard,
    title: 'Manage Finances',
    description: 'Track deposits, match fees, expenses, and refunds. Every transaction is automatically recorded. Add funds to member accounts.',
    required: ['Amount', 'Transaction Type'],
    optional: ['Description', 'Linked Match', 'Linked Member'],
  },
  {
    icon: Trophy,
    title: 'Track Tournaments',
    description: 'Record tournament participation with details like format, entry fee, prize money, and your club\'s final position.',
    required: ['Tournament Name', 'Start Date', 'Venue', 'Format'],
    optional: ['End Date', 'Total Teams', 'Entry Fee', 'Prize Money', 'Result/Position', 'Notes'],
  },
  {
    icon: Camera,
    title: 'Upload Match Photos',
    description: 'Capture memories! Upload match photos with captions. Photos appear in the team carousel on the dashboard.',
    required: ['Photo'],
    optional: ['Caption'],
  },
  {
    icon: Bell,
    title: 'Send WhatsApp Reminders',
    description: 'Send balance reminders and match notifications directly to members via WhatsApp with one click.',
    required: [],
    optional: ['Custom Message'],
  },
];

const MEMBER_ACTIONS = [
  {
    icon: Smartphone,
    title: 'View Dashboard',
    description: 'See club stats, recent matches, Man of the Match, finance overview, and upcoming events at a glance.',
  },
  {
    icon: Users,
    title: 'View Members',
    description: 'See all club members, their balances, match participation count, and contact details.',
  },
  {
    icon: CalendarDays,
    title: 'Check Match Schedule',
    description: 'View upcoming matches, past results, scores, and player participation. Browse the visual calendar.',
  },
  {
    icon: Wallet,
    title: 'Pay Online',
    description: 'Deposit funds into your club balance via Razorpay (UPI, cards, net banking). Balance updates instantly.',
  },
  {
    icon: ClipboardList,
    title: 'Request to Join',
    description: 'New players can submit join requests with their name, phone, experience, and a message. Admin approves or rejects.',
  },
  {
    icon: Heart,
    title: 'Give Feedback',
    description: 'Submit feedback with star ratings. Admin can reply. Helps improve club management.',
  },
];

const MEMBER_JOIN_FIELDS = [
  { field: 'Full Name', required: true, description: 'Your complete name as you want it shown in the club' },
  { field: 'Phone Number', required: false, description: 'Your mobile number for WhatsApp reminders and contact' },
  { field: 'Email Address', required: false, description: 'Email for notifications (optional)' },
  { field: 'Cricket Experience', required: false, description: 'E.g., "5 years, played for college team", "Weekend player"' },
  { field: 'Message', required: false, description: 'Why you want to join this club, any additional info' },
];

export function HowItWorks() {
  const { settings } = usePlatformSettings();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Nav */}
      <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="./">
            <CricMatesLogo size={36} showText textClassName="text-lg text-gray-900 dark:text-gray-100" />
          </a>
          <div className="flex items-center gap-3">
            <a
              href="./pricing"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Pricing
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-violet-600"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-28 text-center">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/20">
            <FileText className="w-4 h-4" />
            Complete Guide
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.1]">
            How CricMates<br />
            <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">Works</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know — from getting your club set up to managing matches, finances, and team members.
          </p>
        </div>
      </section>

      {/* Getting Started Steps */}
      <section className="max-w-5xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-1.5 rounded-full mb-4">
            <Star className="w-4 h-4" /> Getting Started
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
            From Zero to Managing<br />Your Club in 4 Steps
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Setting up your cricket club on CricMates is quick and straightforward. Here's exactly what happens:
          </p>
        </div>

        <div className="space-y-6">
          {ONBOARDING_STEPS.map((step) => (
            <div
              key={step.step}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 md:p-8 hover:shadow-lg hover:shadow-emerald-500/5 transition-all"
            >
              <div className="flex items-start gap-6">
                <div className={`text-5xl font-extrabold bg-gradient-to-br ${step.color} bg-clip-text text-transparent shrink-0 hidden md:block`}>
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center md:hidden`}>
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{step.title}</h3>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{step.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.info.map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 text-sm bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What Information is Needed */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-full mb-4">
              <ClipboardList className="w-4 h-4" /> Information Required
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
              What Information<br />Do You Need to Provide?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Here's everything your club and members need to get started.
            </p>
          </div>

          {/* Club Setup Info */}
          <div className="mb-8">
            <button
              onClick={() => toggleSection('club')}
              className="w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-left hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Club Setup Information</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">What we need to create your club</p>
                  </div>
                </div>
                {openSection === 'club' ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>
            {openSection === 'club' && (
              <div className="bg-white dark:bg-gray-800 rounded-b-2xl border border-t-0 border-gray-200 dark:border-gray-700 p-6 -mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { field: 'Club Name', required: true, example: 'e.g., Pune Warriors Cricket Club' },
                    { field: 'Short Name (for subdomain)', required: true, example: 'e.g., pune-warriors → pune-warriors.cricmates.in' },
                    { field: 'Admin Password', required: true, example: 'For managing members, matches, finances' },
                    { field: 'Location', required: false, example: 'e.g., Pune, Maharashtra' },
                    { field: 'Contact Number', required: false, example: 'Club contact for members' },
                    { field: 'Email', required: false, example: 'Club email for communication' },
                    { field: 'Brand Color', required: false, example: 'Your club\'s primary color (default: green)' },
                    { field: 'Team A & Team B Names', required: false, example: 'For internal practice matches (e.g., Spartans vs Gladiators)' },
                    { field: 'Season', required: false, example: 'e.g., 2025-26' },
                    { field: 'Founded Year', required: false, example: 'e.g., 2020' },
                    { field: 'Instagram URL', required: false, example: 'Your club\'s Instagram page' },
                    { field: 'Razorpay Key ID', required: false, example: 'For online payment collection from members' },
                    { field: 'About Story & Mission', required: false, example: 'Displayed on your club\'s About page' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        item.required
                          ? 'bg-red-100 dark:bg-red-900/30'
                          : 'bg-gray-100 dark:bg-gray-600'
                      }`}>
                        {item.required ? (
                          <span className="text-red-500 text-xs font-bold">*</span>
                        ) : (
                          <CheckCircle className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                          {item.field}
                          {item.required && <span className="text-red-500 ml-1">Required</span>}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.example}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Member Info */}
          <div className="mb-8">
            <button
              onClick={() => toggleSection('member')}
              className="w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-left hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Member Information</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">What's needed for each club member</p>
                  </div>
                </div>
                {openSection === 'member' ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>
            {openSection === 'member' && (
              <div className="bg-white dark:bg-gray-800 rounded-b-2xl border border-t-0 border-gray-200 dark:border-gray-700 p-6 -mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Admin adds members through the Members page. Only the name is mandatory — everything else is optional.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { field: 'Full Name', required: true, example: 'Member\'s complete name' },
                    { field: 'Phone Number', required: false, example: 'For WhatsApp reminders and contact' },
                    { field: 'Email Address', required: false, example: 'For notifications' },
                    { field: 'Birthday', required: false, example: 'Club sends birthday wishes' },
                    { field: 'Initial Balance (₹)', required: false, example: 'Starting account balance (default: ₹0)' },
                    { field: 'Profile Photo', required: false, example: 'Upload a photo for the member card' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        item.required
                          ? 'bg-red-100 dark:bg-red-900/30'
                          : 'bg-gray-100 dark:bg-gray-600'
                      }`}>
                        {item.required ? (
                          <span className="text-red-500 text-xs font-bold">*</span>
                        ) : (
                          <CheckCircle className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                          {item.field}
                          {item.required && <span className="text-red-500 ml-1">Required</span>}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.example}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Join Request Info */}
          <div>
            <button
              onClick={() => toggleSection('join')}
              className="w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-left hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Join Request (for new players)</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">What new players submit to join the club</p>
                  </div>
                </div>
                {openSection === 'join' ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>
            {openSection === 'join' && (
              <div className="bg-white dark:bg-gray-800 rounded-b-2xl border border-t-0 border-gray-200 dark:border-gray-700 p-6 -mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  New players can submit a join request through the Requests page. The admin reviews and approves or rejects each request.
                </p>
                <div className="space-y-3">
                  {MEMBER_JOIN_FIELDS.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        item.required
                          ? 'bg-red-100 dark:bg-red-900/30'
                          : 'bg-gray-100 dark:bg-gray-600'
                      }`}>
                        {item.required ? (
                          <span className="text-red-500 text-xs font-bold">*</span>
                        ) : (
                          <CheckCircle className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                          {item.field}
                          {item.required && <span className="text-red-500 ml-1">Required</span>}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Admin vs Member */}
      <section className="max-w-5xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-4 py-1.5 rounded-full mb-4">
            <Lock className="w-4 h-4" /> Roles
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
            Admin vs Member<br />— Who Can Do What?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Each club has one admin password. Members can view everything. Admins can manage everything.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Admin */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 rounded-2xl border border-violet-200 dark:border-violet-800 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Club Admin</h3>
                <p className="text-sm text-violet-600 dark:text-violet-400">Password protected</p>
              </div>
            </div>
            <div className="space-y-3">
              {ADMIN_FEATURES.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <feature.icon className="w-5 h-5 text-violet-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{feature.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-violet-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Export Data</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Download complete club data as JSON or CSV for backup and analysis.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-violet-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Reply to Feedback</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">View and respond to member feedback with written replies.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Club Members</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">No login needed</p>
              </div>
            </div>
            <div className="space-y-3">
              {MEMBER_ACTIONS.map((action, i) => (
                <div key={i} className="flex items-start gap-3">
                  <action.icon className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{action.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How Finances Work */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-1.5 rounded-full mb-4">
              <Wallet className="w-4 h-4" /> Finance System
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
              How Money Management Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Member Balance',
                icon: Wallet,
                color: 'from-emerald-500 to-teal-500',
                items: [
                  'Each member has a balance account (starting at ₹0)',
                  'Admin adds funds when members pay (deposit)',
                  'Match fees are auto-deducted from balance',
                  'Low balance alerts shown on dashboard (< ₹1,000)',
                  'Critical balance warning (< ₹500)',
                ],
              },
              {
                title: 'Match Fees',
                icon: CalendarDays,
                color: 'from-blue-500 to-indigo-500',
                items: [
                  'Admin sets fee per match (e.g., ₹200)',
                  'Ground cost and other expenses tracked separately',
                  'Auto-deduct from player balance (optional)',
                  'Every deduction recorded as a transaction',
                  'Fee split equally among all players',
                ],
              },
              {
                title: 'Online Payments',
                icon: CreditCard,
                color: 'from-violet-500 to-purple-500',
                items: [
                  'Members deposit via Razorpay (UPI, card, net banking)',
                  'Club sets up their own Razorpay account',
                  'Money goes directly to club\'s bank account',
                  'Balance updates instantly after payment',
                  'All payment records stored automatically',
                ],
              },
              {
                title: 'Transaction Records',
                icon: FileText,
                color: 'from-amber-500 to-orange-500',
                items: [
                  '4 types: Deposit, Match Fee, Expense, Refund',
                  'Every transaction logged with date and description',
                  'Monthly financial reports available',
                  'Filter and search transactions',
                  'Export as CSV for accounting',
                ],
              },
            ].map((card, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">{card.title}</h3>
                </div>
                <ul className="space-y-2">
                  {card.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Info */}
      <section className="max-w-4xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-4 py-1.5 rounded-full mb-4">
            <CreditCard className="w-4 h-4" /> Subscription
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
            Subscription Plans
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
            <div className="p-8 text-center">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Free Trial</h3>
              <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">15 Days</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Full access to all features</p>
              <p className="text-xs text-gray-400">No payment needed to start</p>
            </div>
            <div className="p-8 text-center bg-emerald-50/50 dark:bg-emerald-900/10">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Monthly</h3>
              <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">₹{settings.pricing.monthly_fee}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Per month</p>
              <p className="text-xs text-gray-400">+ ₹{settings.pricing.setup_fee} one-time setup fee</p>
            </div>
            <div className="p-8 text-center relative">
              <span className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                Save 20%
              </span>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Yearly</h3>
              <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">₹{(settings.pricing.yearly_fee || 4790).toLocaleString()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Per year (₹{Math.round((settings.pricing.yearly_fee || 4790) / 12)}/mo)</p>
              <p className="text-xs text-gray-400">+ ₹{settings.pricing.setup_fee} one-time setup fee</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800 p-6">
          <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-3">How Subscription Works:</h4>
          <ol className="space-y-2 text-sm text-amber-700 dark:text-amber-400">
            <li className="flex items-start gap-2">
              <span className="font-bold shrink-0">1.</span>
              You contact us to start a free 15-day trial — we set up everything.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold shrink-0">2.</span>
              After trial, pay ₹{settings.pricing.setup_fee} one-time setup fee to activate.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold shrink-0">3.</span>
              Then pay ₹{settings.pricing.monthly_fee}/month or ₹{(settings.pricing.yearly_fee || 4790).toLocaleString()}/year to keep using.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold shrink-0">4.</span>
              If subscription expires, your data stays safe — just renew to continue.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold shrink-0">5.</span>
              Pay via WhatsApp/UPI or online through the app. Both options available.
            </li>
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-emerald-100/90 mb-8 max-w-xl mx-auto">
            Start your free 15-day trial today. No payment required. All features included.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent('Hi, I want to start a free trial for my cricket club on CricMates.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-bold py-4 px-10 rounded-2xl hover:bg-emerald-50 transition-all text-lg shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              Start Free Trial
            </a>
            <a
              href="./pricing"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold py-4 px-10 rounded-2xl hover:bg-white/20 transition-all text-lg border border-white/20"
            >
              View Pricing <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <CricMatesLogo size={40} className="justify-center mb-4" showText textClassName="text-xl text-white" />
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
            <a href="./pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
            <a href="./" className="hover:text-emerald-400 transition-colors">Enter App</a>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-800">
            <p className="text-xs text-gray-600">Built with care for cricket lovers across India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
