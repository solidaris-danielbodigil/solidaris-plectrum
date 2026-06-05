import type { ButtonDesignTokens } from '@primeuix/themes/types/button';

 export default {
    root: {
        lg: {
            fontSize: "{form.field.lg.font.size}",
            paddingX: "{form.field.lg.padding.x}",
            paddingY: "{form.field.lg.padding.y}",
            iconOnlyWidth: "3rem"
        },
        sm: {
            fontSize: "{form.field.sm.font.size}",
            paddingX: "{form.field.sm.padding.x}",
            paddingY: "{form.field.sm.padding.y}",
            iconOnlyWidth: "2rem"
        },
        gap: "0.5rem",
        label: {
            fontWeight: "600"
        },
        paddingX: "{form.field.padding.x}",
        paddingY: "{form.field.padding.y}",
        badgeSize: "1rem",
        focusRing: {
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}"
        },
        borderRadius: "{form.field.border.radius}",
        raisedShadow: "0",
        iconOnlyWidth: "2.5rem",
        transitionDuration: "{form.field.transition.duration}",
        roundedBorderRadius: "2rem"
    },
    colorScheme: {
        dark: {
            link: {
                color: "{primary.color}",
                hoverColor: "{primary.color}",
                activeColor: "{primary.color}"
            },
            root: {
                help: {
                    color: "{purple.950}",
                    focusRing: {
                        color: "{purple.400}",
                        shadow: "none"
                    },
                    background: "{purple.400}",
                    hoverColor: "{purple.950}",
                    activeColor: "{purple.950}",
                    borderColor: "{purple.400}",
                    hoverBackground: "{purple.300}",
                    activeBackground: "{purple.200}",
                    hoverBorderColor: "{purple.300}",
                    activeBorderColor: "{purple.200}"
                },
                info: {
                    color: "{sky.950}",
                    focusRing: {
                        color: "{sky.400}",
                        shadow: "none"
                    },
                    background: "{sky.400}",
                    hoverColor: "{sky.950}",
                    activeColor: "{sky.950}",
                    borderColor: "{sky.400}",
                    hoverBackground: "{sky.300}",
                    activeBackground: "{sky.200}",
                    hoverBorderColor: "{sky.300}",
                    activeBorderColor: "{sky.200}"
                },
                warn: {
                    color: "{orange.950}",
                    focusRing: {
                        color: "{orange.400}",
                        shadow: "none"
                    },
                    background: "{orange.400}",
                    hoverColor: "{orange.950}",
                    activeColor: "{orange.950}",
                    borderColor: "{orange.400}",
                    hoverBackground: "{orange.300}",
                    activeBackground: "{orange.200}",
                    hoverBorderColor: "{orange.300}",
                    activeBorderColor: "{orange.200}"
                },
                danger: {
                    color: "{red.950}",
                    focusRing: {
                        color: "{red.400}",
                        shadow: "none"
                    },
                    background: "{red.400}",
                    hoverColor: "{red.950}",
                    activeColor: "{red.950}",
                    borderColor: "{red.400}",
                    hoverBackground: "{red.300}",
                    activeBackground: "{red.200}",
                    hoverBorderColor: "{red.300}",
                    activeBorderColor: "{red.200}"
                },
                primary: {
                    color: "{primary.contrast.color}",
                    focusRing: {
                        color: "{primary.color}",
                        shadow: "none"
                    },
                    background: "{primary.color}",
                    hoverColor: "{primary.contrast.color}",
                    activeColor: "{primary.contrast.color}",
                    borderColor: "{primary.color}",
                    hoverBackground: "{primary.hover.color}",
                    activeBackground: "{primary.active.color}",
                    hoverBorderColor: "{primary.hover.color}",
                    activeBorderColor: "{primary.active.color}"
                },
                success: {
                    color: "{green.950}",
                    focusRing: {
                        color: "{green.400}",
                        shadow: "none"
                    },
                    background: "{green.400}",
                    hoverColor: "{green.950}",
                    activeColor: "{green.950}",
                    borderColor: "{green.400}",
                    hoverBackground: "{green.300}",
                    activeBackground: "{green.200}",
                    hoverBorderColor: "{green.300}",
                    activeBorderColor: "{green.200}"
                },
                contrast: {
                    color: "{surface.950}",
                    focusRing: {
                        color: "{surface.0}",
                        shadow: "none"
                    },
                    background: "{surface.0}",
                    hoverColor: "{surface.950}",
                    activeColor: "{surface.950}",
                    borderColor: "{surface.0}",
                    hoverBackground: "{surface.100}",
                    activeBackground: "{surface.200}",
                    hoverBorderColor: "{surface.100}",
                    activeBorderColor: "{surface.200}"
                },
                secondary: {
                    color: "{surface.300}",
                    focusRing: {
                        color: "{surface.300}",
                        shadow: "none"
                    },
                    background: "{surface.800}",
                    hoverColor: "{surface.200}",
                    activeColor: "{surface.100}",
                    borderColor: "{surface.800}",
                    hoverBackground: "{surface.700}",
                    activeBackground: "{surface.600}",
                    hoverBorderColor: "{surface.700}",
                    activeBorderColor: "{surface.600}"
                }
            },
            text: {
                help: {
                    color: "{purple.400}",
                    hoverBackground: "color-mix(in srgb, {purple.400}, transparent 96%)",
                    activeBackground: "color-mix(in srgb, {purple.400}, transparent 84%)"
                },
                info: {
                    color: "{sky.400}",
                    hoverBackground: "color-mix(in srgb, {sky.400}, transparent 96%)",
                    activeBackground: "color-mix(in srgb, {sky.400}, transparent 84%)"
                },
                warn: {
                    color: "{orange.400}",
                    hoverBackground: "color-mix(in srgb, {orange.400}, transparent 96%)",
                    activeBackground: "color-mix(in srgb, {orange.400}, transparent 84%)"
                },
                plain: {
                    color: "{surface.0}",
                    hoverBackground: "{surface.800}",
                    activeBackground: "{surface.700}"
                },
                danger: {
                    color: "{red.400}",
                    hoverBackground: "color-mix(in srgb, {red.400}, transparent 96%)",
                    activeBackground: "color-mix(in srgb, {red.400}, transparent 84%)"
                },
                primary: {
                    color: "{primary.color}",
                    hoverBackground: "color-mix(in srgb, {primary.color}, transparent 96%)",
                    activeBackground: "color-mix(in srgb, {primary.color}, transparent 84%)"
                },
                success: {
                    color: "{green.400}",
                    hoverBackground: "color-mix(in srgb, {green.400}, transparent 96%)",
                    activeBackground: "color-mix(in srgb, {green.400}, transparent 84%)"
                },
                contrast: {
                    color: "{surface.0}",
                    hoverBackground: "{surface.800}",
                    activeBackground: "{surface.700}"
                },
                secondary: {
                    color: "{surface.400}",
                    hoverBackground: "{surface.800}",
                    activeBackground: "{surface.700}"
                }
            },
            outlined: {
                help: {
                    color: "{purple.400}",
                    borderColor: "{purple.700}",
                    hoverBackground: "color-mix(in srgb, {purple.400}, transparent 96%)",
                    activeBackground: "color-mix(in srgb, {purple.400}, transparent 84%)"
                },
                info: {
                    color: "{sky.400}",
                    borderColor: "{sky.700}",
                    hoverBackground: "color-mix(in srgb, {sky.400}, transparent 96%)",
                    activeBackground: "color-mix(in srgb, {sky.400}, transparent 84%)"
                },
                warn: {
                    color: "{orange.400}",
                    borderColor: "{orange.700}",
                    hoverBackground: "color-mix(in srgb, {orange.400}, transparent 96%)",
                    activeBackground: "color-mix(in srgb, {orange.400}, transparent 84%)"
                },
                plain: {
                    color: "{surface.0}",
                    borderColor: "{surface.600}",
                    hoverBackground: "{surface.800}",
                    activeBackground: "{surface.700}"
                },
                danger: {
                    color: "{red.400}",
                    borderColor: "{red.700}",
                    hoverBackground: "color-mix(in srgb, {red.400}, transparent 96%)",
                    activeBackground: "color-mix(in srgb, {red.400}, transparent 84%)"
                },
                primary: {
                    color: "{primary.color}",
                    borderColor: "{primary.700}",
                    hoverBackground: "color-mix(in srgb, {primary.color}, transparent 96%)",
                    activeBackground: "color-mix(in srgb, {primary.color}, transparent 84%)"
                },
                success: {
                    color: "{green.400}",
                    borderColor: "{green.700}",
                    hoverBackground: "color-mix(in srgb, {green.400}, transparent 96%)",
                    activeBackground: "color-mix(in srgb, {green.400}, transparent 84%)"
                },
                contrast: {
                    color: "{surface.0}",
                    borderColor: "{surface.500}",
                    hoverBackground: "{surface.800}",
                    activeBackground: "{surface.700}"
                },
                secondary: {
                    color: "{surface.400}",
                    borderColor: "{surface.700}",
                    hoverBackground: "rgba(255,255,255,0.04)",
                    activeBackground: "rgba(255,255,255,0.16)"
                }
            }
        },
        light: {
            link: {
                color: "{blue.600}",
                hoverColor: "{blue.700}",
                activeColor: "{blue.800}"
            },
            root: {
                help: {
                    color: "{surface.50}",
                    focusRing: {
                        color: "{surface.0}",
                        shadow: "none"
                    },
                    background: "{surface.50}",
                    hoverColor: "{surface.50}",
                    activeColor: "#ffffff",
                    borderColor: "{surface.50}",
                    hoverBackground: "{surface.50}",
                    activeBackground: "{surface.50}",
                    hoverBorderColor: "{surface.50}",
                    activeBorderColor: "{surface.50}"
                },
                info: {
                    color: "#ffffff",
                    focusRing: {
                        color: "{blue.300}",
                        shadow: "none"
                    },
                    background: "{blue.600}",
                    hoverColor: "#ffffff",
                    activeColor: "#ffffff",
                    borderColor: "{blue.600}",
                    hoverBackground: "{blue.700}",
                    activeBackground: "{blue.800}",
                    hoverBorderColor: "{blue.700}",
                    activeBorderColor: "{blue.700}"
                },
                warn: {
                    color: "#ffffff",
                    focusRing: {
                        color: "{orange.600}",
                        shadow: "none"
                    },
                    background: "{orange.600}",
                    hoverColor: "#ffffff",
                    activeColor: "#ffffff",
                    borderColor: "{orange.600}",
                    hoverBackground: "{orange.700}",
                    activeBackground: "{orange.800}",
                    hoverBorderColor: "{orange.700}",
                    activeBorderColor: "{orange.800}"
                },
                danger: {
                    color: "#ffffff",
                    focusRing: {
                        color: "{red.500}",
                        shadow: "none"
                    },
                    background: "{red.500}",
                    hoverColor: "#ffffff",
                    activeColor: "#ffffff",
                    borderColor: "{red.600}",
                    hoverBackground: "{red.700}",
                    activeBackground: "{red.800}",
                    hoverBorderColor: "{red.700}",
                    activeBorderColor: "{red.800}"
                },
                primary: {
                    color: "{primary.contrast.color}",
                    focusRing: {
                        color: "{primary.color}",
                        shadow: "none"
                    },
                    background: "{primary.color}",
                    hoverColor: "{primary.contrast.color}",
                    activeColor: "{primary.contrast.color}",
                    borderColor: "{primary.color}",
                    hoverBackground: "{primary.hover.color}",
                    activeBackground: "{primary.active.color}",
                    hoverBorderColor: "{primary.hover.color}",
                    activeBorderColor: "{primary.active.color}"
                },
                success: {
                    color: "#ffffff",
                    focusRing: {
                        color: "{green.600}",
                        shadow: "none"
                    },
                    background: "{green.600}",
                    hoverColor: "#ffffff",
                    activeColor: "#ffffff",
                    borderColor: "{green.600}",
                    hoverBackground: "{green.700}",
                    activeBackground: "{green.800}",
                    hoverBorderColor: "{green.700}",
                    activeBorderColor: "{green.800}"
                },
                contrast: {
                    color: "{surface.50}",
                    focusRing: {
                        color: "{surface.950}",
                        shadow: "none"
                    },
                    background: "{surface.50}",
                    hoverColor: "{surface.50}",
                    activeColor: "{surface.50}",
                    borderColor: "{surface.50}",
                    hoverBackground: "{surface.50}",
                    activeBackground: "{surface.50}",
                    hoverBorderColor: "{surface.50}",
                    activeBorderColor: "{surface.50}"
                },
                secondary: {
                    color: "{surface.900}",
                    focusRing: {
                        color: "{surface.600}",
                        shadow: "none"
                    },
                    background: "{transparant.white.40}",
                    hoverColor: "{surface.950}",
                    activeColor: "{surface.950}",
                    borderColor: "{transparant.black.200}",
                    hoverBackground: "{transparant.black.50}",
                    activeBackground: "{transparant.black.200}",
                    hoverBorderColor: "{transparant.black.400}",
                    activeBorderColor: "{transparant.black.600}"
                }
            },
            text: {
                help: {
                    color: "{surface.50}",
                    hoverBackground: "{surface.50}",
                    activeBackground: "{surface.50}"
                },
                info: {
                    color: "{blue.700}",
                    hoverBackground: "{blue.75}",
                    activeBackground: "{blue.100}"
                },
                warn: {
                    color: "{orange.600}",
                    hoverBackground: "{orange.75}",
                    activeBackground: "{orange.100}"
                },
                plain: {
                    color: "{surface.50}",
                    hoverBackground: "{surface.50}",
                    activeBackground: "{surface.50}"
                },
                danger: {
                    color: "{red.600}",
                    hoverBackground: "{red.75}",
                    activeBackground: "{red.100}"
                },
                primary: {
                    color: "{primary.500}",
                    hoverBackground: "{primary.75}",
                    activeBackground: "{primary.100}"
                },
                success: {
                    color: "{green.600}",
                    hoverBackground: "{green.75}",
                    activeBackground: "{green.100}"
                },
                contrast: {
                    color: "{surface.950}",
                    hoverBackground: "{surface.75}",
                    activeBackground: "{surface.100}"
                },
                secondary: {
                    color: "{surface.950}",
                    hoverBackground: "{transparant.black.100}",
                    activeBackground: "{surface.100}"
                }
            },
            outlined: {
                help: {
                    color: "{surface.50}",
                    borderColor: "{surface.50}",
                    hoverBackground: "{surface.50}",
                    activeBackground: "{surface.50}"
                },
                info: {
                    color: "{surface.50}",
                    borderColor: "{surface.50}",
                    hoverBackground: "{surface.50}",
                    activeBackground: "{surface.50}"
                },
                warn: {
                    color: "{surface.50}",
                    borderColor: "{surface.50}",
                    hoverBackground: "{surface.50}",
                    activeBackground: "{surface.50}"
                },
                plain: {
                    color: "{surface.50}",
                    borderColor: "{surface.50}",
                    hoverBackground: "{surface.50}",
                    activeBackground: "{surface.50}"
                },
                danger: {
                    color: "{red.600}",
                    borderColor: "{red.200}",
                    hoverBackground: "{red.50}",
                    activeBackground: "{red.100}"
                },
                primary: {
                    color: "{surface.50}",
                    borderColor: "{surface.50}",
                    hoverBackground: "{surface.50}",
                    activeBackground: "{surface.50}"
                },
                success: {
                    color: "{surface.50}",
                    borderColor: "{surface.50}",
                    hoverBackground: "{surface.50}",
                    activeBackground: "{surface.50}"
                },
                contrast: {
                    color: "{surface.50}",
                    borderColor: "{surface.50}",
                    hoverBackground: "{surface.50}",
                    activeBackground: "{surface.50}"
                },
                secondary: {
                    color: "{surface.50}",
                    borderColor: "{surface.50}",
                    hoverBackground: "{surface.50}",
                    activeBackground: "{surface.50}"
                }
            }
        }
    }
} satisfies ButtonDesignTokens;