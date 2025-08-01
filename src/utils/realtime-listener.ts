import { NestFactory } from '@nestjs/core';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { AppModule } from 'src/app.module';

dotenv.config();

(async () => {
    const app = await NestFactory.createApplicationContext(AppModule);

    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
    );
    console.log('📡 Listening for payment events...');
    const channel = supabase
        .channel('custom-realtime-payments')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'realtime_payments',
            },
            (payload) => {
                console.log('🔔 Realtime:Payload as Payment Event Received:', payload);

                const payment = payload.new;
                const userId = payment.user_id;

                console.log('✅ Payment record inserted');
                console.log('User ID:', userId);
            }
        );

    await channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            console.log('✅ Supabase Realtime subscription active');
        } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Error subscribing to Supabase channel');
        }
    });

    // Prevent process from exiting
    //   setInterval(() => {}, 1000);
})();
