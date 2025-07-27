/** Una línea del log de fases */
export interface FaseLog {
  id: number;
  fase: string;
  numeroIntento: number;        // intento automático
  reintentoOfUsuario: number;
  fechaIntento: string;
  statusCode: number;
  mensaje: string;
}

/** Un backup de contenido */
export interface Backup {
  id: number;
  fase: string;
  numeroIntento: number;        // intento automático
  reintentoOfUsuario: number;   // reproceso manual
  fechaBackup: string;
  descargable: boolean;
}

/** Respuesta completa del backend */
export interface HistorialResponse {
  logs: FaseLog[];
  backups: Backup[];
}
