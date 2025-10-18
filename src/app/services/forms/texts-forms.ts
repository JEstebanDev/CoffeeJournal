import { InfoLevel, RoastLevel } from './slide.interface';

export const beanTypes = ['Arabica', 'Robusta', 'Liberica'];

export const roastLevels: RoastLevel[] = [
  { value: 'light', label: 'roastLevelLight', color: '#D4A574' },
  { value: 'medium', label: 'roastLevelMedium', color: '#8B6F47' },
  { value: 'dark', label: 'roastLevelDark', color: '#3E2723' },
];

export const brewMethodsOptions = [
  { name: 'brewMethodV60', image: '/assets/brew_method/pourover.png' },
  { name: 'brewMethodEspresso', image: '/assets/brew_method/espresso.png' },
  { name: 'brewMethodFrenchPress', image: '/assets/brew_method/french_press.png' },
  { name: 'brewMethodChemex', image: '/assets/brew_method/chemex.png' },
  { name: 'brewMethodAeropress', image: '/assets/brew_method/aeropress.png' },
  { name: 'brewMethodMoka', image: '/assets/brew_method/moka_pot.png' },
  { name: 'brewMethodColdBrew', image: '/assets/brew_method/cold_brew.png' },
];

export const bodyLevels: InfoLevel[] = [
  {
    value: 1,
    label: 'bodyLevelSoft',
    icon: '💧',
    description: 'bodyLevelSoftDescription',
    color: '#bfada6',
  },
  {
    value: 2,
    label: 'bodyLevelLight',
    icon: '☁️',
    description: 'bodyLevelLightDescription',
    color: '#a1887f',
  },
  { value: 3, label: 'bodyLevelMedium', icon: '🪶', description: 'bodyLevelMediumDescription', color: '#8d6e63' },
  { value: 4, label: 'bodyLevelFull', icon: '🍫', description: 'bodyLevelFullDescription', color: '#6d4c41' },
  { value: 5, label: 'bodyLevelDense', icon: '🧈', description: 'bodyLevelDenseDescription', color: '#4e342e' },
];

export const acidityLevels: InfoLevel[] = [
  { value: 1, label: 'acidityLevelNone', icon: '⚪', description: 'acidityLevelNoneDescription', color: '#d4c9c4' },
  { value: 2, label: 'acidityLevelLow', icon: '🍊', description: 'acidityLevelLowDescription', color: '#ffcc80' },
  {
    value: 3,
    label: 'acidityLevelMedium',
    icon: '🍋',
    description: 'acidityLevelMediumDescription',
    color: '#ffb84d',
  },
  { value: 4, label: 'acidityLevelHigh', icon: '🍏', description: 'acidityLevelHighDescription', color: '#ffad33' },
  {
    value: 5,
    label: 'acidityLevelIntense',
    icon: '🌈',
    description: 'acidityLevelIntenseDescription',
    color: '#ffa726',
  },
];

export const afterTasteLevels: InfoLevel[] = [
  { value: 1, label: 'aftertasteLevelShort', icon: '🌬️', description: 'aftertasteLevelShortDescription', color: '#e1bee7' },
  { value: 2, label: 'aftertasteLevelSoft', icon: '☁️', description: 'aftertasteLevelSoftDescription', color: '#ce93d8' },
  {
    value: 3,
    label: 'aftertasteLevelMedium',
    icon: '🌤️',
    description: 'aftertasteLevelMediumDescription',
    color: '#ba68c8',
  },
  { value: 4, label: 'aftertasteLevelLong', icon: '🌇', description: 'aftertasteLevelLongDescription', color: '#ab47bc' },
  {
    value: 5,
    label: 'aftertasteLevelComplex',
    icon: '🌌',
    description: 'aftertasteLevelComplexDescription',
    color: '#8e24aa',
  },
];
