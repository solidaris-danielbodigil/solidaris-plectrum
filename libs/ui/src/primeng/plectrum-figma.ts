/** PrimeNG v21 UI kit → this repo and Storybook.
 * Node ids come from the published library
 * https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-
 * `storybook` is set only when this catalogue has a page for that control.
 */
export const PLECTRUM_UI_KIT =
  'https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-';

export type PrimeNgPurpose =
  | 'Actions'
  | 'Forms'
  | 'Navigation'
  | 'Data'
  | 'Feedback'
  | 'Overlays';

export interface PrimeNgKitComponent {
  /** Published component name in the UI kit. */
  figma: string;
  /** Figma node id, colon form. */
  nodeId: string;
  purpose: PrimeNgPurpose;
  /** Storybook docs path, including a heading when the family page is shared. */
  storybook: string | null;
  /** Selector or directive used in application templates. */
  code: string;
  /** Plectrum component or class that replaces stock usage, when one exists. */
  plectrum: string | null;
}

export function plectrumFigma(nodeId: string): string {
  return `${PLECTRUM_UI_KIT}?node-id=${nodeId.replaceAll(':', '-')}`;
}

export const PRIMENG_KIT: readonly PrimeNgKitComponent[] = [
  { figma: "autocomplete", nodeId: "6047:9515", purpose: "Forms", storybook: "/docs/primeng-autocomplete--docs", code: "p-autocomplete", plectrum: null },
  { figma: "cascadeselect", nodeId: "245:10195", purpose: "Forms", storybook: null, code: "p-cascadeselect", plectrum: null },
  { figma: "checkbox", nodeId: "148:6321", purpose: "Forms", storybook: null, code: "p-checkbox", plectrum: null },
  { figma: "colorpicker", nodeId: "248:9840", purpose: "Forms", storybook: null, code: "p-colorpicker", plectrum: null },
  { figma: "datepicker", nodeId: "109:10137", purpose: "Forms", storybook: "/docs/primeng-forms--docs#datepicker", code: "p-datepicker", plectrum: null },
  { figma: "tree", nodeId: "422:22831", purpose: "Data", storybook: "/docs/primeng-data--docs#tree-stock", code: "p-tree", plectrum: null },
  { figma: "editor", nodeId: "276:10374", purpose: "Forms", storybook: null, code: "p-editor", plectrum: null },
  { figma: "floatlabel", nodeId: "7421:323985", purpose: "Forms", storybook: null, code: "p-floatlabel", plectrum: "pds-form-field" },
  { figma: "iftalabel", nodeId: "7462:106727", purpose: "Forms", storybook: null, code: "p-iftalabel", plectrum: "pds-form-field" },
  { figma: "inputnumber", nodeId: "203:8804", purpose: "Forms", storybook: null, code: "p-inputnumber", plectrum: null },
  { figma: "inputgroup", nodeId: "263:10540", purpose: "Forms", storybook: "/docs/primeng-forms--docs#inputgroup", code: "p-inputgroup", plectrum: null },
  { figma: "inputotp", nodeId: "7167:15865", purpose: "Forms", storybook: null, code: "p-inputotp", plectrum: null },
  { figma: "inputtext", nodeId: "23:835", purpose: "Forms", storybook: "/docs/primeng-inputtext--docs", code: "pInputText", plectrum: null },
  { figma: "knob", nodeId: "277:10630", purpose: "Forms", storybook: null, code: "p-knob", plectrum: null },
  { figma: "listbox", nodeId: "6212:6733", purpose: "Forms", storybook: null, code: "p-listbox", plectrum: null },
  { figma: "multiselect", nodeId: "171:6457", purpose: "Forms", storybook: null, code: "p-multiselect", plectrum: null },
  { figma: "password", nodeId: "287:10430", purpose: "Forms", storybook: null, code: "p-password", plectrum: null },
  { figma: "radiobutton", nodeId: "140:5820", purpose: "Forms", storybook: null, code: "p-radiobutton", plectrum: null },
  { figma: "rating", nodeId: "290:11082", purpose: "Forms", storybook: null, code: "p-rating", plectrum: null },
  { figma: "select", nodeId: "156:5882", purpose: "Forms", storybook: "/docs/primeng-select--docs", code: "p-select", plectrum: null },
  { figma: "togglebutton", nodeId: "187:6103", purpose: "Actions", storybook: "/docs/primeng-togglebutton--docs", code: "p-togglebutton", plectrum: null },
  { figma: "selectbutton", nodeId: "191:6703", purpose: "Actions", storybook: "/docs/primeng-selectbutton--docs", code: "p-selectbutton", plectrum: null },
  { figma: "slider", nodeId: "290:12331", purpose: "Forms", storybook: null, code: "p-slider", plectrum: null },
  { figma: "textarea", nodeId: "6209:7402", purpose: "Forms", storybook: null, code: "textarea", plectrum: null },
  { figma: "card", nodeId: "238:10355", purpose: "Data", storybook: "/docs/primeng-content-and-navigation--docs#card", code: "p-card", plectrum: null },
  { figma: "toggleswitch", nodeId: "260:11899", purpose: "Forms", storybook: null, code: "p-toggleswitch", plectrum: null },
  { figma: "treeselect", nodeId: "6653:17198", purpose: "Forms", storybook: null, code: "p-treeselect", plectrum: null },
  { figma: "button", nodeId: "10:125", purpose: "Actions", storybook: "/docs/primeng-button--docs", code: "p-button", plectrum: null },
  { figma: "speeddial", nodeId: "504:29029", purpose: "Actions", storybook: null, code: "p-speeddial", plectrum: null },
  { figma: "splitbutton", nodeId: "223:8532", purpose: "Actions", storybook: null, code: "p-splitbutton", plectrum: null },
  { figma: "datatable", nodeId: "374:16034", purpose: "Data", storybook: "/docs/primeng-data--docs#table", code: "p-table", plectrum: null },
  { figma: "dataview", nodeId: "399:20261", purpose: "Data", storybook: null, code: "p-dataview", plectrum: null },
  { figma: "orderlist", nodeId: "6408:44516", purpose: "Data", storybook: null, code: "p-orderlist", plectrum: null },
  { figma: "organizationchart", nodeId: "434:25271", purpose: "Data", storybook: null, code: "p-organizationchart", plectrum: null },
  { figma: "paginator", nodeId: "599:33074", purpose: "Data", storybook: null, code: "p-paginator", plectrum: null },
  { figma: "picklist", nodeId: "397:18966", purpose: "Data", storybook: null, code: "p-picklist", plectrum: null },
  { figma: "timeline", nodeId: "442:29308", purpose: "Data", storybook: "/docs/custom-components-timeline--docs", code: "p-timeline", plectrum: "c-timeline" },
  { figma: "treetable", nodeId: "427:22270", purpose: "Data", storybook: null, code: "p-treetable", plectrum: null },
  { figma: "accordion", nodeId: "232:9351", purpose: "Data", storybook: "/docs/custom-components-accordion--docs", code: "p-accordion", plectrum: "c-accordion" },
  { figma: "divider", nodeId: "302:11810", purpose: "Data", storybook: "/docs/primeng-content-and-navigation--docs#divider", code: "p-divider", plectrum: null },
  { figma: "fieldset", nodeId: "306:11917", purpose: "Data", storybook: null, code: "p-fieldset", plectrum: null },
  { figma: "panel", nodeId: "229:10217", purpose: "Data", storybook: null, code: "p-panel", plectrum: null },
  { figma: "scrollpanel", nodeId: "314:12216", purpose: "Data", storybook: null, code: "p-scrollpanel", plectrum: null },
  { figma: "splitter", nodeId: "313:12050", purpose: "Data", storybook: null, code: "p-splitter", plectrum: null },
  { figma: "stepper", nodeId: "6978:73977", purpose: "Navigation", storybook: "/docs/primeng-content-and-navigation--docs#stepper", code: "p-stepper", plectrum: null },
  { figma: "tabs", nodeId: "320:12276", purpose: "Navigation", storybook: "/docs/primeng-content-and-navigation--docs#tabs", code: "p-tabs", plectrum: null },
  { figma: "toolbar", nodeId: "322:13288", purpose: "Navigation", storybook: "/docs/custom-components-toolbar--docs", code: "p-toolbar", plectrum: "pds-toolbar" },
  { figma: "confirmdialog", nodeId: "323:12317", purpose: "Overlays", storybook: null, code: "p-confirmdialog", plectrum: null },
  { figma: "confirmpopup", nodeId: "324:16867", purpose: "Overlays", storybook: null, code: "p-confirmpopup", plectrum: null },
  { figma: "dialog", nodeId: "243:9556", purpose: "Overlays", storybook: "/docs/primeng-dialog--docs", code: "p-dialog", plectrum: null },
  { figma: "popover", nodeId: "605:37190", purpose: "Overlays", storybook: "/docs/primeng-overlays--docs#popover", code: "p-popover", plectrum: null },
  { figma: "drawer", nodeId: "4461:50366", purpose: "Overlays", storybook: "/docs/custom-components-drawer--docs", code: "p-drawer", plectrum: "c-drawer" },
  { figma: "tooltip", nodeId: "327:12832", purpose: "Overlays", storybook: "/docs/primeng-overlays--docs#tooltip", code: "pTooltip", plectrum: null },
  { figma: "fileupload", nodeId: "505:29350", purpose: "Forms", storybook: null, code: "p-fileupload", plectrum: null },
  { figma: "breadcrumb", nodeId: "185:6637", purpose: "Navigation", storybook: "/docs/primeng-content-and-navigation--docs#breadcrumb", code: "p-breadcrumb", plectrum: null },
  { figma: "dock", nodeId: "507:30666", purpose: "Navigation", storybook: null, code: "p-dock", plectrum: null },
  { figma: "menu", nodeId: "452:28358", purpose: "Overlays", storybook: "/docs/primeng-overlays--docs#menu", code: "p-menu", plectrum: null },
  { figma: "contextmenu", nodeId: "6580:26999", purpose: "Overlays", storybook: null, code: "p-contextmenu", plectrum: null },
  { figma: "menubar", nodeId: "6598:27869", purpose: "Navigation", storybook: null, code: "p-menubar", plectrum: null },
  { figma: "megamenu", nodeId: "6590:27038", purpose: "Navigation", storybook: null, code: "p-megamenu", plectrum: null },
  { figma: "panelmenu", nodeId: "462:27439", purpose: "Navigation", storybook: null, code: "p-panelmenu", plectrum: null },
  { figma: "tieredmenu", nodeId: "452:28582", purpose: "Navigation", storybook: null, code: "p-tieredmenu", plectrum: null },
  { figma: "message", nodeId: "393:39252", purpose: "Feedback", storybook: "/docs/primeng-message-and-toast--docs", code: "p-message", plectrum: null },
  { figma: "toast", nodeId: "393:42317", purpose: "Feedback", storybook: "/docs/primeng-message-and-toast--docs", code: "p-toast", plectrum: null },
  { figma: "carousel", nodeId: "501:30399", purpose: "Data", storybook: null, code: "p-carousel", plectrum: null },
  { figma: "galleria", nodeId: "6641:26340", purpose: "Data", storybook: null, code: "p-galleria", plectrum: null },
  { figma: "image", nodeId: "503:31819", purpose: "Data", storybook: null, code: "p-image", plectrum: null },
  { figma: "imagecompare", nodeId: "6977:102044", purpose: "Data", storybook: null, code: "p-imagecompare", plectrum: null },
  { figma: "avatargroup", nodeId: "7168:70283", purpose: "Data", storybook: null, code: "p-avatargroup", plectrum: null },
  { figma: "avatar", nodeId: "327:13384", purpose: "Data", storybook: "/docs/custom-components-plectrumavatar--docs", code: "p-avatar", plectrum: "pds-plectrum-avatar" },
  { figma: "badge", nodeId: "330:13237", purpose: "Feedback", storybook: "/docs/primeng-content-and-navigation--docs#badge", code: "p-badge", plectrum: null },
  { figma: "overlaybadge", nodeId: "6998:92179", purpose: "Feedback", storybook: null, code: "p-overlaybadge", plectrum: null },
  { figma: "blockui", nodeId: "334:12695", purpose: "Overlays", storybook: null, code: "p-blockui", plectrum: null },
  { figma: "chip", nodeId: "334:13139", purpose: "Feedback", storybook: null, code: "p-chip", plectrum: null },
  { figma: "inplace", nodeId: "340:12980", purpose: "Data", storybook: null, code: "p-inplace", plectrum: null },
  { figma: "metergroup", nodeId: "6962:59067", purpose: "Data", storybook: null, code: "p-metergroup", plectrum: null },
  { figma: "skeleton", nodeId: "373:13726", purpose: "Feedback", storybook: "/docs/custom-components-skeleton-slot--docs", code: "p-skeleton", plectrum: "pds-skeleton-slot" },
  { figma: "progressbar", nodeId: "349:12860", purpose: "Feedback", storybook: null, code: "p-progressbar", plectrum: null },
  { figma: "progressspinner", nodeId: "367:12862", purpose: "Feedback", storybook: null, code: "p-progressspinner", plectrum: null },
  { figma: "tag", nodeId: "373:13337", purpose: "Feedback", storybook: "/docs/primeng-content-and-navigation--docs#tag", code: "p-tag", plectrum: null },
  { figma: "scrolltop", nodeId: "373:13099", purpose: "Navigation", storybook: "/docs/primeng-content-and-navigation--docs#scrolltop", code: "p-scrolltop", plectrum: null },
  { figma: "terminal", nodeId: "373:13715", purpose: "Data", storybook: null, code: "p-terminal", plectrum: null },

];

/** Documented controls, keyed for existing gallery imports. */
export const PLECTRUM_FIGMA = Object.fromEntries(
  PRIMENG_KIT.filter((component) => component.storybook).map((component) => [
    component.figma,
    plectrumFigma(component.nodeId),
  ]),
) as Record<string, string>;
