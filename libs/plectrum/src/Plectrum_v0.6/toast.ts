import type { ToastDesignTokens } from '@primeuix/themes/types/toast';

 export default {
    icon: {
        size: "1.125rem"
    },
    root: {
        width: "25rem",
        borderWidth: "1px",
        borderRadius: "{border.radius.md}",
        transitionDuration: "{transition.duration}"
    },
    text: {
        gap: "0.25rem"
    },
    detail: {
        fontSize: "0.875rem",
        fontWeight: "400"
    },
    content: {
        gap: "0.5rem",
        padding: "{overlay.popover.padding}"
    },
    summary: {
        fontSize: "1rem",
        fontWeight: "600"
    },
    closeIcon: {
        size: "1rem"
    },
    closeButton: {
        width: "1.75rem",
        height: "1.75rem",
        focusRing: {
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}"
        },
        borderRadius: "50%"
    },
    colorScheme: {
        dark: {
            info: {
                color: "{blue.500}",
                shadow: "0px 4px 8px 0px color-mix(in srgb, {blue.500}, transparent 96%)",
                background: "color-mix(in srgb, {blue.500}, transparent 84%)",
                borderColor: "color-mix(in srgb, {blue.700}, transparent 64%)",
                closeButton: {
                    focusRing: {
                        color: "{blue.500}",
                        shadow: "none"
                    },
                    hoverBackground: "rgba(255, 255, 255, 0.05)"
                },
                detailColor: "{surface.0}"
            },
            root: {
                blur: "10px"
            },
            warn: {
                color: "{yellow.500}",
                shadow: "0px 4px 8px 0px color-mix(in srgb, {yellow.500}, transparent 96%)",
                background: "color-mix(in srgb, {yellow.500}, transparent 84%)",
                borderColor: "color-mix(in srgb, {yellow.700}, transparent 64%)",
                closeButton: {
                    focusRing: {
                        color: "{yellow.500}",
                        shadow: "none"
                    },
                    hoverBackground: "rgba(255, 255, 255, 0.05)"
                },
                detailColor: "{surface.0}"
            },
            error: {
                color: "{red.500}",
                shadow: "0px 4px 8px 0px color-mix(in srgb, {red.500}, transparent 96%)",
                background: "color-mix(in srgb, {red.500}, transparent 84%)",
                borderColor: "color-mix(in srgb, {red.700}, transparent 64%)",
                closeButton: {
                    focusRing: {
                        color: "{red.500}",
                        shadow: "none"
                    },
                    hoverBackground: "rgba(255, 255, 255, 0.05)"
                },
                detailColor: "{surface.0}"
            },
            success: {
                color: "{green.500}",
                shadow: "0px 4px 8px 0px color-mix(in srgb, {green.500}, transparent 96%)",
                background: "color-mix(in srgb, {green.500}, transparent 84%)",
                borderColor: "color-mix(in srgb, {green.700}, transparent 64%)",
                closeButton: {
                    focusRing: {
                        color: "{green.500}",
                        shadow: "none"
                    },
                    hoverBackground: "rgba(255, 255, 255, 0.05)"
                },
                detailColor: "{surface.0}"
            },
            contrast: {
                color: "{surface.950}",
                shadow: "0px 4px 8px 0px color-mix(in srgb, {surface.950}, transparent 96%)",
                background: "{surface.0}",
                borderColor: "{surface.100}",
                closeButton: {
                    focusRing: {
                        color: "{surface.950}",
                        shadow: "none"
                    },
                    hoverBackground: "{surface.100}"
                },
                detailColor: "{surface.950}"
            },
            secondary: {
                color: "{surface.300}",
                shadow: "0px 4px 8px 0px color-mix(in srgb, {surface.500}, transparent 96%)",
                background: "{surface.800}",
                borderColor: "{surface.700}",
                closeButton: {
                    focusRing: {
                        color: "{surface.300}",
                        shadow: "none"
                    },
                    hoverBackground: "{surface.700}"
                },
                detailColor: "{surface.0}"
            }
        },
        light: {
            info: {
                color: "{primary.500}",
                shadow: "0px 3px 10px 0px color-mix(in srgb, {surface.950}, transparent 92%)",
                background: "color-mix(in srgb, {blue.50}, transparent 4%)",
                borderColor: "{content.border.color}",
                closeButton: {
                    focusRing: {
                        color: "{primary.600}",
                        shadow: "none"
                    },
                    hoverBackground: "{primary.100}"
                },
                detailColor: "{surface.950}"
            },
            root: {
                blur: "1.5px"
            },
            warn: {
                color: "{orange.600}",
                shadow: "0px 3px 10px 0px color-mix(in srgb, {surface.950}, transparent 92%)",
                background: "color-mix(in srgb,{orange.50}, transparent 4%)",
                borderColor: "{content.border.color}",
                closeButton: {
                    focusRing: {
                        color: "{yellow.600}",
                        shadow: "none"
                    },
                    hoverBackground: "{yellow.100}"
                },
                detailColor: "{surface.950}"
            },
            error: {
                color: "{red.600}",
                shadow: "0px 3px 10px 0px color-mix(in srgb, {surface.950}, transparent 92%)",
                background: "color-mix(in srgb, {red.50}, transparent 4%)",
                borderColor: "{content.border.color}",
                closeButton: {
                    focusRing: {
                        color: "{red.600}",
                        shadow: "none"
                    },
                    hoverBackground: "{red.100}"
                },
                detailColor: "{surface.950}"
            },
            success: {
                color: "{green.700}",
                shadow: "0px 3px 10px 0px color-mix(in srgb, {surface.950}, transparent 92%)",
                background: "color-mix(in srgb, {green.50}, transparent 4%)",
                borderColor: "{content.border.color}",
                closeButton: {
                    focusRing: {
                        color: "{green.600}",
                        shadow: "none"
                    },
                    hoverBackground: "{green.100}"
                },
                detailColor: "{surface.950}"
            },
            contrast: {
                color: "{surface.50}",
                shadow: "0px 3px 10px 0px color-mix(in srgb, {surface.950}, transparent 92%)",
                background: "color-mix(in srgb,{surface.800}, transparent 4%)",
                borderColor: "{content.border.color}",
                closeButton: {
                    focusRing: {
                        color: "{surface.50}",
                        shadow: "none"
                    },
                    hoverBackground: "{surface.700}"
                },
                detailColor: "{surface.0}"
            },
            secondary: {
                color: "{surface.50}",
                shadow: "0px 3px 10px 0px color-mix(in srgb, {surface.950}, transparent 92%)",
                background: "{surface.50}",
                borderColor: "{surface.50}",
                closeButton: {
                    focusRing: {
                        color: "{surface.50}",
                        shadow: "none"
                    },
                    hoverBackground: "{surface.50}"
                },
                detailColor: "{surface.50}"
            }
        }
    }
} satisfies ToastDesignTokens;