import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ButtonModule } from '@fba/button';
import { ToastModule, ToastService, ToastType } from '@fba/event';
import { AutocompleteModule, ButtonGroupModule, FormModule } from '@fba/form';
import { IconModule } from '@fba/icon';
import { AlertModule } from '@fba/info';
import { CardModule } from '@fba/panel';
import { Option } from '@fleetbridge-app/common';
import { getAnimations, getKeyframeAnimations } from '@fleetbridge-app/util';

/* eslint-disable max-lines */

interface AnimationSelection {
  category: string;
  property: string;
  value: string;
}

interface AnimationExample {
  name: string;
  selections: Array<AnimationSelection>;
  cssClass: string;
  isPlaying: boolean;
  animationName?: string;
}

interface AnimationProperty {
  id: string;
  label: string;
  value: string;
}

interface AnimationOption {
  id: string;
  label: string;
  value: string;
}

interface KeyframeAnimation {
  name: string;
  cssCode: string;
  isPlaying: boolean;
}

/**
 * Utility methods for animation component
 * Moving these outside the component class to reduce the file size
 */

// Default values for animation properties
export const DEFAULT_ANIMATION_VALUES = {
  duration: 'var(--animation--duration__medium)',
  timing: 'var(--animation--timing__ease)',
  delay: 'var(--animation--delay__none)',
  iteration: 'var(--animation--iteration__once)',
  direction: 'var(--animation--direction__normal)',
};

/**
 * Check if an animation property has a default value
 */
export function isDefaultAnimationProperty(
  category: string,
  property: string,
): boolean {
  return (
    (category === 'duration' && property === '--animation--duration__medium') ||
    (category === 'timing' && property === '--animation--timing__ease') ||
    (category === 'delay' && property === '--animation--delay__none') ||
    (category === 'iteration' && property === '--animation--iteration__once') ||
    (category === 'direction' && property === '--animation--direction__normal')
  );
}

/**
 * Generate the utility class for a given animation category and property
 */
export function generateAnimationUtilityClass(
  category: string,
  property: string,
): string {
  const [, propertyPart] = property.split('__');
  return `u-animate--${category}-${propertyPart}`;
}

@Component({
  selector: 'fba-animation',
  templateUrl: './animation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    ButtonModule,
    CardModule,
    FormModule,
    IconModule,
    AutocompleteModule,
    AlertModule,
    ClipboardModule,
    ToastModule,
    ButtonGroupModule,
  ],
})
export class AnimationComponent implements OnInit {
  readonly animations = signal<Record<string, Record<string, string>>>({});

  readonly selectedValues = signal<Record<string, string>>({});

  readonly examples = signal<Array<AnimationExample>>([]);

  readonly categoryOptions = signal<Array<string>>([]);

  readonly propertyOptions = signal<Record<string, Array<AnimationProperty>>>(
    {},
  );

  readonly animationsLoaded = signal(false);

  readonly keyframeAnimations = signal<Array<KeyframeAnimation>>([]);

  readonly keyframeOptions = signal<Array<AnimationOption>>([]);

  readonly animationCategories = signal<Array<{ id: string; label: string }>>([
    { id: 'all', label: 'All' },
  ]);

  readonly selectedCategory = signal<string>('all');

  readonly filteredKeyframeOptions = computed(() => {
    const category = this.selectedCategory();
    if (category === 'all') {
      return this.keyframeOptions();
    }

    // Filter keyframe options based on category from their names
    return this.keyframeOptions().filter((option) => {
      const parts = option.id.split('--');
      if (parts.length >= 2) {
        const keyframeCategory = parts[0].split('__')[1];
        return keyframeCategory === category;
      }
      return false;
    });
  });

  readonly scssCode = computed(() =>
    this.generateScssCode(this.getSelections()),
  );

  readonly utilityCode = computed(() =>
    this.generateUtilityCode(this.getSelections()),
  );

  readonly keyframeCode = computed(() => this.generateKeyframeCode());

  private clipboard = inject(Clipboard);

  private toast = inject(ToastService);

  private renderer = inject(Renderer2);

  private el = inject(ElementRef);

  /**
   * Get the selected option for a category as an Option array for the autocomplete component
   */
  getSelectedOptionForCategory(category: string): Array<Option<string>> {
    const value = this.selectedValues()[category];
    if (!value) {
      return [];
    }

    // Find the matching option in the property options
    const options =
      category === 'type'
        ? this.keyframeOptions()
        : this.propertyOptions()[category] || [];

    const matchingOption = options.find((opt) => opt.id === value);

    if (matchingOption) {
      return [{ id: matchingOption.id, label: matchingOption.label }];
    }

    // Fallback if no matching option found
    return [{ id: value, label: value.replace('animation-', '') }];
  }

  ngOnInit(): void {
    this.loadKeyframeAnimations();
    this.loadAnimations();

    // Initialize examples if there are selections
    this.updateExamples();
  }

  /**
   * Handle animation category selection
   */
  onCategorySelected(categoryId: string): void {
    this.selectedCategory.set(categoryId);

    // Clear current type selection when switching categories
    if (this.selectedValues()['type']) {
      const currentValues = { ...this.selectedValues() };
      delete currentValues['type'];
      this.selectedValues.set(currentValues);
    }
  }

  /**
   * Load animations from CSS custom properties
   */
  loadAnimations(): void {
    try {
      const animationsData = getAnimations();

      if (animationsData && Object.keys(animationsData).length > 0) {
        this.animations.set(animationsData);

        let categories = Object.keys(animationsData);

        // Reorder categories to put 'type' first
        if (categories.includes('type')) {
          categories = [
            'type',
            ...categories.filter((category) => category !== 'type'),
          ];
        }

        this.categoryOptions.set(categories);

        const propertyOpts: Record<string, Array<AnimationProperty>> = {};
        categories.forEach((category) => {
          if (category === 'type') {
            // For type category, use keyframe options directly
            propertyOpts[category] = this.getKeyframeOptionsForType();
          } else {
            propertyOpts[category] = this.initializePropertyOptions(
              category,
              animationsData,
            );
          }
        });

        this.propertyOptions.set(propertyOpts);
        this.animationsLoaded.set(true);

        // Ensure keyframe options are updated and synchronized
        this.updateKeyframeRelatedOptions();

        // Update examples based on current selections
        this.updateExamples();
      } else {
        this.animationsLoaded.set(false);
      }
    } catch (error) {
      console.error('Failed to load animations', error);
      this.animationsLoaded.set(false);
    }
  }

  /**
   * Convert keyframe options for use as animation type properties
   */
  getKeyframeOptionsForType(): Array<AnimationProperty> {
    // Use filtered options based on selected category
    return this.filteredKeyframeOptions().map((option) => {
      const keyframeName = option.id;
      // Extract a user-friendly label from the animation name pattern
      // animation__category--name-of-animation → name-of-animation
      const nameParts = keyframeName.split('--');
      const animationType = nameParts.length > 1 ? nameParts[1] : keyframeName;

      return {
        id: keyframeName,
        label: animationType,
        value: keyframeName,
      };
    });
  }

  /**
   * Handle selection of an animation property
   */
  onPropertySelected(category: string, propertyId: string): void {
    if (category === 'type') {
      // For type category, use the full animation name
      const currentValues = { ...this.selectedValues() };

      // Use the full animation name (it already has the animation__category--name format)
      currentValues[category] = propertyId;

      this.selectedValues.set(currentValues);
      this.updateExamples();
    } else if (propertyId && this.animations()[category]) {
      const currentValues = { ...this.selectedValues() };
      currentValues[category] = propertyId;
      this.selectedValues.set(currentValues);
      this.updateExamples();
    }
  }

  /**
   * Remove a selected animation property
   */
  onPropertyRemoved(category: string): void {
    const currentValues = { ...this.selectedValues() };
    if (currentValues[category]) {
      delete currentValues[category];
      this.selectedValues.set(currentValues);
      this.updateExamples();
    }
  }

  /**
   * Get all current selections as structured data, applying defaults for missing categories
   */
  getSelections(): Array<AnimationSelection> {
    const selections: Array<AnimationSelection> = [];
    const currentValues = this.selectedValues();
    const currentAnimations = this.animations();

    if (!currentValues['type']) {
      return selections;
    }

    Object.keys(currentValues).forEach((category) => {
      const propertyId = currentValues[category];

      if (category === 'type') {
        // For type category, handle keyframe name
        const keyframeName = propertyId;
        const animationType = keyframeName.replace('animation-', '');

        selections.push({
          category: 'type',
          property: `--animation--type__${animationType}`,
          value: animationType,
        });
      } else if (propertyId && currentAnimations[category]) {
        const propertyValue = currentAnimations[category][propertyId];

        // Handle different property format patterns
        const varMatch = propertyId.match(/var\((--animation--[^_]+__[^)]+)\)/);
        if (varMatch) {
          const fullProp = varMatch[1];
          const parts = fullProp.split('__');
          const category = parts[0].split('--')[2];

          selections.push({
            category,
            property: fullProp,
            value: propertyValue,
          });
        }
      }
    });

    // Add defaults for missing properties
    Object.entries(DEFAULT_ANIMATION_VALUES).forEach(
      ([category, defaultValue]) => {
        const hasCategory = selections.some((s) => s.category === category);

        if (!hasCategory) {
          const match = defaultValue.match(
            /var\((--animation--[^_]+__[^)]+)\)/,
          );
          if (match) {
            const property = match[1];

            let value = '';
            if (currentAnimations[category]) {
              value = currentAnimations[category][defaultValue] || '';
            }

            selections.push({
              category,
              property,
              value,
            });
          }
        }
      },
    );

    return selections;
  }

  /**
   * Toggle animation state on an element
   */
  toggleAnimation(example: AnimationExample): void {
    const currentExamples = [...this.examples()];
    const index = currentExamples.findIndex((e) => e.name === example.name);

    if (index !== -1) {
      const newExample = {
        ...example,
        isPlaying: !example.isPlaying,
      };

      currentExamples[index] = newExample;
      this.examples.set(currentExamples);

      if (newExample.isPlaying) {
        // When toggling to play, we need to reset first to ensure
        // the animation starts from the beginning
        this.resetAnimation(newExample);
      }
    }
  }

  /**
   * Reset the animation
   */
  resetAnimation(example: AnimationExample): void {
    const container = this.el.nativeElement as HTMLElement;
    const exampleElement = container.querySelector(
      `.animation-example-${example.name} .animation-preview__object`,
    ) as HTMLElement;

    if (exampleElement) {
      const baseClasses = ['animation-preview__object', 'u-animate'];

      // Reset by removing animation classes and keeping only base classes
      this.renderer.setAttribute(
        exampleElement,
        'class',
        baseClasses.join(' '),
      );

      // Reset the animation name custom property
      this.renderer.setStyle(exampleElement, '--_local-animation-name', 'none');

      this.forceReflow(exampleElement);

      if (example.isPlaying) {
        const additionalClasses = example.cssClass
          .split(' ')
          .filter((cls) => cls !== 'u-animate');

        const finalClasses = [...baseClasses, ...additionalClasses];
        this.renderer.setAttribute(
          exampleElement,
          'class',
          finalClasses.join(' '),
        );

        // Explicitly set the animation name as a custom property
        // This ensures it overrides any other classes that might set it
        this.renderer.setStyle(
          exampleElement,
          '--_local-animation-name',
          example.animationName,
        );
      }
    }
  }

  /**
   * Copy value to clipboard
   */
  copyToClipboard(value: string): void {
    this.clipboard.copy(value);
    this.toast.pushToast('Copied to clipboard', ToastType.success);
  }

  /**
   * Manually trigger loading animations
   */
  manuallyLoadAnimations(): void {
    this.loadAnimations();
  }

  /**
   * Helper method to get correctly formatted options for autocomplete
   */
  getPropertyOptions(category: string): Array<AnimationProperty> {
    return this.propertyOptions()[category] || [];
  }

  /**
   * Ensure all keyframe-related dropdown items are correctly updated when animations are loaded
   */
  private updateKeyframeRelatedOptions(): void {
    // Ensure the type category uses keyframe options
    const propertyOpts = { ...this.propertyOptions() };
    if (propertyOpts['type']) {
      propertyOpts['type'] = this.getKeyframeOptionsForType();
      this.propertyOptions.set(propertyOpts);
    }
  }

  /**
   * Initialize options for a specific category
   */
  private initializePropertyOptions(
    category: string,
    animations: Record<string, Record<string, string>>,
  ): Array<AnimationProperty> {
    if (animations[category]) {
      const properties = animations[category];

      return Object.keys(properties).map((key) => {
        // Extract property name from CSS variable format var(--animation--category__property)
        const match = key.match(/var\((--animation--[^_]+__([^)]+))\)/);
        // Use the display name for the label, falling back to the key if not found
        const displayName = match ? match[1].split('__')[1] : key;

        return {
          id: key,
          label: displayName,
          value: properties[key],
        };
      });
    }
    return [];
  }

  /**
   * Generate SCSS code example from selections
   */
  private generateScssCode(selections: Array<AnimationSelection>): string {
    if (selections.length === 0) {
      return '';
    }

    // Get the animation name (required parameter)
    const keyframeName = this.selectedValues()['type'] || 'animation__fade--in';

    // Helper to extract the shorthand name from a property
    const getShorthand = (selection) => {
      if (!selection) return null;
      return selection.property.split('__')[1];
    };

    // Default values based on the mixin definition
    const defaults = {
      duration: 'medium',
      timing: 'ease',
      delay: 'none',
      iteration: 'once',
      direction: 'normal',
    };

    // Get the values for each parameter (using defaults if not specified or if default value selected)
    const getDuration = () => {
      const selection = selections.find((s) => s.category === 'duration');
      if (
        selection &&
        !isDefaultAnimationProperty(selection.category, selection.property)
      ) {
        return getShorthand(selection);
      }
      return null; // use default
    };

    const getTiming = () => {
      const selection = selections.find((s) => s.category === 'timing');
      if (
        selection &&
        !isDefaultAnimationProperty(selection.category, selection.property)
      ) {
        return getShorthand(selection);
      }
      return null; // use default
    };

    const getDelay = () => {
      const selection = selections.find((s) => s.category === 'delay');
      if (
        selection &&
        !isDefaultAnimationProperty(selection.category, selection.property)
      ) {
        return getShorthand(selection);
      }
      return null; // use default
    };

    const getIteration = () => {
      const selection = selections.find((s) => s.category === 'iteration');
      if (
        selection &&
        !isDefaultAnimationProperty(selection.category, selection.property)
      ) {
        return getShorthand(selection);
      }
      return null; // use default
    };

    const getDirection = () => {
      const selection = selections.find((s) => s.category === 'direction');
      if (
        selection &&
        !isDefaultAnimationProperty(selection.category, selection.property)
      ) {
        return getShorthand(selection);
      }
      return null; // use default
    };

    // Extract actual values
    const duration = getDuration();
    const timing = getTiming();
    const delay = getDelay();
    const iteration = getIteration();
    const direction = getDirection();

    // Check which parameters need to be included (we include all parameters up to the last non-default one)
    const needsDirection = direction !== null;
    const needsIteration = iteration !== null || needsDirection;
    const needsDelay = delay !== null || needsIteration;
    const needsTiming = timing !== null || needsDelay;
    const needsDuration = duration !== null || needsTiming;

    // Build the positional parameter string
    let result = `@include animate(${keyframeName}`;

    if (needsDuration) {
      result += `, ${duration || defaults.duration}`;
    }

    if (needsTiming) {
      result += `, ${timing || defaults.timing}`;
    }

    if (needsDelay) {
      result += `, ${delay || defaults.delay}`;
    }

    if (needsIteration) {
      result += `, ${iteration || defaults.iteration}`;
    }

    if (needsDirection) {
      result += `, ${direction}`;
    }

    result += ');';
    return result;
  }

  /**
   * Generate utility code example from selections
   */
  private generateUtilityCode(selections: Array<AnimationSelection>): string {
    if (selections.length === 0) {
      return '';
    }

    let utilityCode = 'u-animate';
    const typeSelection = selections.find((s) => s.category === 'type');

    if (typeSelection) {
      // For keyframe animations, use the animation name directly
      const selectedValue = this.selectedValues()['type'] || '';
      const animationType = selectedValue.replace('animation-', '');
      utilityCode += ` u-animate--type-${animationType}`;
    }

    selections.forEach((selection) => {
      if (selection.category === 'type') return;

      if (!isDefaultAnimationProperty(selection.category, selection.property)) {
        utilityCode += ` ${generateAnimationUtilityClass(selection.category, selection.property)}`;
      }
    });

    return utilityCode;
  }

  /**
   * Load keyframe animations from stylesheet
   */
  private loadKeyframeAnimations(): void {
    try {
      const keyframeCategories = getKeyframeAnimations();

      // Create categories list for the button group
      const categoryList = Object.keys(keyframeCategories).map((category) => ({
        id: category,
        label: category.charAt(0).toUpperCase() + category.slice(1),
      }));

      // Sort categories with 'All' first, then alphabetically
      const sortedCategories = categoryList.sort((a, b) => {
        if (a.id === 'all') return -1;
        if (b.id === 'all') return 1;
        return a.label.localeCompare(b.label);
      });

      this.animationCategories.set(sortedCategories);

      // Flatten all animations for the keyframe options
      const allKeyframes = keyframeCategories['all'] || [];

      // Filter out duplicate keyframe names using a Set
      const uniqueKeyframeNames = [...new Set(allKeyframes)];

      const keyframes: Array<KeyframeAnimation> = uniqueKeyframeNames.map(
        (name) => ({
          name,
          cssCode: '', // We don't need this anymore
          isPlaying: false,
        }),
      );

      this.keyframeAnimations.set(
        keyframes.sort((a, b) => a.name.localeCompare(b.name)),
      );

      this.keyframeOptions.set(
        keyframes.map((animation) => {
          // Extract a user-friendly label from the animation name pattern
          // animation__category--name-of-animation → name-of-animation
          const nameParts = animation.name.split('--');
          const displayName =
            nameParts.length > 1 ? nameParts[1] : animation.name;

          return {
            id: animation.name,
            label: displayName,
            value: animation.name,
          };
        }),
      );

      // Update any type options to use keyframes
      if (this.animationsLoaded()) {
        this.updateKeyframeRelatedOptions();
      }
    } catch (error) {
      console.error('Failed to load keyframe animations', error);
    }
  }

  /**
   * Forces a reflow on an element by reading a layout property
   * This is necessary for animations to reset properly when re-applying the same animation classes.
   * Without this, the browser would optimize away the redundant class changes and the animation wouldn't restart.
   * @param element The element to force reflow on
   */
  private forceReflow(element: HTMLElement): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { offsetHeight } = element;
  }

  /**
   * Generate keyframe code for the selected animation type
   *
   * This method extracts the actual definition of the current keyframe animation.
   * It searches through the document's stylesheets to find the complete keyframe rule
   * with all its properties (0%, 100%, etc.) and CSS declarations.
   *
   * @returns A formatted string containing the full keyframe definition
   */
  private generateKeyframeCode(): string {
    const selectedType = this.selectedValues()['type'];
    if (!selectedType) {
      return '';
    }

    // Use the full keyframe name as is (should be animation__category--name)
    const fullKeyframeName = selectedType;

    // Try to find the actual keyframe rule in the stylesheets
    try {
      // Loop through all stylesheets
      for (let i = 0; i < document.styleSheets.length; i++) {
        const styleSheet = document.styleSheets[i];

        try {
          // Get all rules in the stylesheet
          const rules = styleSheet.cssRules || styleSheet.rules;

          // Loop through rules to find matching keyframe
          for (let j = 0; j < rules.length; j++) {
            const rule = rules[j];

            // Check if it's a keyframe rule and matches our selected type
            if (rule.type === CSSRule.KEYFRAMES_RULE) {
              // Type assertion for keyframe rule
              const keyframeRule = rule as unknown as {
                name: string;
                cssRules: Array<{
                  keyText: string;
                  style: CSSStyleDeclaration;
                }>;
              };

              // Match the exact animation name
              if (keyframeRule.name === fullKeyframeName) {
                // Found matching keyframe, now build the string representation
                let keyframeText = `@keyframes ${keyframeRule.name} {\n`;

                // Get all keyframe rules (0%, 100%, etc.)
                for (let k = 0; k < keyframeRule.cssRules.length; k++) {
                  const keyframe = keyframeRule.cssRules[k];
                  keyframeText += `  ${keyframe.keyText} {\n`;

                  // Get all style declarations
                  const { style } = keyframe;
                  for (let l = 0; l < style.length; l++) {
                    const propertyName = style[l];
                    const propertyValue = style.getPropertyValue(propertyName);
                    keyframeText += `    ${propertyName}: ${propertyValue};\n`;
                  }

                  keyframeText += '  }\n\n';
                }

                keyframeText += '}';
                return keyframeText;
              }
            }
          }
        } catch (securityError) {
          // Skip this stylesheet due to CORS errors
          // eslint-disable-next-line no-continue
          continue;
        }
      }

      // If keyframe not found in stylesheets, fall back to a generic template
      return `@keyframes ${fullKeyframeName} {
  /* Custom animation */
  /* Unable to access specific keyframe definition due to browser security restrictions */
}`;
    } catch (error) {
      console.error('Error accessing keyframes:', error);
      return `@keyframes ${fullKeyframeName} {
  /* Error accessing keyframe definition */
}`;
    }
  }

  /**
   * Update Animation Demo based on current selections
   */
  private updateExamples(): void {
    const selections = this.getSelections();

    // Don't create examples if no animation type is selected
    if (!selections.find((s) => s.category === 'type')) {
      this.examples.set([]);
      return;
    }

    // Create a single example with all current selections
    const typeSelection = selections.find((s) => s.category === 'type');
    if (typeSelection) {
      const animationName = typeSelection.value;
      const selectedValue = this.selectedValues()['type'] || '';

      // Get animation CSS classes
      let cssClass = 'u-animate';

      // For keyframe animations, add the type class
      cssClass += ` u-animate--type-${animationName}`;

      // Add any non-default property classes
      selections.forEach((selection) => {
        if (selection.category === 'type') return;

        if (
          !isDefaultAnimationProperty(selection.category, selection.property)
        ) {
          cssClass += ` ${generateAnimationUtilityClass(selection.category, selection.property)}`;
        }
      });

      const example: AnimationExample = {
        name: animationName,
        selections,
        cssClass,
        isPlaying: false,
        animationName: selectedValue,
      };

      this.examples.set([example]);
    }
  }
}
