import type { TimelineDesignTokens } from '@primeuix/themes/types/timeline';

 export default {
    event: {
        minHeight: "5rem"
    },
    vertical: {
        eventContent: {
            padding: "0 1rem"
        }
    },
    horizontal: {
        eventContent: {
            padding: "1rem 0"
        }
    },
    eventMarker: {
        size: "1.125rem",
        content: {
            size: "0.375rem",
            background: "{primary.600}",
            insetShadow: "0 1px 1px 0 #0000001f, 0 1px 0 0 #0000000f",
            borderRadius: "2px"
        },
        background: "{content.background}",
        borderColor: "{content.border.color}",
        borderWidth: "1px",
        borderRadius: "20px"
    },
    eventConnector: {
        size: "2px",
        color: "{timeline.event.marker.border.color}"
    }
} satisfies TimelineDesignTokens;