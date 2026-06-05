import type { TagDesignTokens } from '@primeuix/themes/types/tag';

 export default {
    icon: {
        size: "1rem"
    },
    root: {
        gap: "0.5rem",
        padding: "0.25rem 0.5rem 0.25rem 0.5rem",
        fontSize: "1rem",
        fontWeight: "600",
        borderRadius: "{border.radius.lg}",
        roundedBorderRadius: "{border.radius.lg}"
    },
    colorScheme: {
        dark: {
            info: {
                color: "{sky.300}",
                background: "color-mix(in srgb, {sky.500}, transparent 84%)"
            },
            warn: {
                color: "{orange.300}",
                background: "color-mix(in srgb, {orange.500}, transparent 84%)"
            },
            danger: {
                color: "{red.300}",
                background: "color-mix(in srgb, {red.500}, transparent 84%)"
            },
            primary: {
                color: "{primary.200}",
                background: "color-mix(in srgb, {primary.500}, transparent 64%)"
            },
            success: {
                color: "{green.300}",
                background: "color-mix(in srgb, {green.500}, transparent 84%)"
            },
            contrast: {
                color: "{surface.950}",
                background: "{surface.0}"
            },
            secondary: {
                color: "{surface.300}",
                background: "{surface.800}"
            }
        },
        light: {
            info: {
                color: "{blue.800}",
                background: "{blue.75}"
            },
            warn: {
                color: "{orange.900}",
                background: "{orange.75}"
            },
            danger: {
                color: "{red.700}",
                background: "{red.75}"
            },
            primary: {
                color: "{primary.700}",
                background: "{primary.75}"
            },
            success: {
                color: "{green.800}",
                background: "{green.75}"
            },
            contrast: {
                color: "{surface.0}",
                background: "{surface.950}"
            },
            secondary: {
                color: "{surface.800}",
                background: "{surface.75}"
            }
        }
    }
} satisfies TagDesignTokens;