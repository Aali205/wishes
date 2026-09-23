// ---------------------------------------------------------------------------
// Supabase connection used to save orders and power the admin dashboard.
// The anon key is meant to be public: access is limited by the row-level
// security rules in supabase/schema.sql.
// ---------------------------------------------------------------------------

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vjfrledvdygacbuinpuj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3FkKaEcOVBsTDidjllebLg_MTFcTbGA';

export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
