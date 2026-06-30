import type { TagDesignTokens } from '@primeuix/themes/types/tag';

 export default {
    root: {
        fontSize: "0.875rem",
        fontWeight: "600",
        padding: "0.25rem 0.5rem",
        gap: "0.25rem",
        borderRadius: "{content.border.radius}",
        roundedBorderRadius: "{border.radius.xl}"
    },
    icon: {
        size: "0.75rem"
    },
    colorScheme: {
        light: {
            primary: {
                background: "{primary.100}",
                color: "{primary.800}"
            },
            secondary: {
                background: "{surface.100}",
                color: "{surface.800}"
            },
            success: {
                background: "{green.100}",
                color: "{green.800}"
            },
            info: {
                background: "{sky.100}",
                color: "{sky.800}"
            },
            warn: {
                background: "{orange.100}",
                color: "{orange.800}"
            },
            danger: {
                background: "{red.100}",
                color: "{red.800}"
            },
            contrast: {
                background: "{surface.900}",
                color: "{surface.0}"
            }
        }
    }
} satisfies TagDesignTokens;