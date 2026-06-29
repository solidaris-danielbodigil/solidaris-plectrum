export default {
    form: {
        field: {
            invalid: {
                border: {
                    weight: "0.125rem"
                }
            },
            disabled: {
                border: "{surface.200}"
            }
        }
    },
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
    toast: {
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
        success: {
            icon: {
                color: "{toast.success.close.button.focus.ring.color}"
            }
        },
        contrast: {
            icon: {
                color: "{toast.contrast.close.button.focus.ring.color}"
            }
        },
        secondary: {
            icon: {
                color: "{toast.secondary.close.button.focus.ring.color}"
            }
        }
    },
    slider: {
        range: {
            size: "8px"
        }
    },
    emutnav: {
        item: {
            gap: "1rem",
            icon: {
                color: "{navigation.item.icon.color}",
                focus: {
                    color: "{navigation.item.icon.focus.color}"
                },
                active: {
                    color: "{emutnav.item.active.color}"
                }
            },
            color: "{navigation.item.color}",
            focus: {
                color: "{navigation.item.focus.color}",
                background: "{navigation.item.focus.background}"
            },
            hover: {
                background: "{navigation.item.focus.background}"
            },
            active: {
                color: "{branding.700}",
                background: "{branding.50}"
            },
            padding: "1rem"
        },
        list: {
            gap: "0.5rem",
            mobile: {
                gap: "0.25rem",
                padding: "0.75rem"
            },
            padding: "1.5rem"
        }
    },
    message: {
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
        success: {
            icon: {
                color: "{message.success.outlined.border.color}"
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
        },
        secondary: {
            icon: {
                color: "{message.secondary.outlined.border.color}"
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
    plectrum: {
        six: {
            color: "{surface.950}",
            background: "{pink.400}"
        },
        five: {
            color: "{primary.contrast.color}",
            background: "{purple.700}"
        },
        four: {
            color: "{surface.950}",
            background: "{yellow.400}"
        },
        nine: {
            color: "{surface.950}",
            background: "{lime.500}"
        },
        eight: {
            color: "{surface.950}",
            background: "{amber.500}"
        },
        seven: {
            color: "{surface.950}",
            background: "{cyan.400}"
        },
        three: {
            color: "{surface.950}",
            background: "{teal.400}"
        },
        partner: {
            color: "{primary.contrast.color}",
            background: "{blue.800}"
        },
        deceased: {
            color: "{surface.950}",
            background: "{form.field.disabled.background}"
        },
        titularis: {
            color: "{primary.contrast.color}",
            background: "{basic.solidaris.500}"
        }
    },
    functional: {
        link: {
            hover: "#004c9eff",
            default: "#006ce0ff",
            visited: "#c822a6ff"
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
    toggleswitch: {
        handle: {
            disabled: {
                border: "{neutral.600}"
            }
        }
    }
}