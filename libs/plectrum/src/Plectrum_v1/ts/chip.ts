import type { ChipDesignTokens } from '@primeuix/themes/types/chip';

 export default {
    icon: {
        size: "1rem"
    },
    root: {
        gap: "0.5rem",
        paddingX: "0.75rem",
        paddingY: "0.5rem",
        borderRadius: "12px",
        transitionDuration: "{transition.duration}"
    },
    image: {
        width: "2rem",
        height: "2rem"
    },
    removeIcon: {
        size: "1rem",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        }
    },
    colorScheme: {
        light: {
            icon: {
                color: "{form.field.icon.color}"
            },
            root: {
                color: "{form.field.placeholder.color}",
                background: "{surface.100}"
            },
            removeIcon: {
                color: "{form.field.icon.color}"
            }
        }
    }
} satisfies ChipDesignTokens;