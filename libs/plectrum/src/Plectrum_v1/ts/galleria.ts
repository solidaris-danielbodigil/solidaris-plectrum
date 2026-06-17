import type { GalleriaDesignTokens } from '@primeuix/themes/types/galleria';

 export default {
    root: {
        borderColor: "{overlay.popover.border.color}",
        borderWidth: "1px",
        borderRadius: "{content.border.radius}",
        transitionDuration: "{transition.duration}"
    },
    caption: {
        color: "{surface.0}",
        padding: "1rem",
        background: "#00000080"
    },
    navIcon: {
        size: "1.5rem"
    },
    navButton: {
        next: {
            borderRadius: "100px"
        },
        prev: {
            borderRadius: "100px"
        },
        size: "3rem",
        color: "{surface.950}",
        gutter: "0.5rem",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        },
        background: "#ffffff99",
        hoverColor: "{surface.950}",
        hoverBackground: "#ffffffcc"
    },
    closeButton: {
        size: "3rem",
        color: "{surface.950}",
        gutter: "0.5rem",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        },
        background: "#ffffff99",
        hoverColor: "{surface.950}",
        borderRadius: "100px",
        hoverBackground: "#ffffffcc"
    },
    colorScheme: {
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
            shadow: "none"
        },
        borderRadius: "7px",
        activeBackground: "{primary.600}"
    },
    thumbnailsContent: {
        padding: "1rem 0.25rem",
        background: "{content.background}"
    },
    insetIndicatorList: {
        background: "#00000080"
    },
    thumbnailNavButton: {
        size: "2rem",
        gutter: "0.5rem",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        },
        borderRadius: "{content.border.radius}"
    },
    insetIndicatorButton: {
        background: "#ffffff66",
        hoverBackground: "#ffffff99",
        activeBackground: "{surface.0}"
    },
    thumbnailNavButtonIcon: {
        size: "1rem"
    }
} satisfies GalleriaDesignTokens;