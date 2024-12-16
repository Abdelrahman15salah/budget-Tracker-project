import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  private apiUrl = 'http://localhost:5000/api/income';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getIncomes(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  addIncome(income: { amount: number; source: string; date: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, income, {
      headers: this.getAuthHeaders(),
    });
  }
  
  editIncome(id: string, income: { amount: number; source: string; date: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/edit/${id}`, income, {
      headers: this.getAuthHeaders(),
    });
  }
  deleteIncome(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
