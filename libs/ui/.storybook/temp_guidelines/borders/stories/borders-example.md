```css
.my-bloc_my-input-element {
  @extend %u-border--input;

  background-color: blue;
  font-size: 999px;

  &--success {
    @extend %u-border--input-success;

    background-color: green;
  }
}
```
