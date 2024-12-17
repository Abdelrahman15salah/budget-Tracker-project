import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }

  getBudgets(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/budgets/`, { headers: this.getAuthHeaders() });
  }

  addBudget(budget: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/budgets/`, budget, { headers: this.getAuthHeaders() });
  }

  editBudget(id: string, budget: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/budgets/${id}`, budget, { headers: this.getAuthHeaders() });
  }

  deleteBudget(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/budgets/${id}`, { headers: this.getAuthHeaders() });
  }
}
