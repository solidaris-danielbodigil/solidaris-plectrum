export type DocumentQueueType = 'INDPMTDC' | 'INDPMTAT';

export interface DocumentQueueRow {
  id: number;
  oa: number;
  ter: number;
  source: string;
  identification: string;
  nom: string;
  type: DocumentQueueType;
  dateReception: string;
  dateEntree: string;
  dateEtat: string;
  etat:
    | 'recu'
    | 'attribue'
    | 'en-traitement'
    | 'incomplet'
    | 'rappel'
    | 'cloture';
  mine: boolean;
  urgent: boolean;
}

type QueueStatus = DocumentQueueRow['etat'];

const TYPES: DocumentQueueType[] = ['INDPMTDC', 'INDPMTAT'];

const SOURCES = ['ATDCCTX', 'SCAN', 'MAIL'] as const;

const STATUSES: QueueStatus[] = [
  'recu',
  'attribue',
  'en-traitement',
  'incomplet',
  'rappel',
  'cloture',
];

const NAMES = [
  'Alice,Johnson',
  'Eva,Martinez',
  'David,Garcia',
  'Henry,Taylor',
  'Grace,Anderson',
  'Isabella,Thomas',
  'Catherine,Davis',
  'Frank,Wilson',
  'Brian,Smith',
  'Olivia,Brown',
  'James,Miller',
  'Sophia,Moore',
  'Liam,Jackson',
  'Mia,White',
  'Noah,Harris',
  'Emma,Martin',
  'Lucas,Thompson',
  'Chloe,Garcia',
  'Mason,Clark',
  'Ella,Lewis',
];

const OFFICES = [
  { oa: 319, ter: 315 },
  { oa: 412, ter: 310 },
  { oa: 507, ter: 320 },
  { oa: 218, ter: 301 },
];

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function stamp(day: number, hour: number, minute: number): string {
  return `2025-${pad(6 + Math.floor((day - 1) / 28))}-${pad(((day - 1) % 28) + 1)} ${pad(hour)}:${pad(minute)}:00`;
}

function buildRow(index: number): DocumentQueueRow {
  const office = OFFICES[index % OFFICES.length];
  return {
    id: index + 1,
    oa: office.oa,
    ter: office.ter,
    source: SOURCES[index % SOURCES.length],
    identification: `4673343-198307${pad(24 + (index % 70))}-${index + 2}`,
    nom: NAMES[index % NAMES.length],
    type: TYPES[index % TYPES.length],
    dateReception: stamp(index + 1, 9 + (index % 8), (index * 7) % 60),
    dateEntree: stamp(index + 1, 10 + (index % 7), (index * 11) % 60),
    dateEtat: '2026-02-16 13:36:59',
    etat: STATUSES[index % STATUSES.length],
    mine: index % 3 === 0,
    urgent: index % 4 === 0,
  };
}

export const DOCUMENT_QUEUE_ROWS: DocumentQueueRow[] = Array.from(
  { length: 40 },
  (_, index) => buildRow(index),
);
