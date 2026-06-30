import type { ChipDesignTokens } from '@primeuix/themes/types/chip';

 export default {
    root: {
        borderRadius: "12px",
        paddingX: "0.75rem",
        paddingY: "0.5rem",
        gap: "0.5rem",
        transitionDuration: "{transition.duration}"
    },
    image: {
        width: "2rem",
        height: "2rem"
    },
    icon: {
        size: "1rem"
    },
    removeIcon: {
        size: "1rem",
        focusRing: {
            width: "{focus.ring.width}",
            style: "{focus.ring.style}",
            color: "{focus.ring.color}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        }
    },
    colorScheme: {
        light: {
            root: {
                background: "{surface.100}",
                color: "{form.field.placeholder.color}"
            },
            icon: {
                color: "{form.field.icon.color}"
            },
            removeIcon: {
                color: "{form.field.icon.color}"
            }
        }
    }
} satisfies ChipDesignTokens;