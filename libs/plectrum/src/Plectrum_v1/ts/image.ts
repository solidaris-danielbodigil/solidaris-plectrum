import type { ImageDesignTokens } from '@primeuix/themes/types/image';

 export default {
    root: {
        transitionDuration: "{transition.duration}"
    },
    action: {
        size: "3rem",
        color: "{surface.950}",
        iconSize: "1.5rem",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        },
        hoverColor: "{surface.950}",
        borderRadius: "1.5rem",
        hoverBackground: "#ffffff99"
    },
    preview: {
        icon: {
            size: "1.5rem"
        },
        mask: {
            color: "{mask.color}",
            background: "{mask.background}"
        }
    },
    toolbar: {
        gap: "0.5rem",
        blur: "8px",
        padding: "0.5rem",
        position: {
            top: "1rem",
            left: "auto",
            right: "1rem",
            bottom: "auto"
        },
        background: "#ffffff33",
        borderColor: "{surface.0}",
        borderWidth: "1px",
        borderRadius: "100px"
    }
} satisfies ImageDesignTokens;