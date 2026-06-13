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
        path: 'design-system',
        loadComponent: () =>
          import('./design-system/design-system.component').then(
            (m) => m.DesignSystemComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'sessions' },
];
