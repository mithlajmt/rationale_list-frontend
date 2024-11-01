import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
  
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  error={
    message: '',
    show: false
  }

  constructor(
    private fb: FormBuilder,
    private authserv:AuthService,
    private router:Router,
    private loading:LoadingService,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      user_type: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    this.registerForm.valueChanges.subscribe(() => {
      this.getFormProgress();
    });
  }

  getFormProgress(): number {
    const controls = Object.keys(this.registerForm.controls);
    const totalControls = controls.length;
    const validControls = controls.filter(key => this.registerForm.get(key)?.valid).length;
    return (validControls / totalControls) * 100;
  }

  setUserType(type: string): void {
    this.registerForm.patchValue({
      user_type: type
    });
  }

  navigate(){
    this.router.navigate(['auth/login']);
  }

  onSubmit() {
    this.loading.show(); // Show loading spinner
    if (this.registerForm.valid) {
        // Trim inputs to avoid leading/trailing spaces before submission
        const formData = {
            ...this.registerForm.value,
            userName: this.registerForm.value.userName.trim(),
            email: this.registerForm.value.email.trim(),
            password: this.registerForm.value.password.trim()
        };

        this.authserv.registerUser(formData).subscribe({
            next: (response: any) => {
                console.log('Registration successful:', response);
                localStorage.setItem('authToken', response.token);
                // localStorage.setItem('role', response.role);
                this.router.navigate(['/user']);
                this.loading.hide(); // Hide loading spinner
                this.toastr.success('Registration Successful', 'Success');
            },
            error: (error) => {
                console.error('Error registering user:', error);
                this.loading.hide(); // Hide loading spinner
                this.toastr.error('Registration Failed', 'Error');
                this.error.message = error.error?.message || 'Registration failed. Please try again.';
                this.error.show = true;
            }
        });
    }
}

}
