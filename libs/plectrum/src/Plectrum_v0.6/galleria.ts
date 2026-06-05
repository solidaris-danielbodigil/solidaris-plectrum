import type { GalleriaDesignTokens } from '@primeuix/themes/types/galleria';

 export default {
    root: {
        borderColor: "{content.border.color}",
        borderWidth: "1px",
        borderRadius: "{content.border.radius}",
        transitionDuration: "{transition.duration}"
    },
    caption: {
        color: "{surface.100}",
        padding: "1rem",
        background: "rgba(0, 0, 0, 0.5)"
    },
    navIcon: {
        size: "1.5rem"
    },
    navButton: {
        next: {
            borderRadius: "50%"
        },
        prev: {
            borderRadius: "50%"
        },
        size: "3rem",
        color: "{surface.100}",
        gutter: "0.5rem",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "{focus.ring.shadow}"
        },
        background: "rgba(255, 255, 255, 0.1)",
        hoverColor: "{surface.0}",
        hoverBackground: "rgba(255, 255, 255, 0.2)"
    },
    closeButton: {
        size: "3rem",
        color: "{surface.50}",
        gutter: "0.5rem",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "{focus.ring.shadow}"
        },
        background: "rgba(255, 255, 255, 0.1)",
        hoverColor: "{surface.0}",
        borderRadius: "50%",
        hoverBackground: "rgba(255, 255, 255, 0.2)"
    },
    colorScheme: {
        dark: {
            indicatorButton: {
                background: "{surface.700}",
                hoverBackground: "{surface.600}"
            },
            thumbnailNavButton: {
                color: "{surface.400}",
                hoverColor: "{surface.0}",
                hoverBackground: "{surface.700}"
            }
        },
        light: {
            indicatorButton: {
                background: "{surface.200}",
                hoverBackground: "{surface.300}"
            },
            thumbnailNavButton: {
                color: "{surface.600}",
                hoverColor: "{surface.700}",
                hoverBackground: "{surface.100}"
            }
        }
    },
    indicatorList: {
        gap: "0.5rem",
        padding: "1rem"
    },
    closeButtonIcon: {
        size: "1.5rem"
    },
    indicatorButton: {
        width: "1rem",
        height: "1rem",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "{focus.ring.shadow}"
        },
        borderRadius: "50%",
        activeBackground: "{primary.color}"
    },
    thumbnailsContent: {
        padding: "1rem 0.25rem",
        background: "{content.background}"
    },
    insetIndicatorList: {
        background: "rgba(0, 0, 0, 0.5)"
    },
    thumbnailNavButton: {
        size: "2rem",
        gutter: "0.5rem",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "{focus.ring.shadow}"
        },
        borderRadius: "{content.border.radius}"
    },
    insetIndicatorButton: {
        background: "rgba(255, 255, 255, 0.4)",
        hoverBackground: "rgba(255, 255, 255, 0.6)",
        activeBackground: "rgba(255, 255, 255, 0.9)"
    },
    thumbnailNavButtonIcon: {
        size: "1rem"
    }
} satisfies GalleriaDesignTokens;