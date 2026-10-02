// url=https://www.figma.com/design/IRkr21rHS0w7rI0bgrv1fZ/PLECTRUM-%C2%B7-Custom-components?node-id=2438-10587
// source=libs/ui/src/lib/profile-header/profile-header.component.ts
// component=ProfileHeader
import figma from 'figma'
const instance = figma.selectedInstance

// Figma booleans toggle example content; in code they are inputs or slots.
// Tags: entries with filterKey render as PrimeNG ToggleButtons (quick filters),
// the others as display-only PrimeNG Tags.
const statusSplitButton = instance.getBoolean('Status Split Button')
const tags = instance.getBoolean('Tags')
const iconActions = instance.getBoolean('Icon Actions')
const buttonActions = instance.getBoolean('Button Actions')
const aValoir = instance.getBoolean('A-valoir panel')
const tabs = instance.getBoolean('Tabs')
const selectButton = instance.getBoolean('Select Button (toggle)')

export default {
  example: figma.code`<pds-profile-header
  [title]="name"
  [avatarInitials]="initials"
  [primaryAction]="{ label: 'Voir carte affilié', shortcut: 'ALT + A' }"
  ${statusSplitButton ? figma.code`[statusAction]="{ label: 'Actions à réaliser', severity: 'success', menuItems: actions }"` : ''}
  ${tags ? '[infoTags]="tags" (infoTagClick)="toggleFilter($event)"' : ''}
  [identifiers]="identifiers"
  (primaryActionClick)="openProfile()"
>
  ${iconActions ? '<div slot="actions"><!-- icon buttons --></div>' : ''}
  ${buttonActions ? '<div slot="actions"><!-- page buttons --></div>' : ''}
  ${aValoir ? '<div slot="aside"><!-- aside panel --></div>' : ''}
  ${tabs ? '<p-tabs slot="nav"><!-- shell tabs --></p-tabs>' : ''}
  ${selectButton ? '<p-selectbutton slot="nav-end" [options]="views" />' : ''}
</pds-profile-header>`,
  imports: ["import { ProfileHeaderComponent } from '@solidaris-danielbodigil/pds-ui'"],
  id: 'profile-header',
  metadata: { nestable: false },
}
