// apps/frontend/src/app/admin-panel/admin-panel.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
  <div class="container mt-5">
    <h2>Admin Panel</h2>
    <div>
      <h4>Creare Contest</h4>
      <form [formGroup]="createContestForm" (ngSubmit)="onCreateContest()">
        <div class="mb-3">
          <label for="title" class="form-label">Titlu</label>
          <input type="text" id="title" formControlName="title" class="form-control">
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Descriere</label>
          <textarea id="description" formControlName="description" class="form-control"></textarea>
        </div>
        <div class="mb-3">
          <label for="startDate" class="form-label">Data Începerii</label>
          <input type="date" id="startDate" formControlName="startDate" class="form-control">
        </div>
        <div class="mb-3">
          <label for="endDate" class="form-label">Data Încheierii</label>
          <input type="date" id="endDate" formControlName="endDate" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary" [disabled]="createContestForm.invalid">Creează Contest</button>
      </form>
    </div>

    <div class="mt-5">
      <h4>Extrage Câștigător</h4>
      <form [formGroup]="extractWinnerForm" (ngSubmit)="onExtractWinner()">
        <div class="mb-3">
          <label for="contestId" class="form-label">ID Contest</label>
          <input type="number" id="contestId" formControlName="contestId" class="form-control">
        </div>
        <button type="submit" class="btn btn-danger" [disabled]="extractWinnerForm.invalid">Extrage</button>
      </form>
    </div>
  </div>
  `
})
export class AdminPanelComponent {
  createContestForm: FormGroup;
  extractWinnerForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.createContestForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
    this.extractWinnerForm = this.fb.group({
      contestId: [null, Validators.required]
    });
  }

  onCreateContest() {
    const token = localStorage.getItem('token') || '';
    this.http.post('/api/contest/create', this.createContestForm.value, { headers: { Authorization: `Bearer ${token}` } })
      .subscribe({
        next: res => { console.log('Contest creat', res); },
        error: err => { console.error('Error creating contest', err); }
      });
  }

  onExtractWinner() {
    const token = localStorage.getItem('token') || '';
    this.http.post('/api/contest/extract-winner', this.extractWinnerForm.value, { headers: { Authorization: `Bearer ${token}` } })
      .subscribe({
        next: res => { console.log('Câștigător extras', res); },
        error: err => { console.error('Error extracting winner', err); }
      });
  }
}
