import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error={
    message: '',
    show: false
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loading: LoadingService
  ) {
    this.loginForm = this.fb.group({
      userNameOrEmail: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.show(); // Show loading spinner
      const user = {
        userNameOrEmail: this.loginForm.value.userNameOrEmail.trim(),
        password: this.loginForm.value.password.trim()
      };
      this.authService.userlogin(user).subscribe({
        next: (response: any) => {
          console.log('Login successful:', response);
          this.loading.hide(); // Hide loading spinner
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('role', response.role);
          this.router.navigate(['/user/courses']);
        },
        error: (error) => {
          console.error('Error logging in:', error);
          this.loading.hide();
          // alert('Login failed');
          this.error.message =error.error.message;
          this.error.show = true;
        }
      });
    }
  }
}
