import type { ImageCompareDesignTokens } from '@primeuix/themes/types/imagecompare';

 export default {
    handle: {
        size: "15px",
        hoverSize: "30px",
        background: "#ffffffcc",
        hoverBackground: "#ffffffff",
        borderColor: "#00000066",
        hoverBorderColor: "#00000066",
        borderWidth: "0",
        borderRadius: "7.5px",
        transitionDuration: "{transition.duration}",
        focusRing: {
            width: "{focus.ring.width}",
            style: "{focus.ring.style}",
            color: "#00000066",
            offset: "{focus.ring.offset}",
            shadow: "none"
        }
    }
} satisfies ImageCompareDesignTokens;