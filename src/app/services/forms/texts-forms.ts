import { InfoLevel, RoastLevel } from './slide.interface';

export const beanTypes = ['Arabica', 'Robusta', 'Liberica'];

export const roastLevels: RoastLevel[] = [
  { value: 'light', label: 'Claro', color: '#D4A574' },
  { value: 'medium', label: 'Medio', color: '#8B6F47' },
  { value: 'dark', label: 'Oscuro', color: '#3E2723' },
];

export const brewMethodsOptions = [
  { name: 'V60', image: '/assets/brew_method/pourover.png' },
  { name: 'Espresso', image: '/assets/brew_method/espresso.png' },
  { name: 'Prensa Francesa', image: '/assets/brew_method/french_press.png' },
  { name: 'Chemex', image: '/assets/brew_method/chemex.png' },
  { name: 'Aeropress', image: '/assets/brew_method/aeropress.png' },
  { name: 'Moka', image: '/assets/brew_method/moka_pot.png' },
  { name: 'Cold Brew', image: '/assets/brew_method/cold_brew.png' },
];

export const bodyLevels: InfoLevel[] = [
  {
    value: 1,
    label: 'Suave',
    icon: '💧',
    description: 'Acuoso o muy suave',
    color: '#bfada6',
  },
  {
    value: 2,
    label: 'Liviano',
    icon: '☁️',
    description: 'Suave pero con presencia',
    color: '#a1887f',
  },
  { value: 3, label: 'Medio', icon: '🪶', description: 'Textura balanceada', color: '#8d6e63' },
  { value: 4, label: 'Pleno', icon: '🍫', description: 'Cremoso y redondo', color: '#6d4c41' },
  { value: 5, label: 'Denso', icon: '🧈', description: 'Pesado, aceitoso', color: '#4e342e' },
];

export const acidityLevels: InfoLevel[] = [
  { value: 1, label: 'Nula', icon: '⚪', description: 'Plana, sin chispa', color: '#d4c9c4' },
  { value: 2, label: 'Baja', icon: '🍊', description: 'Suave, equilibrada', color: '#ffcc80' },
  {
    value: 3,
    label: 'Media',
    icon: '🍋',
    description: 'Brillante pero armónica',
    color: '#ffb84d',
  },
  { value: 4, label: 'Alta', icon: '🍏', description: 'Viva y punzante', color: '#ffad33' },
  {
    value: 5,
    label: 'Intensa',
    icon: '🌈',
    description: 'Dominante, vibrante',
    color: '#ffa726',
  },
];

export const afterTasteLevels: InfoLevel[] = [
  { value: 1, label: 'Corto', icon: '🌬️', description: 'Desaparece rápido', color: '#e1bee7' },
  { value: 2, label: 'Suave', icon: '☁️', description: 'Persistencia leve', color: '#ce93d8' },
  {
    value: 3,
    label: 'Medio',
    icon: '🌤️',
    description: 'Buen final, sin amargor',
    color: '#ba68c8',
  },
  { value: 4, label: 'Largo', icon: '🌇', description: 'Permanece agradable', color: '#ab47bc' },
  {
    value: 5,
    label: 'Complejo',
    icon: '🌌',
    description: 'Evoluciona con el tiempo',
    color: '#8e24aa',
  },
];
