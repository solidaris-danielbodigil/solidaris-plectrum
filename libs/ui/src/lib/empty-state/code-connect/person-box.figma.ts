// url=https://www.figma.com/design/947lOBHnx8VJUPLuKhLqby/PLECTRUM-%C2%B7-Icons---illustrations?node-id=2002-473
// source=libs/ui/src/lib/empty-state/empty-state.component.ts
// component=EmptyState
import figma from 'figma'

export default {
  example: figma.code`<pds-empty-state illustration="person-box" title="Title" description="Description" />`,
  imports: ["import { EmptyStateComponent } from '@solidaris/ui'"],
  id: 'person-box',
  metadata: { nestable: true },
}
