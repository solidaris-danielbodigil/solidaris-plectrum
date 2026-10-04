import type { Routes } from '@angular/router';
import { DesignSystemComponent } from './design-system.component';
import { provideInsights } from './insights.provider';
import { InsightsStore } from './insights.store';

export const DESIGN_SYSTEM_ROUTES: Routes = [
  {
    path: '',
    // Route-level providers keep the generated data in this lazy chunk and give
    // every section one store (selected source survives tab changes).
    providers: [provideInsights(), InsightsStore],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: ':section', component: DesignSystemComponent },
    ],
  },
];
