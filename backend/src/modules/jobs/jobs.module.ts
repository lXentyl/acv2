import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './job.entity';
import { JobStatusHistoryEntity } from './job-status-history.entity';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';

@Module({
    imports: [TypeOrmModule.forFeature([JobEntity, JobStatusHistoryEntity])],
    controllers: [JobsController],
    providers: [JobsService],
    exports: [JobsService],
})
export class JobsModule { }
