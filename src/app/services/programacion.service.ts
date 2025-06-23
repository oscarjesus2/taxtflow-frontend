import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProgramacionInforme } from '../models/programacion-informe.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ProgramacionService {

  private apiUrl = `${environment.apiBaseUrl}/programaciones`;

  constructor(private http: HttpClient) {}

  /** Lista todas las programaciones del usuario logueado */
  listarTodas(): Observable<ProgramacionInforme[]> {
    return this.http.get<ProgramacionInforme[]>(this.apiUrl);
  }

  /** Crea una nueva programación */
  crear(programacion: ProgramacionInforme): Observable<ProgramacionInforme> {
    return this.http.post<ProgramacionInforme>(this.apiUrl, programacion);
  }

  /** Obtiene una programación por id */
  obtener(id: number): Observable<ProgramacionInforme> {
    return this.http.get<ProgramacionInforme>(`${this.apiUrl}/${id}`);
  }

  /** Actualiza una programación existente */
  actualizar(programacion: ProgramacionInforme): Observable<ProgramacionInforme> {
    return this.http.put<ProgramacionInforme>(
      `${this.apiUrl}/${programacion.id}`,
      programacion
    );
  }

  /** Elimina una programación */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /** Busca programaciones cuya próxima ejecución coincida con la fecha */
  buscarPorFecha(fechaISO: string): Observable<ProgramacionInforme[]> {
    const params = new HttpParams().set('fecha', fechaISO);   // 2025-07-15
    return this.http.get<ProgramacionInforme[]>(
      `${this.apiUrl}/por-fecha`,
      { params }
    );
  }
}
