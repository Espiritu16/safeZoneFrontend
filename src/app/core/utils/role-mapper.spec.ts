import { describe, expect, it } from 'vitest';
import { labelToRole, roleToLabel } from './role-mapper';

describe('role mapper', () => {
  it('maps backend roles to frontend labels', () => {
    expect(roleToLabel('ADMIN')).toBe('Administrador');
    expect(roleToLabel('DEFENSOR')).toBe('Defensor Legal');
    expect(roleToLabel('PSICOLOGO')).toBe('Psicólogo');
    expect(roleToLabel('VICTIMA')).toBe('Víctima');
  });

  it('maps frontend labels to backend roles', () => {
    expect(labelToRole('Administrador')).toBe('ADMIN');
    expect(labelToRole('Defensor Legal')).toBe('DEFENSOR');
    expect(labelToRole('Recepcionista')).toBe('RECEPCIONISTA');
    expect(labelToRole('Soporte Técnico')).toBe('SOPORTE');
  });
});
