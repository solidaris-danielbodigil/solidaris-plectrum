import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { DocsLinkComponent } from '../storybook/docs-link.component';
import { plectrumFigma, PRIMENG_KIT } from './plectrum-figma';

@Component({
  selector: 'pds-primeng-kit-map',
  imports: [TableModule, Tag, DocsLinkComponent],
  template: `
    <p-table [value]="rows" dataKey="figma" size="small" sortField="figma" [sortOrder]="1">
      <ng-template #header>
        <tr>
          <th scope="col" pSortableColumn="figma">UI kit <p-sortIcon field="figma" /></th>
          <th scope="col">Code</th>
          <th scope="col">Plectrum</th>
          <th scope="col">Storybook</th>
          <th scope="col">Figma</th>
        </tr>
      </ng-template>
      <ng-template #body let-row>
        <tr>
          <td>{{ row.figma }}</td>
          <td><code>{{ row.code }}</code></td>
          <td>{{ row.plectrum ?? '—' }}</td>
          <td>
            @if (row.storybook) {
              <pds-docs-link label="Open" [path]="row.storybook" />
            } @else {
              <p-tag value="Not documented" severity="secondary" />
            }
          </td>
          <td>
            <pds-docs-link label="Open" [href]="row.figmaUrl" />
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
class PrimeNgKitMapComponent {
  protected readonly rows = PRIMENG_KIT.map((component) => ({
    ...component,
    figmaUrl: plectrumFigma(component.nodeId),
  }));
}

const meta: Meta = {
  title: 'PrimeNG/Figures/UI kit',
  tags: ['!dev'],
  parameters: { layout: 'padded', chromatic: { disableSnapshot: true } },
};

export default meta;

export const Map: StoryObj = {
  tags: ['!dev'],
  render: () => ({
    moduleMetadata: { imports: [PrimeNgKitMapComponent] },
    template: '<pds-primeng-kit-map />',
  }),
};
