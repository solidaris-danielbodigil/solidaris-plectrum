import type { AvatarDesignTokens } from '@primeuix/themes/types/avatar';

 export default {
    lg: {
        icon: {
            size: "1.5rem"
        },
        group: {
            offset: "-1rem"
        },
        width: "3rem",
        height: "3rem",
        fontSize: "1.5rem"
    },
    xl: {
        icon: {
            size: "2rem"
        },
        group: {
            offset: "-1.5rem"
        },
        width: "4rem",
        height: "4rem",
        fontSize: "2rem"
    },
    icon: {
        size: "1rem"
    },
    root: {
        color: "{surface.0}",
        width: "2rem",
        height: "2rem",
        fontSize: "1rem",
        background: "{branding.800}",
        borderRadius: "{content.border.radius}"
    },
    group: {
        offset: "-0.75rem",
        borderColor: "#0000000d"
    }
} satisfies AvatarDesignTokens;