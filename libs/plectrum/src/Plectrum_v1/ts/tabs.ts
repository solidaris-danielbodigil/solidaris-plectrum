import type { TabsDesignTokens } from '@primeuix/themes/types/tabs';

 export default {
    root: {
        transitionDuration: "{transition.duration}"
    },
    tablist: {
        borderWidth: "0",
        background: "#00000000",
        borderColor: "{content.border.color}"
    },
    tab: {
        background: "#00000000",
        hoverBackground: "#00000000",
        activeBackground: "#00000000",
        borderWidth: "0",
        borderColor: "{content.border.color}",
        hoverBorderColor: "{primary.hover.color}",
        activeBorderColor: "{primary.color}",
        color: "{text.muted.color}",
        hoverColor: "{text.color}",
        activeColor: "{text.color}",
        padding: "1rem 1.125rem",
        fontWeight: "600",
        margin: "0 0 -1px 0",
        gap: "0.5rem",
        focusRing: {
            width: "{focus.ring.width}",
            style: "{focus.ring.style}",
            color: "{focus.ring.color}",
            offset: "-1px",
            shadow: "none"
        }
    },
    tabpanel: {
        background: "{content.background}",
        color: "{content.color}",
        padding: "0.875rem 1.125rem 1.125rem",
        focusRing: {
            width: "{focus.ring.width}",
            style: "{focus.ring.style}",
            color: "{focus.ring.color}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        }
    },
    navButton: {
        background: "{content.background}",
        color: "{text.muted.color}",
        hoverColor: "{text.color}",
        width: "2.5rem",
        shadow: "0 0 10px 50px #ffffff99",
        focusRing: {
            width: "{focus.ring.width}",
            style: "{focus.ring.style}",
            color: "{focus.ring.color}",
            offset: "-1px",
            shadow: "none"
        }
    },
    activeBar: {
        height: "0.25rem",
        bottom: "-1px",
        background: "{primary.color}"
    }
} satisfies TabsDesignTokens;