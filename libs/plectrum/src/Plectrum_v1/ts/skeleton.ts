import type { SkeletonDesignTokens } from '@primeuix/themes/types/skeleton';

 export default {
    root: {
        borderRadius: "{content.border.radius}"
    },
    colorScheme: {
        light: {
            root: {
                background: "{surface.200}",
                animationBackground: "rgba(255, 255, 255, 0.4)"
            }
        },
        dark: {
            root: {
                animationBackground: "rgba(255, 255, 255, 0.1)"
            }
        }
    }
} satisfies SkeletonDesignTokens;