// apps/backend/src/contest/contest.controller.ts
import { Controller, Post, Body, UseGuards, Get, Param, Req } from '@nestjs/common';
import { ContestService } from './contest.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('contest')
export class ContestController {
  constructor(private readonly contestService: ContestService) {}

  // Înregistrare la un contest (se transmite contestId și numărul de tichete)
  @Post('register')
  @UseGuards(JwtAuthGuard)
  async register(@Body() registrationData: { contestId: number; tickets: number }, @Req() req: Request) {
    const user = (req as any).user;
    return this.contestService.registerContest({
      userId: user.sub,
      contestId: registrationData.contestId,
      tickets: registrationData.tickets,
    });
  }

  // Dashboard-ul utilizatorului: concursuri active și istoricul celor trecute
  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  async dashboard(@Req() req: Request) {
    const user = (req as any).user;
    return this.contestService.getDashboard(user.sub);
  }

  // Detalii contest (inclusiv câștigători, dacă există)
  @Get('details/:contestId')
  @UseGuards(JwtAuthGuard)
  async getContestDetails(@Param('contestId') contestId: number) {
    return this.contestService.getContestDetails(Number(contestId));
  }

  // Endpoint de creare contest (admin)
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createContest(@Body() contestData: { title: string, description: string, startDate: string, endDate: string }, @Req() req: Request) {
    const user = (req as any).user;
    if (user.email !== 'apasca2002@yahoo.com') {
      return { message: 'Unauthorized' };
    }
    return this.contestService.createContest(contestData);
  }

  // Endpoint de extragere câștigător (admin)
  @Post('extract-winner')
  @UseGuards(JwtAuthGuard)
  async extractWinner(@Body() body: { contestId: number }, @Req() req: Request) {
    const user = (req as any).user;
    if (user.email !== 'apasca2002@yahoo.com') {
      return { message: 'Unauthorized' };
    }
    return this.contestService.extractWinner(body.contestId);
  }
}
