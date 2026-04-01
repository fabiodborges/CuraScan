-- WAITIX Database Schema
-- Version 1.0 — Mars 2026

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client', 'waiter')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WAITER PROFILES TABLE
-- ============================================
CREATE TABLE public.waiter_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  is_online BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT FALSE,
  iban TEXT,
  stripe_account_id TEXT,
  kyc_verified BOOLEAN DEFAULT FALSE,
  rating_avg NUMERIC(3,2) DEFAULT 0,
  missions_count INTEGER DEFAULT 0,
  total_earned NUMERIC(10,2) DEFAULT 0,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  last_location_update TIMESTAMPTZ,
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MISSIONS TABLE
-- ============================================
CREATE TABLE public.missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.users(id),
  waiter_id UUID REFERENCES public.users(id),
  location_name TEXT NOT NULL,
  location_address TEXT,
  location_lat NUMERIC(10,7) NOT NULL,
  location_lng NUMERIC(10,7) NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('concert', 'restaurant', 'sneakers', 'ambassade', 'prefecture', 'produit', 'autre')),
  start_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes IN (30, 60, 90, 120, 150, 180, 210, 240)),
  price_client NUMERIC(10,2) NOT NULL,
  price_waiter NUMERIC(10,2) NOT NULL,
  commission NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  waiter_position INTEGER,
  client_rating INTEGER CHECK (client_rating >= 1 AND client_rating <= 5),
  client_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- ============================================
-- MESSAGES TABLE (Chat)
-- ============================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES public.missions(id),
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  amount_client NUMERIC(10,2) NOT NULL,
  amount_waiter NUMERIC(10,2) NOT NULL,
  amount_commission NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'authorized', 'captured', 'refunded', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  captured_at TIMESTAMPTZ
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mission_new', 'mission_accepted', 'mission_started', 'mission_completed', 'mission_cancelled', 'payment', 'system')),
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_waiter_profiles_online ON public.waiter_profiles(is_online, is_available);
CREATE INDEX idx_waiter_profiles_location ON public.waiter_profiles(latitude, longitude);
CREATE INDEX idx_missions_client ON public.missions(client_id);
CREATE INDEX idx_missions_waiter ON public.missions(waiter_id);
CREATE INDEX idx_missions_status ON public.missions(status);
CREATE INDEX idx_messages_mission ON public.messages(mission_id);
CREATE INDEX idx_payments_mission ON public.payments(mission_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, read);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- USERS policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Clients can view waiter profiles"
  ON public.users FOR SELECT
  USING (role = 'waiter');

-- WAITER PROFILES policies
CREATE POLICY "Waiter can view and update own profile"
  ON public.waiter_profiles FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view online waiter profiles"
  ON public.waiter_profiles FOR SELECT
  USING (is_online = true AND is_available = true);

-- MISSIONS policies
CREATE POLICY "Clients can create missions"
  ON public.missions FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can view their own missions"
  ON public.missions FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = waiter_id);

CREATE POLICY "Waiters can view pending missions"
  ON public.missions FOR SELECT
  USING (status = 'pending');

CREATE POLICY "Mission participants can update"
  ON public.missions FOR UPDATE
  USING (auth.uid() = client_id OR auth.uid() = waiter_id);

-- MESSAGES policies
CREATE POLICY "Mission participants can view messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.missions
      WHERE missions.id = messages.mission_id
      AND (missions.client_id = auth.uid() OR missions.waiter_id = auth.uid())
    )
  );

CREATE POLICY "Mission participants can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.missions
      WHERE missions.id = messages.mission_id
      AND (missions.client_id = auth.uid() OR missions.waiter_id = auth.uid())
    )
  );

-- PAYMENTS policies
CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.missions
      WHERE missions.id = payments.mission_id
      AND (missions.client_id = auth.uid() OR missions.waiter_id = auth.uid())
    )
  );

-- NOTIFICATIONS policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_waiter_profiles
  BEFORE UPDATE ON public.waiter_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );

  -- If the user is a waiter, create a waiter profile
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'client') = 'waiter' THEN
    INSERT INTO public.waiter_profiles (user_id)
    VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate mission price
CREATE OR REPLACE FUNCTION public.calculate_mission_price(duration_min INTEGER)
RETURNS TABLE(price_client NUMERIC, price_waiter NUMERIC, commission NUMERIC) AS $$
DECLARE
  client_price NUMERIC;
BEGIN
  client_price := CASE duration_min
    WHEN 30 THEN 8.00
    WHEN 60 THEN 15.00
    WHEN 90 THEN 22.00
    WHEN 120 THEN 28.00
    WHEN 150 THEN 35.00
    WHEN 180 THEN 41.00
    WHEN 210 THEN 47.00
    WHEN 240 THEN 53.00
    ELSE 0.00
  END;

  RETURN QUERY SELECT
    client_price,
    ROUND(client_price * 0.80, 2),
    ROUND(client_price * 0.20, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to update waiter stats after mission completion
CREATE OR REPLACE FUNCTION public.update_waiter_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status = 'in_progress' THEN
    UPDATE public.waiter_profiles
    SET
      missions_count = missions_count + 1,
      total_earned = total_earned + NEW.price_waiter,
      rating_avg = (
        SELECT COALESCE(AVG(client_rating), 0)
        FROM public.missions
        WHERE waiter_id = NEW.waiter_id AND client_rating IS NOT NULL
      )
    WHERE user_id = NEW.waiter_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_mission_completed
  AFTER UPDATE ON public.missions
  FOR EACH ROW EXECUTE FUNCTION public.update_waiter_stats();
