import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth'; 

  constructor(private http: HttpClient, private router: Router) {}

  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }

  logout(): void {
    localStorage.removeItem('token'); 
    this.router.navigate(['/login']); 
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token !== null;
  }

  getUserInfo(): any {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = atob(token.split('.')[1]); 
      return JSON.parse(payload);
    }
    return null;
  }
}
