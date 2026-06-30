import type { ProgressBarDesignTokens } from '@primeuix/themes/types/progressbar';

 export default {
    root: {
        background: "{content.border.color}",
        borderRadius: "{content.border.radius}",
        height: "0.5rem"
    },
    value: {
        background: "{primary.color}"
    },
    label: {
        color: "{primary.contrast.color}",
        fontSize: "0.625rem",
        fontWeight: "600"
    }
} satisfies ProgressBarDesignTokens;