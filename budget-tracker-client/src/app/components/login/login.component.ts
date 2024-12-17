import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { merge } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password,
    });

    // Subscribe to status and value changes
    this.email.statusChanges.subscribe(() => this.updateErrorMessage());
    this.email.valueChanges.subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.email.hasError('email')) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const user = {
        email: this.email.value ?? '',
        password: this.password.value ?? '',
      };

      this.authService.login(user).subscribe(
        (response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.router.navigate(['/dashboard']);
          } else {
            alert('Login failed: Token missing in response');
          }
        },
        (error) => {
          alert('Login failed: ' + (error.error.message || 'An error occurred'));
        }
      );
    } else {
      alert('Please fix validation errors before submitting.');
    }
  }
}
