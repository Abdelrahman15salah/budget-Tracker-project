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

  // Fetch budgets for the authenticated user
  getBudgets(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/budgets/`, { headers: this.getAuthHeaders() });
  }

  // Add a new budget
  addBudget(budget: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/budgets/`, budget, { headers: this.getAuthHeaders() });
  }

  // Edit an existing budget
  editBudget(id: string, budget: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/budgets/${id}`, budget, { headers: this.getAuthHeaders() });
  }

  // Delete a budget
  deleteBudget(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/budgets/${id}`, { headers: this.getAuthHeaders() });
  }
}
