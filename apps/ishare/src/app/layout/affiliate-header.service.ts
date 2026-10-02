import { Injectable, signal } from '@angular/core';
import type { MenuItem } from 'primeng/api';
import type {
  ProfileHeaderVariant,
  ProfileHeaderIdentifier,
  ProfileHeaderInfoTag,
  ProfileHeaderPrimaryAction,
  ProfileHeaderStatusAction,
  PlectrumAvatarGender,
  PlectrumAvatarVariant,
} from '@solidaris-danielbodigil/pds-ui';

export interface AffiliateHeaderData {
  title: string;
  variant: ProfileHeaderVariant;
  avatarGender: PlectrumAvatarGender;
  avatarVariant: PlectrumAvatarVariant;
  avatarInitials: string;
  statusAction: ProfileHeaderStatusAction | null;
  infoTags: ProfileHeaderInfoTag[];
  identifiers: ProfileHeaderIdentifier[];
  primaryAction: ProfileHeaderPrimaryAction | null;
  onInfoTagClick?: (tag: ProfileHeaderInfoTag) => void;
  onPrimaryActionClick?: () => void;
  onStatusActionClick?: () => void;
  onStatusMenuSelect?: (item: MenuItem) => void;
}

@Injectable({ providedIn: 'root' })
export class AffiliateHeaderService {
  readonly header = signal<AffiliateHeaderData | null>(null);
  readonly headerLoading = signal(false);

  setHeaderLoading(loading: boolean): void {
    this.headerLoading.set(loading);
  }

  setHeader(data: AffiliateHeaderData): void {
    this.header.set(data);
  }

  clearHeader(): void {
    this.header.set(null);
    this.headerLoading.set(false);
  }
}
