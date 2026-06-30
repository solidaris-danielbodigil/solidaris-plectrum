import type { PasswordDesignTokens } from '@primeuix/themes/types/password';

 export default {
    meter: {
        background: "{content.border.color}",
        borderRadius: "{content.border.radius}",
        height: "0.75rem"
    },
    icon: {
        color: "{form.field.icon.color}"
    },
    overlay: {
        background: "{overlay.popover.background}",
        borderColor: "{overlay.popover.border.color}",
        borderRadius: "{overlay.popover.border.radius}",
        color: "{overlay.popover.color}",
        padding: "{overlay.popover.padding}",
        shadow: "0 2px 4px -2px #0000001a, 0 4px 6px -1px #0000001a"
    },
    content: {
        gap: "0.5rem"
    },
    colorScheme: {
        light: {
            strength: {
                weakBackground: "{red.500}",
                mediumBackground: "{amber.500}",
                strongBackground: "{green.500}"
            }
        }
    }
} satisfies PasswordDesignTokens;