import { Injectable, signal } from '@angular/core';
import type {
  AffiliateOverviewCardVariant,
  AffiliateOverviewIdentifier,
  AffiliateOverviewInfoTag,
  AffiliateOverviewPrimaryAction,
  AffiliateOverviewStatusAction,
  PlectrumAvatarGender,
  PlectrumAvatarVariant,
} from '@solidaris/ui';

export interface AffiliateHeaderData {
  title: string;
  variant: AffiliateOverviewCardVariant;
  avatarGender: PlectrumAvatarGender;
  avatarVariant: PlectrumAvatarVariant;
  avatarInitials: string;
  statusAction: AffiliateOverviewStatusAction | null;
  infoTags: AffiliateOverviewInfoTag[];
  identifiers: AffiliateOverviewIdentifier[];
  primaryAction: AffiliateOverviewPrimaryAction | null;
  onInfoTagClick?: (tag: AffiliateOverviewInfoTag) => void;
  onPrimaryActionClick?: () => void;
  onStatusActionClick?: () => void;
}

@Injectable({ providedIn: 'root' })
export class AffiliateHeaderService {
  readonly header = signal<AffiliateHeaderData | null>(null);

  setHeader(data: AffiliateHeaderData): void {
    this.header.set(data);
  }

  clearHeader(): void {
    this.header.set(null);
  }
}
