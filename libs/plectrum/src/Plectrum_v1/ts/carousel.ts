import type { CarouselDesignTokens } from '@primeuix/themes/types/carousel';

 export default {
    root: {
        transitionDuration: "{transition.duration}"
    },
    content: {
        gap: "0.25rem"
    },
    indicator: {
        width: "2rem",
        height: "0.25rem",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        },
        borderRadius: "{content.border.radius}",
        activeBackground: "{primary.600}"
    },
    colorScheme: {
        light: {
            indicator: {
                background: "{surface.200}",
                hoverBackground: "{surface.300}"
            }
        }
    },
    indicatorList: {
        gap: "0.5rem",
        padding: "1rem"
    }
} satisfies CarouselDesignTokens;