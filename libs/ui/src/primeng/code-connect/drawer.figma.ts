// url=https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-?node-id=4461-50366
// source=libs/ui/src/primeng/plectrum-figma.ts
// component=Drawer
import figma from 'figma'

export default {
  example: figma.code`<p-drawer [appendTo]="'body'" />`,
  imports: ["import { Drawer } from 'primeng/drawer'"],
  id: 'drawer',
  metadata: { nestable: true },
}
