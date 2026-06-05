import type { ToolbarDesignTokens } from '@primeuix/themes/types/toolbar';

 export default {
    root: {
        gap: "0.5rem",
        color: "{content.color}",
        padding: "0.5rem",
        background: "{primary.100}",
        borderColor: "{content.border.color}",
        borderRadius: "{border.radius.xl}"
    }
} satisfies ToolbarDesignTokens;