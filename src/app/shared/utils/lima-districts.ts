export const LIMA_DISTRICTS = [
  'Ancón',
  'Ate',
  'Barranco',
  'Breña',
  'Carabayllo',
  'Chaclacayo',
  'Chorrillos',
  'Cieneguilla',
  'Comas',
  'El Agustino',
  'Independencia',
  'Jesús María',
  'La Molina',
  'La Victoria',
  'Lima',
  'Lince',
  'Los Olivos',
  'Lurigancho-Chosica',
  'Lurín',
  'Magdalena del Mar',
  'Miraflores',
  'Pachacámac',
  'Pucusana',
  'Pueblo Libre',
  'Puente Piedra',
  'Punta Hermosa',
  'Punta Negra',
  'Rímac',
  'San Bartolo',
  'San Borja',
  'San Isidro',
  'San Juan de Lurigancho',
  'San Juan de Miraflores',
  'San Luis',
  'San Martín de Porres',
  'San Miguel',
  'Santa Anita',
  'Santa María del Mar',
  'Santa Rosa',
  'Santiago de Surco',
  'Surquillo',
  'Villa El Salvador',
  'Villa María del Triunfo',
] as const;

export type LimaDistrict = (typeof LIMA_DISTRICTS)[number];

export function normalizeDistrictSearch(value: string | null | undefined): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function filterLimaDistricts(query: string | null | undefined): LimaDistrict[] {
  const normalizedQuery = normalizeDistrictSearch(query);

  if (!normalizedQuery) {
    return [...LIMA_DISTRICTS];
  }

  return LIMA_DISTRICTS.filter((district) => normalizeDistrictSearch(district).includes(normalizedQuery));
}

export function resolveLimaDistrict(value: string | null | undefined): LimaDistrict | null {
  const normalizedValue = normalizeDistrictSearch(value);

  if (!normalizedValue) {
    return null;
  }

  return LIMA_DISTRICTS.find((district) => normalizeDistrictSearch(district) === normalizedValue) ?? null;
}

export function isLimaDistrict(value: string | null | undefined): boolean {
  return resolveLimaDistrict(value) !== null;
}
