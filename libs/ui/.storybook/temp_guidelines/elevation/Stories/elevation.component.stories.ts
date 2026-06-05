import { Meta } from '@storybook/angular';

const underOptions = [
  '%u-elevation--under',
  '%u-elevation--under-2',
  '%u-elevation--under-3',
  '%u-elevation--under-4',
  '%u-elevation--under-5',
];
const raisedOptions = [
  '%u-elevation--raised',
  '%u-elevation--raised-2',
  '%u-elevation--raised-3',
  '%u-elevation--raised-4',
  '%u-elevation--raised-5',
];
const stickyOptions = [
  '%u-elevation--sticky',
  '%u-elevation--sticky-2',
  '%u-elevation--sticky-3',
  '%u-elevation--sticky-4',
  '%u-elevation--sticky-5',
];
const highRaisedOptions = [
  '%u-elevation--high-raised',
  '%u-elevation--high-raised-2',
  '%u-elevation--high-raised-3',
  '%u-elevation--high-raised-4',
  '%u-elevation--high-raised-5',
];
const overlaysOptions = [
  '%u-elevation--overlays',
  '%u-elevation--overlays-2',
  '%u-elevation--overlays-3',
  '%u-elevation--overlays-4',
  '%u-elevation--overlays-5',
];
const blockingOverlaysOptions = [
  '%u-elevation--blocking-overlays',
  '%u-elevation--blocking-overlays-2',
  '%u-elevation--blocking-overlays-3',
  '%u-elevation--blocking-overlays-4',
  '%u-elevation--blocking-overlays-5',
];

export default {
  title: 'Foundations / Elevation',
  argTypes: {
    '%u-elevation--under': {
      name: '%u-elevation--under',
      description:
        'Elevation context for elements that are placed below the surface',
      table: {
        defaultValue: {
          summary: '%u-elevation--under',
        },
        type: {
          summary: underOptions.join(' | '),
        },
      },
    },
    '%u-elevation--raised': {
      name: '%u-elevation--raised',
      description:
        'Elevation context for elements that are elevated slightly above the surface',
      table: {
        defaultValue: {
          summary: '%u-elevation--raised',
        },
        type: {
          summary: raisedOptions.join(' | '),
        },
      },
    },
    '%u-elevation--sticky': {
      name: '%u-elevation--sticky',
      description:
        'Elevation context for elements that stay fixed in position, and above `Raised` context',
      table: {
        defaultValue: {
          summary: '%u-elevation--sticky',
        },
        type: {
          summary: stickyOptions.join(' | '),
        },
      },
    },
    '%u-elevation--high-raised': {
      name: '%u-elevation--high-raised',
      description:
        'Elevation context for elements that are elevated slightly above `Sticky` elements',
      table: {
        defaultValue: {
          summary: '%u-elevation--high-raised',
        },
        type: {
          summary: highRaisedOptions.join(' | '),
        },
      },
    },
    '%u-elevation--overlays': {
      name: '%u-elevation--overlays',
      description:
        'Elevation context for elements that appear on top of other content without blocking it completely, and above `High raised` context',
      table: {
        defaultValue: {
          summary: '%u-elevation--overlays',
        },
        type: {
          summary: overlaysOptions.join(' | '),
        },
      },
    },
    '%u-elevation--blocking-overlays': {
      name: '%u-elevation--blocking-overlays',
      description:
        'Elevation context for elements that appear on top of other content and completely block interaction with the content below, and above `Overlays` context',
      table: {
        defaultValue: {
          summary: '%u-elevation--blocking-overlays',
        },
        type: {
          summary: blockingOverlaysOptions.join(' | '),
        },
      },
    },
  },
  tags: ['!autodocs', '!dev', 'Foundations'],
} as Meta;

export const Default = {
  render: () => ({
    template: '',
  }),
};
