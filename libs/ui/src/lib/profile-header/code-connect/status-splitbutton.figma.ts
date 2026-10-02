// url=https://www.figma.com/design/IRkr21rHS0w7rI0bgrv1fZ/PLECTRUM-%C2%B7-Custom-components?node-id=2371-3075
// source=libs/ui/src/lib/profile-header/profile-header.component.ts
// component=ProfileHeader
import figma from 'figma'
const instance = figma.selectedInstance

// .splitbutton PTL Header — the Profile header status action (statusAction with menuItems > 1).
const severity = instance.getEnum('State', {
  'Success': 'success',
  'Warning': 'warn',
  'Danger': 'danger',
})

export default {
  example: figma.code`<pds-profile-header
  [title]="name"
  [statusAction]="{ label: 'Actions à réaliser', severity: '${severity}', menuItems: actions }"
  (statusMenuSelect)="onAction($event)"
/>`,
  imports: ["import { ProfileHeaderComponent } from '@solidaris-danielbodigil/pds-ui'"],
  id: 'profile-header-status-splitbutton',
  metadata: { nestable: true },
}
