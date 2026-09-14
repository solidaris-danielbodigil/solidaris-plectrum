import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'indemnites/at-dc-demande', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./layout/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      {
        path: 'dashboard/vue-ensemble',
        loadComponent: () =>
          import('./overview/overview.component').then((m) => m.OverviewComponent),
      },
      {
        path: 'dashboard/mon-panier',
        loadComponent: () => import('./stub/stub-page.component').then((m) => m.StubPageComponent),
      },
      {
        path: 'dashboard/abonnements-alertes',
        loadComponent: () => import('./stub/stub-page.component').then((m) => m.StubPageComponent),
      },
      {
        path: 'indemnites/at-dc-demande',
        loadComponent: () =>
          import('./document-queue/document-queue.component').then(
            (m) => m.DocumentQueueComponent,
          ),
      },
      {
        path: 'indemnites/:itemId',
        loadComponent: () => import('./stub/stub-page.component').then((m) => m.StubPageComponent),
      },
      {
        path: 'ac',
        loadComponent: () => import('./stub/stub-page.component').then((m) => m.StubPageComponent),
      },
      {
        path: 'soins',
        loadComponent: () => import('./stub/stub-page.component').then((m) => m.StubPageComponent),
      },
      {
        path: 'medical',
        loadComponent: () => import('./stub/stub-page.component').then((m) => m.StubPageComponent),
      },
      {
        path: 'juridique',
        loadComponent: () => import('./stub/stub-page.component').then((m) => m.StubPageComponent),
      },
      {
        path: 'population',
        loadComponent: () => import('./stub/stub-page.component').then((m) => m.StubPageComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'indemnites/at-dc-demande' },
];
