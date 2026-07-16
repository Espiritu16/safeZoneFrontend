import { describe, expect, it } from 'vitest';
import { filterLimaDistricts, isLimaDistrict, resolveLimaDistrict } from './lima-districts';

describe('lima district helpers', () => {
  it('filters districts ignoring case and accents', () => {
    expect(filterLimaDistricts('san juan')).toEqual(['San Juan de Lurigancho', 'San Juan de Miraflores']);
    expect(filterLimaDistricts('rimac')).toEqual(['Rímac']);
  });

  it('only accepts official Lima district names', () => {
    expect(isLimaDistrict('Comas')).toBe(true);
    expect(isLimaDistrict('Lima norte')).toBe(false);
    expect(isLimaDistrict('Lima Cercado')).toBe(false);
  });

  it('resolves a typed option to the canonical district name', () => {
    expect(resolveLimaDistrict(' los olivos ')).toBe('Los Olivos');
    expect(resolveLimaDistrict('Santa Fe')).toBeNull();
  });
});
