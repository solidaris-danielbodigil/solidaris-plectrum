import type { PopoverDesignTokens } from '@primeuix/themes/types/popover';

 export default {
    root: {
        color: "{overlay.popover.color}",
        gutter: "10px",
        shadow: "{overlay.popover.shadow}",
        background: "{overlay.popover.background}",
        arrowOffset: "1.25rem",
        borderColor: "{overlay.popover.border.color}",
        borderRadius: "{overlay.popover.border.radius}"
    },
    content: {
        padding: "{overlay.popover.padding}"
    }
} satisfies PopoverDesignTokens;