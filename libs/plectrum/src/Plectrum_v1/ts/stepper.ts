import type { StepperDesignTokens } from '@primeuix/themes/types/stepper';

 export default {
    root: {
        transitionDuration: "{transition.duration}"
    },
    step: {
        gap: "1rem",
        padding: "0.5rem"
    },
    separator: {
        size: "2px",
        margin: "0 0 0 1rem",
        background: "{content.border.color}",
        activeBackground: "{primary.color}"
    },
    stepTitle: {
        color: "{text.muted.color}",
        fontWeight: "500",
        activeColor: "{text.color}"
    },
    steppanel: {
        color: "{content.color}",
        indent: "1rem",
        padding: "0",
        background: "#26262600"
    },
    stepHeader: {
        gap: "0.5rem",
        padding: "0",
        focusRing: {
            color: "{focus.ring.color}",
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        },
        borderRadius: "{content.border.radius}"
    },
    stepNumber: {
        size: "2rem",
        color: "{text.muted.color}",
        shadow: "0 1px 1px 0 #0000001f, 0 1px 0 0 #0000000f",
        fontSize: "1.143rem",
        background: "{content.background}",
        fontWeight: "500",
        activeColor: "{surface.0}",
        borderColor: "{content.border.color}",
        borderRadius: "1rem",
        activeBackground: "{primary.700}",
        activeBorderColor: "#00000000"
    },
    steppanels: {
        padding: "0.875rem 0.5rem 1.125rem"
    }
} satisfies StepperDesignTokens;