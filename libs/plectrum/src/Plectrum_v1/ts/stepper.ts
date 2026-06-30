import type { StepperDesignTokens } from '@primeuix/themes/types/stepper';

 export default {
    root: {
        transitionDuration: "{transition.duration}"
    },
    separator: {
        background: "{overlay.popover.border.color}",
        activeBackground: "{primary.color}",
        margin: "0 0 0 1rem",
        size: "2px"
    },
    step: {
        padding: "0.5rem",
        gap: "1rem"
    },
    stepHeader: {
        padding: "0",
        borderRadius: "{content.border.radius}",
        focusRing: {
            width: "{focus.ring.width}",
            style: "{focus.ring.style}",
            color: "{focus.ring.color}",
            offset: "{focus.ring.offset}",
            shadow: "none"
        },
        gap: "0.5rem"
    },
    stepTitle: {
        color: "{text.muted.color}",
        activeColor: "{text.color}",
        fontWeight: "500"
    },
    stepNumber: {
        background: "{content.background}",
        activeBackground: "{primary.700}",
        borderColor: "{stepper.separator.background}",
        activeBorderColor: "#00000000",
        color: "{text.muted.color}",
        activeColor: "{surface.0}",
        size: "2rem",
        fontSize: "1.143rem",
        fontWeight: "500",
        borderRadius: "1rem",
        shadow: "0 1px 1px 0 #0000001f, 0 1px 0 0 #0000000f"
    },
    steppanels: {
        padding: "0.875rem 0.5rem 1.125rem"
    },
    steppanel: {
        background: "#26262600",
        color: "{content.color}",
        padding: "0",
        indent: "1rem"
    }
} satisfies StepperDesignTokens;