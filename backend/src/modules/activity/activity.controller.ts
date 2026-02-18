import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ActivityService } from './activity.service';

@Controller('activity')
@UseGuards(AuthGuard('jwt'))
export class ActivityController {
    constructor(private readonly activityService: ActivityService) { }

    @Get()
    async findAll(@Request() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
        return this.activityService.findAll(req.user.tenant_id, { page, limit });
    }
}
