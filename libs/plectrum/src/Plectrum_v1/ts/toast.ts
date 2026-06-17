import type { ToastDesignTokens } from '@primeuix/themes/types/toast';

 export default {
    icon: {
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
        width: "25rem",
        borderWidth: "1px",
        borderRadius: "{content.border.radius}",
        transitionDuration: "{transition.duration}"
    },
    text: {
        gap: "0.5rem"
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
    detail: {
        fontSize: "0.875rem",
        fontWeight: "500"
    },
    content: {
        gap: "0.5rem",
        padding: "{overlay.popover.padding}"
    },
    success: {
        shadow: "0 4px 8px 0 #0108040a",
        closeButton: {
            focusRing: {
                shadow: "none"
            }
        }
    },
    summary: {
        fontSize: "1rem",
        fontWeight: "500"
    },
    contrast: {
        shadow: "0 4px 8px 0 #0000010a",
        closeButton: {
            focusRing: {
                shadow: "none"
            }
        }
    },
    closeIcon: {
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
                background: "#f5f7faf2",
                borderColor: "{surface.100}",
                closeButton: {
                    focusRing: {
                        color: "{primary.color}"
                    },
                    hoverBackground: "{blue.100}"
                },
                detailColor: "{text.color}"
            },
            root: {
                blur: "1.5px"
            },
            warn: {
                color: "{text.color}",
                background: "#fff9ebf2",
                borderColor: "{toast.info.border.color}",
                closeButton: {
                    focusRing: {
                        color: "{yellow.600}"
                    },
                    hoverBackground: "{yellow.100}"
                },
                detailColor: "{text.color}"
            },
            error: {
                color: "{text.color}",
                background: "#fff2f1f2",
                borderColor: "{toast.info.border.color}",
                closeButton: {
                    focusRing: {
                        color: "{red.600}"
                    },
                    hoverBackground: "{red.100}"
                },
                detailColor: "{surface.700}"
            },
            success: {
                color: "{text.color}",
                background: "#f1fcf4f2",
                borderColor: "{toast.info.border.color}",
                closeButton: {
                    focusRing: {
                        color: "{green.600}"
                    },
                    hoverBackground: "{green.100}"
                },
                detailColor: "{text.color}"
            },
            contrast: {
                color: "{surface.50}",
                background: "{surface.900}",
                borderColor: "{surface.950}",
                closeButton: {
                    focusRing: {
                        color: "{surface.50}"
                    },
                    hoverBackground: "{surface.800}"
                },
                detailColor: "{surface.0}"
            },
            secondary: {
                color: "{text.color}",
                background: "{surface.100}",
                borderColor: "{toast.info.border.color}",
                closeButton: {
                    focusRing: {
                        color: "{surface.600}"
                    },
                    hoverBackground: "{surface.200}"
                },
                detailColor: "{surface.700}"
            }
        }
    }
} satisfies ToastDesignTokens;