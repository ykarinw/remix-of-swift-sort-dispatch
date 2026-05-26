
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS max_workers integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS current_workers integer NOT NULL DEFAULT 0;

UPDATE public.orders SET max_workers = GREATEST(max_workers, 1);
