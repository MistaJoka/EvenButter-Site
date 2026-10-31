-- Logged-in (authenticated) users kept Supabase's default table grants.
-- RLS blocked them anyway, but a future policy could open the list by
-- accident. Only the dashboard (service role) should ever touch it.
revoke all on public.waitlist from authenticated;
