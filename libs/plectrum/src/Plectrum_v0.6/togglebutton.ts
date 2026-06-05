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
            shadow: "{focus.ring.shadow}"
        },
        fontWeight: "600",
        borderRadius: "{border.radius.xl}",
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
        borderRadius: "{border.radius.md}",
        checkedShadow: "0"
    },
    colorScheme: {
        dark: {
            icon: {
                color: "{surface.400}",
                hoverColor: "{surface.300}",
                checkedColor: "{surface.0}"
            },
            root: {
                color: "{surface.400}",
                background: "{surface.950}",
                hoverColor: "{surface.300}",
                borderColor: "{surface.950}",
                checkedColor: "{surface.0}",
                hoverBackground: "{surface.950}",
                checkedBackground: "{surface.950}",
                checkedBorderColor: "{surface.950}"
            },
            content: {
                checkedBackground: "{surface.800}"
            }
        },
        light: {
            icon: {
                color: "{transparant.black.600}",
                hoverColor: "{surface.700}",
                checkedColor: "{surface.900}"
            },
            root: {
                color: "{surface.950}",
                background: "{primary.100}",
                hoverColor: "{surface.700}",
                borderColor: "{primary.100}",
                checkedColor: "{surface.900}",
                hoverBackground: "{primary.100}",
                checkedBackground: "{primary.100}",
                checkedBorderColor: "{primary.100}"
            },
            content: {
                checkedBackground: "{surface.0}"
            }
        }
    }
} satisfies ToggleButtonDesignTokens;