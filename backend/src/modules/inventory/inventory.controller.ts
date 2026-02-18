import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service';

@Controller('materials')
@UseGuards(AuthGuard('jwt'))
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Get()
    async findAll(@Request() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
        return this.inventoryService.findAllMaterials(req.user.tenant_id, { page, limit });
    }

    @Post()
    async create(@Request() req: any, @Body() body: any) {
        const material = await this.inventoryService.createMaterial(req.user.tenant_id, req.user.id, body);
        return { data: material };
    }

    @Post(':id/movements')
    async recordMovement(@Request() req: any, @Param('id') id: string, @Body() body: any) {
        const movement = await this.inventoryService.recordMovement(req.user.tenant_id, req.user.id, id, body);
        return { data: movement };
    }

    @Get('alerts')
    async getAlerts(@Request() req: any) {
        const materials = await this.inventoryService.getAlerts(req.user.tenant_id);
        return { data: materials };
    }
}
