import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medico } from '../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private url = '/api/medicos';

  constructor(private http: HttpClient) { }

  listar(): Observable<any> {
    // Retorna a página { content: Medico[], pageable }
    return this.http.get<any>(this.url);
  }

  buscarPorId(id: number): Observable<Medico> {
    return this.http.get<Medico>(`${this.url}/${id}`);
  }

  cadastrar(medico: Medico): Observable<Medico> {
    return this.http.post<Medico>(this.url, medico);
  }

  atualizar(medico: Medico): Observable<Medico> {
    return this.http.put<Medico>(this.url, medico);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
