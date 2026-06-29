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
                color: "{button.primary.background}",
                hoverColor: "{button.primary.hover.background}",
                activeColor: "{button.primary.active.background}"
            },
            root: {
                help: {
                    color: "{surface.950}",
                    focusRing: {
                        color: "{purple.500}"
                    },
                    background: "{purple.200}",
                    hoverColor: "{button.help.color}",
                    activeColor: "{button.help.hover.color}",
                    borderColor: "{button.help.background}",
                    hoverBackground: "{purple.400}",
                    activeBackground: "{button.help.hover.background}",
                    hoverBorderColor: "{button.help.hover.background}",
                    activeBorderColor: "{button.help.active.background}"
                },
                info: {
                    color: "{surface.950}",
                    focusRing: {
                        color: "{sky.500}"
                    },
                    background: "{sky.300}",
                    hoverColor: "{button.info.color}",
                    activeColor: "{button.info.color}",
                    borderColor: "{button.info.background}",
                    hoverBackground: "{sky.500}",
                    activeBackground: "{button.info.hover.background}",
                    hoverBorderColor: "{button.info.hover.background}",
                    activeBorderColor: "{button.info.hover.border.color}"
                },
                warn: {
                    color: "{surface.950}",
                    focusRing: {
                        color: "{orange.500}"
                    },
                    background: "{orange.300}",
                    hoverColor: "{surface.950}",
                    activeColor: "{button.warn.color}",
                    borderColor: "{button.warn.background}",
                    hoverBackground: "{orange.500}",
                    activeBackground: "{button.warn.hover.background}",
                    hoverBorderColor: "{button.warn.hover.background}",
                    activeBorderColor: "{button.warn.active.background}"
                },
                danger: {
                    color: "{surface.950}",
                    focusRing: {
                        color: "{red.600}"
                    },
                    background: "{red.200}",
                    hoverColor: "{button.danger.color}",
                    activeColor: "{button.danger.hover.color}",
                    borderColor: "{button.danger.background}",
                    hoverBackground: "{red.400}",
                    activeBackground: "{button.danger.hover.background}",
                    hoverBorderColor: "{button.danger.hover.background}",
                    activeBorderColor: "{button.danger.active.background}"
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
                    background: "{green.300}",
                    hoverColor: "{button.success.color}",
                    activeColor: "{button.success.color}",
                    borderColor: "{button.success.background}",
                    hoverBackground: "{green.500}",
                    activeBackground: "{button.success.hover.background}",
                    hoverBorderColor: "{button.success.hover.background}",
                    activeBorderColor: "{button.success.active.background}"
                },
                contrast: {
                    color: "{primary.contrast.color}",
                    focusRing: {
                        color: "{surface.950}"
                    },
                    background: "{surface.950}",
                    hoverColor: "{button.contrast.color}",
                    activeColor: "{button.contrast.hover.color}",
                    borderColor: "{button.contrast.background}",
                    hoverBackground: "{surface.700}",
                    activeBackground: "{button.contrast.hover.background}",
                    hoverBorderColor: "{button.contrast.hover.background}",
                    activeBorderColor: "{button.contrast.active.background}"
                },
                secondary: {
                    color: "{surface.950}",
                    focusRing: {
                        color: "{surface.600}"
                    },
                    background: "{surface.0}",
                    hoverColor: "{button.secondary.color}",
                    activeColor: "{button.secondary.color}",
                    borderColor: "{surface.500}",
                    hoverBackground: "{surface.200}",
                    activeBackground: "{button.secondary.hover.background}",
                    hoverBorderColor: "{button.secondary.border.color}",
                    activeBorderColor: "{button.secondary.border.color}"
                }
            },
            text: {
                help: {
                    color: "{button.outlined.help.color}",
                    hoverBackground: "{button.outlined.help.hover.background}",
                    activeBackground: "{button.outlined.help.active.background}"
                },
                info: {
                    color: "{button.outlined.info.color}",
                    hoverBackground: "{button.outlined.info.hover.background}",
                    activeBackground: "{button.outlined.info.active.background}"
                },
                warn: {
                    color: "{button.outlined.warn.color}",
                    hoverBackground: "{button.outlined.warn.hover.background}",
                    activeBackground: "{button.outlined.warn.active.background}"
                },
                plain: {
                    color: "{button.outlined.plain.color}",
                    hoverBackground: "{button.outlined.plain.hover.background}",
                    activeBackground: "{button.outlined.plain.active.background}"
                },
                danger: {
                    color: "{button.outlined.danger.color}",
                    hoverBackground: "{button.outlined.danger.hover.background}",
                    activeBackground: "{button.outlined.danger.active.background}"
                },
                primary: {
                    color: "{button.outlined.primary.color}",
                    hoverBackground: "{button.outlined.primary.hover.background}",
                    activeBackground: "{button.outlined.primary.active.background}"
                },
                success: {
                    color: "{button.outlined.success.color}",
                    hoverBackground: "{button.outlined.success.hover.background}",
                    activeBackground: "{button.outlined.success.active.background}"
                },
                contrast: {
                    color: "{button.outlined.contrast.color}",
                    hoverBackground: "{button.outlined.contrast.hover.background}",
                    activeBackground: "{button.outlined.contrast.active.background}"
                },
                secondary: {
                    color: "{button.outlined.secondary.color}",
                    hoverBackground: "{button.outlined.secondary.hover.background}",
                    activeBackground: "{button.outlined.secondary.active.background}"
                }
            },
            outlined: {
                help: {
                    color: "{purple.700}",
                    borderColor: "{purple.400}",
                    hoverBackground: "{purple.100}",
                    activeBackground: "{button.outlined.help.hover.background}"
                },
                info: {
                    color: "{sky.700}",
                    borderColor: "{sky.400}",
                    hoverBackground: "{sky.100}",
                    activeBackground: "{button.outlined.info.hover.background}"
                },
                warn: {
                    color: "{orange.700}",
                    borderColor: "{orange.400}",
                    hoverBackground: "{orange.100}",
                    activeBackground: "{button.outlined.warn.hover.background}"
                },
                plain: {
                    color: "{surface.700}",
                    borderColor: "{surface.400}",
                    hoverBackground: "{surface.100}",
                    activeBackground: "{button.outlined.plain.hover.background}"
                },
                danger: {
                    color: "{red.700}",
                    borderColor: "{red.400}",
                    hoverBackground: "{red.100}",
                    activeBackground: "{button.outlined.danger.hover.background}"
                },
                primary: {
                    color: "{primary.700}",
                    borderColor: "{primary.400}",
                    hoverBackground: "{primary.100}",
                    activeBackground: "{button.outlined.primary.hover.background}"
                },
                success: {
                    color: "{green.700}",
                    borderColor: "{green.400}",
                    hoverBackground: "{green.100}",
                    activeBackground: "{button.outlined.success.hover.background}"
                },
                contrast: {
                    color: "{surface.950}",
                    borderColor: "{surface.400}",
                    hoverBackground: "{surface.100}",
                    activeBackground: "{button.outlined.contrast.hover.background}"
                },
                secondary: {
                    color: "{surface.700}",
                    borderColor: "{surface.300}",
                    hoverBackground: "{surface.100}",
                    activeBackground: "{button.outlined.secondary.hover.background}"
                }
            }
        }
    }
} satisfies ButtonDesignTokens;