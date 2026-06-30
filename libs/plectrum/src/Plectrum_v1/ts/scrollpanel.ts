import type { ScrollPanelDesignTokens } from '@primeuix/themes/types/scrollpanel';

 export default {
    root: {
        transitionDuration: "{transition.duration}"
    },
    bar: {
        size: "9px",
        borderRadius: "{border.radius.sm}",
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
            bar: {
                background: "{surface.400}"
            }
        }
    }
} satisfies ScrollPanelDesignTokens;