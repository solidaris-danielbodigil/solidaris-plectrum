### Animation Utilities (CSS Classes)

Animation utility classes are defined in `libs/styles/7-utilities/_utilities.animations.scss` and provide ready-to-use animations:

```scss
// Base animation utilities
.u-animate {
  // Duration modifiers
  &--duration-fast {
    transition-duration: var(--animation-duration--fast);
    animation-duration: var(--animation-duration--fast);
  }

  &--duration-medium {
    transition-duration: var(--animation-duration--medium);
    animation-duration: var(--animation-duration--medium);
  }

  // Timing function modifiers
  &--timing-ease {
    transition-timing-function: var(--animation-timing--ease);
    animation-timing-function: var(--animation-timing--ease);
  }

  &--timing-bounce {
    transition-timing-function: var(--animation-timing--bounce);
    animation-timing-function: var(--animation-timing--bounce);
  }

  // Common animation types
  &--fade-in {
    animation-name: fade-in;
    animation-duration: var(--animation-duration--medium);
    animation-timing-function: var(--animation-timing--ease);
    animation-fill-mode: forwards;
  }

  &--slide-in-right {
    animation-name: slide-in-right;
    animation-duration: var(--animation-duration--medium);
    animation-timing-function: var(--animation-timing--ease);
    animation-fill-mode: forwards;
  }
  
  // ... many more animation classes
}

// Transition utilities
.u-transition {
  &--all {
    transition: all var(--animation-duration--medium) var(--animation-timing--ease);
  }

  &--transform {
    transition: transform var(--animation-duration--medium) var(--animation-timing--ease);
  }
  
  // ... other transition types
}

// Hover animation utilities
.u-hover-animate {
  &--grow {
    transition: transform var(--animation-duration--fast) var(--animation-timing--ease);

    &:hover,
    &:focus {
      transform: scale(1.05);
    }
  }
  
  // ... other hover animations
}
```

These utility classes can be applied directly in HTML to add animations without writing custom CSS. 