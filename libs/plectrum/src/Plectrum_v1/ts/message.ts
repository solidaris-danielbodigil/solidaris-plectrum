import type { MessageDesignTokens } from '@primeuix/themes/types/message';

 export default {
    root: {
        borderRadius: "{content.border.radius}",
        borderWidth: "1px",
        transitionDuration: "{transition.duration}"
    },
    content: {
        padding: "0.5rem 0.75rem",
        gap: "0.5rem",
        sm: {
            padding: "0.375rem 0.625rem"
        },
        lg: {
            padding: "0.625rem 0.875rem"
        }
    },
    text: {
        fontSize: "1rem",
        fontWeight: "500",
        sm: {
            fontSize: "0.875rem"
        },
        lg: {
            fontSize: "1.125rem"
        }
    },
    icon: {
        size: "1.125rem",
        sm: {
            size: "1rem"
        },
        lg: {
            size: "1.25rem"
        }
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
        size: "1rem",
        sm: {
            size: "0.875rem"
        },
        lg: {
            size: "1.125rem"
        }
    },
    outlined: {
        root: {
            borderWidth: "1px"
        }
    },
    simple: {
        content: {
            padding: "0"
        }
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
            info: {
                background: "#eff6fff2",
                borderColor: "{blue.200}",
                color: "{text.color}",
                closeButton: {
                    hoverBackground: "{blue.100}",
                    focusRing: {
                        color: "{primary.color}"
                    }
                },
                outlined: {
                    color: "{text.color}",
                    borderColor: "{primary.color}"
                },
                simple: {
                    color: "{text.color}"
                }
            },
            success: {
                background: "#f0fdf4f2",
                borderColor: "{green.200}",
                color: "{text.color}",
                closeButton: {
                    hoverBackground: "{green.100}",
                    focusRing: {
                        color: "{green.600}"
                    }
                },
                outlined: {
                    color: "{text.color}",
                    borderColor: "{green.600}"
                },
                simple: {
                    color: "{text.color}"
                }
            },
            warn: {
                background: "#fefce8f2",
                borderColor: "{yellow.200}",
                color: "{text.color}",
                closeButton: {
                    hoverBackground: "{yellow.100}",
                    focusRing: {
                        color: "{yellow.700}"
                    }
                },
                outlined: {
                    color: "{text.color}",
                    borderColor: "{yellow.700}"
                },
                simple: {
                    color: "{text.color}"
                }
            },
            error: {
                background: "#fef2f2f2",
                borderColor: "{red.200}",
                color: "{text.color}",
                closeButton: {
                    hoverBackground: "{red.100}",
                    focusRing: {
                        color: "{red.600}"
                    }
                },
                outlined: {
                    color: "{text.color}",
                    borderColor: "{red.600}"
                },
                simple: {
                    color: "{text.color}"
                }
            },
            secondary: {
                background: "{surface.50}",
                borderColor: "{surface.200}",
                color: "{text.color}",
                closeButton: {
                    hoverBackground: "{surface.400}",
                    focusRing: {
                        color: "{surface.600}"
                    }
                },
                outlined: {
                    color: "{text.color}",
                    borderColor: "{surface.500}"
                },
                simple: {
                    color: "{text.color}"
                }
            },
            contrast: {
                background: "{surface.900}",
                borderColor: "{surface.950}",
                color: "{surface.50}",
                closeButton: {
                    hoverBackground: "{surface.800}",
                    focusRing: {
                        color: "{text.color}"
                    }
                },
                outlined: {
                    color: "{text.color}",
                    borderColor: "{surface.950}"
                },
                simple: {
                    color: "{text.color}"
                }
            }
        }
    }
} satisfies MessageDesignTokens;