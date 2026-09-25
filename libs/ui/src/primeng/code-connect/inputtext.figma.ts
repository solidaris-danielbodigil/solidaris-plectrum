// url=https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-?node-id=23-835
// source=libs/ui/src/lib/form-field/form-field.component.ts
// component=FormField
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('↳ Label')
const invalid = instance.getEnum('❌ Invalid', { 'False': false, 'True': true })
const disabled = instance.getEnum('🚫 Disabled', { 'False': false, 'True': true })
const filled = instance.getEnum('🟦 Filled', { 'False': false, 'True': true })
const size = instance.getEnum('🤏 Size', { 'Normal': '', 'Small': 'small', 'Large': 'large' })

export default {
  example: figma.code`<pds-form-field label="${label}" inputId="field" ${invalid ? '[invalid]="true"' : ''}>
  <input
    pInputText
    id="field"
    ${invalid ? '[invalid]="true"' : ''}
    ${disabled ? '[disabled]="true"' : ''}
    ${filled ? 'variant="filled"' : ''}
    ${size ? figma.code`size="${size}"` : ''}
  />
</pds-form-field>`,
  imports: [
    "import { FormFieldComponent } from '@solidaris-danielbodigil/ui'",
    "import { InputText } from 'primeng/inputtext'",
  ],
  id: 'inputtext',
  metadata: { nestable: true },
}
