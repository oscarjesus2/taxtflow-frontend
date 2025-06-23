import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private url = 'http://localhost:8081/api'; // Ajusta si es necesario

  constructor(private http: HttpClient) {}

  getResumen(){return this.http.get<any>(`${this.url}/resumen`);}
  getUltimosInformes(){return this.http.get<InformeResumen[]>(`${this.url}/ultimos-informes`);}
  getProximasProgramaciones(){return this.http.get<ProxProgDTO[]>(`${this.url}/proximas`);}
  getTrend7d(){return this.http.get<{dias:string[],valores:number[]}>(`${this.url}/trend7d`);}
  getAlerts(){return this.http.get<string[]>(`${this.url}/alerts`);}

  /* drill-down */
  getProgramacion(id:number){return this.http.get<ProxProgDTO>(`/api/programaciones/${id}`);}
  getRuns(id:number){return this.http.get<any[]>(`/api/programaciones/${id}/runs`);}
}

/* Interfaces de conveniencia */
export interface InformeResumen{fecha:string;cliente:string;tipo:string;estado:string;url?:string;}
export interface ProxProgDTO{ id:number;clienteRuc:string;tipoInforme:string;proximoInstante:string;
  frecuencia:string;formato:string; }