
DROP POLICY IF EXISTS "View available or own orders" ON public.orders;
CREATE POLICY "View available or own orders" ON public.orders
  FOR SELECT TO authenticated
  USING (status IN ('available','full') OR worker_id = auth.uid());

DROP POLICY IF EXISTS "Workers can accept orders" ON public.orders;
CREATE POLICY "Workers can accept orders" ON public.orders
  FOR UPDATE TO authenticated
  USING (status IN ('available','full') OR worker_id = auth.uid())
  WITH CHECK (worker_id = auth.uid() OR worker_id IS NULL);
