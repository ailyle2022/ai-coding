import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {

    // 检查是否为GraphQL请求
    if (req.path === '/graphql') {
      // 对于GraphQL请求，我们需要检查body中的操作类型
      const body = req.body;

      // 如果是登录操作，则跳过认证
      if (body && body.query && typeof body.query === 'string') {
        // 检查是否是登录相关的操作
        const isLoginOperation = body.query.includes('login');
        const isVerifyMFA = body.query.includes('verifyMFA');
        
        // 如果是登录操作、获取当前用户信息或内省查询，则跳过认证
        if (isLoginOperation || isVerifyMFA) {
          return next();
        }
      }
    }

    // 获取Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    // 提取token (格式: Bearer <token>)
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res
        .status(401)
        .json({ message: 'Invalid authorization header format' });
    }

    const token = tokenParts[1];

    try {
      // 验证token是否存在且有效
      const session = await this.authService.getUserSession(token);
      if (!session) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      // 将用户信息附加到request对象上
      (req as any).user = session;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  }
}