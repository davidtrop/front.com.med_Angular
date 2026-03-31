import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenJWT } from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));
  isAuthenticated = this._isAuthenticated.asReadonly();

  constructor(private http: HttpClient, private router: Router) {}

  login(dados: any): Observable<TokenJWT> {
    return this.http.post<TokenJWT>('/api/login', dados).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        this._isAuthenticated.set(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this._isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
