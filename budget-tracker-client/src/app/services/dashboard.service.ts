import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  getDashboardData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`, { headers: this.getAuthHeaders() });
  }

  getIncome(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/income/`, { headers: this.getAuthHeaders() });
  }

  getSavingsGoal(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/goals/`, { headers: this.getAuthHeaders() });
  }

  addIncome(income: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/income/add`, income, { headers: this.getAuthHeaders() });
  }

  addSavingsGoal(goal: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/goals/add`, goal, { headers: this.getAuthHeaders() });
  }

  deleteIncome(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/income/delete/${id}`, { headers: this.getAuthHeaders() });
  }

  deleteSavingsGoal(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/goals/delete/${id}`, { headers: this.getAuthHeaders() });
  }

  generateReport(reportData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/report/generate`, reportData);  // Send the report data to the backend
  }
  // finishGoal(goalId: string): Observable<any> {
  //   return this.http.put<any>(`${this.apiUrl}/goals/finish/${goalId}`, {}, { headers: this.getAuthHeaders() });
  // }
  getBudget(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/budgets/`, { headers: this.getAuthHeaders() });
  }
  
}