import { Animal, AnimalGroup, CategoryInfo } from './types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: AnimalGroup.BARN,
    title: 'The Big Barn',
    arabicTitle: 'الحظيرة الكبيرة',
    icon: '🏠',
    color: 'from-orange-400 to-red-500'
  },
  {
    id: AnimalGroup.POULTRY,
    title: 'Birds & Ducks',
    arabicTitle: 'الطيور والدواجن',
    icon: '🦆',
    color: 'from-sky-400 to-blue-500'
  },
  {
    id: AnimalGroup.PETS,
    title: 'Small Friends',
    arabicTitle: 'الأصدقاء الصغار',
    icon: '🐇',
    color: 'from-green-400 to-emerald-600'
  }
];

export const ANIMALS: Animal[] = [
  // BARN
  {
    id: 'cow',
    englishName: 'Cow',
    arabicName: 'بَقَرَة',
    transliteration: 'Baqara',
    emoji: '🐄',
    group: AnimalGroup.BARN,
    color: 'bg-orange-100'
  },
  {
    id: 'sheep',
    englishName: 'Sheep',
    arabicName: 'خَرُوف',
    transliteration: 'Kharoof',
    emoji: '🐑',
    group: AnimalGroup.BARN,
    color: 'bg-orange-50'
  },
  {
    id: 'horse',
    englishName: 'Horse',
    arabicName: 'حِصَان',
    transliteration: 'Hissan',
    emoji: '🐎',
    group: AnimalGroup.BARN,
    color: 'bg-amber-100'
  },
  {
    id: 'donkey',
    englishName: 'Donkey',
    arabicName: 'حِمَار',
    transliteration: 'Himar',
    emoji: '🫏',
    group: AnimalGroup.BARN,
    color: 'bg-stone-200'
  },
  {
    id: 'goat',
    englishName: 'Goat',
    arabicName: 'مَاعِز',
    transliteration: "Ma'ez",
    emoji: '🐐',
    group: AnimalGroup.BARN,
    color: 'bg-orange-50'
  },

  // POULTRY
  {
    id: 'chicken',
    englishName: 'Chicken',
    arabicName: 'دَجَاجَة',
    transliteration: 'Dajaja',
    emoji: '🐔',
    group: AnimalGroup.POULTRY,
    color: 'bg-yellow-100'
  },
  {
    id: 'rooster',
    englishName: 'Rooster',
    arabicName: 'دِيك',
    transliteration: 'Deek',
    emoji: '🐓',
    group: AnimalGroup.POULTRY,
    color: 'bg-red-100'
  },
  {
    id: 'duck',
    englishName: 'Duck',
    arabicName: 'بَطَّة',
    transliteration: 'Batta',
    emoji: '🦆',
    group: AnimalGroup.POULTRY,
    color: 'bg-sky-100'
  },
  {
    id: 'turkey',
    englishName: 'Turkey',
    arabicName: 'دِيك رُومِي',
    transliteration: 'Deek Rumi',
    emoji: '🦃',
    group: AnimalGroup.POULTRY,
    color: 'bg-amber-50'
  },

  // PETS / OTHERS
  {
    id: 'cat',
    englishName: 'Cat',
    arabicName: 'قِطَّة',
    transliteration: 'Qitta',
    emoji: '🐱',
    group: AnimalGroup.PETS,
    color: 'bg-orange-50'
  },
  {
    id: 'dog',
    englishName: 'Dog',
    arabicName: 'كَلْب',
    transliteration: 'Kalb',
    emoji: '🐶',
    group: AnimalGroup.PETS,
    color: 'bg-stone-100'
  },
  {
    id: 'rabbit',
    englishName: 'Rabbit',
    arabicName: 'أَرْنَب',
    transliteration: 'Arnab',
    emoji: '🐰',
    group: AnimalGroup.PETS,
    color: 'bg-pink-50'
  },
  {
    id: 'bee',
    englishName: 'Bee',
    arabicName: 'نَحْلَة',
    transliteration: 'Nahla',
    emoji: '🐝',
    group: AnimalGroup.PETS,
    color: 'bg-yellow-200'
  }
];
