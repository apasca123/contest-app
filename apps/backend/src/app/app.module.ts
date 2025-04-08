// apps/backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ContestModule } from './contest/contest.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ContestModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
