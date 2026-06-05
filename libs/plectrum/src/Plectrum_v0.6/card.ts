import type { CardDesignTokens } from '@primeuix/themes/types/card';

 export default {
    body: {
        gap: "0.5rem",
        padding: "1.25rem"
    },
    root: {
        color: "{content.color}",
        shadow: "0 0 0 1px rgba(0, 0, 0, 0.10)",
        background: "{content.background}",
        borderRadius: "{border.radius.xl}"
    },
    title: {
        fontSize: "1.25rem",
        fontWeight: "600"
    },
    caption: {
        gap: "0.5rem"
    },
    subtitle: {
        color: "{text.muted.color}"
    }
} satisfies CardDesignTokens;