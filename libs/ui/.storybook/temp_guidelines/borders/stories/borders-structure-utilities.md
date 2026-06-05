- ### 7-utilities:

  `utilities.borders.scss`

  #### @include of borders mixin wrapped inside placeholders

  #### Example:

```css
#{$bs-utilities}border {
  @include border();
}

#{$bs-utilities}border--rounded {
  @include border($_radius: small);
}

#{$bs-utilities}border--circle {
  @include border($_radius: circle);
}
```

#### @each loop to generate complex variants

#### Example:

```css
@each $direction in $_direction {
  #{$bs-utilities}border--#{$direction} {
    @if $direction !=no-right and $direction !=no-left {
      @include border($_radius: none, $_direction: $direction, $_width: default);
    } @else if $direction ==no-right {
      @include border($_radius-direction: left, $_direction: $direction, $_width: default);
    } @else if $direction ==no-left {
      @include border($_radius-direction: right, $_direction: $direction, $_width: default);
    }
  }
}
```
