import type { MegaMenuDesignTokens } from '@primeuix/themes/types/megamenu';

 export default {
    item: {
        gap: "{navigation.item.gap}",
        icon: {
            color: "{navigation.item.icon.color}",
            focusColor: "{navigation.item.icon.focus.color}",
            activeColor: "{megamenu.item.active.color}"
        },
        color: "{navigation.item.color}",
        padding: "{navigation.item.padding}",
        focusColor: "{navigation.item.focus.color}",
        activeColor: "{stepper.step.number.active.color}",
        borderRadius: "{border.radius.md}",
        focusBackground: "{highlight.focus.background}",
        activeBackground: "{stepper.step.number.active.background}"
    },
    root: {
        gap: "0.5rem",
        color: "{content.color}",
        background: "{content.background}",
        borderColor: "{content.border.color}",
        borderRadius: "{content.border.radius}",
        transitionDuration: "{transition.duration}",
        verticalOrientation: {
            gap: "{navigation.list.gap}",
            padding: "{navigation.list.padding}"
        },
        horizontalOrientation: {
            gap: "0.5rem",
            padding: "0.25rem"
        }
    },
    overlay: {
        gap: "0.5rem",
        color: "{content.color}",
        shadow: "0 2px 4px -2px #0000001a, 0 4px 6px -1px #0000001a",
        padding: "0",
        background: "{content.background}",
        borderColor: "{overlay.popover.border.color}",
        borderRadius: "{content.border.radius}"
    },
    submenu: {
        gap: "{navigation.list.gap}",
        padding: "{navigation.list.padding}"
    },
    baseItem: {
        padding: "{navigation.item.padding}",
        borderRadius: "{content.border.radius}"
    },
    separator: {
        borderColor: "{content.border.color}"
    },
    submenuIcon: {
        size: "{navigation.submenu.icon.size}",
        color: "{navigation.submenu.icon.color}",
        focusColor: "{navigation.submenu.icon.focus.color}",
        activeColor: "{megamenu.item.active.color}"
    },
    mobileButton: {
        size: "1.75rem",
        color: "{text.muted.color}",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        },
        hoverColor: "{text.hover.muted.color}",
        borderRadius: "0.875rem",
        hoverBackground: "{content.hover.background}"
    },
    submenuLabel: {
        color: "{navigation.submenu.label.color}",
        padding: "{navigation.submenu.label.padding}",
        background: "{navigation.submenu.label.background}",
        fontWeight: "{navigation.submenu.label.font.weight}"
    }
} satisfies MegaMenuDesignTokens;