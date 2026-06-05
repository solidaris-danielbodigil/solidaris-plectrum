import type { SkeletonDesignTokens } from '@primeuix/themes/types/skeleton';

 export default {
    root: {
        borderRadius: "{content.border.radius}"
    },
    colorScheme: {
        dark: {
            root: {
                background: "rgba(255, 255, 255, 0.06)",
                animationBackground: "rgba(255, 255, 255, 0.04)"
            }
        },
        light: {
            root: {
                background: "{surface.75}",
                animationBackground: "rgba(255,255,255,0.4)"
            }
        }
    }
} satisfies SkeletonDesignTokens;