import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
    sub: string; // user id
    email: string;
    tenant_id: string;
    role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_SECRET', 'acv2-secret-key'),
        });
    }

    async validate(payload: JwtPayload) {
        if (!payload.sub || !payload.tenant_id) {
            throw new UnauthorizedException('Invalid token payload');
        }
        return {
            id: payload.sub,
            email: payload.email,
            tenant_id: payload.tenant_id,
            role: payload.role,
        };
    }
}
