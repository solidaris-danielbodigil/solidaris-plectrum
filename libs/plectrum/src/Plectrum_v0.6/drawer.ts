import type { DrawerDesignTokens } from '@primeuix/themes/types/drawer';

 export default {
    root: {
        color: "{overlay.modal.color}",
        shadow: "{overlay.modal.shadow}",
        background: "{overlay.modal.background}",
        borderColor: "{overlay.modal.border.color}"
    },
    title: {
        fontSize: "1.5rem",
        fontWeight: "600"
    },
    footer: {
        padding: "{overlay.modal.padding}"
    },
    header: {
        padding: "{overlay.modal.padding}"
    },
    content: {
        padding: "0 {overlay.modal.padding} {overlay.modal.padding} {overlay.modal.padding}"
    }
} satisfies DrawerDesignTokens;