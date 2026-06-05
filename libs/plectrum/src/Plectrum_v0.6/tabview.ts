import type { TabViewDesignTokens } from '@primeuix/themes/types/tabview';

 export default {
    tab: {
        color: "{text.muted.color}",
        hoverColor: "{text.color}",
        activeColor: "{primary.color}",
        borderColor: "{content.border.color}",
        activeBorderColor: "{primary.color}"
    },
    root: {
        transitionDuration: "{transition.duration}"
    },
    tabList: {
        background: "{content.background}",
        borderColor: "{content.border.color}"
    },
    tabPanel: {
        color: "{content.color}",
        background: "{content.background}"
    },
    navButton: {
        color: "{text.muted.color}",
        background: "{content.background}",
        hoverColor: "{text.color}"
    },
    colorScheme: {
        dark: {
            navButton: {
                shadow: "0px 0px 10px 50px color-mix(in srgb, {content.background}, transparent 50%)"
            }
        },
        light: {
            navButton: {
                shadow: "0px 0px 10px 50px rgba(255, 255, 255, 0.6)"
            }
        }
    }
} satisfies TabViewDesignTokens;