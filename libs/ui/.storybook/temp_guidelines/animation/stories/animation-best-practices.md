## Animation Best Practices

### Purpose First

- **Be intentional**: Every animation should serve a purpose - to guide attention, indicate relationships, or provide feedback.
- **Enhance, don't distract**: Animations should enhance the user experience, not distract from completing tasks.
- **Show causality**: Use animations to indicate cause and effect relationships between user actions and system responses.

### Performance

- **Keep it lightweight**: Animate only the properties that can be GPU-accelerated: `transform`, `opacity`, and sometimes `filter`.
- **Avoid animating layout properties**: Properties like `width`, `height`, `margin`, and `padding` can cause expensive layout recalculations.
- **Use `will-change`**: For complex animations, use `will-change` to hint the browser about properties that will animate, but use sparingly.

### Timing and Pacing

- **Keep it brief**: Most UI animations should complete within 300ms, with complex ones under 500ms.
- **Match speed to action**: Small elements should move faster than large ones. Small UI responses should be quick.
- **Use appropriate easing**: Choose easing functions that match the physical world:
  - Natural movement starts slow, accelerates, and slows down (ease-in-out)
  - Elements entering the screen should ease-out (fast then slow)
  - Elements leaving the screen should ease-in (slow then fast)

### Consistency

- **Use the design system**: Prefer the predefined animation durations, timings, and utilities.
- **Be predictable**: Similar actions should have similar animations throughout the application.
- **Establish patterns**: Create a consistent choreography across the application for common actions.

### Accessibility

- **Respect user preferences**: Honor the `prefers-reduced-motion` media query for users who prefer minimal animation.
- **Avoid flashing content**: Ensure animations don't flash or flicker in ways that could trigger photosensitive conditions.
- **Provide alternatives**: Critical information shouldn't rely solely on animation to be understood. 