import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JobsService } from './jobs.service';

@Controller('jobs')
@UseGuards(AuthGuard('jwt'))
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @Get()
    async findAll(
        @Request() req: any,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('status') status?: string,
    ) {
        return this.jobsService.findAll(req.user.tenant_id, { page, limit, status });
    }

    @Post()
    async create(@Request() req: any, @Body() body: any) {
        const job = await this.jobsService.create(req.user.tenant_id, req.user.id, body);
        return { data: job };
    }

    @Patch(':id/status')
    async updateStatus(
        @Request() req: any,
        @Param('id') id: string,
        @Body() body: { status: string; notes?: string },
    ) {
        const job = await this.jobsService.updateStatus(
            req.user.tenant_id, id, req.user.id, body.status, body.notes,
        );
        return { data: job };
    }

    @Get(':id/history')
    async getHistory(@Request() req: any, @Param('id') id: string) {
        const history = await this.jobsService.getHistory(req.user.tenant_id, id);
        return { data: history };
    }
}
