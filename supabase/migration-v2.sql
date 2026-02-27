-- ============================================================================
-- Cricket Manager - Migration v2: Subscription & Platform Settings
-- ============================================================================
-- Run this in Supabase SQL Editor if you already have the v1 schema.
-- This adds subscription_orders, platform_settings tables, and setup_fee_paid column.
-- ============================================================================

-- Add setup_fee_paid to clubs
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS setup_fee_paid BOOLEAN DEFAULT FALSE;

-- Subscription Orders table
CREATE TABLE IF NOT EXISTS subscription_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('setup', 'monthly')),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('razorpay', 'manual')),
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed')),
  period_start DATE,
  period_end DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_subscription_orders_club_id ON subscription_orders(club_id);
CREATE INDEX IF NOT EXISTS idx_subscription_orders_status ON subscription_orders(status);

ALTER TABLE subscription_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON subscription_orders FOR ALL USING (true);

-- Platform Settings table
CREATE TABLE IF NOT EXISTS platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON platform_settings FOR ALL USING (true);

-- Seed platform settings
INSERT INTO platform_settings (key, value) VALUES
  ('pricing', '{"setup_fee": 999, "monthly_fee": 499, "trial_days": 15}'::jsonb),
  ('contact', '{"whatsapp": "919876543210", "email": "admin@cricketmanager.in"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
