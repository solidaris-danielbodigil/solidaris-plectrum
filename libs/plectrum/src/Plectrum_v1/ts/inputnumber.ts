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
                background: "#00000000",
                hoverBackground: "{form.field.filled.hover.background}",
                activeBackground: "{form.field.filled.background}",
                borderColor: "{form.field.border.color}",
                hoverBorderColor: "{form.field.border.color}",
                activeBorderColor: "{form.field.border.color}",
                color: "{form.field.color}",
                hoverColor: "{form.field.color}",
                activeColor: "{form.field.color}"
            }
        }
    }
} satisfies InputNumberDesignTokens;