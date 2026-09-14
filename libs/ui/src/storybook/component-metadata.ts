import type { ComponentMetadata } from '@solidaris/contracts';
import { AccordionMetadata } from '../lib/accordion/accordion.metadata';
import { CopyableTextMetadata } from '../lib/copyable-text/copyable-text.metadata';
import { DelayPredictionCardMetadata } from '../lib/delay-prediction-card/delay-prediction-card.metadata';
import { DetailListMetadata } from '../lib/detail-list/detail-list.metadata';
import { DrawerMetadata } from '../lib/drawer/drawer.metadata';
import { EmptyStateMetadata } from '../lib/empty-state/empty-state.metadata';
import { FormFieldMetadata } from '../lib/form-field/form-field.metadata';
import { IconMetadata } from '../lib/icon/icon.metadata';
import { InputClearMetadata } from '../lib/input-clear/input-clear.metadata';
import { ListMetadata } from '../lib/list/list.metadata';
import { NavShellMetadata } from '../lib/nav-shell/nav-shell.metadata';
import { PlectrumAvatarMetadata } from '../lib/plectrum-avatar/plectrum-avatar.metadata';
import { ProfileCardMetadata } from '../lib/profile-card/profile-card.metadata';
import { ProfileDrawerMetadata } from '../lib/profile-drawer/profile-drawer.metadata';
import { SkeletonSlotMetadata } from '../lib/skeleton-slot/skeleton-slot.metadata';
import { SubNavShellMetadata } from '../lib/sub-nav-shell/sub-nav-shell.metadata';
import { TimelineMetadata } from '../lib/timeline/timeline.metadata';
import { ToolbarMetadata } from '../lib/toolbar/toolbar.metadata';
import { TopNavMetadata } from '../lib/top-nav/top-nav.metadata';
import { TransactionsCicsModalMetadata } from '../lib/transactions-cics-modal/transactions-cics-modal.metadata';

/** Proving glob for Exception B — asserted against this barrel in contracts:check. */
export const COMPONENT_METADATA_GLOB = 'libs/ui/src/lib/**/*.metadata.ts';

export const ALL_COMPONENT_METADATA: readonly ComponentMetadata[] = [
  AccordionMetadata,
  CopyableTextMetadata,
  DelayPredictionCardMetadata,
  DetailListMetadata,
  DrawerMetadata,
  EmptyStateMetadata,
  FormFieldMetadata,
  IconMetadata,
  InputClearMetadata,
  ListMetadata,
  NavShellMetadata,
  PlectrumAvatarMetadata,
  ProfileCardMetadata,
  ProfileDrawerMetadata,
  SkeletonSlotMetadata,
  SubNavShellMetadata,
  TimelineMetadata,
  ToolbarMetadata,
  TopNavMetadata,
  TransactionsCicsModalMetadata,
];
