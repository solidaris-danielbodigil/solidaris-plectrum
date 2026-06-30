import type { GalleriaDesignTokens } from '@primeuix/themes/types/galleria';

 export default {
    root: {
        borderWidth: "1px",
        borderColor: "{overlay.popover.border.color}",
        borderRadius: "{content.border.radius}",
        transitionDuration: "{transition.duration}"
    },
    navButton: {
        background: "#ffffff99",
        hoverBackground: "#ffffffcc",
        color: "{surface.950}",
        hoverColor: "{surface.950}",
        size: "3rem",
        gutter: "0.5rem",
        prev: {
            borderRadius: "100px"
        },
        next: {
            borderRadius: "100px"
        },
        focusRing: {
            width: "{focus.ring.width}",
            style: "{focus.ring.style}",
            color: "{focus.ring.color}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        }
    },
    navIcon: {
        size: "1.5rem"
    },
    thumbnailsContent: {
        background: "{content.background}",
        padding: "1rem 0.25rem"
    },
    thumbnailNavButton: {
        size: "2rem",
        borderRadius: "{content.border.radius}",
        gutter: "0.5rem",
        focusRing: {
            width: "{focus.ring.width}",
            style: "{focus.ring.style}",
            color: "{focus.ring.color}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        }
    },
    thumbnailNavButtonIcon: {
        size: "1rem"
    },
    caption: {
        background: "#00000080",
        color: "{surface.0}",
        padding: "1rem"
    },
    indicatorList: {
        gap: "0.5rem",
        padding: "1rem"
    },
    indicatorButton: {
        activeBackground: "{primary.600}",
        width: "1rem",
        height: "1rem",
        borderRadius: "7px",
        focusRing: {
            width: "{focus.ring.width}",
            style: "{focus.ring.style}",
            color: "{focus.ring.color}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        }
    },
    insetIndicatorList: {
        background: "#00000080"
    },
    insetIndicatorButton: {
        background: "#ffffff66",
        hoverBackground: "#ffffff99",
        activeBackground: "{surface.0}"
    },
    closeButton: {
        size: "3rem",
        gutter: "0.5rem",
        background: "#ffffff99",
        hoverBackground: "#ffffffcc",
        color: "{surface.950}",
        hoverColor: "{surface.950}",
        borderRadius: "100px",
        focusRing: {
            width: "{focus.ring.width}",
            style: "{focus.ring.style}",
            color: "{focus.ring.color}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        }
    },
    closeButtonIcon: {
        size: "1.5rem"
    },
    colorScheme: {
        light: {
            thumbnailNavButton: {
                hoverBackground: "{surface.100}",
                color: "{surface.600}",
                hoverColor: "{surface.700}"
            },
            indicatorButton: {
                background: "{surface.200}",
                hoverBackground: "{surface.300}"
            }
        }
    }
} satisfies GalleriaDesignTokens;