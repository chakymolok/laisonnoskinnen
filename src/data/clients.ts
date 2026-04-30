export interface Client {
  name: string;
  url: string;
}

export const clients: Client[] = [
  { name: 'Canteen', url: 'https://canteen.moscow/' },
  { name: 'Депо', url: 'https://depotrivokzala.ru/' },
  { name: 'Underdog', url: 'https://underdog-moscow.ru/' },
  { name: 'Васильчуки', url: 'https://chaihona.ru/' },
  { name: 'Soho Rooms', url: 'https://sohorooms.com/' },
];

export const genres: string[] = [
  'DEEP LIQUID DNB',
  'UK BASS',
  'BREAKS',
  'LEFTFIELD',
  'MODERN JUNGLE',
  'UK GARAGE',
  'DISCO',
  'FUNK',
  'SOUL',
  'R&B',
  'HIP-HOP',
  'TECHNO',
  'MINIMAL',
  'AFROBEAT',
  'LATINO',
  'INDIE',
  'DANCE ROCK',
  '80s',
  '90s',
  'HOUSE',
  'DEEP HOUSE',
  'ATMOSPHERIC',
  'AMBIENT BREAKS',
  'OPEN FORMAT',
];
