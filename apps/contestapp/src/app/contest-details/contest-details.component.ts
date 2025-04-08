// apps/frontend/src/app/contest-details/contest-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contest-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  template: `
  <div class="container mt-5" *ngIf="contest">
    <h2>{{ contest.title }}</h2>
    <p>{{ contest.description }}</p>
    <p>Începe: {{ contest.startDate | date }} - Se termină: {{ contest.endDate | date }}</p>

    <div *ngIf="!registrationCompleted">
      <h4>Înregistrează-te la contest</h4>
      <form [formGroup]="registrationForm" (ngSubmit)="onRegister()">
        <div class="mb-3">
          <label for="tickets" class="form-label">Număr de tichete</label>
          <input type="number" id="tickets" formControlName="tickets" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary" [disabled]="registrationForm.invalid">Participă</button>
      </form>
    </div>
    <div *ngIf="registrationCompleted">
      <p>Te-ai înregistrat la acest contest.</p>
    </div>

    <div class="mt-4" *ngIf="contestWinning">
      <h4>Câștigător</h4>
      <p>ID câștigător: {{ contestWinning.userId }}</p>
    </div>
  </div>
  `
})
export class ContestDetailsComponent implements OnInit {
  contest: any;
  contestWinning: any;
  registrationForm: FormGroup;
  registrationCompleted = false;
  contestId!: number;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private http: HttpClient) {
    this.registrationForm = this.fb.group({
      tickets: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.contestId = Number(params.get('id'));
      this.loadContest();
    });
  }

  loadContest() {
    const token = localStorage.getItem('token') || '';
    this.http.get(`/api/contest/details/${this.contestId}`, { headers: { Authorization: `Bearer ${token}` } })
      .subscribe((res: any) => {
        this.contest = res.contest;
        this.contestWinning = res.winning;
      });
  }

  onRegister() {
    if (this.registrationForm.valid) {
      const token = localStorage.getItem('token') || '';
      const data = { contestId: this.contestId, tickets: this.registrationForm.value.tickets };
      this.http.post('/api/contest/register', data, { headers: { Authorization: `Bearer ${token}` } })
        .subscribe({
          next: () => { this.registrationCompleted = true; },
          error: err => { console.error('Error in contest registration', err); }
        });
    }
  }
}
