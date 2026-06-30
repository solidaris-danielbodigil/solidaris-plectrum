export default {
    basic: {
        solidaris: {
            50: "#ffedf1ff",
            100: "#f8ccd5ff",
            200: "#f099acff",
            300: "#e96682ff",
            400: "#e13359ff",
            500: "#da002fff",
            600: "#a60025ff",
            700: "#83001cff",
            800: "#570013ff",
            900: "#2c0009ff"
        }
    },
    functional: {
        link: {
            visited: "#c822a6ff",
            hover: "#004c9eff",
            default: "#006ce0ff"
        }
    },
    plectrum: {
        titularis: {
            background: "{basic.solidaris.500}",
            color: "{primary.contrast.color}"
        },
        partner: {
            background: "{blue.800}",
            color: "{primary.contrast.color}"
        },
        three: {
            background: "{teal.400}",
            color: "{surface.950}"
        },
        four: {
            background: "{yellow.400}",
            color: "{surface.950}"
        },
        five: {
            background: "{purple.700}",
            color: "{primary.contrast.color}"
        },
        six: {
            background: "{pink.400}",
            color: "{surface.950}"
        },
        seven: {
            background: "{cyan.400}",
            color: "{surface.950}"
        },
        eight: {
            background: "{amber.500}",
            color: "{surface.950}"
        },
        nine: {
            background: "{lime.500}",
            color: "{surface.950}"
        },
        deceased: {
            background: "{form.field.disabled.background}",
            color: "{surface.950}"
        }
    },
    emutnav: {
        item: {
            icon: {
                color: "{navigation.item.icon.color}",
                active: {
                    color: "{emutnav.item.active.color}"
                },
                focus: {
                    color: "{navigation.item.icon.focus.color}"
                }
            },
            gap: "1rem",
            color: "{navigation.item.color}",
            padding: "1rem",
            active: {
                color: "{branding.700}",
                background: "{branding.50}"
            },
            focus: {
                color: "{navigation.item.focus.color}",
                background: "{navigation.item.focus.background}"
            },
            hover: {
                background: "{navigation.item.focus.background}"
            }
        },
        list: {
            mobile: {
                gap: "0.25rem",
                padding: "0.75rem"
            },
            gap: "0.5rem",
            padding: "1.5rem"
        }
    },
    message: {
        success: {
            icon: {
                color: "{message.success.outlined.border.color}"
            }
        },
        info: {
            icon: {
                color: "{message.info.outlined.border.color}"
            }
        },
        warn: {
            icon: {
                color: "{message.warn.outlined.border.color}"
            }
        },
        error: {
            icon: {
                color: "{message.error.outlined.border.color}"
            }
        },
        secondary: {
            icon: {
                color: "{message.secondary.outlined.border.color}"
            }
        },
        contrast: {
            icon: {
                color: "{message.contrast.color}"
            },
            simple: {
                icon: {
                    color: "{message.contrast.simple.color}"
                }
            }
        }
    },
    toast: {
        success: {
            icon: {
                color: "{toast.success.close.button.focus.ring.color}"
            }
        },
        info: {
            icon: {
                color: "{toast.info.close.button.focus.ring.color}"
            }
        },
        warn: {
            icon: {
                color: "{toast.warn.close.button.focus.ring.color}"
            }
        },
        error: {
            icon: {
                color: "{toast.error.close.button.focus.ring.color}"
            }
        },
        secondary: {
            icon: {
                color: "{toast.secondary.close.button.focus.ring.color}"
            }
        },
        contrast: {
            icon: {
                color: "{toast.contrast.close.button.focus.ring.color}"
            }
        }
    },
    carousel: {
        indicator: {
            active: {
                height: "0.5rem"
            }
        }
    },
    form: {
        field: {
            disabled: {
                border: "{surface.200}"
            },
            invalid: {
                border: {
                    weight: "0.125rem"
                }
            }
        }
    },
    progressbar: {
        value: {
            height: "1.25rem"
        },
        indeterminate: {
            value: {
                height: "6px"
            },
            height: "3px"
        }
    },
    slider: {
        range: {
            size: "8px"
        }
    },
    toggleswitch: {
        handle: {
            disabled: {
                border: "{neutral.600}"
            }
        }
    },
    tabs: {
        tablist: {
            border: {
                width: {
                    bottom: "1px"
                }
            }
        }
    },
    accordion: {
        panel: {
            border: {
                width: {
                    bottom: "1px"
                }
            }
        }
    }
}