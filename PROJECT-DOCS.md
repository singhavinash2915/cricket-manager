# CricMates - Complete Project Documentation

> Multi-tenant cricket club management SaaS platform built with React 19, TypeScript, Vite 7, Tailwind CSS, and Supabase.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 5.9, React Router v7 |
| Styling | Tailwind CSS (dark mode support) |
| Build | Vite 7 |
| Backend | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| Payments | Razorpay |
| Charts | Recharts |
| Icons | Lucide React |
| Testing | Playwright (E2E) |
| Hosting | Vercel (primary), GitHub Pages (fallback) |
| Domain | cricmates.in with wildcard subdomains (*.cricmates.in) |

---

## Pages & Routes

### Public Routes (No Club Required)
| Route | Page | Description |
|-------|------|-------------|
| `/pricing` | Pricing | Landing page with hero, features grid, pricing card, FAQ, CTA |
| `/how-it-works` | HowItWorks | Onboarding guide with steps, admin vs member comparison |
| `/super-admin` | SuperAdmin | Platform management panel (password-protected) |

### Authenticated Routes (Club Required)
| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Stats cards, photo carousel, recent matches, low balance alerts |
| `/members` | Members | Member list with add/edit/delete, balance management, avatars |
| `/matches` | Matches | Match creation, player selection, scores, Man of Match |
| `/tournaments` | Tournaments | Tournament CRUD, match linking with stage info |
| `/finance` | Finance | Transactions, monthly breakdown, expenses, deposits |
| `/analytics` | Analytics | Win rate charts, player performance, financial summaries |
| `/calendar` | Calendar | Monthly calendar view with match/tournament dates |
| `/payment` | Payment | Razorpay payment form for member deposits |
| `/requests` | Requests | Pending join requests (admin-only) |
| `/settings` | Settings | Admin login, theme toggle, data export (JSON/CSV) |
| `/feedback` | Feedback | Feedback submission and admin replies |
| `/about` | About | Club story, mission, and information |

---

## Database Tables (13 tables)

| Table | Description | Key Fields |
|-------|-------------|------------|
| `clubs` | Club profiles & config | name, short_name, logo_url, primary_color, admin_password_hash, razorpay keys, subscription_status/expires_at |
| `members` | Club members | name, phone, email, balance, status (active/inactive), avatar_url, birthday |
| `matches` | Match records | date, venue, opponent, result, scores, match_fee, match_type (external/internal) |
| `match_players` | Match participation | member_id, match_id, fee_status, team (team_a/team_b) |
| `transactions` | Financial records | type (deposit/match_fee/expense/refund), amount, member_id, match_id |
| `member_requests` | Join requests | name, phone, email, status (pending/approved/rejected) |
| `tournaments` | Tournament details | name, format, status, result, start/end dates |
| `tournament_matches` | Match-tournament mapping | match_id, tournament_id, stage |
| `match_photos` | Photo gallery | match_id, photo_url, caption |
| `feedback` | User feedback | message, admin_reply, is_read |
| `payment_orders` | Member payments (Razorpay) | member_id, amount, status, razorpay_order_id |
| `subscription_orders` | Club subscription payments | club_id, amount, payment_type, payment_method |
| `platform_settings` | Platform-wide config | key, value (pricing, contact info) |

All tables use `club_id` foreign key with CASCADE delete for data isolation.

---

## Features by Area

### Members Management
- Add/edit/delete members with profile details (name, phone, email, birthday)
- Avatar upload (Supabase Storage)
- Balance tracking (auto-calculated from transactions)
- Activity status: active (played in last 10 matches) / inactive
- Member profile view with stats, transaction history, match history tabs
- Search and filter members

### Match Management
- **External matches**: Against other teams (opponent name, scores)
- **Internal matches**: Team A vs Team B (configurable team names per club)
- Player selection (playing XI) from member list
- Score recording and result tracking (won/lost/draw/upcoming/cancelled)
- Man of Match assignment
- Match fee configuration with auto-deduction from balance
- Ground cost and other expenses tracking
- Match photo upload with captions (auto-cleanup: keeps last 5 matches' photos)

### Tournament Tracking
- Formats: T20, ODI, T10, Tennis Ball, Other
- Statuses: Upcoming, Ongoing, Completed
- Results: Winner, Runner-up, Semi-finalist, Quarter-finalist, Group Stage, Participated
- Link matches to tournaments with stage info (Group, Quarter Final, Semi Final, Final, League)

### Finance
- Transaction types: deposit, match_fee, expense, refund
- Monthly breakdown view
- Per-member balance tracking
- Expense tracking (ground costs, other expenses)
- Optional balance deduction per match
- Data export (JSON/CSV)

### Analytics
- Win/loss rate trends
- Player performance stats (matches played, wins, losses)
- Financial summaries (deposits vs expenses)
- Charts via Recharts (Bar, Pie, Responsive containers)

### Calendar
- Monthly calendar view
- Matches and tournaments displayed on dates
- Click date for details
- Navigate between months

### Payment System (Razorpay)
- Members pay deposits via Razorpay (UPI, cards, net banking)
- Club-specific Razorpay keys stored in club record
- Payment verification via Supabase Edge Function
- Auto-updates member balance on success
- Transaction recorded automatically

### Subscription System
- **Trial**: 15 days free for new clubs
- **Setup fee**: ₹999 one-time
- **Monthly**: ₹499/month (30 days)
- **Yearly**: ₹4,790/year (365 days, ~20% discount)
- Auto-expiration check on club load
- Subscription banner (trial countdown / expired lockout)
- Manual payment recording by SuperAdmin
- Payment history tracking

### Member Join Requests
- Public form for potential members to submit join request
- Admin sees pending requests with approve/reject actions
- Approved request auto-creates member record

### Feedback System
- Members submit feedback messages
- Admin can reply to feedback
- Mark as read/resolved

### WhatsApp Integration
- Send match reminders to members
- Fee collection messages
- Direct WhatsApp links in pricing page and footer
- Pre-filled message templates

### Data Export
- JSON export: complete club data with relationships
- CSV export: spreadsheet-compatible for Excel/Google Sheets
- Export from Settings page (admin-only)

---

## Access Levels

### Public (No Login)
- View pricing page, how-it-works page
- Submit join requests
- Make payments (with payment link)

### Member (Club Selected)
- View dashboard, members, matches, tournaments, calendar, analytics
- View match photos
- Submit feedback
- Make deposits via Razorpay

### Admin (Password Protected)
- All member capabilities plus:
- Add/edit/delete members, matches, tournaments
- Manage finances (add deposits, record expenses)
- Approve/reject join requests
- Reply to feedback
- Upload match photos
- Send WhatsApp reminders
- Change admin password
- Export data
- Configure club settings

### SuperAdmin (Master Password)
- Create and manage all clubs
- View/edit all club details
- Manage subscriptions
- Record manual payments
- View platform-wide statistics
- Dark glassmorphism themed dashboard

---

## Architecture

### Club Detection Chain
1. Subdomain matching (`yourclub.cricmates.in` → short_name lookup)
2. URL query parameter (`?club=clubId`)
3. localStorage (`cm-club-id`)

### Admin Authentication
- bcrypt password hashing (with plain-text fallback)
- Per-club admin sessions via localStorage (`cm-admin-{clubId}`)
- No server-side sessions — fully client-side

### Dynamic Branding
- Each club has a `primary_color`
- 10 shade variants generated as CSS custom properties
- Club logo displayed in sidebar
- Club name in page titles

### Dark Mode
- Toggle in header and settings
- Persisted in localStorage (`cm-theme`)
- System preference detection on first load
- Tailwind `dark:` prefix throughout

### Responsive Design
- Desktop: Sidebar + main content
- Mobile: Bottom nav + hamburger menu
- Touch-friendly buttons and inputs
- 100% mobile-friendly

---

## Key Source Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Routing, public routes outside ClubProvider |
| `src/context/ClubContext.tsx` | Subdomain detection, club loading, auto-expiry |
| `src/context/AuthContext.tsx` | Admin auth with bcrypt/plaintext |
| `src/context/ThemeContext.tsx` | Dark mode state and persistence |
| `src/lib/supabase.ts` | Supabase client, super admin password |
| `src/pages/SuperAdmin.tsx` | Platform management (dark glassmorphism) |
| `src/pages/Pricing.tsx` | Public landing page with FAQ |
| `src/pages/HowItWorks.tsx` | Public onboarding guide |
| `src/components/CricMatesLogo.tsx` | Reusable SVG logo |
| `src/hooks/usePlatformSettings.ts` | Platform config with defaults |

### Custom Hooks (14)
| Hook | Purpose |
|------|---------|
| `useMembers` | Member CRUD, avatar management, balance operations |
| `useMatches` | Match CRUD, player management, score recording |
| `useTournaments` | Tournament CRUD, match linking, stats |
| `useTransactions` | Transaction CRUD, financial calculations |
| `useRequests` | Join request management |
| `useFeedback` | Feedback submission and replies |
| `useMatchPhotos` | Photo upload/delete, auto-cleanup |
| `usePayment` | Razorpay payment initiation |
| `usePaymentOrders` | Payment order history |
| `useSubscriptionPayment` | Subscription payment recording |
| `usePlatformSettings` | Platform pricing & contact (cached) |
| `useMemberActivity` | Active member tracking (last 10 matches) |
| `useAnimatedValue` | Counter animations |

---

## E2E Testing (Playwright)

- **16 test suites**, 112 tests covering all app functionality (except Razorpay payments)
- Test data seeded via direct Supabase calls (dedicated test club)
- Auth simulated via localStorage injection
- Cleanup via CASCADE delete of test club

### Test Suites
| Suite | Tests |
|-------|-------|
| public-pages | Pricing page, HowItWorks page, FAQ, footer |
| club-loading | Club selection, URL params, invalid club |
| admin-auth | Login, logout, wrong password, persistence |
| dashboard | Stats, quick actions, recent activity |
| members | List, add, edit, delete, profile, search |
| matches | List, create, edit, scores, photos |
| tournaments | List, create, link matches, standings |
| finance | Overview, deposits, expenses, filters |
| calendar | Monthly view, dates, navigation |
| analytics | Stats table, charts, top performers |
| member-requests | Submit, approve, reject |
| feedback | Submit, admin reply |
| settings | Load, update, password, export |
| subscription-banner | Trial, expired, active states |
| super-admin | Login, CRUD clubs, payments, search |
| navigation | Sidebar, mobile nav, routing |

### Scripts
```bash
npm run test:e2e        # Run all tests
npm run test:e2e:ui     # Playwright UI mode
npm run test:e2e:headed # Run with visible browser
```

---

## CI/CD

- **GitHub Actions**: `.github/workflows/e2e.yml` runs on push/PR to main
- **Vercel**: Primary deployment (cricmates.in)
- **GitHub Pages**: Fallback deployment (/cricket-manager/ base path)

---

## Development Work Log

### Features Built
1. **Core App** - React 19 + Vite 7 + Supabase multi-tenant SaaS
2. **13 Database Tables** with CASCADE delete isolation
3. **Subdomain Routing** (*.cricmates.in)
4. **Admin Authentication** (bcrypt + localStorage)
5. **Dashboard** with stats, photo carousel, recent activity
6. **Members Management** with avatars, balance tracking
7. **Match System** (external + internal matches, playing XI, Man of Match)
8. **Tournament Tracking** with stages and results
9. **Finance Module** with deposits, expenses, exports
10. **Analytics** with Recharts visualizations
11. **Calendar View** with monthly navigation
12. **Razorpay Payment Integration** (member deposits + club subscriptions)
13. **Member Join Requests** with auto-member creation
14. **Feedback System** with admin replies
15. **WhatsApp Integration** for reminders
16. **Data Export** (JSON + CSV)
17. **Dark Mode** with system preference detection
18. **Responsive Design** (mobile-first)
19. **Dynamic Club Branding** (colors + logos)
20. **Pricing Landing Page** with features, FAQ, billing toggle
21. **HowItWorks Page** with onboarding steps
22. **SuperAdmin Dashboard** (dark glassmorphism, multi-select payments)
23. **Subscription Lifecycle** (trial → setup fee → monthly/yearly)
24. **E2E Testing** (Playwright, 16 suites, 112 tests)
25. **GitHub Actions CI** for automated testing
