// url=https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-?node-id=327-12832
// source=libs/ui/src/primeng/plectrum-figma.ts
// component=Tooltip
import figma from 'figma'

export default {
  example: figma.code`<span pTooltip="Hint">Text</span>`,
  imports: ["import { Tooltip } from 'primeng/tooltip'"],
  id: 'tooltip',
  metadata: { nestable: true },
}
