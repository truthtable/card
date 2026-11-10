import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ysiitzwakssoktrlishu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_vcfafOYEJXJ86Yffbps6rA_DwrTGpeX';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

