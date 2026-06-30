import type { BadgeDesignTokens } from '@primeuix/themes/types/badge';

 export default {
    root: {
        borderRadius: "{border.radius.md}",
        padding: "0 0.5rem",
        fontSize: "0.75rem",
        fontWeight: "700",
        minWidth: "1.5rem",
        height: "1.5rem"
    },
    dot: {
        size: "0.5rem"
    },
    sm: {
        fontSize: "0.625rem",
        minWidth: "1.25rem",
        height: "1.25rem"
    },
    lg: {
        fontSize: "0.875rem",
        minWidth: "1.75rem",
        height: "1.75rem"
    },
    xl: {
        fontSize: "1rem",
        minWidth: "2rem",
        height: "2rem"
    },
    colorScheme: {
        light: {
            primary: {
                background: "{primary.200}",
                color: "{text.color}"
            },
            secondary: {
                background: "{surface.200}",
                color: "{text.color}"
            },
            success: {
                background: "{button.success.background}",
                color: "{button.success.color}"
            },
            info: {
                background: "{button.info.background}",
                color: "{button.info.color}"
            },
            warn: {
                background: "{button.warn.background}",
                color: "{button.warn.color}"
            },
            danger: {
                background: "{button.danger.background}",
                color: "{button.danger.color}"
            },
            contrast: {
                background: "{button.contrast.background}",
                color: "{button.contrast.color}"
            }
        }
    }
} satisfies BadgeDesignTokens;