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
        help: {
            focusRing: {
                shadow: "none"
            }
        },
        info: {
            focusRing: {
                shadow: "none"
            }
        },
        warn: {
            focusRing: {
                shadow: "none"
            }
        },
        label: {
            fontWeight: "500"
        },
        danger: {
            focusRing: {
                shadow: "none"
            }
        },
        primary: {
            focusRing: {
                shadow: "none"
            }
        },
        success: {
            focusRing: {
                shadow: "none"
            }
        },
        contrast: {
            focusRing: {
                shadow: "none"
            }
        },
        paddingX: "{form.field.padding.x}",
        paddingY: "{form.field.padding.y}",
        badgeSize: "1rem",
        focusRing: {
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}"
        },
        secondary: {
            focusRing: {
                shadow: "none"
            }
        },
        borderRadius: "{form.field.border.radius}",
        iconOnlyWidth: "2.5rem",
        transitionDuration: "{form.field.transition.duration}",
        roundedBorderRadius: "2rem"
    },
    colorScheme: {
        light: {
            link: {
                color: "{primary.600}",
                hoverColor: "{primary.700}",
                activeColor: "{primary.700}"
            },
            root: {
                help: {
                    color: "{surface.950}",
                    focusRing: {
                        color: "{purple.500}"
                    },
                    background: "{purple.300}",
                    hoverColor: "{surface.950}",
                    activeColor: "{surface.950}",
                    borderColor: "{purple.300}",
                    hoverBackground: "{purple.400}",
                    activeBackground: "{purple.400}",
                    hoverBorderColor: "{purple.400}",
                    activeBorderColor: "{purple.400}"
                },
                info: {
                    color: "{surface.950}",
                    focusRing: {
                        color: "{sky.500}"
                    },
                    background: "{sky.400}",
                    hoverColor: "{surface.950}",
                    activeColor: "{surface.950}",
                    borderColor: "{sky.400}",
                    hoverBackground: "{sky.500}",
                    activeBackground: "{sky.500}",
                    hoverBorderColor: "{sky.500}",
                    activeBorderColor: "{sky.500}"
                },
                warn: {
                    color: "{surface.950}",
                    focusRing: {
                        color: "{orange.500}"
                    },
                    background: "{orange.400}",
                    hoverColor: "{surface.950}",
                    activeColor: "{surface.950}",
                    borderColor: "{orange.400}",
                    hoverBackground: "{orange.500}",
                    activeBackground: "{orange.500}",
                    hoverBorderColor: "{orange.500}",
                    activeBorderColor: "{orange.500}"
                },
                danger: {
                    color: "#ffffffff",
                    focusRing: {
                        color: "{red.600}"
                    },
                    background: "{red.600}",
                    hoverColor: "{surface.950}",
                    activeColor: "{surface.0}",
                    borderColor: "{red.600}",
                    hoverBackground: "{red.700}",
                    activeBackground: "{red.700}",
                    hoverBorderColor: "{red.700}",
                    activeBorderColor: "{red.700}"
                },
                primary: {
                    color: "{primary.contrast.color}",
                    focusRing: {
                        color: "{primary.color}"
                    },
                    background: "{primary.600}",
                    hoverColor: "{primary.contrast.color}",
                    activeColor: "{primary.contrast.color}",
                    borderColor: "{primary.600}",
                    hoverBackground: "{primary.hover.color}",
                    activeBackground: "{primary.active.color}",
                    hoverBorderColor: "{primary.hover.color}",
                    activeBorderColor: "{primary.active.color}"
                },
                success: {
                    color: "{surface.950}",
                    focusRing: {
                        color: "{green.500}"
                    },
                    background: "{green.400}",
                    hoverColor: "{surface.950}",
                    activeColor: "{surface.950}",
                    borderColor: "{green.400}",
                    hoverBackground: "{green.500}",
                    activeBackground: "{green.500}",
                    hoverBorderColor: "{green.500}",
                    activeBorderColor: "{green.500}"
                },
                contrast: {
                    color: "{surface.0}",
                    focusRing: {
                        color: "{surface.950}"
                    },
                    background: "{surface.950}",
                    hoverColor: "{surface.0}",
                    activeColor: "{surface.0}",
                    borderColor: "{surface.950}",
                    hoverBackground: "{surface.800}",
                    activeBackground: "{surface.800}",
                    hoverBorderColor: "{surface.800}",
                    activeBorderColor: "{surface.800}"
                },
                secondary: {
                    color: "{surface.950}",
                    focusRing: {
                        color: "{surface.600}"
                    },
                    background: "{surface.0}",
                    hoverColor: "{surface.950}",
                    activeColor: "{surface.950}",
                    borderColor: "{surface.500}",
                    hoverBackground: "{surface.100}",
                    activeBackground: "{surface.100}",
                    hoverBorderColor: "{surface.700}",
                    activeBorderColor: "{surface.700}"
                }
            },
            text: {
                help: {
                    color: "{purple.700}",
                    hoverBackground: "{purple.50}",
                    activeBackground: "{purple.50}"
                },
                info: {
                    color: "{sky.700}",
                    hoverBackground: "{sky.50}",
                    activeBackground: "{sky.50}"
                },
                warn: {
                    color: "{orange.700}",
                    hoverBackground: "{orange.50}",
                    activeBackground: "{orange.50}"
                },
                plain: {
                    color: "{surface.700}",
                    hoverBackground: "{surface.50}",
                    activeBackground: "{surface.50}"
                },
                danger: {
                    color: "{red.700}",
                    hoverBackground: "{red.50}",
                    activeBackground: "{red.50}"
                },
                primary: {
                    color: "{primary.600}",
                    hoverBackground: "{primary.50}",
                    activeBackground: "{primary.50}"
                },
                success: {
                    color: "{green.700}",
                    hoverBackground: "{green.50}",
                    activeBackground: "{green.50}"
                },
                contrast: {
                    color: "{surface.950}",
                    hoverBackground: "{surface.50}",
                    activeBackground: "{surface.50}"
                },
                secondary: {
                    color: "{surface.800}",
                    hoverBackground: "{surface.50}",
                    activeBackground: "{surface.50}"
                }
            },
            outlined: {
                help: {
                    color: "{purple.700}",
                    borderColor: "{purple.400}",
                    hoverBackground: "{purple.50}",
                    activeBackground: "{purple.50}"
                },
                info: {
                    color: "{sky.700}",
                    borderColor: "{sky.400}",
                    hoverBackground: "{sky.50}",
                    activeBackground: "{sky.50}"
                },
                warn: {
                    color: "{orange.700}",
                    borderColor: "{orange.400}",
                    hoverBackground: "{orange.50}",
                    activeBackground: "{orange.50}"
                },
                plain: {
                    color: "{surface.700}",
                    borderColor: "{surface.300}",
                    hoverBackground: "{surface.50}",
                    activeBackground: "{surface.50}"
                },
                danger: {
                    color: "{red.700}",
                    borderColor: "{red.400}",
                    hoverBackground: "{red.50}",
                    activeBackground: "{red.50}"
                },
                primary: {
                    color: "{primary.600}",
                    borderColor: "{primary.300}",
                    hoverBackground: "{primary.50}",
                    activeBackground: "{primary.50}"
                },
                success: {
                    color: "{green.700}",
                    borderColor: "{green.400}",
                    hoverBackground: "{green.50}",
                    activeBackground: "{green.50}"
                },
                contrast: {
                    color: "{surface.950}",
                    borderColor: "{surface.600}",
                    hoverBackground: "{surface.50}",
                    activeBackground: "{surface.50}"
                },
                secondary: {
                    color: "{surface.950}",
                    borderColor: "{surface.500}",
                    hoverBackground: "{surface.50}",
                    activeBackground: "{surface.50}"
                }
            }
        }
    }
} satisfies ButtonDesignTokens;