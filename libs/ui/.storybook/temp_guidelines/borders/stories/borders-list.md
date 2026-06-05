**Directional Borders**

For directions and radius directions, add a modifier to your placeholder.
You have to choose between radius direction and direction.
Use it only when no semantic specificity is available.
If no direction is specified, "all" will be set by default.

- radius directions:
  _placeholder_ +
  `radius-all`
  `radius-left`
  `radius-right`
  `radius-bottom`
  `radius-top`
  `radius-corner-1`
  `radius-corner-2`
  `radius-corner-3`
  `radius-corner-4`

- directions:
  _placeholder_ +
  `horizontal`
  `vertical`
  `all`
  `left`
  `right`
  `bottom`
  `top`
  `corner-1`
  `corner-2`
  `corner-3`
  `corner-4`

##### Standard Borders

- `%u-border` **If needed:** add modifier --"direction" or --"radius direction"

- `%u-border--dark`
- `%u-border--rounded`
- `%u-border--circle`

  > **If needed:**
  > add modifier -"direction" or -"radius direction"

##### Override Borders

- `%u-border--none`

##### Divider

- `%u-border--divider`
- `%u-border--divider-primary`
- `%u-border--divider-blue`

  > **If needed:**
  > add modifier -"direction" or -"radius direction"

##### Card

- `%u-border--card`
- `%u-border--card-outlined`
- `%u-border--card-elevated`
- `%u-border--card-dashed`

  > **If needed:**
  > add modifier -"direction" or -"radius direction"

- Card without border but with radius direction:
  `%u-border--card-none` **Add modifier:** -"radius direction"

##### Input:

- `%u-border--input`
- `%u-border--input-hover`
- `%u-border--input-focus`
- `%u-border--input-disabled`
- `%u-border--input-pressed`
- `%u-border--input-success`
- `%u-border--input-error`
- `%u-border--input-error-focus`
- `%u-border--input-warning`
- `%u-border--input-warning-focus`

  > **If needed:**
  > add modifier -"direction" or -"radius direction"

##### Button:

- `%u-border--button`
- `%u-border--button-active`
- `%u-border--button-danger`
- `%u-border--button-primary`

  > **If needed:**
  > add modifier -"direction" or -"radius direction"

##### checkbox:

- `%u-border--checkbox`
- `%u-border--checkbox-checked`
- `%u-border--checked-hover`

  > **If needed:**
  > add modifier -"direction" or -"radius direction"

##### Tag:

- `%u-border--tag`
- `%u-border--tag-success`
- `%u-border--tag-error`
- `%u-border--tag-dashed`
- `%u-border--tag-processing`
- `%u-border--tag-warning`

  > **If needed:**
  > add modifier -"direction" or -"radius direction"

##### Badge:

- `%u-border--badge`
- `%u-border--badge-ghost-dark`
