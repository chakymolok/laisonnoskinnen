export interface Format {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  price: string;
  priceNote: string;
  featured?: boolean;
}

export const formats: Format[] = [
  {
    id: 'basic',
    num: '01',
    title: 'BASIC',
    subtitle: 'Back to back',
    description:
      'Для частных вечеринок и небольших корпоративов. Базовое DJ-оборудование, работаем вдвоём в формате b2b: один после другого, треком в трек.',
    features: [
      '2 DJ в формате back-to-back',
      'базовое DJ-оборудование (винил/цифра)',
      'open-format подбор под зал',
      'до 6 часов сета',
    ],
    price: '80 000 ₽',
    priceNote: 'бюджет на 6-часовое мероприятие',
  },
  {
    id: 'pro',
    num: '02',
    title: 'PRO',
    subtitle: 'Two sets, one night',
    description:
      'Расширенный сетап. Каждый отыгрывает свой час: Лайсо тянет в фактуру, Noskinnen двигает зал. Чередуемся, работаем под ведущего, под программу.',
    features: [
      '2 DJ в формате 1 set / 1 set',
      'расширенное DJ-оборудование',
      'микрофон для ведущего',
      'индивидуальный подбор под программу',
      'до 6 часов сета',
    ],
    price: '160 000 ₽',
    priceNote: 'бюджет на 6-часовое мероприятие',
    featured: true,
  },
  {
    id: 'premium',
    num: '03',
    title: 'PREMIUM',
    subtitle: 'Full experience',
    description:
      'Полное сопровождение мероприятия высшего уровня. Своё DJ + свой звук + свет + микрофоны. Команда, мы делаем всё сами под ключ.',
    features: [
      'команда, мы закрываем всё',
      'DJ-оборудование (винил + CDJ-2000)',
      'звуковая система под зал',
      'микрофоны и стойки',
      'индивидуальный сценарий вечера',
      'помощь в организации',
    ],
    price: 'от 120 000 ₽',
    priceNote: 'начальный бюджет от 2 часов',
  },
];
