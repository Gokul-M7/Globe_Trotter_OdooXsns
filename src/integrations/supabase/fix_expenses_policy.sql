
-- Enable RLS on trip_expenses if not already enabled
ALTER TABLE public.trip_expenses ENABLE ROW LEVEL SECURITY;

-- Add missing policies for trip_expenses
DROP POLICY IF EXISTS "Users can insert own trip expenses" ON public.trip_expenses;
CREATE POLICY "Users can insert own trip expenses" on public.trip_expenses for insert
  with check (trip_id in (select id from public.trips where user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update own trip expenses" ON public.trip_expenses;
CREATE POLICY "Users can update own trip expenses" on public.trip_expenses for update
  using (trip_id in (select id from public.trips where user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete own trip expenses" ON public.trip_expenses;
CREATE POLICY "Users can delete own trip expenses" on public.trip_expenses for delete
  using (trip_id in (select id from public.trips where user_id = auth.uid()));
