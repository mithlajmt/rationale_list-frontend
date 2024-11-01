import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken'); // Replace 'token' with your actual token key

    if (!token) {
      // If no token is found, redirect to login
      this.router.navigate(['auth/login']); // Adjust the login route as necessary
      return false; // Prevent activation of the current route
    }

    return true; // Allow activation if token exists
  }
}
