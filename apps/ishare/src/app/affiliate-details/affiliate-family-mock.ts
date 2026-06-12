import type {
  AffiliateDetailDrawerFamilyMember,
  PlectrumAvatarGender,
  PlectrumAvatarVariant,
} from '@solidaris/ui';

import {

  EVA_MARTINEZ_NISS,

  JACK_MOTA_NISS,

  QUINTEN_MOTA_NISS,

  SHILOH_MOTA_NISS,

} from './affiliate-mock.constants';



export interface AffiliateFamilyProfile {

  niss: string;

  name: string;

  avatarInitials: string;

  avatarGender: PlectrumAvatarGender;

  avatarVariant: PlectrumAvatarVariant;

  nsi: string;

  contractNumber: string;

  generalInfo: { label: string; value: string }[];

  contactInfo: { label: string; value: string }[];

}



const SHARED_ADDRESS = 'Solidariteitsstraat 5, 2500 Lier';



const FAMILY_MEMBERS: readonly AffiliateDetailDrawerFamilyMember[] = [

  {

    id: EVA_MARTINEZ_NISS,

    initials: 'E',

    name: 'Eva Martinez',

    relationship: 'titulaire',

    color: 'blue',

  },

  {

    id: QUINTEN_MOTA_NISS,

    initials: 'Q',

    name: 'Quinten Mota',

    relationship: 'partenaire',

    color: 'blue',

  },

  {

    id: SHILOH_MOTA_NISS,

    initials: 'S',

    name: 'Shiloh Mota',

    relationship: 'enfant à charge',

    color: 'green',

  },

  {

    id: JACK_MOTA_NISS,

    initials: 'J',

    name: 'Jack Mota',

    relationship: 'enfant à charge',

    color: 'yellow',

  },

];



/** Relationship labels per dossier (key = viewer NISS, value = member NISS → label). */

const RELATIONSHIP_BY_DOSSIER: Record<string, Record<string, string>> = {

  [EVA_MARTINEZ_NISS]: {

    [QUINTEN_MOTA_NISS]: 'partenaire',

    [SHILOH_MOTA_NISS]: 'enfant à charge',

    [JACK_MOTA_NISS]: 'enfant à charge',

  },

  [QUINTEN_MOTA_NISS]: {

    [EVA_MARTINEZ_NISS]: 'conjointe',

    [SHILOH_MOTA_NISS]: 'enfant à charge',

    [JACK_MOTA_NISS]: 'enfant à charge',

  },

  [SHILOH_MOTA_NISS]: {

    [EVA_MARTINEZ_NISS]: 'mère',

    [QUINTEN_MOTA_NISS]: 'père',

    [JACK_MOTA_NISS]: 'frère',

  },

  [JACK_MOTA_NISS]: {

    [EVA_MARTINEZ_NISS]: 'mère',

    [QUINTEN_MOTA_NISS]: 'père',

    [SHILOH_MOTA_NISS]: 'sœur',

  },

};



export const AFFILIATE_FAMILY_PROFILES: Record<string, AffiliateFamilyProfile> = {

  [EVA_MARTINEZ_NISS]: {

    niss: EVA_MARTINEZ_NISS,

    name: 'Eva Martinez',

    avatarInitials: 'EM',

    avatarGender: 'female',

    avatarVariant: 1,

    nsi: '00004212182',

    contractNumber: '1241786-19630928-2',

    generalInfo: [

      { label: 'NSI', value: '00004212182' },

      { label: 'Date de naissance', value: '14/08/1989 (36 ans)' },

      { label: 'Nationalité', value: 'Espagnol (ES)' },

      { label: 'Langue de contact', value: 'Espagnol (ES)' },

    ],

    contactInfo: [

      { label: 'Adresse officielle', value: SHARED_ADDRESS },

      { label: 'E-mail', value: 'lies.verhoeven@gmail.com' },

      { label: 'Numéro de téléphone', value: '+32 89 123 004' },

      { label: 'Numéro de portable', value: '+32 472 987 567' },

    ],

  },

  [QUINTEN_MOTA_NISS]: {

    niss: QUINTEN_MOTA_NISS,

    name: 'Quinten Mota',

    avatarInitials: 'QM',

    avatarGender: 'male',

    avatarVariant: 1,

    nsi: '00004321234',

    contractNumber: '—',

    generalInfo: [

      { label: 'NSI', value: '00004321234' },

      { label: 'Date de naissance', value: '15/03/1987 (39 ans)' },

      { label: 'Nationalité', value: 'Belge (BE)' },

      { label: 'Langue de contact', value: 'Néerlandais (NL)' },

    ],

    contactInfo: [

      { label: 'Adresse officielle', value: SHARED_ADDRESS },

      { label: 'E-mail', value: 'quinten.mota@example.com' },

      { label: 'Numéro de téléphone', value: '+32 89 123 005' },

      { label: 'Numéro de portable', value: '+32 472 987 568' },

    ],

  },

  [SHILOH_MOTA_NISS]: {

    niss: SHILOH_MOTA_NISS,

    name: 'Shiloh Mota',

    avatarInitials: 'SM',

    avatarGender: 'female',

    avatarVariant: 3,

    nsi: '00005234567',

    contractNumber: '—',

    generalInfo: [

      { label: 'NSI', value: '00005234567' },

      { label: 'Date de naissance', value: '20/05/2012 (14 ans)' },

      { label: 'Nationalité', value: 'Belge (BE)' },

      { label: 'Langue de contact', value: 'Néerlandais (NL)' },

    ],

    contactInfo: [

      { label: 'Adresse officielle', value: SHARED_ADDRESS },

      { label: 'E-mail', value: '—' },

      { label: 'Numéro de téléphone', value: '—' },

      { label: 'Numéro de portable', value: '—' },

    ],

  },

  [JACK_MOTA_NISS]: {

    niss: JACK_MOTA_NISS,

    name: 'Jack Mota',

    avatarInitials: 'JM',

    avatarGender: 'male',

    avatarVariant: 2,

    nsi: '00005123456',

    contractNumber: '—',

    generalInfo: [

      { label: 'NSI', value: '00005123456' },

      { label: 'Date de naissance', value: '14/08/2015 (10 ans)' },

      { label: 'Nationalité', value: 'Belge (BE)' },

      { label: 'Langue de contact', value: 'Néerlandais (NL)' },

    ],

    contactInfo: [

      { label: 'Adresse officielle', value: SHARED_ADDRESS },

      { label: 'E-mail', value: '—' },

      { label: 'Numéro de téléphone', value: '—' },

      { label: 'Numéro de portable', value: '—' },

    ],

  },

};



export function resolveAffiliateProfile(

  routeId: string,

): AffiliateFamilyProfile {

  return (

    AFFILIATE_FAMILY_PROFILES[routeId] ??

    AFFILIATE_FAMILY_PROFILES[EVA_MARTINEZ_NISS]

  );

}



export function familyMembersForDossier(

  viewerNiss: string,

): AffiliateDetailDrawerFamilyMember[] {

  const relationships = RELATIONSHIP_BY_DOSSIER[viewerNiss] ?? {};



  return FAMILY_MEMBERS.filter((member) => member.id !== viewerNiss).map(

    (member) => ({

      ...member,

      relationship: relationships[member.id!] ?? member.relationship,

    }),

  );

}



export function resolveFamilyMemberNiss(

  member: AffiliateDetailDrawerFamilyMember,

): string | null {

  if (member.id) {

    return member.id;

  }



  return (

    FAMILY_MEMBERS.find((entry) => entry.name === member.name)?.id ?? null

  );

}


