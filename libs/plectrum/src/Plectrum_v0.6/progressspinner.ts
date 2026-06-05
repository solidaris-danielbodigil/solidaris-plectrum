import type { ProgressSpinnerDesignTokens } from '@primeuix/themes/types/progressspinner';

 export default {
    colorScheme: {
        dark: {
            root: {
                colorOne: "{red.400}",
                colorTwo: "{blue.400}",
                colorFour: "{yellow.400}",
                colorThree: "{green.400}"
            }
        },
        light: {
            root: {
                colorOne: "{rose.600}",
                colorTwo: "{rose.200}",
                colorFour: "{primary.600}",
                colorThree: "{primary.200}"
            }
        }
    }
} satisfies ProgressSpinnerDesignTokens;