import type { SliderDesignTokens } from '@primeuix/themes/types/slider';

 export default {
    root: {
        transitionDuration: "{transition.duration}"
    },
    range: {
        background: "{primary.color}"
    },
    track: {
        size: "3px",
        background: "{content.border.color}",
        borderRadius: "{content.border.radius}"
    },
    handle: {
        width: "20px",
        height: "20px",
        content: {
            width: "12px",
            height: "12px",
            shadow: "0px 0.5px 0px 0px rgba(0, 0, 0, 0), 0px 1px 1px 0px rgba(0, 0, 0, 0.14)",
            borderRadius: "50%",
            hoverBackground: "{content.background}"
        },
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "{focus.ring.shadow}"
        },
        background: "{content.border.color}",
        borderRadius: "50%",
        hoverBackground: "{content.border.color}"
    },
    colorScheme: {
        dark: {
            handle: {
                content: {
                    background: "{surface.950}"
                }
            }
        },
        light: {
            handle: {
                content: {
                    background: "{surface.0}"
                }
            }
        }
    }
} satisfies SliderDesignTokens;