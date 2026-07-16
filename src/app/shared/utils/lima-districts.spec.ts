import { describe, expect, it } from 'vitest';
import { filterLimaDistricts, isLimaDistrict, resolveLimaDistrict } from './lima-districts';

describe('lima district helpers', () => {
  it('filters districts ignoring case and accents', () => {
    expect(filterLimaDistricts('san juan')).toEqual(['San Juan de Lurigancho', 'San Juan de Miraflores']);
    expect(filterLimaDistricts('rimac')).toEqual(['Rímac']);
  });

  it('only accepts supported district names', () => {
    expect(isLimaDistrict('Comas')).toBe(true);
    expect(isLimaDistrict('Ventanilla')).toBe(true);
    expect(isLimaDistrict('Santa Fe')).toBe(false);
  });

  it('resolves a typed option to the canonical district name', () => {
    expect(resolveLimaDistrict(' los olivos ')).toBe('Los Olivos');
    expect(resolveLimaDistrict('Santa Fe')).toBeNull();
  });

  it('maps legacy Lima zone values to Lima for edit forms', () => {
    expect(resolveLimaDistrict('Lima Cercado')).toBe('Lima');
    expect(resolveLimaDistrict('Cercado de Lima')).toBe('Lima');
    expect(resolveLimaDistrict('Lima norte')).toBe('Lima');
  });
});
