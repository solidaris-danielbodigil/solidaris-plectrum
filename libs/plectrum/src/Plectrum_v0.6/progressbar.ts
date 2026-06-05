import type { ProgressBarDesignTokens } from '@primeuix/themes/types/progressbar';

 export default {
    root: {
        height: "1.4rem",
        background: "{content.border.color}",
        borderRadius: "{content.border.radius}"
    },
    label: {
        color: "{primary.contrast.color}",
        fontSize: "0.75rem",
        fontWeight: "700"
    },
    value: {
        background: "{primary.500}"
    }
} satisfies ProgressBarDesignTokens;