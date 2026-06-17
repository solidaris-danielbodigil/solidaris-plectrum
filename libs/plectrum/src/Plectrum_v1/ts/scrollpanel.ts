import type { ScrollPanelDesignTokens } from '@primeuix/themes/types/scrollpanel';

 export default {
    bar: {
        size: "9px",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        },
        borderRadius: "{border.radius.sm}"
    },
    root: {
        transitionDuration: "{transition.duration}"
    },
    colorScheme: {
        light: {
            bar: {
                background: "{surface.400}"
            }
        }
    }
} satisfies ScrollPanelDesignTokens;