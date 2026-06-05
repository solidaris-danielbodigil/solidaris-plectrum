import type { StepsDesignTokens } from '@primeuix/themes/types/steps';

 export default {
    root: {
        transitionDuration: "{transition.duration}"
    },
    itemLink: {
        gap: "0.5rem",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "{focus.ring.shadow}"
        },
        borderRadius: "{content.border.radius}"
    },
    itemLabel: {
        color: "{text.muted.color}",
        fontWeight: "500",
        activeColor: "{primary.color}"
    },
    separator: {
        background: "{content.border.color}"
    },
    itemNumber: {
        size: "2rem",
        color: "{text.muted.color}",
        shadow: "0px 0.5px 0px 0px rgba(0, 0, 0, 0.06), 0px 1px 1px 0px rgba(0, 0, 0, 0.12)",
        fontSize: "1.143rem",
        background: "{content.background}",
        fontWeight: "500",
        activeColor: "{primary.color}",
        borderColor: "{content.border.color}",
        borderRadius: "50%",
        activeBackground: "{content.background}",
        activeBorderColor: "{content.border.color}"
    }
} satisfies StepsDesignTokens;