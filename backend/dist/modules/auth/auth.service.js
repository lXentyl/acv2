"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../users/user.entity");
const tenant_entity_1 = require("../tenants/tenant.entity");
let AuthService = class AuthService {
    constructor(userRepo, tenantRepo, jwtService) {
        this.userRepo = userRepo;
        this.tenantRepo = tenantRepo;
        this.jwtService = jwtService;
    }
    async login(dto) {
        const user = await this.userRepo.findOne({
            where: { email: dto.email, is_deleted: false },
        });
        if (!user || !(await bcrypt.compare(dto.password, user.password_hash))) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const tokens = await this.generateTokens(user);
        user.refresh_token_hash = await bcrypt.hash(tokens.refresh_token, 10);
        user.last_login_at = new Date();
        await this.userRepo.save(user);
        return tokens;
    }
    async register(dto) {
        const existing = await this.userRepo.findOne({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('El correo ya está registrado');
        }
        let tenant;
        if (dto.tenant_name) {
            const slug = dto.tenant_name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            tenant = this.tenantRepo.create({ name: dto.tenant_name, slug });
            tenant = await this.tenantRepo.save(tenant);
        }
        else {
            throw new common_1.ConflictException('Nombre de empresa requerido');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({
            tenant_id: tenant.id,
            email: dto.email,
            password_hash: passwordHash,
            first_name: dto.first_name,
            last_name: dto.last_name,
            role_id: '00000000-0000-0000-0000-000000000001',
        });
        const savedUser = await this.userRepo.save(user);
        return this.generateTokens(savedUser);
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'acv2-refresh-secret',
            });
            const user = await this.userRepo.findOne({
                where: { id: payload.sub, is_deleted: false },
            });
            if (!user || !user.refresh_token_hash) {
                throw new common_1.UnauthorizedException('Token inválido');
            }
            const isValid = await bcrypt.compare(refreshToken, user.refresh_token_hash);
            if (!isValid)
                throw new common_1.UnauthorizedException('Token inválido');
            const tokens = await this.generateTokens(user);
            user.refresh_token_hash = await bcrypt.hash(tokens.refresh_token, 10);
            await this.userRepo.save(user);
            return tokens;
        }
        catch {
            throw new common_1.UnauthorizedException('Token inválido o expirado');
        }
    }
    async getProfile(userId) {
        const user = await this.userRepo.findOne({
            where: { id: userId, is_deleted: false },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        const { password_hash, refresh_token_hash, ...profile } = user;
        return profile;
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            tenant_id: user.tenant_id,
            role: user.role_id,
        };
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(payload, {
                expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET || 'acv2-refresh-secret',
                expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
            }),
        ]);
        return { access_token, refresh_token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(tenant_entity_1.TenantEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map