import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // private userApi: string = 'https://testing.competitivecracker.com/api/v1/user/courses';

  private userApi: string = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  // getFullcourse(user: any) {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });

  //   // Convert `user` object to query parameters
  //   let params = new HttpParams();
  //   Object.keys(user).forEach(key => {
  //     params = params.set(key, user[key]);
  //   });

  //   // Make the GET request with headers and query parameters
  //   return this.http.get(this.userApi, { headers, params });
  // }

  getRationalList(){
    return this.http.get(`${this.userApi}/user/rationale`);
  }

  getRationalData(id:any){
    return this.http.get(`${this.userApi}/user/rationale/${id}`);
  }

  getDecisionList(){
    return this.http.get(`${this.userApi}/user/decisions`);
  }

  getSpecialityList(){
    return this.http.get(`${this.userApi}/user/specialities`);
  }
  updateRationale(id:any,body:any){
    return this.http.put(`${this.userApi}/user/rationale/${id}`,body);
  }

}
