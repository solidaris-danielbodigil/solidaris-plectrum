// url=https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-?node-id=373-13726
// source=libs/ui/src/primeng/plectrum-figma.ts
// component=Skeleton
import figma from 'figma'

export default {
  example: figma.code`<pds-skeleton-slot />`,
  imports: ["import { Skeleton } from 'primeng/skeleton'",
  "import { SkeletonSlotComponent } from '@solidaris-danielbodigil/ui'"],
  id: 'skeleton',
  metadata: { nestable: true },
}
