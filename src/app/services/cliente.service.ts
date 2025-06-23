import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private apiUrl = `${environment.apiBaseUrl}/clientes`;

  constructor(private http: HttpClient) {}

  listarPropios(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  getById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  update(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  probarFtp(dto: Partial<Cliente>) {
  return this.http.post(`${this.apiUrl}/test-ftp`, dto);
}
}