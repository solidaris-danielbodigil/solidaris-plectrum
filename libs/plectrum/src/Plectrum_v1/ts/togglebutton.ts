import type { ToggleButtonDesignTokens } from '@primeuix/themes/types/togglebutton';

 export default {
    root: {
        padding: "0.25rem",
        borderRadius: "{content.border.radius}",
        gap: "0.5rem",
        fontWeight: "500",
        disabledBackground: "{form.field.disabled.background}",
        disabledBorderColor: "{form.field.disabled.background}",
        disabledColor: "{form.field.disabled.color}",
        invalidBorderColor: "{form.field.invalid.border.color}",
        focusRing: {
            width: "{focus.ring.width}",
            style: "{focus.ring.style}",
            color: "{focus.ring.color}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        },
        transitionDuration: "{form.field.transition.duration}",
        sm: {
            fontSize: "{form.field.sm.font.size}",
            padding: "0.25rem"
        },
        lg: {
            fontSize: "{form.field.lg.font.size}",
            padding: "0.25rem"
        }
    },
    icon: {
        disabledColor: "{form.field.disabled.color}"
    },
    content: {
        padding: "0.25rem 0.75rem",
        borderRadius: "{content.border.radius}",
        checkedShadow: "0 1px 2px 0 #0000000a, 0 1px 2px 0 #00000005",
        sm: {
            padding: "0.25rem 0.75rem"
        },
        lg: {
            padding: "0.25rem 0.75rem"
        }
    },
    colorScheme: {
        light: {
            root: {
                background: "{primary.200}",
                checkedBackground: "{togglebutton.background}",
                hoverBackground: "{primary.200}",
                borderColor: "#eaeff400",
                color: "{text.muted.color}",
                hoverColor: "{text.color}",
                checkedColor: "{surface.950}",
                checkedBorderColor: "#eaeff400"
            },
            icon: {
                color: "{surface.500}",
                hoverColor: "{surface.700}",
                checkedColor: "{togglebutton.checked.color}"
            },
            content: {
                checkedBackground: "{surface.0}"
            }
        }
    }
} satisfies ToggleButtonDesignTokens;