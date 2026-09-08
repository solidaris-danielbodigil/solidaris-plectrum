/** Plectrum for PrimeNG (Main) UI Kit — SSOT for gallery Figma links. */
export const PLECTRUM_UI_KIT =
  'https://www.figma.com/design/YNZ1DlSjDNUXrvkxlSp10D/Plectrum-for-PrimeNG--Main-';

export function plectrumFigma(nodeId: string): string {
  return `${PLECTRUM_UI_KIT}?node-id=${nodeId}`;
}

export const PLECTRUM_FIGMA = {
  autocomplete: plectrumFigma('6728-52564'),
  badge: plectrumFigma('6738-55106'),
  breadcrumb: plectrumFigma('6738-52933'),
  button: plectrumFigma('6738-49717'),
  card: plectrumFigma('6738-49733'),
  datatable: plectrumFigma('6738-49721'),
  datepicker: plectrumFigma('6738-20507'),
  dialog: plectrumFigma('6738-50209'),
  divider: plectrumFigma('6738-49734'),
  drawer: plectrumFigma('6738-50210'),
  inputgroup: plectrumFigma('6738-22644'),
  inputtext: plectrumFigma('6738-22646'),
  menu: plectrumFigma('6738-52936'),
  message: plectrumFigma('6738-53164'),
  popover: plectrumFigma('6738-50211'),
  scrolltop: plectrumFigma('6738-55112'),
  select: plectrumFigma('6738-22642'),
  selectbutton: plectrumFigma('6738-46433'),
  skeleton: plectrumFigma('6738-55113'),
  stepper: plectrumFigma('6738-49739'),
  tabs: plectrumFigma('6738-49740'),
  tag: plectrumFigma('6738-55116'),
  timeline: plectrumFigma('6738-49727'),
  toast: plectrumFigma('6738-53165'),
  togglebutton: plectrumFigma('6738-46435'),
  tooltip: plectrumFigma('6738-50212'),
  tree: plectrumFigma('6738-49728'),
} as const;
