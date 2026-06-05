> **Use it as a placeholder: <br /> This is the way**

Semantic values provide better reusability. Why?:

- It allows you to reuse a defined scope, forward modifications and maintenance will be much easier

- By reusing those semantic placeholders, you will prevent any further inconsistency

- It centralizes the content

```css
@extend %u-border--card-outlined;
```

> **Use it as a mixin: <br /> Only when a placeholder cannot be applied.**

- Mixins are more flexible but less semantic than placeholders, thus use them only as last resort.

```css
@include border();

@include border($_radius: big, $_style: dashed);
```

#### Tweak borders:

- Go to `settings.borders.scss`
- Search for `:root` to tweak ar add variables

```css
:root {
  --border-default: calc(var(--base-unit) / 16);
  --border-small: calc(var(--border-default) / 2);
  --border-big: calc(var(--border-default) * 2);
  --border-extra-big: calc(var(--border-default) * 4);
  --border-none: var(--none);

  --radius: calc(var(--base-unit) / 8);
  --radius--big: calc(var(--border-default) * 3);
  --radius--xl: calc(var(--border-default) * 5);
  --radius--xxl: calc(var(--base-unit) * 4);
  --radius--circle: 100%;

  --shadow-blur: calc(var(--base-unit) * 1);

  --none: 0;
}
```

- Search for `$_border-props` and `$_border-types-props` to tweak border properties

```css
$_border-types-props: (
  default: (
    divider: var(--color...),
    card: var(--color...),
    default: var(--color...),
    dark: var(--color...),
    divider-primary: var(--color...),
    divider-blue: var(--color...),
  ),
```
