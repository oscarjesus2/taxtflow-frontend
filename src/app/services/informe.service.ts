import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { InformeGenerado } from "../models/informe-generado.model";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class InformeService {

  private apiUrl = `${environment.apiBaseUrl}/informes`;
  constructor(private http: HttpClient) { }

  listarTodos(): Observable<InformeGenerado[]> {
    return this.http.get<InformeGenerado[]>(this.apiUrl);
  }

  listarPorCliente(clienteId: number): Observable<InformeGenerado[]> {
    return this.http.get<InformeGenerado[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  listarPorClienteYTipo(clienteId: number, tipo: string): Observable<InformeGenerado[]> {
    return this.http.get<InformeGenerado[]>(`${this.apiUrl}/cliente/${clienteId}/tipo/${tipo}`);
  }

  generarInforme(clienteId: number, tipo: string, periodo: string): Observable<InformeGenerado> {
    return this.http.post<InformeGenerado>(`${this.apiUrl}/generar`, null, {
      params: { clienteId, tipo, periodo }
    });
  }

  eliminarFase(id: number, fase: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/fase/${fase}`);
  }


  eliminarInforme(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  reintentarInforme(id: number) {
    return this.http.put<void>(`${this.apiUrl}/${id}/reintentar`, {});
  }

  descargarInforme(urlDescarga: string): Observable<Blob> {
    return this.http.get(urlDescarga, {
      responseType: 'blob'
    });
  }
}
