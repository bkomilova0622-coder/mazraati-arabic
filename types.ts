export enum AnimalGroup {
  BARN = 'BARN',
  POULTRY = 'POULTRY',
  PETS = 'PETS'
}

export interface Animal {
  id: string;
  englishName: string;
  arabicName: string;
  transliteration: string;
  emoji: string;
  group: AnimalGroup;
  color: string; // Tailwind color class for background accent
}

export interface CategoryInfo {
  id: AnimalGroup;
  title: string;
  arabicTitle: string;
  icon: string;
  color: string; // Tailwind gradient classes
}

export enum ViewState {
  HOME = 'HOME',
  LEARN = 'LEARN',
  QUIZ = 'QUIZ'
}
