import type { CarouselDesignTokens } from '@primeuix/themes/types/carousel';

 export default {
    root: {
        transitionDuration: "{transition.duration}"
    },
    content: {
        gap: "0.25rem"
    },
    indicator: {
        width: "0.5rem",
        height: "0.5rem",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "{focus.ring.shadow}"
        },
        borderRadius: "{content.border.radius}"
    },
    colorScheme: {
        dark: {
            indicator: {
                background: "{surface.700}",
                hoverBackground: "{surface.600}",
                activeBackground: "{primary.color}"
            }
        },
        light: {
            indicator: {
                background: "{surface.100}",
                hoverBackground: "{surface.200}",
                activeBackground: "{primary.color}"
            }
        }
    },
    indicatorList: {
        gap: "0.5rem",
        padding: "1rem"
    }
} satisfies CarouselDesignTokens;