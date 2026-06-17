import type { InputNumberDesignTokens } from '@primeuix/themes/types/inputnumber';

 export default {
    root: {
        transitionDuration: "{transition.duration}"
    },
    button: {
        width: "2.5rem",
        borderRadius: "{form.field.border.radius}",
        verticalPadding: "{form.field.padding.y}"
    },
    colorScheme: {
        light: {
            button: {
                color: "{form.field.color}",
                background: "#00000000",
                hoverColor: "{form.field.color}",
                activeColor: "{form.field.color}",
                borderColor: "{form.field.border.color}",
                hoverBackground: "{form.field.filled.hover.background}",
                activeBackground: "{form.field.filled.background}",
                hoverBorderColor: "{form.field.border.color}",
                activeBorderColor: "{form.field.border.color}"
            }
        }
    }
} satisfies InputNumberDesignTokens;