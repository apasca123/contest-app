// apps/frontend/src/app/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  template: `
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2>Login / Înregistrare</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" formControlName="email" class="form-control" placeholder="exemplu@domain.com">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Parola</label>
            <input type="password" id="password" formControlName="password" class="form-control" placeholder="Parola">
          </div>
          <div class="mb-3">
            <label for="name" class="form-label">Nume (doar la prima logare)</label>
            <input type="text" id="name" formControlName="name" class="form-control" placeholder="Nume complet">
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="loginForm.invalid">Login</button>
        </form>
      </div>
    </div>
  </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      name: [''] // opțional, pentru auto-înregistrare
    });
  }
  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login error', err);
        }
      });
    }
  }
}
