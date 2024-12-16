import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  getExpenses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/expenses/`, {headers: this.getAuthHeaders()});
  }

  addExpense(expense: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/expenses/add`, expense, {headers: this.getAuthHeaders()});
  }

  deleteExpense(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/expenses/delete/${id}`, {headers: this.getAuthHeaders()});
  }

  editExpense(id: string, expense: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/expenses/edit/${id}`, expense, {headers: this.getAuthHeaders()});
  }
}