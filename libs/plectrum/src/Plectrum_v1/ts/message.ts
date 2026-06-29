import type { MessageDesignTokens } from '@primeuix/themes/types/message';

 export default {
    icon: {
        lg: {
            size: "1.25rem"
        },
        sm: {
            size: "1rem"
        },
        size: "1.125rem"
    },
    info: {
        shadow: "0 4px 8px 0 #02050a0a",
        closeButton: {
            focusRing: {
                shadow: "none"
            }
        }
    },
    root: {
        borderWidth: "1px",
        borderRadius: "{content.border.radius}",
        transitionDuration: "{transition.duration}"
    },
    text: {
        lg: {
            fontSize: "1.125rem"
        },
        sm: {
            fontSize: "0.875rem"
        },
        fontSize: "1rem",
        fontWeight: "500"
    },
    warn: {
        shadow: "0 4px 8px 0 #0907000a",
        closeButton: {
            focusRing: {
                shadow: "none"
            }
        }
    },
    error: {
        shadow: "0 4px 8px 0 #0a03030a",
        closeButton: {
            focusRing: {
                shadow: "none"
            }
        }
    },
    simple: {
        content: {
            padding: "0"
        }
    },
    content: {
        lg: {
            padding: "0.625rem 0.875rem"
        },
        sm: {
            padding: "0.375rem 0.625rem"
        },
        gap: "0.5rem",
        padding: "0.5rem 0.75rem"
    },
    success: {
        shadow: "0 4px 8px 0 #0108040a",
        closeButton: {
            focusRing: {
                shadow: "none"
            }
        }
    },
    contrast: {
        shadow: "0 4px 8px 0 #0000010a",
        closeButton: {
            focusRing: {
                shadow: "none"
            }
        }
    },
    outlined: {
        root: {
            borderWidth: "1px"
        }
    },
    closeIcon: {
        lg: {
            size: "1.125rem"
        },
        sm: {
            size: "0.875rem"
        },
        size: "1rem"
    },
    secondary: {
        shadow: "0 4px 8px 0 #0405060a",
        closeButton: {
            focusRing: {
                shadow: "none"
            }
        }
    },
    closeButton: {
        width: "1.75rem",
        height: "1.75rem",
        focusRing: {
            style: "{focus.ring.style}",
            width: "{focus.ring.width}",
            offset: "{focus.ring.offset}"
        },
        borderRadius: "0.875rem"
    },
    colorScheme: {
        light: {
            info: {
                color: "{text.color}",
                simple: {
                    color: "{text.color}"
                },
                outlined: {
                    color: "{text.color}",
                    borderColor: "{primary.color}"
                },
                background: "#eff6fff2",
                borderColor: "{blue.200}",
                closeButton: {
                    focusRing: {
                        color: "{primary.color}"
                    },
                    hoverBackground: "{blue.100}"
                }
            },
            warn: {
                color: "{text.color}",
                simple: {
                    color: "{text.color}"
                },
                outlined: {
                    color: "{text.color}",
                    borderColor: "{yellow.700}"
                },
                background: "#fefce8f2",
                borderColor: "{yellow.200}",
                closeButton: {
                    focusRing: {
                        color: "{yellow.700}"
                    },
                    hoverBackground: "{yellow.100}"
                }
            },
            error: {
                color: "{text.color}",
                simple: {
                    color: "{text.color}"
                },
                outlined: {
                    color: "{text.color}",
                    borderColor: "{red.600}"
                },
                background: "#fef2f2f2",
                borderColor: "{red.200}",
                closeButton: {
                    focusRing: {
                        color: "{red.600}"
                    },
                    hoverBackground: "{red.100}"
                }
            },
            success: {
                color: "{text.color}",
                simple: {
                    color: "{text.color}"
                },
                outlined: {
                    color: "{text.color}",
                    borderColor: "{green.600}"
                },
                background: "#f0fdf4f2",
                borderColor: "{green.200}",
                closeButton: {
                    focusRing: {
                        color: "{green.600}"
                    },
                    hoverBackground: "{green.100}"
                }
            },
            contrast: {
                color: "{surface.50}",
                simple: {
                    color: "{text.color}"
                },
                outlined: {
                    color: "{text.color}",
                    borderColor: "{surface.950}"
                },
                background: "{surface.900}",
                borderColor: "{surface.950}",
                closeButton: {
                    focusRing: {
                        color: "{text.color}"
                    },
                    hoverBackground: "{surface.800}"
                }
            },
            secondary: {
                color: "{text.color}",
                simple: {
                    color: "{text.color}"
                },
                outlined: {
                    color: "{text.color}",
                    borderColor: "{surface.500}"
                },
                background: "{surface.50}",
                borderColor: "{surface.200}",
                closeButton: {
                    focusRing: {
                        color: "{surface.600}"
                    },
                    hoverBackground: "{surface.400}"
                }
            }
        }
    }
} satisfies MessageDesignTokens;