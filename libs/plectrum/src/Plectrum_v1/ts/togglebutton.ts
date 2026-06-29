import type { ToggleButtonDesignTokens } from '@primeuix/themes/types/togglebutton';

 export default {
    icon: {
        disabledColor: "{form.field.disabled.color}"
    },
    root: {
        lg: {
            padding: "0.25rem",
            fontSize: "{form.field.lg.font.size}"
        },
        sm: {
            padding: "0.25rem",
            fontSize: "{form.field.sm.font.size}"
        },
        gap: "0.5rem",
        padding: "0.25rem",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        },
        fontWeight: "500",
        borderRadius: "{content.border.radius}",
        disabledColor: "{form.field.disabled.color}",
        disabledBackground: "{form.field.disabled.background}",
        invalidBorderColor: "{form.field.invalid.border.color}",
        transitionDuration: "{form.field.transition.duration}",
        disabledBorderColor: "{form.field.disabled.background}"
    },
    content: {
        lg: {
            padding: "0.25rem 0.75rem"
        },
        sm: {
            padding: "0.25rem 0.75rem"
        },
        padding: "0.25rem 0.75rem",
        borderRadius: "{content.border.radius}",
        checkedShadow: "0 1px 2px 0 #0000000a, 0 1px 2px 0 #00000005"
    },
    colorScheme: {
        light: {
            icon: {
                color: "{surface.500}",
                hoverColor: "{surface.700}",
                checkedColor: "{surface.0}"
            },
            root: {
                color: "{text.muted.color}",
                background: "{primary.100}",
                hoverColor: "{text.color}",
                borderColor: "#e7e7e700",
                checkedColor: "{surface.0}",
                hoverBackground: "{primary.100}",
                checkedBackground: "{primary.100}",
                checkedBorderColor: "#eaeff400"
            },
            content: {
                checkedBackground: "{primary.active.color}"
            }
        }
    }
} satisfies ToggleButtonDesignTokens;