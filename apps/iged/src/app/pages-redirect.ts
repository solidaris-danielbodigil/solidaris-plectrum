export const IGED_PAGES_REDIRECT_KEY = 'pds-iged-spa-path';

/** Path stashed by the root GitHub Pages 404 dispatcher for /iged deep links. */
export function readIgedPagesRedirect(): string | null {
  try {
    const stored = sessionStorage.getItem(IGED_PAGES_REDIRECT_KEY);
    if (!stored) {
      return null;
    }
    sessionStorage.removeItem(IGED_PAGES_REDIRECT_KEY);
    return stored;
  } catch {
    return null;
  }
}
