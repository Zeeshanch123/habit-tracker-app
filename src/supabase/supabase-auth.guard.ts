import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET!;

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('No Authorization header');
    const token = authHeader.replace('Bearer ', '');
    try {
      // Verify JWT using Supabase JWT secret
      const payload = jwt.verify(token, SUPABASE_JWT_SECRET) as any;
      // Attach user info to request
      // console.log("payload:", payload);

      request['user'] = {
        id: payload.sub, // Supabase user UUID
        email: payload.email,
        ...payload,
      };
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}