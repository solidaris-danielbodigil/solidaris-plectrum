## Animation Don'ts

### Avoid Excessive Motion

❌ **Don't overanimate**: Animating too many elements at once creates visual noise and can be distracting.

❌ **Don't use animations just because you can**: Every animation should have a clear purpose.

❌ **Don't animate large elements drastically**: Avoid large-scale movements that dominate the viewport.

### Avoid Performance Issues

❌ **Don't animate expensive properties**: Avoid animating properties like `box-shadow`, `filter` (except `opacity`), or gradients.

❌ **Don't trigger layout thrashing**: Avoid reading layout properties (like `offsetWidth`) and then immediately making style changes.

❌ **Don't use JavaScript animation for simple transitions**: CSS animations are more performant for basic UI transitions.

### Avoid Timing Problems

❌ **Don't make animations too slow**: Animations longer than 500ms for basic UI interactions feel sluggish.

❌ **Don't use linear timing**: Linear easing feels mechanical and unnatural for most UI animations.

❌ **Don't chain too many sequential animations**: Avoid making users wait through multiple animations to complete a task.

### Avoid Inconsistency

❌ **Don't use different timings for similar elements**: Maintain consistent timing patterns for similar components.

❌ **Don't create custom animations for standard interactions**: Follow platform conventions for common patterns.

❌ **Don't mix animation styles**: Stick to a consistent animation language throughout the application.

### Avoid Accessibility Issues

❌ **Don't ignore prefers-reduced-motion**: Always provide alternatives for users who prefer minimal motion.

❌ **Don't create animations that prevent interaction**: Users should be able to interact with the UI even during animations.

❌ **Don't rely on animation alone to convey meaning**: Critical information should be conveyed through multiple channels. 