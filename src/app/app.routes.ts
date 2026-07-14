import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'services',
    loadComponent: () => import('./services/services.component').then(m => m.ServicesComponent),
  },
];
