import type { ConfirmPopupDesignTokens } from '@primeuix/themes/types/confirmpopup';

 export default {
    icon: {
        size: "1rem",
        color: "{overlay.popover.color}"
    },
    root: {
        color: "{overlay.popover.color}",
        gutter: "10px",
        shadow: "{overlay.popover.shadow}",
        background: "{overlay.popover.background}",
        arrowOffset: "1.25rem",
        borderColor: "{overlay.popover.border.color}",
        borderRadius: "{overlay.popover.border.radius}"
    },
    footer: {
        gap: "0.5rem",
        padding: "0 {overlay.popover.padding} {overlay.popover.padding} {overlay.popover.padding}"
    },
    content: {
        gap: "1rem",
        padding: "{overlay.popover.padding}"
    }
} satisfies ConfirmPopupDesignTokens;