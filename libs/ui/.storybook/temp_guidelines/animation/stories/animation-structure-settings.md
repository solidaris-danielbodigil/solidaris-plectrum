### Animation Settings (CSS Variables)

Animation settings are defined as CSS custom properties in `libs/styles/1-settings/_settings.animation.scss`, following ITCSS principles:

```scss
:root {
  // Animation durations
  --animation-duration--fast: 150ms;
  --animation-duration--medium: 300ms;
  --animation-duration--slow: 500ms;
  --animation-duration--very-slow: 800ms;

  // Timing functions / Easing curves
  --animation-timing--ease: cubic-bezier(0.25, 0.1, 0.25, 1);
  --animation-timing--ease-in: cubic-bezier(0.42, 0, 1, 1);
  --animation-timing--ease-out: cubic-bezier(0, 0, 0.58, 1);
  --animation-timing--ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);
  --animation-timing--linear: cubic-bezier(0, 0, 1, 1);

  // Custom easing curves
  --animation-timing--bounce: cubic-bezier(0.34, 0.01, 0.18, 1.38);
  --animation-timing--elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --animation-timing--snappy: cubic-bezier(0.2, 0.9, 0.4, 1.0);
  --animation-timing--gentle: cubic-bezier(0.4, 0.0, 0.2, 1.0);

  // Delays
  --animation-delay--tiny: 50ms;
  --animation-delay--small: 100ms;
  --animation-delay--medium: 200ms;
  --animation-delay--large: 500ms;

  // Animation transforms
  --animation-transform--fade-in: opacity 1;
  --animation-transform--fade-out: opacity 0;
  --animation-transform--slide-up: translateY(-100%);
  --animation-transform--slide-down: translateY(100%);
  --animation-transform--slide-left: translateX(-100%);
  --animation-transform--slide-right: translateX(100%);
  --animation-transform--scale-up: scale(1.1);
  --animation-transform--scale-down: scale(0.9);
  // ...and more
}
```

These properties provide the foundation for all animations, ensuring consistency across components.

### Adding New Animation Types

To add a new animation type to the system, follow these steps:

1. **Add the CSS custom property** in the `:root` section:

```scss
:root {
  // ... existing properties
  
  // Your new animation type
  --animation--type__your-new-animation: your-transform-value;
}
```

2. **Add to the SCSS maps** so it's accessible via mixins and functions:

```scss
$_animation-props: (
  // ... existing map properties
  
  type: (
    // ... existing types
    your-new-animation: var(--animation--type__your-new-animation),
  )
);
```

3. **Add to the types list** for utility class generation:

```scss
$_types: (
  // ... existing types
  your-new-animation,
);
```

This ensures your new animation is fully integrated with the animation system and accessible via utility classes, mixins, and functions. 