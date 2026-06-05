import type { BadgeDesignTokens } from '@primeuix/themes/types/badge';

 export default {
    lg: {
        height: "1.5rem",
        fontSize: "0.875rem",
        minWidth: "1.5rem"
    },
    sm: {
        height: "1.25rem",
        fontSize: "0.75rem",
        minWidth: "1.25rem"
    },
    xl: {
        height: "1.75rem",
        fontSize: "1rem",
        minWidth: "1.75rem"
    },
    dot: {
        size: "0.75rem"
    },
    root: {
        height: "1.25rem",
        padding: "0 0.5rem",
        fontSize: "0.75rem",
        minWidth: "1.25rem",
        fontWeight: "700",
        borderRadius: "{border.radius.sm}"
    },
    colorScheme: {
        dark: {
            info: {
                color: "{sky.950}",
                background: "{sky.400}"
            },
            warn: {
                color: "{orange.950}",
                background: "{orange.400}"
            },
            danger: {
                color: "{red.950}",
                background: "{red.400}"
            },
            primary: {
                color: "{primary.contrast.color}",
                background: "{primary.color}"
            },
            success: {
                color: "{green.950}",
                background: "{green.400}"
            },
            contrast: {
                color: "{surface.950}",
                background: "{surface.0}"
            },
            secondary: {
                color: "{surface.300}",
                background: "{surface.800}"
            }
        },
        light: {
            info: {
                color: "{blue.900}",
                background: "{blue.50}"
            },
            warn: {
                color: "{orange.900}",
                background: "{orange.75}"
            },
            danger: {
                color: "{surface.0}",
                background: "{red.600}"
            },
            primary: {
                color: "{surface.900}",
                background: "{primary.75}"
            },
            success: {
                color: "{green.800}",
                background: "{green.75}"
            },
            contrast: {
                color: "{surface.0}",
                background: "{surface.950}"
            },
            secondary: {
                color: "{surface.900}",
                background: "{surface.75}"
            }
        }
    }
} satisfies BadgeDesignTokens;