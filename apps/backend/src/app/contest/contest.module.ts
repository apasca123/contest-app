// apps/backend/src/contest/contest.module.ts
import { Module } from '@nestjs/common';
import { ContestController } from './contest.controller';
import { ContestService } from './contest.service';
import { EmailService } from '../mail-service/email.service';

@Module({
  controllers: [ContestController],
  providers: [ContestService, EmailService],
})
export class ContestModule {}
