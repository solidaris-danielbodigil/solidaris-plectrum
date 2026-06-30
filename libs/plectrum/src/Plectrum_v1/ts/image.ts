import type { ImageDesignTokens } from '@primeuix/themes/types/image';

 export default {
    root: {
        transitionDuration: "{transition.duration}"
    },
    preview: {
        icon: {
            size: "1.5rem"
        },
        mask: {
            background: "{mask.background}",
            color: "{mask.color}"
        }
    },
    toolbar: {
        position: {
            left: "auto",
            right: "1rem",
            top: "1rem",
            bottom: "auto"
        },
        blur: "8px",
        background: "#ffffff33",
        borderColor: "{surface.0}",
        borderWidth: "1px",
        borderRadius: "100px",
        padding: "0.5rem",
        gap: "0.5rem"
    },
    action: {
        hoverBackground: "#ffffff99",
        color: "{surface.950}",
        hoverColor: "{surface.950}",
        size: "3rem",
        iconSize: "1.5rem",
        borderRadius: "1.5rem",
        focusRing: {
            width: "{focus.ring.width}",
            style: "{focus.ring.style}",
            color: "{focus.ring.color}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        }
    }
} satisfies ImageDesignTokens;