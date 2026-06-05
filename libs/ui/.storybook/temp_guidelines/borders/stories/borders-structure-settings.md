- ### 1-settings:

  `settings.borders.scss`

  #### List of variables for borders:

  You can tweak border variables like `colors`, `radius`, `width`

  #### Values for borders:

  You can change proprieties of specific borders here by matching a variable to a type of border prop.

  > **This is the main place where you will tweak the borders**

  #### Example:

  `border-width: (default: var(--border-default), input: var(--border-default),...); `

  #### List of arguments accepted for border status and border types:

```css
$_default: (divider, default, dark, divider-primary, divider-blue);

$_input: (input, input-hover, input-focus, input-disabled, input-pressed, input-success, input-error, input-error-focus, input-warning, input-warning-focus);

$_button: (button, button-active, button-danger, button-primary);

$_checkbox: (checkbox, checkbox-checked, checkbox-hover);

$_tag: (tag, tag-success, tag-error, tag-dashed, tag-processing, tag-warning, tag-colorful-blue);

$_badge: (badge, badge-ghost-dark);

$_types: (default, input, button, checkbox, tag, badge);
```
