import type { BudgetOption, CravingKey, CravingOption, DistanceOption, RatingOption } from '@/types';

export const BUDGET_TIERS: BudgetOption[] = [
  {
    tier: 'hemat',
    label: 'Hemat',
    range: '15k - 30k',
    caption: 'Kenyang merakyat',
    symbol: '$',
    emoji: '🪙',
    moodLabel: 'Hemat Ceria',
    minPrice: 0,
    maxPrice: 30000,
  },
  {
    tier: 'pas',
    label: 'Pas Kantong',
    range: '30k - 75k',
    caption: 'Casual & mantap',
    symbol: '$$',
    emoji: '😋',
    moodLabel: 'Pas Enaknya',
    minPrice: 30000,
    maxPrice: 75000,
    favorite: true,
  },
  {
    tier: 'nraktir',
    label: 'Nraktir',
    range: '75k - 150k',
    caption: 'Treat yourself',
    symbol: '$$$',
    emoji: '🥳',
    moodLabel: 'Nraktir Teman',
    minPrice: 75000,
    maxPrice: 150000,
  },
  {
    tier: 'sultan',
    label: 'Sultan Mode',
    range: '> 150k',
    caption: 'Gak mikir saldo',
    symbol: '$$$$',
    emoji: '👑',
    moodLabel: 'Sultan Mode',
    minPrice: 150000,
    maxPrice: Number.MAX_SAFE_INTEGER,
  },
];

export const DEFAULT_CRAVING: CravingKey = 'bebas';

export const CRAVING_OPTIONS: CravingOption[] = [
  { key: DEFAULT_CRAVING, label: '🎲 Bebas Apapun' },
  { key: 'bakso_mie', label: '🍜 Bakso & Mie' },
  { key: 'nasi_padang', label: '🍚 Nasi Padang' },
  { key: 'ayam_geprek', label: '🍗 Ayam Geprek' },
  { key: 'sate_street', label: '🍢 Sate & Street Food' },
  { key: 'kopi_snack', label: '☕ Kopi & Snack' },
];

export const DISTANCE_OPTIONS: DistanceOption[] = [
  { value: '1km', label: 'Dekat', display: '< 1 km', summary: 'Dekat (<1km)', radiusKm: 1 },
  { value: '3km', label: 'Santai', display: '< 3 km', summary: 'Santai (<3km)', radiusKm: 3 },
  { value: '8km', label: 'Jauh', display: '< 8 km', summary: 'Jauh (<8km)', radiusKm: 8 },
];

export const RATING_OPTIONS: RatingOption[] = [
  { value: 'all', label: 'Bebas', display: 'Bebas 🎪', minRating: 0 },
  { value: '4.0', label: 'Enak', display: '4.0+ ⭐', minRating: 4 },
  { value: '4.5', label: 'Juara', display: '4.5+ ✨', minRating: 4.5 },
];
