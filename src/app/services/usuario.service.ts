// src/app/services/usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model'; // Asegúrate de tener este modelo
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = `${environment.apiBaseUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  getMiUsuario(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/me`);
  }

  actualizarLicencia(licenciaId: number): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/licencia/${licenciaId}`, {});
  }
}
