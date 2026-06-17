import type { BadgeDesignTokens } from '@primeuix/themes/types/badge';

 export default {
    lg: {
        height: "1.75rem",
        fontSize: "0.875rem",
        minWidth: "1.75rem"
    },
    sm: {
        height: "1.25rem",
        fontSize: "0.625rem",
        minWidth: "1.25rem"
    },
    xl: {
        height: "2rem",
        fontSize: "1rem",
        minWidth: "2rem"
    },
    dot: {
        size: "0.5rem"
    },
    root: {
        height: "1.5rem",
        padding: "0 0.5rem",
        fontSize: "0.75rem",
        minWidth: "1.5rem",
        fontWeight: "700",
        borderRadius: "{border.radius.md}"
    },
    colorScheme: {
        light: {
            info: {
                color: "{button.info.color}",
                background: "{button.info.background}"
            },
            warn: {
                color: "{button.warn.color}",
                background: "{button.warn.background}"
            },
            danger: {
                color: "{button.danger.color}",
                background: "{button.danger.background}"
            },
            primary: {
                color: "{text.color}",
                background: "{primary.50}"
            },
            success: {
                color: "{button.success.color}",
                background: "{button.success.background}"
            },
            contrast: {
                color: "{button.contrast.color}",
                background: "{button.contrast.background}"
            },
            secondary: {
                color: "{text.color}",
                background: "{surface.50}"
            }
        }
    }
} satisfies BadgeDesignTokens;