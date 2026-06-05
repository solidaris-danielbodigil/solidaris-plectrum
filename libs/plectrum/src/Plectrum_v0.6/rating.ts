import type { RatingDesignTokens } from '@primeuix/themes/types/rating';

 export default {
    icon: {
        size: "1rem",
        color: "{text.muted.color}",
        hoverColor: "{yellow.700}",
        activeColor: "{yellow.500}"
    },
    root: {
        gap: "0.25rem",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "{focus.ring.shadow}"
        },
        transitionDuration: "{transition.duration}"
    }
} satisfies RatingDesignTokens;