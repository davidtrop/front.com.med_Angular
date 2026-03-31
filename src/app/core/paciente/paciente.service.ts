import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private url = '/pacientes';

  constructor(private http: HttpClient) { }

  listar(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  buscarPorId(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.url}/${id}`);
  }

  cadastrar(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(this.url, paciente);
  }

  atualizar(paciente: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(this.url, paciente);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
