// apps/frontend/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContestDetailsComponent } from './contest-details/contest-details.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'contest/:id', component: ContestDetailsComponent },
  { path: 'admin', component: AdminPanelComponent },
];
