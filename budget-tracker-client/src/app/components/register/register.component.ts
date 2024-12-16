import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone:false,
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post('http://localhost:5000/api/auth/register', this.user)
      .subscribe(
        response => {
          alert('Registration successful!');
          this.router.navigate(['/login']);  
        },
        error => {
          alert('Registration failed: ' + error.error.message);
        }
      );
  }
}
