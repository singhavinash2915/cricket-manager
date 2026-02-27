# Cricket Club Manager - Usage Guide

## Table of Contents

1. [Overview](#overview)
2. [Super Admin Guide](#super-admin-guide)
3. [Club Admin Guide](#club-admin-guide)
4. [Regular User Guide](#regular-user-guide)
5. [Subscription & Pricing](#subscription--pricing)

---

## Overview

Cricket Club Manager is a multi-tenant platform where multiple cricket clubs can manage their teams, matches, finances, and more — each in their own isolated portal.

### User Roles

| Role | Access | How to Access |
|------|--------|---------------|
| **Super Admin** | Manages all clubs, subscriptions, and payments across the platform | Visit `/super-admin` and enter the Super Admin password |
| **Club Admin** | Manages their own club's members, matches, finances, settings | Click "Admin Login" in the sidebar and enter the club's admin password |
| **Regular User** | Views club data, submits join requests, gives feedback, makes payments | Select a club from the home page — no login required |

---

## Super Admin Guide

**Access:** Navigate to `/super-admin` and enter the Super Admin password.

### Dashboard Overview

The Super Admin dashboard shows platform-wide statistics:

- **Total Clubs** — Number of clubs registered on the platform
- **Active** — Clubs with active subscriptions
- **Trial** — Clubs currently on free trial
- **Expired** — Clubs whose subscriptions have expired
- **Revenue** — Total revenue from subscription payments

An **"Expiring Soon"** alert appears when any club's subscription expires within 7 days.

### Creating a New Club

1. Click the **"Add Club"** button
2. Fill in the club details:
   - **Club Name** — Full name (e.g., "Pune Warriors Cricket Club")
   - **Short Name** — Abbreviation used as identifier (e.g., "PWCC") — must be unique
   - **Location** — City or area
   - **Season** — Current season label (e.g., "2026")
   - **Team A / Team B Names** — Names for internal match teams
   - **Admin Password** — The club admin will use this to log in
   - **Primary Color** — Branding color for the club's portal
   - **Contact Info** — Phone, email, Instagram URL
   - **About & Mission** — Club description shown on the About page
   - **Razorpay Key ID & Payment Link** — For the club's own payment collection (member deposits)
   - **Subscription Status** — Set to "Trial" for new clubs (auto-expires in 15 days)
3. Click **Save** to create the club

### Managing Subscriptions

**For Trial/Expired Clubs:**
- Click **"Record Payment"** on the club card
- Select payment type:
  - **Setup Fee (Rs.999)** — One-time activation fee (for new clubs)
  - **Monthly (Rs.499)** — Monthly renewal
- Add notes (UPI reference, bank transfer ID, etc.)
- Click Submit — the club becomes active for 30 days

**For Active Clubs:**
- Click **"Extend"** to add 30 more days to the subscription
- The new expiry date is shown on the club card

### Viewing a Club's Portal

- Click the **eye icon** on any club card to open that club's portal in a new tab
- This lets you preview exactly what the club admin and users see

### Payment History

- Switch to the **"Payments"** tab to view all subscription payments
- See payment type, amount, method (Razorpay/Manual), status, and date
- Filter and track revenue across all clubs

### Editing / Deleting a Club

- Click **Edit** on any club card to modify its details
- Click **Delete** to permanently remove a club and all its data (use with caution)

---

## Club Admin Guide

**Access:** Open your club's portal, then click **"Admin Login"** at the bottom of the sidebar. Enter your club's admin password (provided by the Super Admin).

When logged in as admin, you'll see:
- Additional menu items: **Requests** and **Settings**
- Edit/Delete buttons on members, matches, tournaments, etc.
- Financial management controls

### Members Management

**Adding a Member:**
1. Go to **Members** page
2. Click **"Add Member"**
3. Enter: Name, Phone, Email (optional), Birthday (optional)
4. The member is created with Rs.0 balance

**Editing a Member:**
- Click on a member card to view details
- Click **Edit** to modify name, phone, email, birthday
- Upload or change the member's avatar photo

**Managing Balances:**
- Click **"Add Funds"** on a member to manually add balance
- View transaction history per member
- Use the **balance filters** (Low < Rs.1000, Critical < Rs.500) to identify members who need to deposit

**WhatsApp Reminders:**
- Click **"Send Reminders"** to generate WhatsApp messages for members with low balance
- Pre-filled messages include the member's name and outstanding amount

### Matches Management

**Creating a Match:**
1. Go to **Matches** page
2. Click **"Add Match"**
3. Fill in:
   - Match type: **External** (vs another team) or **Internal** (Team A vs Team B)
   - Opponent name, venue, date and time
   - Match fee per player, ground cost
4. After the match, edit it to add:
   - Result (Won/Lost/Draw)
   - Scores
   - Man of the Match
   - Match photos

**Match Fees:**
- When you record a result, match fees are automatically deducted from participating members' balances
- Ground costs are recorded as club expenses

**Match Photos:**
- Click **"Add Photo"** to upload match images with captions
- Photos are stored in the cloud and visible to all users

### Tournaments

**Creating a Tournament:**
1. Go to **Tournaments** page
2. Click **"Add Tournament"**
3. Enter: Name, format (T20/ODI/T10/Tennis Ball/Other), dates, status
4. Link matches to tournament stages (Group, League, QF, SF, Final)
5. Record final results: Winner, Runner-up, etc.

### Finance

**Viewing Finances:**
- **Transactions tab** — All deposits, fees, expenses, and refunds
- **Monthly Reports** — Month-by-month breakdown of income vs expenses
- **Financial Reports** — Detailed analytics

**Adding Expenses:**
- Click **"Add Expense"** to record club expenditures (equipment, venue bookings, etc.)
- Expenses are tracked separately from match-related costs

### Requests (Join Requests)

- New users can submit join requests from the club portal
- A **red badge** on the Requests menu shows pending count
- **Approve** — Creates a new member from the request
- **Reject** — Declines the request

### Settings

- View club configuration
- Export club data (JSON/CSV format)
- Admin logout

### Feedback

- View member feedback with star ratings
- Reply to feedback
- Delete inappropriate feedback

---

## Regular User Guide

Regular users can access any club's portal without a password. Here's what's available:

### Dashboard
- View club statistics: total members, total funds, matches played, win rate
- See the latest Man of the Match
- View match results, top contributors, and upcoming events

### Members
- Browse the member directory
- See member profiles, stats, and participation history

### Matches
- View upcoming and completed matches
- See match details: scores, results, photos, man of the match

### Tournaments
- Browse tournament history and current tournaments
- View brackets, stages, and results

### Finance
- View financial summaries and monthly reports

### Calendar
- Monthly calendar view showing all matches
- Click any date to see matches scheduled on that day

### Analytics
- Club performance stats: win rate, recent form, monthly trends
- Top players by participation

### Pay Online
- Make balance deposits via Razorpay (UPI, Card, Net Banking)
- Select your name, enter amount, and pay securely
- Balance updates automatically after successful payment

### Join Request
- New players can submit a request to join the club
- Provide: Name, Phone, Email, Cricket Experience, and a message
- The club admin will review and approve/reject

### Feedback
- Submit feedback with a 1-5 star rating
- View admin responses to your feedback

### About
- Club story, mission, contact information
- Active member count and match statistics

---

## Subscription & Pricing

### Plans

| | Details |
|---|---|
| **Free Trial** | 15 days, all features included |
| **Setup Fee** | Rs.999 one-time (to activate after trial) |
| **Monthly Fee** | Rs.499/month (for continued access) |

### Subscription Lifecycle

```
1. Super Admin creates club → Trial (15 days)
2. Club uses all features during trial
3. Trial expires → App shows "Pay to Continue" screen
4. Club pays Rs.999 setup fee → Activated for 30 days
5. After 30 days → Expires → Club pays Rs.499 monthly
6. Cycle continues monthly
```

### What Happens When Subscription Expires?

- The app shows a full-screen "Subscription Expired" message
- Club data is **preserved** (nothing is deleted)
- Two options to reactivate:
  - **Pay Online** via Razorpay
  - **Pay via WhatsApp/UPI** — contact the platform admin
- Once payment is recorded, the club is reactivated for 30 days

### Trial Banner

During the free trial, a banner at the top shows:
- Days remaining in the trial
- A "Subscribe now" link to contact the platform admin

---

## Quick Reference

| Action | Who Can Do It | Where |
|--------|---------------|-------|
| Create a club | Super Admin | `/super-admin` |
| Record subscription payment | Super Admin | `/super-admin` → Record Payment |
| Add members | Club Admin | Members page |
| Create matches | Club Admin | Matches page |
| Add expenses | Club Admin | Finance page |
| Approve join requests | Club Admin | Requests page |
| Make online payment | Any user | Pay Online page |
| Submit feedback | Any user | Feedback page |
| Submit join request | Any user | Members page |
| View dashboard | Any user | Home page |

---

## Need Help?

- **WhatsApp:** Contact the platform admin via the links provided in the app
- **Email:** Available on the About page and subscription screens
