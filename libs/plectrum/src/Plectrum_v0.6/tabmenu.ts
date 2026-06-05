import type { TabmenuDesignTokens } from '@primeuix/themes/types/tabmenu';

 export default {
    item: {
        gap: "0.5rem",
        color: "{text.muted.color}",
        margin: "0 0 -1px 0",
        padding: "1rem 1.125rem",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "{focus.ring.shadow}"
        },
        background: "transparent",
        fontWeight: "600",
        hoverColor: "{text.color}",
        activeColor: "{primary.color}",
        borderColor: "{content.border.color}",
        borderWidth: "0 0 1px 0",
        hoverBackground: "transparent",
        activeBackground: "transparent",
        hoverBorderColor: "{content.border.color}",
        activeBorderColor: "{primary.color}"
    },
    root: {
        transitionDuration: "{transition.duration}"
    },
    tablist: {
        background: "{content.background}",
        borderColor: "{content.border.color}",
        borderWidth: "0 0 1px 0"
    },
    itemIcon: {
        color: "{text.muted.color}",
        hoverColor: "{text.color}",
        activeColor: "{primary.color}"
    },
    activeBar: {
        bottom: "-1px",
        height: "1px",
        background: "{primary.color}"
    }
} satisfies TabmenuDesignTokens;