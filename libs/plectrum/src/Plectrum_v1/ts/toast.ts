import type { ToastDesignTokens } from '@primeuix/themes/types/toast';

 export default {
    root: {
        width: "25rem",
        borderRadius: "{content.border.radius}",
        borderWidth: "1px",
        transitionDuration: "{transition.duration}"
    },
    icon: {
        size: "1.125rem"
    },
    content: {
        padding: "{overlay.popover.padding}",
        gap: "0.5rem"
    },
    text: {
        gap: "0.5rem"
    },
    summary: {
        fontWeight: "500",
        fontSize: "1rem"
    },
    detail: {
        fontWeight: "500",
        fontSize: "0.875rem"
    },
    closeButton: {
        width: "1.75rem",
        height: "1.75rem",
        borderRadius: "0.875rem",
        focusRing: {
            width: "{focus.ring.width}",
            style: "{focus.ring.style}",
            offset: "{focus.ring.offset}"
        }
    },
    closeIcon: {
        size: "1rem"
    },
    info: {
        shadow: "0 4px 8px 0 #02050a0a",
        closeButton: {
            focusRing: {
                shadow: "none"
            }
        }
    },
    success: {
        shadow: "0 4px 8px 0 #0108040a",
        closeButton: {
            focusRing: {
                shadow: "none"
            }
        }
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
    secondary: {
        shadow: "0 4px 8px 0 #0405060a",
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
    colorScheme: {
        light: {
            root: {
                blur: "1.5px"
            },
            info: {
                background: "#f5f7faf2",
                borderColor: "{surface.100}",
                color: "{text.color}",
                detailColor: "{text.color}",
                closeButton: {
                    hoverBackground: "{blue.100}",
                    focusRing: {
                        color: "{primary.color}"
                    }
                }
            },
            success: {
                background: "#f1fcf4f2",
                borderColor: "{toast.info.border.color}",
                color: "{text.color}",
                detailColor: "{text.color}",
                closeButton: {
                    hoverBackground: "{green.100}",
                    focusRing: {
                        color: "{green.600}"
                    }
                }
            },
            warn: {
                background: "#fff9ebf2",
                borderColor: "{toast.info.border.color}",
                color: "{text.color}",
                detailColor: "{text.color}",
                closeButton: {
                    hoverBackground: "{yellow.100}",
                    focusRing: {
                        color: "{yellow.600}"
                    }
                }
            },
            error: {
                background: "#fff2f1f2",
                borderColor: "{toast.info.border.color}",
                color: "{text.color}",
                detailColor: "{surface.700}",
                closeButton: {
                    hoverBackground: "{red.100}",
                    focusRing: {
                        color: "{red.600}"
                    }
                }
            },
            secondary: {
                background: "{surface.100}",
                borderColor: "{toast.info.border.color}",
                color: "{text.color}",
                detailColor: "{surface.700}",
                closeButton: {
                    hoverBackground: "{surface.200}",
                    focusRing: {
                        color: "{surface.600}"
                    }
                }
            },
            contrast: {
                background: "{surface.900}",
                borderColor: "{surface.950}",
                color: "{surface.50}",
                detailColor: "{surface.0}",
                closeButton: {
                    hoverBackground: "{surface.800}",
                    focusRing: {
                        color: "{surface.50}"
                    }
                }
            }
        }
    }
} satisfies ToastDesignTokens;