import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.registerForm.get('email')?.valueChanges.subscribe(() => {
      this.updateErrorMessage();
    });
  }

  get email() {
    return this.registerForm.get('email');
  }

  updateErrorMessage() {
    if (this.email?.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.email?.hasError('email')) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.http.post('http://localhost:5000/api/auth/register', this.registerForm.value)
        .subscribe(
          response => {
            this.router.navigate(['/login']);
          },
          error => {
            alert('Registration failed: ' + error.error.message);
          }
        );
    }
  }
}
