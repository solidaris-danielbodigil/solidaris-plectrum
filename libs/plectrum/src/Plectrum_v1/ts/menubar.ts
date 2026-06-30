import type { MenubarDesignTokens } from '@primeuix/themes/types/menubar';

 export default {
    root: {
        background: "{content.background}",
        borderColor: "{content.border.color}",
        borderRadius: "{content.border.radius}",
        color: "{content.color}",
        gap: "0.5rem",
        padding: "{megamenu.horizontal.orientation.padding}",
        transitionDuration: "{transition.duration}"
    },
    baseItem: {
        borderRadius: "{content.border.radius}",
        padding: "{navigation.item.padding}"
    },
    item: {
        focusBackground: "{megamenu.item.focus.background}",
        activeBackground: "{megamenu.item.active.background}",
        color: "{navigation.item.color}",
        focusColor: "{navigation.item.focus.color}",
        activeColor: "{megamenu.item.active.color}",
        padding: "{navigation.item.padding}",
        borderRadius: "{navigation.item.border.radius}",
        gap: "{navigation.item.gap}",
        icon: {
            color: "{navigation.item.icon.color}",
            focusColor: "{navigation.item.icon.focus.color}",
            activeColor: "{menubar.item.active.color}"
        }
    },
    submenu: {
        padding: "{navigation.list.padding}",
        gap: "{navigation.list.gap}",
        background: "{content.background}",
        borderColor: "{content.border.color}",
        borderRadius: "{content.border.radius}",
        shadow: "0 2px 4px -2px #0000001a, 0 4px 6px -1px #0000001a",
        mobileIndent: "1rem",
        icon: {
            size: "{navigation.submenu.icon.size}",
            color: "{navigation.submenu.icon.color}",
            focusColor: "{navigation.submenu.icon.focus.color}",
            activeColor: "{megamenu.item.active.color}"
        }
    },
    separator: {
        borderColor: "{content.border.color}"
    },
    mobileButton: {
        borderRadius: "0.875rem",
        size: "1.75rem",
        color: "{text.muted.color}",
        hoverColor: "{text.hover.muted.color}",
        hoverBackground: "{content.hover.background}",
        focusRing: {
            width: "{focus.ring.width}",
            style: "{focus.ring.style}",
            color: "{focus.ring.color}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        }
    }
} satisfies MenubarDesignTokens;