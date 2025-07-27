export interface InformeGenerado {
  /* Información principal */
  id: number;
  estado: string;                 // → podrías tiparlo con un enum
  tipoInforme: string;            // → idem
  clienteRazonSocial: string;
  periodo: string;
  urlDescargaStreaming: string;
  ubicacionFtp?: string;
  ubicacionDrive?: string;
  fechaGeneracion: string;        // ISO 8601; convénte a Date en el front si lo necesitas

  reintentoOfUsuario: number;          // usados
  maxReintentosManuales: number;       // tope que viene de la licencia

  /* Fase REGISTRADO */
  contenidoRegistrado?: string;
  statusCodeRegistrado?: number;
  statusMensajeRegistrado?: string;
  reintentosRegistrado?: number;
  urlDescargaRegistrado?: string;

  /* Fase PRELIMINAR */
  contenidoPreliminar?: string;
  statusCodePreliminar?: number;
  statusMensajePreliminar?: string;
  reintentosPreliminar?: number;
  urlDescargaPreliminar?: string;

  /* Fase PROPUESTA */
  contenidoPropuesta?: string;
  statusCodePropuesta?: number;
  statusMensajePropuesta?: string;
  reintentosPropuesta?: number;
  urlDescargaPropuesta?: string;

  /* Fase RESUMEN */
  contenidoResumen?: string;
  statusCodeResumen?: number;
  statusMensajeResumen?: string;
  reintentosResumen?: number;
  urlDescargaResumen?: string;

  /* Cliente asociado */
  cliente: {
    id: number;
    ruc: string;
    razonSocial: string;
  };
}
