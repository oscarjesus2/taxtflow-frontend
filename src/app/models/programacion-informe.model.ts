import { Cliente } from "./cliente.model";

// Se usa en componentes y plantillas para mostrar datos
export interface ProgramacionInforme {
  id: number;
  clienteId: number;
  clienteRazonSocial: string;
  propietarioId: string;
  propietarioEmail: string;

  tipoInforme: string;
  fechaInicio: string;
  horaEjecucion: string;
  frecuencia: string;
  activo: boolean;
  destino: string;
  urlDestino: string;
  nombreArchivo?: string;
  formato: string;
  fechaProximaEjecucion: string;
}
