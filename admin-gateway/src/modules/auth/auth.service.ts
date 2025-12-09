import { Injectable } from '@nestjs/common';
import { AuthPayload, AuthUser } from './auth.payload';

export interface LoginInput {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  async login(loginInput: LoginInput): Promise<AuthPayload> {
    // 模拟验证逻辑：用户名和密码都为admin时登录成功
    if (loginInput.username === 'admin' && loginInput.password === 'admin') {
      // 模拟生成token
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIn0.5fF9f2vYHQVyzmy6K0sJiMS7qNgqMV7w';
      
      const user = new AuthUser();
      user.id = 1;
      user.username = 'admin';
      
      const authPayload = new AuthPayload();
      authPayload.token = token;
      authPayload.user = user;
      
      return authPayload;
    }
    
    throw new Error('Invalid credentials');
  }
}