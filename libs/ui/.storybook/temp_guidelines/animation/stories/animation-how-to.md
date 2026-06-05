## Creating a New Animation

To add a new animation to our system, follow these steps to ensure it's fully integrated with our animation architecture:

### Step A: Define the CSS Custom Property
Add the new animation type to the `:root` section in `libs/styles/1-settings/_settings.animation.scss`:

```scss
// Add your new animation type with its target end state
--animation--type__your-new-animation: your-transform-or-property-value;
```

### Step B: Add to SCSS Maps
Add the animation to the `$_animation-props` map in the same file:

```scss
type: (
  // Existing animations...
  your-new-animation: var(--animation--type__your-new-animation),
)
```

### Step C: Add to Animation Types List
Add the animation name to the `$_types` list:

```scss
$_types: (
  // Existing types...
  your-new-animation,
)
```

### Step D: Create the Keyframes
In `libs/styles/2-tools/_tools.animations.scss`, add your animation keyframes definition. The naming convention follows `animation__category--name`:

```scss
@keyframes animation__category--your-new-animation {
  0% {
    // Starting state
    transform: scale(1);
  }
  
  50% {
    // Mid-point if needed
    transform: scale(1.2);
  }
  
  100% {
    // End state
    transform: scale(1);
  }
}
```

### Step E: Test and Use

Test your new animation with both utility classes and mixins:

```html
<!-- As a utility class -->
<div class="u-animate u-animate--type-animation__category--your-new-animation"></div>
```

```scss
// As a mixin
.element {
  @include animate(animation__category--your-new-animation);
}
```

## Using Animation Utilities

The simplest way to add animations is by applying utility classes directly in your HTML:

```html
<!-- Basic animation -->
<div class="u-animate u-animate--type-animation__fade--in">Content</div>

<!-- Animation with custom properties -->
<div class="u-animate u-animate--type-animation__slide--in-right u-animate--duration-slow u-animate--timing-bounce">
  Content
</div>

<!-- Applying transitions for hover effects -->
<button class="u-transition--transform u-hover-animate--grow">Hover me</button>
```

## Using SCSS Mixins

For more control, use the provided `animate` mixin. The mixin accepts parameters in this order:

```scss
@include animate(
  $_type: fade-in,         // The animation name (required)
  $_duration: medium,      // Duration (default: medium)
  $_timing: ease,          // Timing function (default: ease)
  $_delay: none,           // Delay (default: none)
  $_iteration: once,       // Iteration count (default: once)
  $_direction: normal      // Direction (default: normal)
);
```

Examples:

```scss
// Basic usage with default values
.element {
  @include animate(animation__fade--in);
}

// With custom properties
.element {
  @include animate(animation__slide--in-right, slow, ease-out);
}

// With specific direction
.element {
  @include animate(animation__attention--breadbump, medium, ease, none, once, alternate);
}

// Using only specific parameters
// Note: For positional parameters, you must include all parameters up to the last one you want to use
.element-with-custom-direction {
  @include animate(animation__attention--breadbump, medium, ease, none, once, alternate);
}
```

## Customizing Animations

### Custom Durations, Timings, and More

You can customize animation properties using utility classes:

```html
<div class="u-animate u-animate--type-animation__fade--in 
            u-animate--duration-slow 
            u-animate--timing-ease-out 
            u-animate--delay-medium 
            u-animate--iteration-infinite
            u-animate--direction-alternate">
  Content will fade in slowly with ease-out timing
</div>
```

### Available Animation Categories

Our animation system organizes animations into categories:

- **Fade**: Opacity-based animations (`animation__fade--in`, `animation__fade--out`, etc.)
- **Slide**: Position-based animations (`animation__slide--in-left`, `animation__slide--up`, etc.)
- **Scale**: Size-based animations (`animation__scale--up`, `animation__scale--down`, etc.)
- **Attention**: Attention-grabbing animations (`animation__attention--pulse`, `animation__attention--breadbump`, etc.)
- **Entrance/Exit**: Combined animations for entrances/exits
- **Loading**: Loading indicators (`animation__loading--spinner`, etc.)

Each category uses its own naming convention: `animation__category--name`