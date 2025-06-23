// src/app/models/usuario.model.ts
import { Licencia } from './licencia.model';

export interface Usuario {
  id: string;              // ID del usuario (UUID desde Keycloak)
  email: string;           // Email del usuario
  autenticadoSocial: boolean; // Indica si se registró con Google, Facebook, etc.
  proveedorSocial: string;    // Nombre del proveedor social, si aplica
  licencia: Licencia;      // Licencia asociada
}
