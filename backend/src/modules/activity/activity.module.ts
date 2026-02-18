import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogEntity } from './activity-log.entity';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ActivityLogEntity])],
    controllers: [ActivityController],
    providers: [ActivityService],
    exports: [ActivityService],
})
export class ActivityModule { }
