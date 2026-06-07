import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./layout/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'affiliate/:id',
        loadComponent: () =>
          import('./affiliate-details/affiliate-details.component').then(
            (m) => m.AffiliateDetailsComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
