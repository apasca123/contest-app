// apps/frontend/src/app/services/contest.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContestService {
  private baseUrl = '/api/contest';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`);
  }

  getContestDetails(contestId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/details/${contestId}`);
  }

  registerToContest(data: { contestId: number, tickets: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  createContest(contestData: { title: string, description: string, startDate: string, endDate: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, contestData);
  }

  extractWinner(contestId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/extract-winner`, { contestId });
  }
}
