import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReciboRequest, ReciboResponse } from '../models/recibo.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReciboService {
  private url = `${environment.apiUrl}/recibos`;

  constructor(private http: HttpClient) {}

  listarPorMes(mes: number, anio: number): Observable<ReciboResponse[]> {
    const params = new HttpParams().set('mes', mes).set('anio', anio);
    return this.http.get<ReciboResponse[]>(this.url, { params });
  }

  crear(request: ReciboRequest): Observable<ReciboResponse> {
    return this.http.post<ReciboResponse>(this.url, request);
  }

  actualizar(id: number, request: ReciboRequest): Observable<ReciboResponse> {
    return this.http.put<ReciboResponse>(`${this.url}/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  cambiarEstado(id: number): Observable<ReciboResponse> {
    return this.http.patch<ReciboResponse>(`${this.url}/${id}/estado`, {});
  }
}
