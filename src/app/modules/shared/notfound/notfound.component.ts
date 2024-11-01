import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent {
  constructor( private router:Router) { }

  nav(){
    this.router.navigate(['/']);  // Navigate to home page
  }
}
