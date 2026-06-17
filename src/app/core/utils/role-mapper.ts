import type { BackendRole, FrontendRole } from '../models/api.models';

export function roleToLabel(role: BackendRole): FrontendRole {
  const labels: Record<BackendRole, FrontendRole> = {
    VICTIMA: 'Víctima',
    RECEPCIONISTA: 'Recepcionista',
    PSICOLOGO: 'Psicólogo',
    DEFENSOR: 'Defensor Legal',
    SOPORTE: 'Soporte Técnico',
    ADMIN: 'Administrador',
  };
  return labels[role];
}

export function labelToRole(label: FrontendRole): BackendRole {
  const roles: Record<FrontendRole, BackendRole> = {
    'Víctima': 'VICTIMA',
    'Recepcionista': 'RECEPCIONISTA',
    'Psicólogo': 'PSICOLOGO',
    'Defensor Legal': 'DEFENSOR',
    'Soporte Técnico': 'SOPORTE',
    'Administrador': 'ADMIN',
  };
  return roles[label];
}
