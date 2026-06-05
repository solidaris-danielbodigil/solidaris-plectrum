import { ButtonModule } from '@fba/button';
import { ToastModule, ToastService } from '@fba/event';
import { AutocompleteModule, ButtonGroupModule, FormModule } from '@fba/form';
import { IconModule } from '@fba/icon';
import { AlertModule } from '@fba/info';
import { CardModule } from '@fba/panel';
import { getAnimations, getKeyframeAnimations } from '@fleetbridge-app/util';
import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { AnimationComponent } from '../animation.component';
import { AnimationModule } from '../animation.module';

// Define type for our custom CSS properties
interface AnimationArgTypes {
  [key: `--animation--${string}`]: {
    control: string;
    description: string;
    table: {
      type: { summary: string };
      defaultValue: { summary: string };
      category: string;
    };
  };
}

// Define keyframe animation data structure for documentation
interface KeyframeAnimationData {
  name: string;
  category: string;
  exampleCode?: string;
}

// Default values to determine which properties are defaults
const defaultPropertyValues = {
  duration: 'medium',
  timing: 'ease',
  delay: 'none',
  iteration: 'once',
  direction: 'normal',
};

/**
 * Generate a meaningful description for an animation property
 * @param category Animation category (duration, timing, delay, etc.)
 * @param propertyName The name of the property (e.g., 'fast', 'bounce', 'infinite')
 * @param value The CSS value of the property
 */
function getPropertyDescription(
  category: string,
  propertyName: string,
  value: string,
): string {
  // Generate description based on category and property name
  switch (category) {
    case 'duration': {
      // Parse the value to get the duration in ms
      const durationMatch = value.match(/(\d+)ms/);
      const duration = durationMatch ? durationMatch[1] : value;
      return `${
        propertyName.charAt(0).toUpperCase() + propertyName.slice(1)
      } animation duration (${duration})`;
    }

    case 'timing':
      if (propertyName === 'ease') return 'Default easing curve';
      if (propertyName === 'linear') return 'Linear easing (no acceleration)';
      if (propertyName.includes('bounce'))
        return `${
          propertyName.includes('gentle') ? 'Gentle' : 'Strong'
        } bounce effect`;
      if (propertyName === 'elastic') return 'Elastic, stretchy effect';
      if (propertyName === 'snappy') return 'Quick, snappy movement';
      if (propertyName === 'gentle') return 'Gentle, subtle movement';
      if (propertyName === 'ease-in') return 'Slow start, fast end';
      if (propertyName === 'ease-out') return 'Fast start, slow end';
      if (propertyName === 'ease-in-out') return 'Slow start, slow end';
      return `${propertyName.replace(/-/g, ' ')} timing function`;

    case 'delay': {
      // Parse the value to get the delay in ms
      const delayMatch = value.match(/(\d+)ms/);
      const delay = delayMatch ? delayMatch[1] : value;
      if (propertyName === 'none') return 'No delay';
      return `${
        propertyName.charAt(0).toUpperCase() + propertyName.slice(1)
      } delay (${delay})`;
    }

    case 'iteration':
      if (propertyName === 'once') return 'Play animation once';
      if (propertyName === 'twice') return 'Play animation twice';
      if (propertyName === 'thrice') return 'Play animation three times';
      if (propertyName === 'infinite') return 'Play animation infinitely';
      return `Play animation ${propertyName} times`;

    case 'direction':
      if (propertyName === 'normal') return 'Play animation normally';
      if (propertyName === 'reverse') return 'Play animation in reverse';
      if (propertyName === 'alternate')
        return 'Play animation forwards then backwards';
      if (propertyName === 'alternate-reverse')
        return 'Play animation backwards then forwards';
      return `Play animation in ${propertyName} direction`;

    case 'type':
      if (propertyName.includes('fade')) {
        return `Fade ${propertyName.includes('in') ? 'in' : 'out'} animation`;
      }

      if (propertyName.includes('slide')) {
        const direction = propertyName.replace('slide-', '');
        return `Slide ${direction} animation`;
      }

      if (propertyName.includes('scale')) {
        const scaleType = propertyName.replace('scale-', '');
        return `Scale ${scaleType} animation`;
      }

      if (propertyName.includes('rotate')) {
        const degrees = propertyName.replace('rotate-', '');
        return `${degrees}-degree rotation animation`;
      }

      return `${propertyName.replace(/-/g, ' ')} animation`;

    default:
      // For any other categories, generate a generic description
      return `${category}: ${propertyName.replace(/-/g, ' ')} (${value})`;
  }
}

// Function to dynamically generate argTypes from our animation properties
function generateArgTypes(): AnimationArgTypes {
  const argTypes: AnimationArgTypes = {};

  try {
    // This will only work in browser environment - Storybook runs in browser so it's fine
    // For build environments without a DOM, we'll need to handle the exception
    const animationProperties =
      typeof document !== 'undefined' ? getAnimations() : {};

    // Loop through each category and its properties
    Object.entries(animationProperties).forEach(([category, properties]) => {
      // Convert category name to proper case for display
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

      // Add each property to argTypes
      Object.entries(properties as Record<string, string>).forEach(
        ([propertyId, value]) => {
          // Extract property name from CSS variable format var(--animation--category__property)
          const match = propertyId.match(/var\(--animation--[^_]+__([^)]+)\)/);
          const propertyName = match ? match[1] : propertyId;

          const isDefault =
            propertyName ===
            defaultPropertyValues[
              category as keyof typeof defaultPropertyValues
            ];

          // Get a meaningful description for this property
          const baseDescription = getPropertyDescription(
            category,
            propertyName,
            value,
          );
          const description = isDefault
            ? `${baseDescription} (Default)`
            : baseDescription;

          const cssVarName = `--animation--${category}__${propertyName}`;
          const typeValue = isDefault ? 'default' : 'string';

          argTypes[cssVarName] = {
            description,
            table: {
              type: { summary: typeValue },
              defaultValue: { summary: value },
              category: `${categoryName}s`, // Make plural, e.g., "Durations"
            },
            control: false, // Disable controls entirely
          };
        },
      );
    });
  } catch (error) {
    console.warn('Unable to generate animation argTypes:', error);
  }

  return argTypes;
}

// Function to generate keyframe animation data for documentation
function generateKeyframeAnimationData(): Array<KeyframeAnimationData> {
  // This will only work in browser environment
  if (typeof document === 'undefined') {
    return [];
  }

  try {
    // Get keyframe animation names from CSS
    const keyframeCategories = getKeyframeAnimations();

    // Flatten the categorized keyframes into a single array
    const allKeyframeNames: Array<string> = [];
    Object.values(keyframeCategories).forEach((categoryAnimations) => {
      allKeyframeNames.push(...categoryAnimations);
    });

    // Convert to documentation format
    return allKeyframeNames.map((name) => {
      // Extract category from animation__category--name pattern
      const parts = name.split('--');
      const category = parts.length >= 2 ? parts[0].split('__')[1] : 'Other';

      return {
        name,
        category,
      };
    });
  } catch (error) {
    console.warn('Unable to generate keyframe animation data:', error);
    return [];
  }
}

const meta: Meta<AnimationComponent> = {
  title: 'Foundations/Animation',
  component: AnimationComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        CardModule,
        ToastModule,
        ButtonModule,
        IconModule,
        ButtonGroupModule,
        AutocompleteModule,
        FormModule,
        AlertModule,
        AnimationModule,
      ],
    }),
    applicationConfig({
      providers: [ToastService],
    }),
  ],
  // Dynamically generate argTypes from our properties
  argTypes: generateArgTypes(),
  parameters: {
    docs: {
      description: {
        component:
          'Animation utilities, mixins, and variables for consistent motion across the application.',
      },
      controls: {
        expanded: true,
        sort: 'requiredFirst',
        exclude: Object.keys(generateArgTypes()), // Exclude all animation custom properties from controls
      },
    },
    // Add keyframe documentation data
    keyframes: generateKeyframeAnimationData(),
  },
};

export default meta;

type Story = StoryObj<AnimationComponent>;

export const Playground: Story = {
  args: {},
};
