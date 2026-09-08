import type { PdsMessages } from '../i18n';

export const CopyableTextMessages = {
  fr: {
    copyLabel: (label: string) => `Copier ${label}`,
  },
  nl: {
    copyLabel: (label: string) => `${label} kopiëren`,
  },
} as const satisfies PdsMessages<{
  copyLabel: (label: string) => string;
}>;
