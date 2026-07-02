import type { UsuarioResponse } from '../models/api.models';

export function victimLabel(
  usuario: UsuarioResponse | undefined,
  anonima: boolean | undefined,
  victimaId: string,
): string {
  if (anonima) {
    return 'Víctima protegida';
  }

  if (usuario) {
    const nombre = `${usuario.nombres} ${usuario.apellidos}`.trim();
    if (nombre) {
      return nombre;
    }
  }

  return `Víctima ${victimaId.slice(0, 8)}`;
}