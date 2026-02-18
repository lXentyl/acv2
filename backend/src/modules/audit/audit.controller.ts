import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuditService } from './audit.service';

@Controller('audit-logs')
@UseGuards(AuthGuard('jwt'))
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Get()
    async findAll(
        @Request() req: any,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('entity_type') entityType?: string,
    ) {
        return this.auditService.findAll(req.user.tenant_id, { page, limit, entity_type: entityType });
    }
}
