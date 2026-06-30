import type { ButtonDesignTokens } from '@primeuix/themes/types/button';

 export default {
    root: {
        borderRadius: "{form.field.border.radius}",
        roundedBorderRadius: "2rem",
        gap: "0.5rem",
        paddingX: "{form.field.padding.x}",
        paddingY: "{form.field.padding.y}",
        iconOnlyWidth: "2.5rem",
        sm: {
            fontSize: "{form.field.sm.font.size}",
            paddingX: "{form.field.sm.padding.x}",
            paddingY: "{form.field.sm.padding.y}",
            iconOnlyWidth: "2rem"
        },
        lg: {
            fontSize: "{form.field.lg.font.size}",
            paddingX: "{form.field.lg.padding.x}",
            paddingY: "{form.field.lg.padding.y}",
            iconOnlyWidth: "3rem"
        },
        label: {
            fontWeight: "500"
        },
        focusRing: {
            width: "{focus.ring.width}",
            style: "{focus.ring.style}",
            offset: "{focus.ring.offset}"
        },
        badgeSize: "1rem",
        transitionDuration: "{form.field.transition.duration}",
        primary: {
            focusRing: {
                shadow: "none"
            }
        },
        secondary: {
            focusRing: {
                shadow: "none"
            }
        },
        info: {
            focusRing: {
                shadow: "none"
            }
        },
        success: {
            focusRing: {
                shadow: "none"
            }
        },
        warn: {
            focusRing: {
                shadow: "none"
            }
        },
        help: {
            focusRing: {
                shadow: "none"
            }
        },
        danger: {
            focusRing: {
                shadow: "none"
            }
        },
        contrast: {
            focusRing: {
                shadow: "none"
            }
        }
    },
    colorScheme: {
        light: {
            root: {
                primary: {
                    background: "{primary.600}",
                    hoverBackground: "{primary.hover.color}",
                    activeBackground: "{primary.active.color}",
                    borderColor: "{primary.600}",
                    hoverBorderColor: "{primary.hover.color}",
                    activeBorderColor: "{primary.active.color}",
                    color: "{primary.contrast.color}",
                    hoverColor: "{primary.contrast.color}",
                    activeColor: "{primary.contrast.color}",
                    focusRing: {
                        color: "{primary.color}"
                    }
                },
                secondary: {
                    background: "{surface.0}",
                    hoverBackground: "{surface.200}",
                    activeBackground: "{button.secondary.hover.background}",
                    borderColor: "{surface.500}",
                    hoverBorderColor: "{button.secondary.border.color}",
                    activeBorderColor: "{button.secondary.border.color}",
                    color: "{surface.950}",
                    hoverColor: "{button.secondary.color}",
                    activeColor: "{button.secondary.color}",
                    focusRing: {
                        color: "{surface.600}"
                    }
                },
                info: {
                    background: "{sky.300}",
                    hoverBackground: "{sky.500}",
                    activeBackground: "{button.info.hover.background}",
                    borderColor: "{button.info.background}",
                    hoverBorderColor: "{button.info.hover.background}",
                    activeBorderColor: "{button.info.hover.border.color}",
                    color: "{surface.950}",
                    hoverColor: "{button.info.color}",
                    activeColor: "{button.info.color}",
                    focusRing: {
                        color: "{sky.500}"
                    }
                },
                success: {
                    background: "{green.300}",
                    hoverBackground: "{green.500}",
                    activeBackground: "{button.success.hover.background}",
                    borderColor: "{button.success.background}",
                    hoverBorderColor: "{button.success.hover.background}",
                    activeBorderColor: "{button.success.active.background}",
                    color: "{surface.950}",
                    hoverColor: "{button.success.color}",
                    activeColor: "{button.success.color}",
                    focusRing: {
                        color: "{green.500}"
                    }
                },
                warn: {
                    background: "{orange.300}",
                    hoverBackground: "{orange.500}",
                    activeBackground: "{button.warn.hover.background}",
                    borderColor: "{button.warn.background}",
                    hoverBorderColor: "{button.warn.hover.background}",
                    activeBorderColor: "{button.warn.active.background}",
                    color: "{surface.950}",
                    hoverColor: "{surface.950}",
                    activeColor: "{button.warn.color}",
                    focusRing: {
                        color: "{orange.500}"
                    }
                },
                help: {
                    background: "{purple.200}",
                    hoverBackground: "{purple.400}",
                    activeBackground: "{button.help.hover.background}",
                    borderColor: "{button.help.background}",
                    hoverBorderColor: "{button.help.hover.background}",
                    activeBorderColor: "{button.help.active.background}",
                    color: "{surface.950}",
                    hoverColor: "{button.help.color}",
                    activeColor: "{button.help.hover.color}",
                    focusRing: {
                        color: "{purple.500}"
                    }
                },
                danger: {
                    background: "{red.200}",
                    hoverBackground: "{red.400}",
                    activeBackground: "{button.danger.hover.background}",
                    borderColor: "{button.danger.background}",
                    hoverBorderColor: "{button.danger.hover.background}",
                    activeBorderColor: "{button.danger.active.background}",
                    color: "{surface.950}",
                    hoverColor: "{button.danger.color}",
                    activeColor: "{button.danger.hover.color}",
                    focusRing: {
                        color: "{red.600}"
                    }
                },
                contrast: {
                    background: "{surface.950}",
                    hoverBackground: "{surface.700}",
                    activeBackground: "{button.contrast.hover.background}",
                    borderColor: "{button.contrast.background}",
                    hoverBorderColor: "{button.contrast.hover.background}",
                    activeBorderColor: "{button.contrast.active.background}",
                    color: "{primary.contrast.color}",
                    hoverColor: "{button.contrast.color}",
                    activeColor: "{button.contrast.hover.color}",
                    focusRing: {
                        color: "{surface.950}"
                    }
                }
            },
            outlined: {
                primary: {
                    hoverBackground: "{primary.100}",
                    activeBackground: "{button.outlined.primary.hover.background}",
                    borderColor: "{primary.400}",
                    color: "{primary.700}"
                },
                secondary: {
                    hoverBackground: "{surface.100}",
                    activeBackground: "{button.outlined.secondary.hover.background}",
                    borderColor: "{surface.300}",
                    color: "{surface.700}"
                },
                success: {
                    hoverBackground: "{green.100}",
                    activeBackground: "{button.outlined.success.hover.background}",
                    borderColor: "{green.400}",
                    color: "{green.700}"
                },
                info: {
                    hoverBackground: "{sky.100}",
                    activeBackground: "{button.outlined.info.hover.background}",
                    borderColor: "{sky.400}",
                    color: "{sky.700}"
                },
                warn: {
                    hoverBackground: "{orange.100}",
                    activeBackground: "{button.outlined.warn.hover.background}",
                    borderColor: "{orange.400}",
                    color: "{orange.700}"
                },
                help: {
                    hoverBackground: "{purple.100}",
                    activeBackground: "{button.outlined.help.hover.background}",
                    borderColor: "{purple.400}",
                    color: "{purple.700}"
                },
                danger: {
                    hoverBackground: "{red.100}",
                    activeBackground: "{button.outlined.danger.hover.background}",
                    borderColor: "{red.400}",
                    color: "{red.700}"
                },
                contrast: {
                    hoverBackground: "{surface.100}",
                    activeBackground: "{button.outlined.contrast.hover.background}",
                    borderColor: "{surface.400}",
                    color: "{surface.950}"
                },
                plain: {
                    hoverBackground: "{surface.100}",
                    activeBackground: "{button.outlined.plain.hover.background}",
                    borderColor: "{surface.400}",
                    color: "{surface.700}"
                }
            },
            text: {
                primary: {
                    hoverBackground: "{button.outlined.primary.hover.background}",
                    activeBackground: "{button.outlined.primary.active.background}",
                    color: "{button.outlined.primary.color}"
                },
                secondary: {
                    hoverBackground: "{button.outlined.secondary.hover.background}",
                    activeBackground: "{button.outlined.secondary.active.background}",
                    color: "{button.outlined.secondary.color}"
                },
                success: {
                    hoverBackground: "{button.outlined.success.hover.background}",
                    activeBackground: "{button.outlined.success.active.background}",
                    color: "{button.outlined.success.color}"
                },
                info: {
                    hoverBackground: "{button.outlined.info.hover.background}",
                    activeBackground: "{button.outlined.info.active.background}",
                    color: "{button.outlined.info.color}"
                },
                warn: {
                    hoverBackground: "{button.outlined.warn.hover.background}",
                    activeBackground: "{button.outlined.warn.active.background}",
                    color: "{button.outlined.warn.color}"
                },
                help: {
                    hoverBackground: "{button.outlined.help.hover.background}",
                    activeBackground: "{button.outlined.help.active.background}",
                    color: "{button.outlined.help.color}"
                },
                danger: {
                    hoverBackground: "{button.outlined.danger.hover.background}",
                    activeBackground: "{button.outlined.danger.active.background}",
                    color: "{button.outlined.danger.color}"
                },
                contrast: {
                    hoverBackground: "{button.outlined.contrast.hover.background}",
                    activeBackground: "{button.outlined.contrast.active.background}",
                    color: "{button.outlined.contrast.color}"
                },
                plain: {
                    hoverBackground: "{button.outlined.plain.hover.background}",
                    activeBackground: "{button.outlined.plain.active.background}",
                    color: "{button.outlined.plain.color}"
                }
            },
            link: {
                color: "{button.primary.background}",
                hoverColor: "{button.primary.hover.background}",
                activeColor: "{button.primary.active.background}"
            }
        }
    }
} satisfies ButtonDesignTokens;