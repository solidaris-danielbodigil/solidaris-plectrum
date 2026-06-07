import type { ToggleButtonDesignTokens } from '@primeuix/themes/types/togglebutton';

// Sizing + structure aligned with @primeuix/themes Aura togglebutton (PrimeNG docs SSOT).
// Color scheme remains Plectrum-branded.
 export default {
    icon: {
        disabledColor: "{form.field.disabled.color}"
    },
    root: {
        padding: "0.25rem",
        borderRadius: "{content.border.radius}",
        gap: "0.5rem",
        fontWeight: "500",
        focusRing: {
            width: "{focus.ring.width}",
            style: "{focus.ring.style}",
            color: "{focus.ring.color}",
            offset: "{focus.ring.offset}",
            shadow: "{focus.ring.shadow}"
        },
        transitionDuration: "{form.field.transition.duration}",
        disabledBackground: "{form.field.disabled.background}",
        disabledBorderColor: "{form.field.disabled.background}",
        disabledColor: "{form.field.disabled.color}",
        invalidBorderColor: "{form.field.invalid.border.color}",
        sm: {
            fontSize: "{form.field.sm.font.size}",
            padding: "0.25rem"
        },
        lg: {
            fontSize: "{form.field.lg.font.size}",
            padding: "0.25rem"
        }
    },
    content: {
        padding: "0.25rem 0.75rem",
        borderRadius: "{content.border.radius}",
        checkedShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.02), 0px 1px 2px 0px rgba(0, 0, 0, 0.04)",
        sm: {
            padding: "0.25rem 0.75rem"
        },
        lg: {
            padding: "0.25rem 0.75rem"
        }
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
