import type { ToggleSwitchDesignTokens } from '@primeuix/themes/types/toggleswitch';

 export default {
    root: {
        width: "2.5rem",
        height: "1.5rem",
        borderRadius: "30px",
        gap: "0.25rem",
        shadow: "0 1px 2px 0 #1212170d",
        focusRing: {
            width: "{focus.ring.width}",
            style: "{focus.ring.style}",
            color: "{focus.ring.color}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        },
        borderWidth: "1px",
        borderColor: "#00000000",
        hoverBorderColor: "#00000000",
        checkedBorderColor: "#00000000",
        checkedHoverBorderColor: "#00000000",
        invalidBorderColor: "{form.field.invalid.border.color}",
        transitionDuration: "{transition.duration}",
        slideDuration: "0.2s"
    },
    handle: {
        borderRadius: "0.5rem",
        size: "1rem"
    },
    colorScheme: {
        light: {
            root: {
                background: "{surface.200}",
                disabledBackground: "{form.field.disabled.background}",
                hoverBackground: "{surface.300}",
                checkedBackground: "{primary.color}",
                checkedHoverBackground: "{primary.hover.color}"
            },
            handle: {
                background: "{text.color}",
                disabledBackground: "#52525200",
                hoverBackground: "{surface.0}",
                checkedBackground: "{surface.0}",
                checkedHoverBackground: "{surface.0}",
                color: "{text.color}",
                hoverColor: "{text.color}",
                checkedColor: "{primary.color}",
                checkedHoverColor: "{primary.hover.color}"
            }
        }
    }
} satisfies ToggleSwitchDesignTokens;