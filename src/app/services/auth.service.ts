import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registerApi:string = 'http://localhost:3000/auth/signup'
  private loginApi:string = 'http://localhost:3000/auth/login'


  constructor(
    private http: HttpClient,
  ) { }

  registerUser(user: any) {
    return this.http.post(this.registerApi, user);
  }
  userlogin(user:any){
    return this.http.post(this.loginApi,user);
  }
}
