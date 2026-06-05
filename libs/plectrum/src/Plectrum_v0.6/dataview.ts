import type { DataViewDesignTokens } from '@primeuix/themes/types/dataview';

 export default {
    root: {
        padding: "0",
        borderColor: "transparent",
        borderWidth: "0",
        borderRadius: "0"
    },
    footer: {
        color: "{content.color}",
        padding: "0.75rem 1rem",
        background: "{content.background}",
        borderColor: "{content.border.color}",
        borderWidth: "1px 0 0 0",
        borderRadius: "0"
    },
    header: {
        color: "{content.color}",
        padding: "0.75rem 1rem",
        background: "{content.background}",
        borderColor: "{content.border.color}",
        borderWidth: "0 0 1px 0",
        borderRadius: "0"
    },
    content: {
        color: "{content.color}",
        padding: "0",
        background: "{content.background}",
        borderColor: "transparent",
        borderWidth: "0",
        borderRadius: "0"
    },
    paginatorTop: {
        borderColor: "{content.border.color}",
        borderWidth: "0 0 1px 0"
    },
    paginatorBottom: {
        borderColor: "{content.border.color}",
        borderWidth: "1px 0 0 0"
    }
} satisfies DataViewDesignTokens;