### Animation Mixins and Functions

Animation mixins and functions are defined in `libs/styles/2-tools/_tools.animations.scss`:

```scss
// Basic Animation Mixins
@mixin transition($properties...) {
  // Creates a transition for multiple properties
  $result: ();
  @each $prop in $properties {
    $result: append($result, $prop var(--animation-duration--medium) var(--animation-timing--ease), comma);
  }
  transition: $result;
}

@mixin animation($name, $duration: var(--animation-duration--medium), $timing: var(--animation-timing--ease), $delay: 0s, $iteration: 1, $direction: normal, $fill-mode: forwards) {
  // Configures a complete animation
  animation-name: $name;
  animation-duration: $duration;
  animation-timing-function: $timing;
  animation-delay: $delay;
  animation-iteration-count: $iteration;
  animation-direction: $direction;
  animation-fill-mode: $fill-mode;
}

// Fade animations
@mixin fade-in($duration: var(--animation-duration--medium), $timing: var(--animation-timing--ease)) {
  animation: fade-in $duration $timing forwards;
}

@mixin fade-out($duration: var(--animation-duration--medium), $timing: var(--animation-timing--ease)) {
  animation: fade-out $duration $timing forwards;
}

// Slide animations
@mixin slide-in($direction: 'right', $duration: var(--animation-duration--medium), $timing: var(--animation-timing--ease)) {
  // Slides an element in from the specified direction
  @if $direction == 'right' {
    animation: slide-in-right $duration $timing forwards;
  } @else if $direction == 'left' {
    animation: slide-in-left $duration $timing forwards;
  } @else if $direction == 'up' {
    animation: slide-in-up $duration $timing forwards;
  } @else if $direction == 'down' {
    animation: slide-in-down $duration $timing forwards;
  }
}

// ... and many more mixins
```

These mixins provide reusable animation patterns that can be applied to any element, ensuring consistency and reducing code duplication.

### Adding Keyframes for New Animations

The animation system includes an automatic keyframe generator based on the type of animation. To add keyframes for a new animation:

#### Option 1: Using the Automatic Generator

The generator uses pattern matching on animation names to create keyframes. To add your animation, find the appropriate section in the generator:

```scss
// In _tools.animations.scss around line 900
@each $type, $value in map.get(animation.$animation-props, type) {
  // Fade animations
  @if string.index($type, 'fade')==1 {
    // Fade keyframes logic
  }
  
  // Slide animations
  @else if string.index($type, 'slide')==1 {
    // Slide keyframes logic
  }
  
  // Your new animation pattern
  @else if string.index($type, 'your-pattern')==1 {
    @keyframes animation-#{$type} {
      0% {
        // Starting state
      }
      
      100% {
        // End state matching the value from settings
      }
    }
  }
}
```

#### Option 2: Manual Keyframe Definition

For animations that don't fit existing patterns, define the keyframes manually:

```scss
// Add before the automatic generator
@keyframes animation-your-new-animation {
  0% {
    // Starting state
  }
  
  50% {
    // Optional intermediate state
  }
  
  100% {
    // End state
  }
}
```

Remember that all keyframe names must be prefixed with `animation-` to work with the utility classes and mixins. 