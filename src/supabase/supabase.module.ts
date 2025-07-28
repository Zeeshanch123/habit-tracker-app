import { Module } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

const SupabaseClientProvider = {
    provide: 'SUPABASE_CLIENT',
    useFactory: () => {
        return createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );
    },
};

@Module({
    providers: [SupabaseClientProvider],
    exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule { }
