export type BackendRole = 'VICTIMA' | 'RECEPCIONISTA' | 'PSICOLOGO' | 'DEFENSOR' | 'SOPORTE' | 'ADMIN';
export type FrontendRole = 'Víctima' | 'Recepcionista' | 'Psicólogo' | 'Defensor Legal' | 'Soporte Técnico' | 'Administrador';

export type EstadoCaso = 'REGISTRADO' | 'EN_EVALUACION' | 'EN_ATENCION' | 'DERIVADO' | 'CERRADO' | 'ARCHIVADO';
export type PrioridadCaso = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
export type NivelRiesgo = 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  usuarioId: string;
  nombre: string;
  correo: string;
  rol: BackendRole;
  token: string;
  refreshToken: string;
  tipoToken: string;
}

export interface SessionContextResponse {
  success: boolean;
  message: string;
  usuarioId: string;
  nombre: string;
  correo: string;
  rol: BackendRole;
  permisos: string[];
  modulos: string[];
}

export interface BasicResponse {
  success: boolean;
  message: string;
}

export interface UsuarioResponse {
  id: string;
  correo: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono?: string | null;
  distrito?: string | null;
  rol: BackendRole;
  activo: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface CrearUsuarioRequest {
  correo: string;
  contrasena: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono?: string;
  distrito?: string;
  rol: BackendRole;
}

export interface CrearPreDenunciaRequest {
  nombresContacto?: string;
  apellidosContacto?: string;
  telefonoContacto?: string;
  correoContacto?: string;
  descripcionHecho: string;
  tipoViolencia?: string;
  fechaIncidente?: string;
  distrito?: string;
  direccionReferencia?: string;
  anonima?: boolean;
}

export type EstadoPreDenuncia = 'PENDIENTE' | 'EN_CONTACTO' | 'FORMALIZADA' | 'DESCARTADA';

export interface PreDenunciaResponse extends CrearPreDenunciaRequest {
  id: string;
  estado: EstadoPreDenuncia;
  motivoDescarte?: string | null;
  victimaId?: string | null;
  denunciaId?: string | null;
  casoId?: string | null;
  asignadaA?: string | null;
  fechaContacto?: string | null;
  fechaFormalizacion?: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface FormalizarPreDenunciaRequest {
  victimaId?: string;
  denunciaId?: string;
  casoId?: string;
  nivelRiesgo: NivelRiesgo;
  formalizarAnonima?: boolean;
}

export interface CasoResponse {
  id: string;
  victimaId: string;
  estado: EstadoCaso;
  prioridad: PrioridadCaso;
  resumen: string;
  distrito: string;
  activo: boolean;
  fechaCreacion: string;
  fechaCierre?: string | null;
  fechaActualizacion: string;
}

export interface CasoFilters {
  victimaId?: string;
  aliasCodigo?: string;
  estado?: EstadoCaso | '';
  prioridad?: PrioridadCaso | '';
  nivelRiesgo?: NivelRiesgo | '';
}

export interface CrearCasoRequest {
  victimaId: string;
  resumen: string;
  distrito: string;
  prioridad: PrioridadCaso;
  estado?: EstadoCaso;
}

export interface ActualizarCasoRequest {
  resumen?: string;
  distrito?: string;
  prioridad?: PrioridadCaso;
  activo?: boolean;
  estado?: EstadoCaso;
}

export interface CrearDenunciaRequest {
  casoId?: string;
  victimaId: string;
  descripcion: string;
  tipoViolencia: string;
  fechaIncidente?: string;
  distrito: string;
  direccionReferencia?: string;
  nivelRiesgo: NivelRiesgo;
  anonima?: boolean;
  adjuntos?: string[];
}

export interface ActualizarDenunciaRequest extends Partial<CrearDenunciaRequest> {}

export interface DenunciaResponse extends CrearDenunciaRequest {
  id: string;
  casoId: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface DenunciaFilters {
  victimaId?: string;
  casoId?: string;
  nivelRiesgo?: NivelRiesgo | '';
  distrito?: string;
  tipoViolencia?: string;
}

export interface CrearSeguimientoCasoRequest {
  casoId: string;
  autorId: string;
  tipoSeguimiento: string;
  contenido: string;
  proximaAccion?: string;
  fechaProximaAccion?: string;
}

export interface ActualizarSeguimientoCasoRequest {
  tipoSeguimiento?: string;
  contenido?: string;
  proximaAccion?: string;
  fechaProximaAccion?: string;
}

export interface SeguimientoCasoResponse extends CrearSeguimientoCasoRequest {
  id: string;
  rolAutor: BackendRole;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}
