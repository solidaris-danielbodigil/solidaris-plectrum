import type { InlineMessageDesignTokens } from '@primeuix/themes/types/inlinemessage';

 export default {
    icon: {
        size: "1rem"
    },
    root: {
        gap: "0.5rem",
        padding: "{form.field.padding.y} {form.field.padding.x}",
        borderRadius: "{content.border.radius}"
    },
    text: {
        fontWeight: "500"
    },
    colorScheme: {
        dark: {
            info: {
                color: "{blue.500}",
                shadow: "0px 4px 8px 0px color-mix(in srgb, {blue.500}, transparent 96%)",
                background: "color-mix(in srgb, {blue.500}, transparent 84%)",
                borderColor: "color-mix(in srgb, {blue.700}, transparent 64%)"
            },
            warn: {
                color: "{yellow.500}",
                shadow: "0px 4px 8px 0px color-mix(in srgb, {yellow.500}, transparent 96%)",
                background: "color-mix(in srgb, {yellow.500}, transparent 84%)",
                borderColor: "color-mix(in srgb, {yellow.700}, transparent 64%)"
            },
            error: {
                color: "{red.500}",
                shadow: "0px 4px 8px 0px color-mix(in srgb, {red.500}, transparent 96%)",
                background: "color-mix(in srgb, {red.500}, transparent 84%)",
                borderColor: "color-mix(in srgb, {red.700}, transparent 64%)"
            },
            success: {
                color: "{green.500}",
                shadow: "0px 4px 8px 0px color-mix(in srgb, {green.500}, transparent 96%)",
                background: "color-mix(in srgb, {green.500}, transparent 84%)",
                borderColor: "color-mix(in srgb, {green.700}, transparent 64%)"
            },
            contrast: {
                color: "{surface.950}",
                shadow: "0px 4px 8px 0px color-mix(in srgb, {surface.950}, transparent 96%)",
                background: "{surface.0}",
                borderColor: "{surface.100}"
            },
            secondary: {
                color: "{surface.300}",
                shadow: "0px 4px 8px 0px color-mix(in srgb, {surface.500}, transparent 96%)",
                background: "{surface.800}",
                borderColor: "{surface.700}"
            }
        },
        light: {
            info: {
                color: "{blue.600}",
                shadow: "0px 4px 8px 0px color-mix(in srgb, {blue.500}, transparent 96%)",
                background: "color-mix(in srgb, {blue.50}, transparent 5%)",
                borderColor: "{blue.200}"
            },
            warn: {
                color: "{yellow.600}",
                shadow: "0px 4px 8px 0px color-mix(in srgb, {yellow.500}, transparent 96%)",
                background: "color-mix(in srgb,{yellow.50}, transparent 5%)",
                borderColor: "{yellow.200}"
            },
            error: {
                color: "{red.600}",
                shadow: "0px 4px 8px 0px color-mix(in srgb, {red.500}, transparent 96%)",
                background: "color-mix(in srgb, {red.50}, transparent 5%)",
                borderColor: "{red.200}"
            },
            success: {
                color: "{green.600}",
                shadow: "0px 4px 8px 0px color-mix(in srgb, {green.500}, transparent 96%)",
                background: "color-mix(in srgb, {green.50}, transparent 5%)",
                borderColor: "{green.200}"
            },
            contrast: {
                color: "{surface.50}",
                shadow: "0px 4px 8px 0px color-mix(in srgb, {surface.950}, transparent 96%)",
                background: "{surface.900}",
                borderColor: "{surface.950}"
            },
            secondary: {
                color: "{surface.600}",
                shadow: "0px 4px 8px 0px color-mix(in srgb, {surface.500}, transparent 96%)",
                background: "{surface.100}",
                borderColor: "{surface.200}"
            }
        }
    }
} satisfies InlineMessageDesignTokens;