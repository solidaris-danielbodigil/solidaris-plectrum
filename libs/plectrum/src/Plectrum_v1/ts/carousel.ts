import type { CarouselDesignTokens } from '@primeuix/themes/types/carousel';

 export default {
    root: {
        transitionDuration: "{transition.duration}"
    },
    content: {
        gap: "0.25rem"
    },
    indicatorList: {
        padding: "1rem",
        gap: "0.5rem"
    },
    indicator: {
        activeBackground: "{primary.600}",
        width: "2rem",
        height: "0.25rem",
        borderRadius: "{content.border.radius}",
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
            indicator: {
                background: "{surface.200}",
                hoverBackground: "{surface.300}"
            }
        }
    }
} satisfies CarouselDesignTokens;