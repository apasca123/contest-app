// apps/backend/src/contest/contest.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { EmailService } from '../mail-service/email.service';

@Injectable()
export class ContestService {
  private dataDir = path.join(__dirname, '..', 'data');

  constructor(private readonly emailService: EmailService) {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir);
    }
    const files = ['users.json', 'contests.json', 'registrations.json', 'winnings.json', 'emails.json'];
    files.forEach(file => {
      const filePath = path.join(this.dataDir, file);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
      }
    });
  }

  async createContest(contestData: { title: string, description: string, startDate: string, endDate: string }): Promise<any> {
    const contestsFile = path.join(this.dataDir, 'contests.json');
    let contests = [];
    if (fs.existsSync(contestsFile)) {
      contests = JSON.parse(fs.readFileSync(contestsFile, 'utf8'));
    }
    const newContest = { id: contests.length + 1, ...contestData };
    contests.push(newContest);
    fs.writeFileSync(contestsFile, JSON.stringify(contests, null, 2), 'utf8');
    return { message: 'Contest creat cu succes', contest: newContest };
  }

  async registerContest(registration: { userId: number, contestId: number, tickets: number }): Promise<any> {
    const registrationsFile = path.join(this.dataDir, 'registrations.json');
    let registrations = [];
    if (fs.existsSync(registrationsFile)) {
      registrations = JSON.parse(fs.readFileSync(registrationsFile, 'utf8'));
    }
    const newRegistration = { id: registrations.length + 1, ...registration, date: new Date() };
    registrations.push(newRegistration);
    fs.writeFileSync(registrationsFile, JSON.stringify(registrations, null, 2), 'utf8');
    const user = await this.getUserById(registration.userId);
    this.sendEmail(user.email, 'Contest Registration', `Te-ai înregistrat la contestul ${registration.contestId}`);
    return { message: 'Înregistrare la contest reușită', registration: newRegistration };
  }

  async getDashboard(userId: number): Promise<any> {
    const contestsFile = path.join(this.dataDir, 'contests.json');
    const registrationsFile = path.join(this.dataDir, 'registrations.json');
    let contests = [];
    let registrations = [];
    if (fs.existsSync(contestsFile)) {
      contests = JSON.parse(fs.readFileSync(contestsFile, 'utf8'));
    }
    if (fs.existsSync(registrationsFile)) {
      registrations = JSON.parse(fs.readFileSync(registrationsFile, 'utf8'));
    }
    const now = new Date();
    const activeContests = contests.filter(contest => new Date(contest.endDate) >= now);
    const pastContests = contests.filter(contest => new Date(contest.endDate) < now &&
      registrations.some(reg => reg.userId === userId && reg.contestId === contest.id));
    return { activeContests, pastContests };
  }

  async getContestDetails(contestId: number): Promise<any> {
    const contestsFile = path.join(this.dataDir, 'contests.json');
    const winningsFile = path.join(this.dataDir, 'winnings.json');
    let contests = [];
    let winnings = [];
    if (fs.existsSync(contestsFile)) {
      contests = JSON.parse(fs.readFileSync(contestsFile, 'utf8'));
    }
    if (fs.existsSync(winningsFile)) {
      winnings = JSON.parse(fs.readFileSync(winningsFile, 'utf8'));
    }
    const contest = contests.find(c => c.id === contestId);
    const contestWinning = winnings.find(w => w.contestId === contestId);
    return { contest, winning: contestWinning || null };
  }

  async extractWinner(contestId: number): Promise<any> {
    const registrationsFile = path.join(this.dataDir, 'registrations.json');
    const winningsFile = path.join(this.dataDir, 'winnings.json');
    let registrations = [];
    if (fs.existsSync(registrationsFile)) {
      registrations = JSON.parse(fs.readFileSync(registrationsFile, 'utf8'));
    }
    const contestRegs = registrations.filter(reg => reg.contestId === contestId);
    if (contestRegs.length === 0) {
      return { message: 'Nici un participant' };
    }
    const weightedEntries = [];
    contestRegs.forEach(reg => {
      for (let i = 0; i < reg.tickets; i++) {
        weightedEntries.push(reg);
      }
    });
    const winnerIndex = Math.floor(Math.random() * weightedEntries.length);
    const winner = weightedEntries[winnerIndex];
    let winnings = [];
    if (fs.existsSync(winningsFile)) {
      winnings = JSON.parse(fs.readFileSync(winningsFile, 'utf8'));
    }
    const newWinning = { id: winnings.length + 1, contestId, userId: winner.userId, date: new Date() };
    winnings.push(newWinning);
    fs.writeFileSync(winningsFile, JSON.stringify(winnings, null, 2), 'utf8');
    const user = await this.getUserById(winner.userId) ;
    await this.emailService.sendEmail('Informare castigator!', `Userul ${user.email} a câștigat la contestul ${contestId}`);
    return { message: 'Câștigător extras', winning: newWinning };
  }

  async getUserById(userId: number): Promise<any> {
    const usersFile = path.join(this.dataDir, 'users.json');
    let users = [];
    if (fs.existsSync(usersFile)) {
      users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    }
    return users.find(u => u.id === userId);
  }

  private sendEmail(to: string, subject: string, body: string) {
    const emailsFile = path.join(this.dataDir, 'emails.json');
    let emails = [];
    if (fs.existsSync(emailsFile)) {
      emails = JSON.parse(fs.readFileSync(emailsFile, 'utf8'));
    }
    const newEmail = { id: emails.length + 1, to, subject, body, date: new Date() };
    emails.push(newEmail);
    fs.writeFileSync(emailsFile, JSON.stringify(emails, null, 2), 'utf8');
  }
}
