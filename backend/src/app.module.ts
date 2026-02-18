import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { AuditModule } from './modules/audit/audit.module';
import { ActivityModule } from './modules/activity/activity.module';

@Module({
    imports: [
        // Environment configuration
        ConfigModule.forRoot({ isGlobal: true }),

        // Rate limiting
        ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

        // Database connection
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get('DB_HOST', 'localhost'),
                port: config.get<number>('DB_PORT', 5432),
                username: config.get('DB_USERNAME', 'acv2admin'),
                password: config.get('DB_PASSWORD', 'secure_password'),
                database: config.get('DB_NAME', 'acv2print'),
                autoLoadEntities: true,
                synchronize: config.get('NODE_ENV') !== 'production',
                logging: config.get('NODE_ENV') !== 'production',
            }),
        }),

        // Feature modules
        AuthModule,
        TenantsModule,
        UsersModule,
        JobsModule,
        InventoryModule,
        AuditModule,
        ActivityModule,
    ],
})
export class AppModule { }
