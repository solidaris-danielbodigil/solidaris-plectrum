/** Eva Martinez — titulaire dossier NISS (DOB 14/08/1989). */
export const EVA_MARTINEZ_NISS = '63092814612';

/** Quinten Mota — partenaire (DOB 15/03/1987). */
export const QUINTEN_MOTA_NISS = '87031512345';

/** Shiloh Mota — enfant à charge (DOB 20/05/2012). */
export const SHILOH_MOTA_NISS = '12052023456';

/** Jack Mota — enfant à charge (DOB 14/08/2015). */
export const JACK_MOTA_NISS = '15081406789';

/** Route ids for all mock family dossiers (non-Eva members have empty document lists). */
export const FAMILY_MEMBER_NISS = [
  EVA_MARTINEZ_NISS,
  QUINTEN_MOTA_NISS,
  SHILOH_MOTA_NISS,
  JACK_MOTA_NISS,
] as const;

export type FamilyMemberNiss = (typeof FAMILY_MEMBER_NISS)[number];

export function isEvaMartinezAffiliate(affiliateId: string): boolean {
  return affiliateId === EVA_MARTINEZ_NISS || !isKnownFamilyMember(affiliateId);
}

export function isKnownFamilyMember(affiliateId: string): boolean {
  return (FAMILY_MEMBER_NISS as readonly string[]).includes(affiliateId);
}
