import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  private baseUrl = 'http://localhost:5000/api/goals'; // Update if needed

  constructor(private http: HttpClient) {}

  getGoals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`, {
      headers: this.getAuthHeaders(),
    });
  }

  addGoal(goal: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, goal, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteGoal(goalId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${goalId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Ensure the token is stored here during login
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
