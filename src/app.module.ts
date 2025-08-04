import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { HabitModule } from './habit/habit.module';
import { HabitLogModule } from './habit-log/habit-log.module';
import { ResourceModule } from './resource/resource.module';
import { PlansModule } from './plans/plans.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        // url: config.get<string>('LIVE_DB_URL'), // For Production
        url: config.get<string>('LOCAL_DB_URL'), // For Development
        // host: config.get<string>('DB_HOST'),
        // port: config.get<number>('DB_PORT'),
        // username: config.get<string>('DB_USER'),
        // password: config.get<string>('DB_PASSWORD'),
        // database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], //it works
        // entities: [], // it works
        // synchronize: false, // ✅Set to false in production level for end user as for clients || use migrations in real world
        synchronize: true, // Set to true in development level for developers;
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    UserModule,
    HabitModule,
    HabitLogModule,
    ResourceModule,
    PlansModule,
    PaymentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule { }
