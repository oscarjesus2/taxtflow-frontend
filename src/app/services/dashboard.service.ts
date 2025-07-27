import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private urlDashboard = `${environment.apiBaseUrl}/dashboard`;
  private urlProgramacionQuery = `${environment.apiBaseUrl}/programacionesquery`;

  constructor(private http: HttpClient) { }

  getResumen() { return this.http.get<any>(`${this.urlDashboard}/resumen`); }
  getUltimosInformes() { return this.http.get<InformeResumen[]>(`${this.urlDashboard}/ultimos-informes`); }
  getProximasProgramaciones() { return this.http.get<ProxProgDTO[]>(`${this.urlDashboard}/proximas`); }
  getTrend7d() { return this.http.get<{ dias: string[], valores: number[] }>(`${this.urlDashboard}/trend7d`); }
  getAlerts() { return this.http.get<string[]>(`${this.urlDashboard}/alerts`); }

  /* drill-down */
  getProgramacion(id: number) { return this.http.get<ProxProgDTO>(`${this.urlProgramacionQuery}/${id}`); }
  getRuns(id: number) { return this.http.get<any[]>(`${this.urlProgramacionQuery}/${id}/runs`); }
}

/* Interfaces de conveniencia */
export interface InformeResumen { fecha: string; periodo: string, cliente: string; tipo: string; estado: string; url?: string; }
export interface ProxProgDTO {
  id: number; 
  clienteRuc: string; 
  tipoInforme: string; 
  proximoInstante: string;
  frecuencia: string; 
  formato: string;
}