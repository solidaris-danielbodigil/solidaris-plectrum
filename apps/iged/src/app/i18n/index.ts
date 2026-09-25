import { computed, inject } from '@angular/core';
import { PdsLocaleService } from '@solidaris-danielbodigil/ui';
import { IgedMessages, type IgedMessageSet } from './messages';

export { IgedMessages, type IgedMessageSet } from './messages';

export function injectIgedMessages() {
  const locale = inject(PdsLocaleService).locale;
  return computed<IgedMessageSet>(() => IgedMessages[locale()]);
}
