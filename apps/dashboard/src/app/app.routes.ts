import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'sessions', pathMatch: 'full' },
      {
        path: 'sessions',
        loadComponent: () =>
          import('./sessions/sessions.component').then((m) => m.SessionsComponent),
      },
      {
        // Lazy: charts and the generated insights data stay out of the initial bundle.
        path: 'design-system',
        loadChildren: () =>
          import('./design-system/design-system.routes').then((m) => m.DESIGN_SYSTEM_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: 'sessions' },
];
