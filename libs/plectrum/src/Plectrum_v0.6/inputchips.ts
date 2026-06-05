import type { InputChipsDesignTokens } from '@primeuix/themes/types/inputchips';

 export default {
    chip: {
        borderRadius: "{border.radius.sm}"
    },
    root: {
        color: "{form.field.color}",
        shadow: "{form.field.shadow}",
        paddingX: "{form.field.padding.x}",
        paddingY: "{form.field.padding.y}",
        focusRing: {
            color: "{form.field.focus.ring.color}",
            style: "{form.field.focus.ring.style}",
            width: "{form.field.focus.ring.width}",
            offset: "{form.field.focus.ring.offset}",
            shadow: "{form.field.focus.ring.shadow}"
        },
        background: "{form.field.background}",
        borderColor: "{form.field.border.color}",
        borderRadius: "{form.field.border.radius}",
        disabledColor: "{form.field.disabled.color}",
        filledBackground: "{form.field.filled.background}",
        focusBorderColor: "{form.field.focus.border.color}",
        hoverBorderColor: "{form.field.hover.border.color}",
        placeholderColor: "{form.field.placeholder.color}",
        disabledBackground: "{form.field.disabled.background}",
        invalidBorderColor: "{form.field.invalid.border.color}",
        transitionDuration: "{form.field.transition.duration}",
        filledFocusBackground: "{form.field.filled.focus.background}"
    },
    colorScheme: {
        dark: {
            chip: {
                color: "{surface.0}",
                focusBackground: "{surface.700}"
            }
        },
        light: {
            chip: {
                color: "{surface.800}",
                focusBackground: "{surface.200}"
            }
        }
    }
} satisfies InputChipsDesignTokens;