import type { StepperDesignTokens } from '@primeuix/themes/types/stepper';

 export default {
    root: {
        transitionDuration: "{transition.duration}"
    },
    step: {
        gap: "0.75rem",
        padding: "0.5rem"
    },
    separator: {
        size: "2px",
        margin: "0 0 0 1.625rem",
        background: "{content.border.color}",
        activeBackground: "{primary.color}"
    },
    stepTitle: {
        color: "{text.muted.color}",
        fontWeight: "500",
        activeColor: "{surface.950}"
    },
    steppanel: {
        color: "{content.color}",
        indent: "1rem",
        padding: "0",
        background: "{content.background}"
    },
    stepHeader: {
        gap: "0.5rem",
        padding: "0",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "{focus.ring.shadow}"
        },
        borderRadius: "{content.border.radius}"
    },
    stepNumber: {
        size: "1.75rem",
        color: "{text.muted.color}",
        shadow: "0",
        fontSize: "0.875rem",
        background: "{content.background}",
        fontWeight: "600",
        activeColor: "{surface.0}",
        borderColor: "{content.border.color}",
        borderRadius: "50%",
        activeBackground: "{primary.color}",
        activeBorderColor: "{primary.color}"
    },
    steppanels: {
        padding: "0.875rem 0.5rem 1.125rem 0.5rem"
    }
} satisfies StepperDesignTokens;