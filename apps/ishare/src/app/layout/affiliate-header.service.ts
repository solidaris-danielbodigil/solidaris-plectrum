import { Injectable, signal } from '@angular/core';
import type { MenuItem } from 'primeng/api';
import type {
  ProfileCardVariant,
  ProfileCardIdentifier,
  ProfileCardInfoTag,
  ProfileCardPrimaryAction,
  ProfileCardStatusAction,
  PlectrumAvatarGender,
  PlectrumAvatarVariant,
} from '@solidaris/ui';

export interface AffiliateHeaderData {
  title: string;
  variant: ProfileCardVariant;
  avatarGender: PlectrumAvatarGender;
  avatarVariant: PlectrumAvatarVariant;
  avatarInitials: string;
  statusAction: ProfileCardStatusAction | null;
  infoTags: ProfileCardInfoTag[];
  identifiers: ProfileCardIdentifier[];
  primaryAction: ProfileCardPrimaryAction | null;
  onInfoTagClick?: (tag: ProfileCardInfoTag) => void;
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
