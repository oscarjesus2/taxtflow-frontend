import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fase } from '../enums/fase.enum';
import { environment } from 'src/environments/environment';

export interface ValidacionResumenDTO {
  resumenId: number;
  tipoValidacion: string;
  fase: string;
  faltantes: number;
  sobrantes: number;
  diferenciasIgv: number;
  diferenciasTotal: number;
  estadoValidacion: string; // "MATCH", "NO_MATCH"
}

export interface HistorialValidacionDTO {
  id: number;
  tipoValidacion: string;
  fase: Fase;
  faltantes: number;
  sobrantes: number;
  diferenciasIgv: number;
  diferenciasTotal: number;
  fechaValidacion: string;
}

@Injectable({
  providedIn: 'root',
})
export class ValidacionInformeService {
  private baseUrl =  `${environment.apiBaseUrl}/informes`;

  constructor(private http: HttpClient) {}

  validarExcel(
    informeId: number,
    tipo: string,
    fase: Fase,
    archivo: File
  ): Observable<ValidacionResumenDTO> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('informeId', informeId.toString());
    formData.append('fase', fase);

    return this.http.post<ValidacionResumenDTO>(
      `${this.baseUrl}/${informeId}/validar/${tipo}`,
      formData
    );
  }

  descargarResultado(
    informeId: number,
    tipo: string,
    fase: Fase
  ): Observable<Blob> {
    const params = new HttpParams()
      .set('informeId', informeId.toString())
      .set('fase', fase);
    return this.http.get(`${this.baseUrl}/${informeId}/validar/${tipo}/resultado`, {
      params,
      responseType: 'blob',
    });
  }

  obtenerHistorial(informeId: number): Observable<HistorialValidacionDTO[]> {
    return this.http.get<HistorialValidacionDTO[]>(
      `${this.baseUrl}/${informeId}/validaciones`
    );
  }
}
