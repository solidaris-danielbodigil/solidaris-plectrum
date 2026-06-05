import type { ColorPickerDesignTokens } from '@primeuix/themes/types/colorpicker';

 export default {
    root: {
        transitionDuration: "{transition.duration}"
    },
    panel: {
        shadow: "{overlay.popover.shadow}",
        borderRadius: "{overlay.popover.borderRadius}"
    },
    preview: {
        width: "1.5rem",
        height: "1.5rem",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "{focus.ring.shadow}"
        },
        borderRadius: "{form.field.border.radius}"
    },
    colorScheme: {
        dark: {
            panel: {
                background: "{surface.900}",
                borderColor: "{surface.700}"
            },
            handle: {
                color: "{surface.0}"
            }
        },
        light: {
            panel: {
                background: "{surface.800}",
                borderColor: "{surface.900}"
            },
            handle: {
                color: "{surface.0}"
            }
        }
    }
} satisfies ColorPickerDesignTokens;