// url=https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-?node-id=327-13384
// source=libs/ui/src/primeng/plectrum-figma.ts
// component=Avatar
import figma from 'figma'

export default {
  example: figma.code`<pds-plectrum-avatar initials="AB" />`,
  imports: ["import { Avatar } from 'primeng/avatar'",
  "import { PlectrumAvatarComponent } from '@solidaris/ui'"],
  id: 'avatar',
  metadata: { nestable: true },
}
