import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Role-based access control decorator.
 * Usage: @Roles('admin', 'supervisor')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
