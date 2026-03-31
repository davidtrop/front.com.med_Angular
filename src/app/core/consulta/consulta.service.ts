import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consulta } from '../models/consulta.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private url = '/api/consultas';

  constructor(private http: HttpClient) { }

  agendar(consulta: Consulta): Observable<Consulta> {
    return this.http.post<Consulta>(this.url, consulta);
  }

  cancelar(id: number, motivoCancelamento: string): Observable<void> {
    return this.http.delete<void>(this.url, {
      body: {
        idConsulta: id,
        motivoCancelamento: motivoCancelamento
      }
    });
  }
}
