export interface Track {
  id: string;
  num: string;
  title: string;
  artist: string;
  tags: string;
  duration: string;
  format: 'vinyl' | 'cdj' | 'b2b';
  audioUrl: string;
  externalUrl: string;
}

export const tracks: Track[] = [
  {
    id: 'nftd-06',
    num: '06',
    title: 'Not for the Dancefloor #06',
    artist: 'Laiso Buck',
    tags: 'uk bass · leftfield · vinyl only',
    duration: '36:49',
    format: 'vinyl',
    audioUrl: '/audio/nftd-06.mp3',
    externalUrl: 'https://promodj.com/laisobuck',
  },
  {
    id: 'nftd-05',
    num: '05',
    title: 'Not for the Dancefloor #05',
    artist: 'Laiso Buck',
    tags: 'afro & uk bass selection',
    duration: '57:54',
    format: 'vinyl',
    audioUrl: '/audio/nftd-05.mp3',
    externalUrl: 'https://promodj.com/theband/mixes/7887520',
  },
  {
    id: 'nftd-04',
    num: '04',
    title: 'Not for the Dancefloor #04',
    artist: 'Laiso Buck',
    tags: 'liquid & deep dnb',
    duration: '40:27',
    format: 'vinyl',
    audioUrl: '/audio/nftd-04.mp3',
    externalUrl: 'https://promodj.com/theband/mixes/7875078',
  },
  {
    id: 'nftd-03',
    num: '03',
    title: 'Not for the Dancefloor #03',
    artist: 'Laiso Buck',
    tags: 'atmospheric dnb · vinyl only',
    duration: '44:00',
    format: 'vinyl',
    audioUrl: '/audio/nftd-03.mp3',
    externalUrl: 'https://promodj.com/theband/mixes/7868702',
  },
  {
    id: 'nftd-02',
    num: '02',
    title: 'Not for the Dancefloor #02',
    artist: 'Laiso Buck',
    tags: 'deep liquid · vinyl only',
    duration: '45:20',
    format: 'vinyl',
    audioUrl: '/audio/nftd-02.mp3',
    externalUrl: 'https://promodj.com/theband/mixes/7859381',
  },
  {
    id: 'nftd-01',
    num: '01',
    title: 'Not for the Dancefloor #01',
    artist: 'Laiso Buck',
    tags: 'deep liquid · vinyl selection',
    duration: '41:27',
    format: 'vinyl',
    audioUrl: '/audio/nftd-01.mp3',
    externalUrl: 'https://promodj.com/theband/mixes/7855911',
  },
  {
    id: 'noskinnen-promo',
    num: '07',
    title: 'Promo Set',
    artist: 'DJ Andreas Noskinnen',
    tags: 'open format · disco · funk · house',
    duration: '60:00',
    format: 'cdj',
    audioUrl: '/audio/noskinnen-promo.mp3',
    externalUrl: 'https://noskinnen.art',
  },
  {
    id: 'b2b-live',
    num: '08',
    title: 'Laiso × Noskinnen B2B',
    artist: 'Laiso & Noskinnen',
    tags: 'live recording · b2b · open format',
    duration: '90:00',
    format: 'b2b',
    audioUrl: '',
    externalUrl: '',
  },
];
