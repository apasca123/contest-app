// apps/backend/src/auth/auth.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';

const SECRET_KEY = 'secretKeyForDemo'; // Folosește variabile de mediu în producție

@Injectable()
export class AuthService {
  private dataDir = path.join(__dirname, '..', 'data');
  private usersFile = path.join(this.dataDir, 'users.json');

  constructor() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir);
    }
    if (!fs.existsSync(this.usersFile)) {
      fs.writeFileSync(this.usersFile, JSON.stringify([]), 'utf8');
    }
  }

  async login(credentials: { email: string, password: string, name?: string }): Promise<string> {
    let users = [];
    if (fs.existsSync(this.usersFile)) {
      const fileData = fs.readFileSync(this.usersFile, 'utf8');
      // Dacă fișierul este gol, setăm users ca un array gol
      users = fileData.trim() ? JSON.parse(fileData) : [];
    }

    let user = users.find(u => u.email === credentials.email);

    if (!user) {
      // Dacă utilizatorul nu există, se auto-înregistrează
      const newUser = {
        id: users.length + 1,
        name: credentials.name ? credentials.name : credentials.email.split('@')[0],
        email: credentials.email,
        password: credentials.password, // Pentru demo; în producție se va folosi hash
        role: credentials.email === 'apasca2002@yahoo.com' ? 'admin' : 'user',
      };
      users.push(newUser);
      fs.writeFileSync(this.usersFile, JSON.stringify(users, null, 2), 'utf8');
      this.sendEmail(newUser.email, 'Bun venit!', 'Te-ai înregistrat cu succes în My Contest App.');
      user = newUser;
    } else {
      // Dacă utilizatorul există, verificăm parola
      if (user.password !== credentials.password) {
        throw new HttpException('Parolă incorectă', HttpStatus.UNAUTHORIZED);
      }
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
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
