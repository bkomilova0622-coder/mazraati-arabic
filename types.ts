
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

export interface Team {
  id: number;
  name: string;
  color: string;     // Main color (bg-red-500)
  lightColor: string; // Light bg (bg-red-50)
  textColor: string; // Text color (text-red-600)
  borderColor: string; // Border color
  score: number;
  icon: string;
}
