import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Tenant isolation middleware.
 * Extracts x-tenant-id from request headers and attaches to request.
 * In production, validates that the JWT user belongs to this tenant.
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
    use(req: Request, _res: Response, next: NextFunction) {
        const tenantId = req.headers['x-tenant-id'] as string;

        if (!tenantId) {
            throw new ForbiddenException('Tenant ID is required');
        }

        // Attach tenant ID to request for downstream use
        (req as any).tenantId = tenantId;

        // In production: validate JWT claims match req.tenantId
        const user = (req as any).user;
        if (user && user.tenant_id && user.tenant_id !== tenantId) {
            throw new ForbiddenException('Cross-tenant access denied');
        }

        next();
    }
}
