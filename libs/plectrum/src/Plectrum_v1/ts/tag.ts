import type { TagDesignTokens } from '@primeuix/themes/types/tag';

 export default {
    icon: {
        size: "0.75rem"
    },
    root: {
        gap: "0.25rem",
        padding: "0.25rem 0.5rem",
        fontSize: "0.875rem",
        fontWeight: "600",
        borderRadius: "{content.border.radius}",
        roundedBorderRadius: "{border.radius.xl}"
    },
    colorScheme: {
        light: {
            info: {
                color: "{sky.800}",
                background: "{sky.100}"
            },
            warn: {
                color: "{orange.800}",
                background: "{orange.100}"
            },
            danger: {
                color: "{red.800}",
                background: "{red.100}"
            },
            primary: {
                color: "{primary.800}",
                background: "{primary.100}"
            },
            success: {
                color: "{green.800}",
                background: "{green.100}"
            },
            contrast: {
                color: "{surface.0}",
                background: "{surface.900}"
            },
            secondary: {
                color: "{surface.800}",
                background: "{surface.50}"
            }
        }
    }
} satisfies TagDesignTokens;