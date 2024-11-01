import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');
 

    if(token==null||token=='') {
      return true; 
    }
    if (token) {
      // If token exists, redirect to /user/courses
      this.router.navigate([`${role}`]);
      return false; // Prevent activation of the current route
    }

    return true; // Allow activation if no token is found
  }
}
