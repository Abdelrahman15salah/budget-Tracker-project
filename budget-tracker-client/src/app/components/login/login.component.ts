
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'; 
 
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  user = {
    email: '',
    password: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    console.log('Login attempt with:', this.user); 

    this.authService.login(this.user).subscribe(
      (response: any) => {
        console.log('Response from login:', response); 

        if (response.token) {
          localStorage.setItem('token', response.token); 
          alert('Login successful!');
          this.router.navigate(['/dashboard']);
          
        } else {
          alert('Login failed: Token missing in response');
        }
      },
      (error) => {
        console.error('Login error:', error); 
        alert('Login failed: ' + (error.error.message || 'An error occurred'));
      }
    );
  }
}
