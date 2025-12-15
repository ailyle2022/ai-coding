import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { CacheService } from './cache.service';

@Module({
  providers: [PasswordService, CacheService],
  exports: [PasswordService, CacheService],
})
export class CommonModule {}
