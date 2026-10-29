// Waitlist delivery. Signups go straight into a Supabase table the shop owns
// (schema: supabase/migrations/20261028000000_waitlist.sql).
//
// Config comes from environment variables (never committed):
//   PUBLIC_SUPABASE_URL       e.g. https://abcdefghijkl.supabase.co
//   PUBLIC_SUPABASE_ANON_KEY  the project's anon/publishable key
// Locally: put them in .env (see .env.example). On GitHub Pages: repository
// Actions variables of the same names; deploy.yml passes them to the build.
//
// The anon key is designed to ship to browsers. Row-level security on the
// table limits it to inserts only.
//
// Until both are set, the form renders but tells visitors signups are not
// open yet, and `npm run build` prints a warning.
export const SUPABASE_URL = (import.meta.env.PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");
export const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? "";
export const isWaitlistConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const WAITLIST_ENDPOINT = `${SUPABASE_URL}/rest/v1/waitlist`;
