// url=https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-?node-id=10-125
// source=libs/ui/src/primeng/actions.mdx
// component=Button
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Text')
const severity = instance.getEnum('Severity', {
  'Primary': '',
  'Secondary': 'secondary',
  'Success': 'success',
  'Info': 'info',
  'Warn': 'warn',
  'Help': 'help',
  'Danger': 'danger',
  'Contrast': 'contrast',
  'Plain': 'secondary',
})
const disabled = instance.getEnum('Disabled', { 'False': false, 'True': true })
const outlined = instance.getEnum('🔲 Outlined', { 'False': false, 'True': true })
const text = instance.getEnum('🔤 Text', { 'False': false, 'True': true })
const link = instance.getEnum('Link', { 'False': false, 'True': true })
const rounded = instance.getEnum('⥰ Rounded', { 'False': false, 'True': true })
const raised = instance.getEnum('⬆️ Raised', { 'False': false, 'True': true })

export default {
  example: figma.code`<p-button
  label="${label}"
  ${severity ? figma.code`severity="${severity}"` : ''}
  ${disabled ? '[disabled]="true"' : ''}
  ${outlined ? '[outlined]="true"' : ''}
  ${text ? '[text]="true"' : ''}
  ${link ? '[link]="true"' : ''}
  ${rounded ? '[rounded]="true"' : ''}
  ${raised ? '[raised]="true"' : ''}
/>`,
  imports: ["import { Button } from 'primeng/button'"],
  id: 'button',
  metadata: { nestable: true },
}
