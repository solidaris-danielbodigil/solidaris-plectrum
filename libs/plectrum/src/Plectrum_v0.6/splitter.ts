import type { SplitterDesignTokens } from '@primeuix/themes/types/splitter';

 export default {
    root: {
        color: "{content.color}",
        background: "{content.background}",
        borderColor: "{content.border.color}",
        transitionDuration: "{transition.duration}"
    },
    gutter: {
        background: "{content.border.color}"
    },
    handle: {
        size: "24px",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "{focus.ring.shadow}"
        },
        background: "transparent",
        borderRadius: "{content.border.radius}"
    }
} satisfies SplitterDesignTokens;