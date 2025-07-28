import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// export const supabaseStorage = createClient(
//     process.env.SUPABASE_URL!,
//     process.env.SUPABASE_SERVICE_ROLE_KEY!,
// ).storage.from('media');


const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.SUPABASE_ANON_KEY!
);

export { supabase };
