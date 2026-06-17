import type { ImageCompareDesignTokens } from '@primeuix/themes/types/imagecompare';

 export default {
    handle: {
        size: "15px",
        focusRing: {
            color: "#00000066",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        },
        hoverSize: "30px",
        background: "#ffffffcc",
        borderColor: "#00000066",
        borderWidth: "0",
        borderRadius: "7.5px",
        hoverBackground: "#ffffffff",
        hoverBorderColor: "#00000066",
        transitionDuration: "{transition.duration}"
    }
} satisfies ImageCompareDesignTokens;