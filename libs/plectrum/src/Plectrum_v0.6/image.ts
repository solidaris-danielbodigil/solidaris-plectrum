import type { ImageDesignTokens } from '@primeuix/themes/types/image';

 export default {
    root: {
        transitionDuration: "{transition.duration}"
    },
    action: {
        size: "3rem",
        color: "{surface.50}",
        iconSize: "1.5rem",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "{focus.ring.shadow}"
        },
        hoverColor: "{surface.0}",
        borderRadius: "50%",
        hoverBackground: "rgba(255,255,255,0.1)"
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
        padding: ".5rem",
        position: {
            top: "1rem",
            left: "auto",
            right: "1rem",
            bottom: "auto"
        },
        background: "rgba(255,255,255,0.1)",
        borderColor: "rgba(255,255,255,0.2)",
        borderWidth: "1px",
        borderRadius: "30px"
    }
} satisfies ImageDesignTokens;