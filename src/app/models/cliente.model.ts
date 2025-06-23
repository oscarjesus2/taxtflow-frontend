export interface Cliente {
  id?: number;
  ruc: string;
  razonSocial: string;
  usuarioSol?: string;
  claveSol?: string;
  clientId?: string;
  clientSecret?: string;
  tipoDestino?: string;
  ftpHost?: string;
  ftpUsuario?: string;
  ftpPassword?: string;
  googleDriveFolderId?: string;
}