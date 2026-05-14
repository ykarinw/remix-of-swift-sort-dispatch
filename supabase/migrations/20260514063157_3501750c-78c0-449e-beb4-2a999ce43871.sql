
-- Updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  city TEXT,
  worker_id TEXT NOT NULL UNIQUE DEFAULT ('SG-' || to_char(now(),'YYYY') || '-' || lpad((floor(random()*100000))::text, 5, '0')),
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.00,
  total_orders INT NOT NULL DEFAULT 0,
  total_earnings BIGINT NOT NULL DEFAULT 0,
  specialization TEXT NOT NULL DEFAULT 'Sortir Paket',
  tier TEXT NOT NULL DEFAULT 'Bronze',
  is_online BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data ->> 'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- APPLICATIONS
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  experience TEXT NOT NULL,
  cv_path TEXT,
  status TEXT NOT NULL DEFAULT 'approved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own applications" ON public.applications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own applications" ON public.applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ORDERS
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT NOT NULL UNIQUE DEFAULT ('ORD-' || lpad((floor(random()*100000))::text, 5, '0')),
  warehouse_name TEXT NOT NULL,
  warehouse_address TEXT NOT NULL,
  distance_km NUMERIC(5,2) NOT NULL,
  duration_hours NUMERIC(4,1) NOT NULL,
  packages INT NOT NULL,
  pay_amount INT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'sedang',
  status TEXT NOT NULL DEFAULT 'available',
  worker_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View available or own orders" ON public.orders FOR SELECT TO authenticated
  USING (status = 'available' OR worker_id = auth.uid());
CREATE POLICY "Workers can accept orders" ON public.orders FOR UPDATE TO authenticated
  USING (status = 'available' OR worker_id = auth.uid())
  WITH CHECK (worker_id = auth.uid() OR worker_id IS NULL);
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed orders
INSERT INTO public.orders (warehouse_name, warehouse_address, distance_km, duration_hours, packages, pay_amount, urgency) VALUES
('Gudang JNE Bekasi Timur', 'Jl. Raya Bekasi Timur No. 12', 2.4, 4, 320, 95000, 'tinggi'),
('Tokopedia Fulfillment Cakung', 'Kawasan Industri Cakung Blok B', 5.1, 6, 480, 142000, 'sedang'),
('Shopee Xpress Pulogadung', 'Jl. Pulogadung Raya 88', 3.8, 3, 210, 72000, 'rendah'),
('JNT Bandar Kemayoran', 'Jl. Benyamin Sueb No. 5', 7.2, 5, 390, 118000, 'tinggi'),
('Lazada eLogistics Cibitung', 'Cibitung Industrial Estate', 8.5, 6, 520, 165000, 'sedang'),
('Ninja Xpress Pondok Kopi', 'Jl. Pondok Kopi Raya 21', 4.2, 4, 280, 88000, 'rendah');

-- STORAGE BUCKET for CVs
INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', false);

CREATE POLICY "Users upload own CV" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users read own CV" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);
