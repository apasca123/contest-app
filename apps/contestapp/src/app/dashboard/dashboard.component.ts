// apps/frontend/src/app/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="container mt-5">
      <h2>Dashboard</h2>
      <div>
        <h4>Concursuri Active</h4>
        <ul class="list-group">
          <li *ngFor="let contest of dashboard?.activeContests" class="list-group-item">
            {{ contest.title }}
            <button class="btn btn-sm btn-primary" (click)="openContest(contest.id)">Participă</button>
          </li>
        </ul>
      </div>
      <div class="mt-4">
        <h4>Istoric Concursuri</h4>
        <ul class="list-group">
          <li *ngFor="let contest of dashboard?.pastContests" class="list-group-item">
            {{ contest.title }}
            <button class="btn btn-sm btn-info" (click)="viewDetails(contest.id)">Detalii</button>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  dashboard: any;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token') || '';
    this.http.get('/api/contest/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .subscribe((res: any) => { this.dashboard = res; });
  }

  openContest(contestId: number) {
    window.location.href = `/contest/${contestId}`;
  }
  viewDetails(contestId: number) {
    window.location.href = `/contest/${contestId}`;
  }
}
