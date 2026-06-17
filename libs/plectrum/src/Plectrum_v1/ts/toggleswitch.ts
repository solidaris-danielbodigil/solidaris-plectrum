import type { ToggleSwitchDesignTokens } from '@primeuix/themes/types/toggleswitch';

 export default {
    root: {
        gap: "0.25rem",
        width: "2.5rem",
        height: "1.5rem",
        shadow: "0 1px 2px 0 #1212170d",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        },
        borderColor: "#00000000",
        borderWidth: "1px",
        borderRadius: "30px",
        slideDuration: "0.2s",
        hoverBorderColor: "#00000000",
        checkedBorderColor: "#00000000",
        invalidBorderColor: "{form.field.invalid.border.color}",
        transitionDuration: "{transition.duration}",
        checkedHoverBorderColor: "#00000000"
    },
    handle: {
        size: "1rem",
        borderRadius: "0.5rem"
    },
    colorScheme: {
        light: {
            root: {
                background: "{surface.200}",
                hoverBackground: "{surface.300}",
                checkedBackground: "{primary.color}",
                disabledBackground: "{form.field.disabled.background}",
                checkedHoverBackground: "{primary.hover.color}"
            },
            handle: {
                color: "{text.color}",
                background: "{text.color}",
                hoverColor: "{text.color}",
                checkedColor: "{primary.color}",
                hoverBackground: "{surface.0}",
                checkedBackground: "{surface.0}",
                checkedHoverColor: "{primary.hover.color}",
                disabledBackground: "#52525200",
                checkedHoverBackground: "{surface.0}"
            }
        }
    }
} satisfies ToggleSwitchDesignTokens;